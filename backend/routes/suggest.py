import requests
import json
import config
from datetime import date, timedelta

import asyncio

from concurrent.futures import ThreadPoolExecutor

from app import api, mp
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
from requests_futures.sessions import FuturesSession
from pathlib import Path

from util.models import *
from util.caching import *
from util.categories import categoryIDReference

suggest = api.namespace('suggest', description='Suggest list of places')

#categoryIDs from FourSquare that link with our location types
categoryID = categoryIDReference

google_details_url = 'https://maps.googleapis.com/maps/api/place/details/json'
google_search_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'

@suggest.route('/fs_short', strict_slashes=False)
class FSSuggest(Resource):
    @suggest.deprecated
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request in integer. Range: [10-50]', required=False)
    @suggest.response(200, description='Success', model=MODEL_f_locations_short)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.doc(description='''
        Suggests 50 locations. Gets coordinate information and FourSquare venue ID for each suggested items.
    ''')
    def get(self):
        location = request.args.get('city')
        count = request.args.get('count')
        countno = config.SUGGEST_COUNT_DEFAULT

        if location is None:
            abort(400, 'Invalid query')

        if count is not None:
            if isinstance(count, int):
                cno = int(count)
                if cno >= 10 and cno <= 50:
                    countno = cno

        # First request on all venues on a city/location
        getresult = self.getExplore(location, countno)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        explore = json.loads(getresult)
        
        item = explore['response']['groups'][0]
        
        # THIS CODE IS NOT USED
        # locationIds = []
        # for target in item['items']:
        #     locationIds.append(target['venue']['id'])

        listres = self.getVenues(item['items'])

        return {
            'city': explore['response']['geocode']['displayString'],
            'locations': listres
        }

    # Returns string from Foursquare API
    def getExplore(self, location, countno):
        cacheresult = check_cache('explore_' + location + '.json')
        if cacheresult == True:
            return retrieve_cache('explore_' + location + '.json')

        url = 'https://api.foursquare.com/v2/venues/explore'

        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            near=location,
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime,
            limit=countno,
            sortByPopularity=1
        )

        resp = requests.get(url=url, params=params)

        if resp.status_code != 200:
            return None

        store_cache(resp.text, 'explore_' + location + '.json')

        return resp.text

    def getVenues(self, items):
        listres = []

        for item in items:
            coords = {
                "latitude": item['venue']['location']['lat'],
                "longitude": item['venue']['location']['lng']
            }

            listres.append({
                "venue_name": item['venue']['name'],
                "coordinate": coords,
                "location_id": item['venue']['id'],
                "location_types": mp.parseCategory(item['venue']['categories'])
            })

        return listres

@suggest.route('/fs_short/prefs',strict_slashes=False)
class FSPrefSuggest(Resource):
    @suggest.param('city','City that the user wants to explore',requried=True)
    @suggest.param('types','''
        Types of locations the users want to visit. 
        Options include(case sensitive,comma to seperate multiple preferences): 
                        night_life
                        nature 
                        markets 
                        restaurants
                        museums
                        themeparks
                        national_monument
                        religious_sites
                        shopping
        ''',required=True)
    @suggest.response(200, description = 'Success', model=MODEL_f_locations_short)
    @suggest.doc(description = 'Suggests locations based on city and types of locations, giving basic details and location name')
    def get(self):
        location = request.args.get('city')
        pref = request.args.get('types')

        prefs = pref.split(",")
        categoryIDs = ""
        for p in prefs:
            if p not in categoryID:
                abort(400, "Invalid type")
            categoryIDs = categoryIDs + "," + categoryID[p]
        categoryIDs = categoryIDs[1:]

        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        payload = {
            'v':parsedtime,
            'client_id':config.FOURSQUARE_CLIENT_ID,
            'client_secret':config.FOURSQUARE_CLIENT_SECRET,
            'near':location,
            'categoryId':categoryIDs
        }
        
        query = requests.get(url="https://api.foursquare.com/v2/venues/search", params=payload)
        if query.status_code != 200:
            abort(403,'FS API can\'t handle request')

        response = json.loads(query.text)
        venues = response['response']['venues']
        location_list = []
        for venue in venues:
            coords = {
                "latitude": venue['location']['lat'],
                "longitude": venue['location']['lng']
            }
            location_list.append({
                "venue_name": venue['name'],
                "coordinate": coords,
                "location_id": venue['id'],
                "location_types": mp.parseCategory(item['venue']['categories'])
            })

        return {
            'city': response['response']['geocode']['feature']['name'],
            'locations': location_list
        }

@suggest.route('/fs', strict_slashes=False)
class FSDetailedSuggest(Resource):
    @suggest.deprecated
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request', required=False)
    @suggest.response(200, description='Success', model=MODEL_f_locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 locations. Gets detailed information (based on Foursquare) for each suggested items, including pictures. 
        This is the expanded version of `/suggest` endpoint with FS venue details (from `/details/fs`).
    ''')
    def get(self):
        location = request.args.get('city')
        count = request.args.get('count')
        countno = config.SUGGEST_COUNT_DEFAULT

        if location is None:
            abort(400, 'Invalid query')

        if count is not None:
            if isinstance(count, int):
                cno = int(count)
                if cno >= 10 and cno <= 50:
                    countno = cno

        # First request on all venues on a city/location
        getresult = self.getExplore(location, countno)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        explore = json.loads(getresult)

        locationIds = []
        item = explore['response']['groups'][0]

        for target in item['items']:
            locationIds.append(target['venue']['id'])

        listres = self.getVenues(locationIds)

        if len(listres) == 0:
            abort(404, 'Maximum query on FS API is reached')

        return {
            'city': explore['response']['geocode']['displayString'],
            'locations': listres
        }

    # Returns string from Foursquare API
    def getExplore(self, location, countno):
        cacheresult = check_cache('explore_' + location + '.json')
        if cacheresult == True:
            return retrieve_cache('explore_' + location + '.json')

        url = 'https://api.foursquare.com/v2/venues/explore'

        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            near=location,
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime,
            limit=countno,
            sortByPopularity=1
        )

        resp = requests.get(url=url, params=params)

        if resp.status_code != 200:
            return None

        store_cache(resp.text, 'explore_' + location + '.json')

        return resp.text

    # Returns a list of locations
    def getVenues(self, venueIds):
        listres = []

        session = FuturesSession(executor=ThreadPoolExecutor(max_workers=10))
        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime
        )

        futures = []
        cached = []

        for venueId in venueIds:
            if check_cache('venue_' + venueId + '.json', False):
                cached.append(venueId)
            else:
                futures.append(session.get('https://api.foursquare.com/v2/venues/' + venueId, params=params))

        for venueId in cached:
            cache = retrieve_cache('venue_' + venueId + '.json', False)
            dictres = json.loads(cache)

            fsresult = self.procfsvenue(dictres)

            listres.append(fsresult)

        for future in futures:
            response = future.result()

            if response.status_code != 200:
                continue

            content = response.text
            parsed = json.loads(content)
            vid = parsed['response']['venue']['id']
            store_cache(content, 'venue_' + vid + '.json')

            fsresult = self.procfsvenue(parsed) 

            listres.append(fsresult)

        return listres

    def procfsvenue(self, parsed):
        return mp.f_location(parsed)

@suggest.route('/fs_google', strict_slashes=False)
class DetailedSuggest(Resource):
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request, between 10 to 50', required=False)
    @suggest.response(200, description='Success', model=MODEL_locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 (or count) locations. Gets detailed information (based on Foursquare and Google Web Services) for each suggested items, including pictures. This is the mixed version of `/suggest/fs` endpoint with `/details/fs_google`.
    ''')
    def get(self):
        location = request.args.get('city')
        count = request.args.get('count')
        countno = config.SUGGEST_COUNT_DEFAULT

        if location is None:
            abort(400, 'Invalid query')

        if count is not None:
            if isinstance(count, int):
                cno = int(count)
                if cno >= 10 and cno <= 50:
                    countno = cno

        # First request on all venues on a city/location
        getresult = self.getExplore(location, countno)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        # Process result of all venues
        explore = json.loads(getresult)
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

        detailedItems = dict()

        # i = 0                   # debug
        for target in item['items']:
            # if i > 10:          # debug
            #     break           # debug
            # i = i + 1           # debug
            id = target['venue']['id']
            name = mp.fs_venuename(target['venue'])
            detail = Detailed(id, name)
            detailedItems[id] = detail

        # Process detailedItems on each detail on two async processes, passing session to two async funcs, using 32 workers on 8 CPUs
        session = FuturesSession(executor=ThreadPoolExecutor(max_workers=32))

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        futures = asyncio.gather(
            self.getFSVenues(detailedItems, session),
            self.getGoogleVenues(detailedItems, session)
        )
        loop.run_until_complete(futures)
        loop.close()

        listres = []

        for key in detailedItems.keys():
            loc = detailedItems[key].get_location()
            if loc is not None:
                listres.append(loc)

        return {
            'city': explore['response']['geocode']['displayString'],
            'locations': listres
        }

    async def getFSVenues(self, detailedItems, session):
        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime
        )

        futures = []
        cached = []

        for key in detailedItems.keys():
            if check_cache('venue_' + key + '.json', False):
                cached.append(key)
            else:
                futures.append(session.get(
                    'https://api.foursquare.com/v2/venues/' + key, params=params))

        for venueId in cached:
            cache = retrieve_cache('venue_' + venueId + '.json', False)
            dictres = json.loads(cache)

            fsvenueobj = self.procfsvenue(dictres)

            detailedItems[venueId].set_fslocation(fsvenueobj)

        for future in futures:
            response = future.result()

            if response.status_code != 200:
                continue

            content = response.text
            parsed = json.loads(content)
            venueId = parsed['response']['venue']['id']
            store_cache(content, 'venue_' + venueId + '.json')

            fsvenueobj = self.procfsvenue(parsed)

            detailedItems[venueId].set_fslocation(fsvenueobj)

    def procfsvenue(self, parsed):
        return mp.f_location(parsed)

    async def getGoogleVenues(self, detailedItems, session):
        # Process placeID synchronously before calling the venues
        self.getGooglePlaceID(detailedItems, session)

        futuredict = dict()
        cached = dict()
        
        for key in detailedItems.keys():
            place_id = detailedItems[key].get_placeid()
            if place_id is None:
                continue

            # print(place_id)
            if check_cache('place_' + place_id + '.json', False):
                cached[key] = place_id
                # print("Found in cache: " + place_id)
            else:
                # print("Not found in cache: " + place_id)
                # continue
                futuredict[key] = session.get(url=google_details_url, params= {
                    'place_id': place_id,
                    'key': config.GOOGLE_WS_API_KEY,
                    'fields': 'photo,url,rating,review,price_level'
                })
                # print("Futured: " + place_id)

        for key in cached.keys():
            place_id = cached[key]
            cache = retrieve_cache('place_' + place_id + '.json', False)
            # print('place_' + place_id)
            dets = json.loads(cache)

            googlelocationobj = self.procgooglevenue(dets, place_id)

            detailedItems[key].set_googlelocation(googlelocationobj)

        for key in futuredict.keys():
            response = futuredict[key].result()
            place_id = detailedItems[key].get_placeid()

            if response.status_code != 200:
                continue
            
            content = response.text
            dets = json.loads(content)
            store_cache(content, 'place_' + place_id + '.json')

            googlelocationobj = self.procgooglevenue(dets, place_id)

            detailedItems[key].set_googlelocation(googlelocationobj)

    def procgooglevenue(self, dets, place_id):
        #get location rating
        return mp.g_location(dets, place_id)

    def getGooglePlaceID(self, detailedItems, session):
        futuredict = dict()

        for key in detailedItems.keys():
            futuredict[key] = session.get(url=google_search_url, params= {
                'input': detailedItems[key].get_venuename(),
                'key': config.GOOGLE_WS_API_KEY,
                'inputtype': 'textquery'
            })
        
        for key in futuredict.keys():
            response = futuredict[key].result()

            if response.status_code != 200:
                continue

            id = json.loads(response.text)
            # print(id)
            # print("===========")
            if id['status'] == 'OK':
                detailedItems[key].set_placeid(id['candidates'][0]['place_id'])

    # Returns string from Foursquare API
    def getExplore(self, location, countno):
        cacheresult = check_cache('explore_' + location + '.json')
        if cacheresult == True:
            return retrieve_cache('explore_' + location + '.json')

        url = 'https://api.foursquare.com/v2/venues/explore'

        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            near=location,
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime,
            limit=countno,
            sortByPopularity=1
        )

        resp = requests.get(url=url, params=params)

        if resp.status_code != 200:
            return None

        store_cache(resp.text, 'explore_' + location + '.json')

        return resp.text

@suggest.route('/fs_google/prefs', strict_slashes=False)
class DetailedPrefSuggest(Resource):
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request, between 10 to 50', required=False)
    @suggest.param('types','''
        Types of locations the users want to visit. 
        Options include(case sensitive,comma to seperate multiple preferences): 
                        night_life
                        nature 
                        markets 
                        restaurants
                        museums
                        themeparks
                        national_monument
                        religious_sites
                        shopping
        ''',required=True)
    @suggest.response(200, description='Success', model=MODEL_locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 (or count) locations **based on type of locations**. Gets detailed information (based on Foursquare and Google Web Services) for each suggested items, including pictures. This is the mixed version of `/suggest/fs`, `/details/fs_google`, and `/suggest/fs_short/prefs`.
    ''')
    def get(self):
        location = request.args.get('city')
        count = request.args.get('count')
        countno = config.SUGGEST_COUNT_DEFAULT

        pref = request.args.get('types')

        prefs = pref.split(",")
        categoryIDs = ""
        for p in prefs:
            if p not in categoryID:
                abort(400, "Invalid type")
            categoryIDs = categoryIDs + "," + categoryID[p]
        categoryIDs = categoryIDs[1:]

        if location is None:
            abort(400, 'Invalid query')

        if count is not None:
            if isinstance(count, int):
                cno = int(count)
                if cno >= 10 and cno <= 50:
                    countno = cno

        # First request on all venues on a city/location
        getresult = self.getExplore(location, countno, categoryIDs)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        # Process result of all venues
        explore = json.loads(getresult)
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

        detailedItems = dict()

        # i = 0                   # debug
        for target in item['items']:
            # if i > 10:          # debug
            #     break           # debug
            # i = i + 1           # debug
            id = target['venue']['id']
            name = mp.fs_venuename(target['venue'])
            detail = Detailed(id, name)
            detailedItems[id] = detail

        # Process detailedItems on each detail on two async processes, passing session to two async funcs, using 32 workers on 8 CPUs
        session = FuturesSession(executor=ThreadPoolExecutor(max_workers=32))

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        futures = asyncio.gather(
            self.getFSVenues(detailedItems, session),
            self.getGoogleVenues(detailedItems, session)
        )
        loop.run_until_complete(futures)
        loop.close()

        listres = []

        for key in detailedItems.keys():
            loc = detailedItems[key].get_location()
            if loc is not None:
                listres.append(loc)

        return {
            'city': explore['response']['geocode']['displayString'],
            'locations': listres
        }

    async def getFSVenues(self, detailedItems, session):
        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime
        )

        futures = []
        cached = []

        for key in detailedItems.keys():
            if check_cache('venue_' + key + '.json', False):
                cached.append(key)
            else:
                futures.append(session.get('https://api.foursquare.com/v2/venues/' + key, params=params))

        for venueId in cached:
            cache = retrieve_cache('venue_' + venueId + '.json', False)
            dictres = json.loads(cache)

            fsvenueobj = self.procfsvenue(dictres)

            detailedItems[venueId].set_fslocation(fsvenueobj)

        for future in futures:
            response = future.result()

            if response.status_code != 200:
                continue

            content = response.text
            parsed = json.loads(content)
            venueId = parsed['response']['venue']['id']
            store_cache(content, 'venue_' + venueId + '.json')

            fsvenueobj = self.procfsvenue(parsed)

            detailedItems[venueId].set_fslocation(fsvenueobj)

    def procfsvenue(self, parsed):
        return mp.f_location(parsed)

    async def getGoogleVenues(self, detailedItems, session):
        # Process placeID synchronously before calling the venues
        self.getGooglePlaceID(detailedItems, session)

        futuredict = dict()
        cached = dict()
        
        for key in detailedItems.keys():
            place_id = detailedItems[key].get_placeid()
            if place_id is None:
                continue

            # print(place_id)
            if check_cache('place_' + place_id + '.json', False):
                cached[key] = place_id
                # print("Found in cache: " + place_id)
            else:
                # print("Not found in cache: " + place_id)
                # continue
                futuredict[key] = session.get(url=google_details_url, params= {
                    'place_id': place_id,
                    'key': config.GOOGLE_WS_API_KEY,
                    'fields': 'photo,url,rating,review,price_level'
                })
                # print("Futured: " + place_id)

        for key in cached.keys():
            place_id = cached[key]
            cache = retrieve_cache('place_' + place_id + '.json', False)
            # print('place_' + place_id)
            dets = json.loads(cache)

            googlelocationobj = self.procgooglevenue(dets, place_id)

            detailedItems[key].set_googlelocation(googlelocationobj)

        for key in futuredict.keys():
            response = futuredict[key].result()
            place_id = detailedItems[key].get_placeid()

            if response.status_code != 200:
                continue
            
            content = response.text
            dets = json.loads(content)
            store_cache(content, 'place_' + place_id + '.json')

            googlelocationobj = self.procgooglevenue(dets, place_id)

            detailedItems[key].set_googlelocation(googlelocationobj)

    def procgooglevenue(self, dets, place_id):
        #get location rating
        return mp.g_location(dets, place_id)

    def getGooglePlaceID(self, detailedItems, session):
        futuredict = dict()

        for key in detailedItems.keys():
            futuredict[key] = session.get(url=google_search_url, params= {
                'input': detailedItems[key].get_venuename(),
                'key': config.GOOGLE_WS_API_KEY,
                'inputtype': 'textquery'
            })
        
        for key in futuredict.keys():
            response = futuredict[key].result()

            if response.status_code != 200:
                continue

            id = json.loads(response.text)
            # print(id)
            # print("===========")
            if id['status'] == 'OK':
                detailedItems[key].set_placeid(id['candidates'][0]['place_id'])

    # Returns string from Foursquare API
    def getExplore(self, location, countno, categoryIDs):
        # Should not use the cache because this has categoryIDs
        # cacheresult = check_cache('explore_' + location + '.json')
        # if cacheresult == True:
        #     return retrieve_cache('explore_' + location + '.json')

        url = 'https://api.foursquare.com/v2/venues/explore'

        rawtime = date.today() - timedelta(days=1)
        parsedtime = rawtime.strftime('%Y%m%d')

        params = dict(
            near=location,
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime,
            limit=countno,
            # sortByPopularity=1,   # Should sort by preference
            categoryId=categoryIDs
        )

        resp = requests.get(url=url, params=params)

        if resp.status_code != 200:
            return None

        # store_cache(resp.text, 'explore_' + location + '.json')

        return resp.text

@suggest.route('/search', strict_slashes=False)
class search(Resource):
    @suggest.param('city','city the user is searching',required=True)
    @suggest.param('query','Term the user wants to search',required=True)
    @suggest.response(200, description='Success', model=MODEL_locations)
    def get(self):
        city = request.args.get('city')
        query = request.args.get('query')
        query = query.strip()
        city = city.lower()
        #only trying to make work for sydney and mel due to lack of api calls
        if city != "sydney" and city != "melbourne":
            return None

        path = Path(__file__).parent.parent
        f = open(str(path)+"/"+city+".txt","r")

        lines = []
        for line in f:
            if query.lower() in line.lower():
                lines.append(line)
                # if len(lines)> 15:
                #     break
        f.close()

        detailedItems = dict()

        for venue in lines:
            col = venue.split(';')
            id = col[2].strip()
            name = col[0].strip()
            detail = Detailed(id, name)
            detail.set_placeid(col[3].strip())
            detailedItems[id] = detail

        detailedItems = self.getFSVenues(detailedItems)
        detailedItems = self.getGoogleVenues(detailedItems)

        #send info
        locations = []
        for key in detailedItems.keys():
            loc = detailedItems[key].get_location()
            if loc is not None:
                locations.append(loc)

        return {'locations': locations}

    def getFSVenues(self, detailedItems):
        parsedtime = date.today().strftime('%Y%m%d')

        params = dict(
            client_id=config.FOURSQUARE_CLIENT_ID,
            client_secret=config.FOURSQUARE_CLIENT_SECRET,
            v=parsedtime
        )

        for key in detailedItems.keys():
            if check_cache('venue_' + key + '.json', False):
                cache = retrieve_cache('venue_' + key + '.json', False)
                parsed = json.loads(cache)
                fsvenueobj = mp.f_location(parsed)
                detailedItems[key].set_fslocation(fsvenueobj)
            else:
                pass
                url = 'https://api.foursquare.com/v2/venues/'+key
                response = requests.get(url=url, params=params)
                if response.status_code != 200:
                    if response.status_code == 429:
                        print("quota exceeded on "+key)
                        break
                    continue
                content = response.text
                parsed = json.loads(content)
                store_cache(content, 'venue_' + key + '.json')
                fsvenueobj = mp.f_location(parsed)
                detailedItems[key].set_fslocation(fsvenueobj)
        return detailedItems
        
    def getGoogleVenues(self, detailedItems):
        
        for key in detailedItems.keys():
            place_id = detailedItems[key].get_placeid()
            if check_cache('place_' + place_id + '.json', False):
                cache = retrieve_cache('place_' + place_id + '.json', False)
                dets = json.loads(cache)
                googlelocationobj = mp.g_location(dets, place_id)
                detailedItems[key].set_googlelocation(googlelocationobj)
            else:
                payload = {
                    'place_id': place_id,
                    'key': config.GOOGLE_WS_API_KEY,
                    'fields': 'url,rating,review'
                }

                response = requests.get(url=google_details_url,params=payload)
                if response.status_code != 200:
                    continue
                content = response.text
                dets = json.loads(content)
                store_cache(content, 'place_' + place_id + '.json')
                googlelocationobj = mp.g_location(dets, place_id)
                detailedItems[key].set_googlelocation(googlelocationobj)

        return detailedItems

        


class Detailed:
    def __init__(self, venueid, venuename):
        self.__venueid = venueid
        self.__venuename = venuename
        self.__fsvenue = None
        self.__placeid = None
        self.__googlevenue = None

    def get_venueid(self):
        return self.__venueid

    def get_venuename(self):
        return self.__venuename

    def set_fslocation(self, fsvenueobj):
        self.__fsvenue = fsvenueobj

    def set_placeid(self, placeid):
        self.__placeid = placeid

    def get_placeid(self):
        return self.__placeid

    def set_googlelocation(self, googlevenueobj):
        self.__googlevenue = googlevenueobj

    def get_fslocation(self):
        return self.__fsvenue

    def get_googlelocation(self):
        return self.__googlevenue

    def get_location(self):
        if self.__fsvenue is None or self.__googlevenue is None:
            return None

        return {
            'foursquare': self.__fsvenue,
            'google': self.__googlevenue
        }
