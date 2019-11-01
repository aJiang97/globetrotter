import requests
import json
import config
from datetime import date, timedelta

import asyncio

from concurrent.futures import ThreadPoolExecutor

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
from requests_futures.sessions import FuturesSession

from util.models import *
from util.caching import *
from util.model_interpret import ModelProc

suggest = api.namespace('suggest', description='Suggest list of places')

google_details_url = 'https://maps.googleapis.com/maps/api/place/details/json'
google_search_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'

@suggest.route('/', strict_slashes=False)
class FSSuggest(Resource):
    @suggest.deprecated
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request in integer. Range: [10-50]', required=False)
    @suggest.response(200, description='Success', model=f_locations_short)
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
        locationIds = []
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

        for target in item['items']:
            locationIds.append(target['venue']['id'])

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
                "location_id": item['venue']['id']
            })

        return listres


@suggest.route('/fs_detailed', strict_slashes=False)
class FSDetailedSuggest(Resource):
    @suggest.deprecated
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request', required=False)
    @suggest.response(200, description='Success', model=f_locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 locations. Gets detailed information (based on Foursquare) for each suggested items, including pictures. This is the expanded version of `/suggest` endpoint with FS venue details (from `/details/fs`).
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
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

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
                futures.append(session.get(
                    'https://api.foursquare.com/v2/venues/' + venueId, params=params))

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
        return ModelProc().f_location(parsed)


@suggest.route('/detailed', strict_slashes=False)
class DetailedSuggest(Resource):
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.param('count', 'Venue count that the user wants to request', required=False)
    @suggest.response(200, description='Success', model=locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 locations. Gets detailed information (based on Foursquare and Google Web Services) for each suggested items, including pictures. This is the mixed version of `/suggest/fs_detailed` endpoint with `/details/fs_google`.
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

        for target in item['items']:
            id = target['venue']['id']
            print(target)
            name = target['venue']['name'] + ' ' + target['venue']['location']['city'] + ' ' + target['venue']['location']['country']
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
            loc = detailedItems[key].get_fslocation()
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
            vid = parsed['response']['venue']['id']
            store_cache(content, 'venue_' + vid + '.json')

            fsvenueobj = self.procfsvenue(parsed)

            detailedItems[vid].set_fslocation(fsvenueobj)

    def procfsvenue(self, parsed):
        return ModelProc().f_location(parsed)

    async def getGoogleVenues(self, detailedItems, session):
        # Process placeID synchronously before calling the venues
        self.getGooglePlaceID(detailedItems, session)

        futuredict = dict()
        cached = []
        
        for key in detailedItems.keys():
            place_id = detailedItems[key].get_placeid()
            if check_cache('venue_' + key + '.json', False):
                cached.append(place_id)
            else:
                futures[key] = session.get(url=google_details_url, params= {
                    'place_id': place_id,
                    'key': config.GOOGLE_WS_API_KEY,
                    'fields': 'photo,url,rating,review,price_level'
                })

        for place_id in cached:
            cache = retrieve_cache('place_' + place_id + '.json', False)
            dets = json.loads(cache)

            googlelocationobj = self.procgooglevenue(dets)

            detailedItems[place_id].set_googlelocation(googlelocationobj)

        for place_id in futuredict.keys():
            response = futuredict[place_id].result()

            if response.status_code != 200:
                continue
            
            content = response.text
            dets = json.loads(content)
            store_cache(content, 'place_' + place_id + '.json')

            googlelocationobj = self.procgooglevenue(dets)

            detailedItems[place_id].set_googlelocation(googlelocationobj)

    def procgooglevenue(self, dets):
        #get location rating
        return ModelProc().g_location(dets)

    def getGooglePlaceID(self, detailedItems, session):
        futuredict = dict()

        for key in detailedItems.keys():
            futuredict[key] = session.get(url=google_search_url, params= {
                'input': detailedItems[key].get_venuename,
                'key': config.GOOGLE_WS_API_KEY,
                'inputtype': 'textquery'
            })
        
        for key in futuredict.keys():
            response = futuredict[key].result()

            if response.status_code != 200:
                continue

            id = json.loads(response.text)
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
