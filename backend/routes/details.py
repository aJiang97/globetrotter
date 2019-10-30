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


details_url = "https://maps.googleapis.com/maps/api/place/details/json?"
search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"
api_key = "AIzaSyDgQH-38jDOyQjMs8YmIA1lc8W2qhj1ros"

details = api.namespace('details', description='get the details of a location')


@details.route('/fs', strict_slashes=False)
class FoursquareDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.response(200, 'Success', location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    def get(self):
        venueId = request.args.get('venueID')

        if venueId is None:
            abort('400', 'Invalid query')

        result = self.getVenue(venueId)

        if result is None:
            abort('403', 'API can\'t handle request')

        return result

    # Returns a list of locations

    def getVenue(self, venueId):
        dictres = None

        if check_cache('venue_' + venueId + '.json', False):
            cache = retrieve_cache('venue_' + venueId + '.json', False)
            dictres = json.loads(cache)
        else:
            session = FuturesSession(
                executor=ThreadPoolExecutor(max_workers=1))
            rawtime = date.today() - timedelta(days=1)
            parsedtime = rawtime.strftime('%Y%m%d')

            params = dict(
                client_id=config.FOURSQUARE_CLIENT_ID,
                client_secret=config.FOURSQUARE_CLIENT_SECRET,
                v=parsedtime
            )
            futures.append(session.get(
                'https://api.foursquare.com/v2/venues/' + venueId, params=params))
            response = future.result()

            if response.status_code != 200:
                return None

            content = response.text
            dictres = json.loads(content)
            vid = dictres['response']['venue']['id']
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

        coords = {
            "latitude": dictres['response']['venue']['location']['lat'],
            "longitude": dictres['response']['venue']['location']['lng']
        }

        pics = []

        # Add best photo
        bp = dictres['response']['venue']['bestPhoto']
        pics.append(bp['prefix'] + str(bp['width']) +
                    'x' + str(bp['height']) + bp['suffix'])

        retval = {
            "venue_name": dictres['response']['venue']['name'],
            "location_types": locs,
            "coordinate": coords,
            "pictures": pics,
            "location_id": dictres['response']['venue']['id']
        }

        return retval


@details.route('/fs_google', strict_slashes=False)
class DepthDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', fg_location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter is geocodable (refer to Geocoding API on Google Maps)')
    @details.response(404, 'Places API could not process or fulfill user request, assuming unavailable resource.')
    def get(self):
        # Merge both location and g_location (read docs)
        # Into fg_location type object
        # Method here should be similar to the method below
        pass

@details.route('/google', strict_slashes=False)
class GoogleDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', g_location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter is geocodable (refer to Geocoding API on Google Maps)')
    @details.response(404, 'Places API could not process or fulfill user request, assuming unavailable resource.')
    def get(self):
        venueid = request.args.get('venueID')
        venuename = request.args.get('venuename')

        if venueid is None and venuename is None:
            abort('400', 'Invalid query')

        result = None

        if venueid is not None:
            # FS venueID is not empty
            # Check if retrieving venuename from FS is possible
            # If not possible, check if venuename field exists
            # If none, abort
            retrieved_venuename = self.getVenueNameFromFS(venueid)
            if retrieved_venuename is None:
                if venuename is None:
                    abort('403', 'FS API can\'t handle request')
                else:
                    # Request for venuename directly
                    result = self.get_details(venuename)
        else:
            # FS venueID is empty, request for venuename directly
            result = self.get_details(venuename)

        if result is None:
            abort('404', 'Places API can\'t handle request')

        return result

    def getVenueNameFromFS(self, venueid):
        dictres = None

        if check_cache('venue_' + venueId + '.json', False):
            cache = retrieve_cache('venue_' + venueId + '.json', False)
            dictres = json.loads(cache)
        else:
            session = FuturesSession(
                executor=ThreadPoolExecutor(max_workers=1))
            rawtime = date.today() - timedelta(days=1)
            parsedtime = rawtime.strftime('%Y%m%d')

            params = dict(
                client_id=config.FOURSQUARE_CLIENT_ID,
                client_secret=config.FOURSQUARE_CLIENT_SECRET,
                v=parsedtime
            )
            futures.append(session.get(
                'https://api.foursquare.com/v2/venues/' + venueId, params=params))
            response = future.result()

            if response.status_code != 200:
                return None

            content = response.text
            dictres = json.loads(content)
            vid = dictres['response']['venue']['id']
            store_cache(content, 'venue_' + vid + '.json')

        # Name of the venue might be unclear, hence returns a lengthy response
        return dictres['response']['venue']['name'] + ' ' + dictres['response']['venue']['location']['neighborhood'] + ' ' + dictres['response']['venue']['location']['city'] + ' ' + dictres['response']['venue']['location']['country']

    # return dets from either API or cache
    def get_details(self, name):
        place_id = get_placeid(name)

        if check_cache('place_' + place_id + '.json', False):
            cache = retrieve_cache('place_' + place_id + '.json', False)
            dets = json.loads(cache)
        else:
            payload = {
                'place_id': pid,
                'key': api_key,
                'fields': 'photo,url,rating,review,price_level'
            }

            response = requests.get(details_url, params=payload)

            if response.status_code != 200:
                return None

            dets = json.loads(response.text)
            store_cache(response.text, 'place_' + place_id + '.json')

        rating = dets['result']['rating']

        user_reviews = []
        for i in range(len(dets['result']['reviews'])-1):
            user_reviews.append({
                "name": dets['result']['reviews'][i]['author_name'],
                "review": dets['result']['reviews'][i]['text'],
                "time": dets['result']['reviews'][i]['relative_time_description']
            })

        # links to googlemaps of location
        url = dets['result']['url']
        
        # Alex:
        # photo todo, however if i saw photo options with FS already done?
        # FS might be better as each photo reference requires api request

        # Kevin:
        # This endpoint doesn't return photos, but the other endpoint returns photos. It is probably advisable for frontend to call the fs_google endpoint if they want a detailed result

        return {
            'location_name': name,
            'reviews': user_reviews,
            'rating': rating,
            'maps_url': url,
            'place_id': place_id
        }

    # get googlemaps location idenitfier
    def get_placeid(self, name):
        params = {
            'input': name,
            'key': api_key,
            'inputtype': 'textquery'
        }

        response = requests.get(search_url, params=params)

        if response.status_code != 200:
            return None

        id = json.loads(response)

        return id['candidates']['place_id']
