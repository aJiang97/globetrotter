import requests
import json
import config
from datetime import date, timedelta

from concurrent.futures import ThreadPoolExecutor

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
from requests_futures.sessions import FuturesSession

from util.models import *
from util.caching import *

suggest = api.namespace('suggest', description='Suggest list of places')


@suggest.route('/', strict_slashes=False)
class Suggest(Resource):
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.response(200, description='Success', model=locations_short)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.doc(description='''
        Suggests 50 locations. Gets coordinate information and FourSquare venue ID for each suggested items.
    ''')
    def get(self):
        location = request.args.get('city')

        if location is None:
            abort(400, 'Invalid query')

        # First request on all venues on a city/location
        getresult = self.getExplore(location)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        explore = json.loads(getresult)
        locationIds = []
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

        i = 0
        for target in item['items']:
            locationIds.append(target['venue']['id'])
        
        listres = self.getVenues(item['items'])

        return {
            'city': explore['response']['geocode']['displayString'],
            'locations': listres
        }

    # Returns string from Foursquare API
    def getExplore(self, location):
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
            limit=50,
            offset=50,
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


@suggest.route('/detailed', strict_slashes=False)
class DetailedSuggest(Resource):
    @suggest.param('city', 'City that the user wants to check', required=True)
    @suggest.response(200, description='Success', model=locations)
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(403, 'FS API could not fulfill user request. Maximum query on venue is reached.')
    @suggest.doc(description='''
        Suggests 50 locations. Gets detailed information (based on Foursquare) for each suggested items, including pictures. This is the expanded version of `/suggest` endpoint
    ''')
    def get(self):
        location = request.args.get('city')

        if location is None:
            abort(400, 'Invalid query')

        # First request on all venues on a city/location
        getresult = self.getExplore(location)

        if getresult is None:
            abort(403, 'FS API can\'t handle request')

        explore = json.loads(getresult)
        locationIds = []
        resp = explore['response']
        gps = resp['groups']
        item = gps[0]

        i = 0
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
    def getExplore(self, location):
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
            limit=50,
            offset=50,
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

            locs = {
                "romance": False,
                "nature": False,
                "wildlife": False,
                "shopping": False,
                "historical": False,
                "cultural": False,
                "family": False,
                "beaches": False,
                "food": False
            }

            coords = {
                "latitude": dictres['response']['venue']['location']['lat'],
                "longitude": dictres['response']['venue']['location']['lng']
            }

            pics = []

            # Add best photo
            bp = dictres['response']['venue']['bestPhoto']
            pics.append(bp['prefix'] + str(bp['width']) + 'x' + str(bp['height']) + bp['suffix'])

            listres.append({
                "venue_name": dictres['response']['venue']['name'],
                "location_types": locs,
                "coordinate": coords,
                "pictures": pics,
                "location_id": dictres['response']['venue']['id']
            })

        for future in futures:
            response = future.result()

            if response.status_code != 200:
                continue

            content = response.text
            parsed = json.loads(content)
            vid = parsed['response']['venue']['id']
            store_cache(content, 'venue_' + vid + '.json')

            locs = {
                "romance": False,
                "nature": False,
                "wildlife": False,
                "shopping": False,
                "historical": False,
                "cultural": False,
                "family": False,
                "beaches": False,
                "food": False
            }

            pics = []

            # Add best photo
            bp = parsed['response']['venue']['bestPhoto']
            pics.append(bp['prefix'] + str(bp['width']) + 'x' + str(bp['height']) + bp['suffix'])

            coords = {
                "latitude": parsed['response']['venue']['location']['lat'],
                "longitude": parsed['response']['venue']['location']['lng']
            }

            listres.append({
                "venue_name": parsed['response']['venue']['name'],
                "location_types": locs,
                "coordinate": coords,
                "pictures": pics,
                "location_id": parsed['response']['venue']['id']
            })

        return listres