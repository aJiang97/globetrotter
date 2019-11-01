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

details_url = 'https://maps.googleapis.com/maps/api/place/details/json'
search_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
details = api.namespace('details', description='Details of a location')


@details.route('/fs', strict_slashes=False)
class FoursquareDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.response(200, 'Success', f_location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    def get(self):
        venueId = request.args.get('venueID')

        if venueId is None:
            abort(400, 'Invalid query')

        result = self.getVenue(venueId)

        if result is None:
            abort(403, 'API can\'t handle request')

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
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.', required=True)
    #@details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', fg_location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter is geocodable (refer to Geocoding API on Google Maps)')
    @details.response(404, 'Places API could not process or fulfill user request, assuming unavailable resource.')
    def get(self):
        # Merge both location and g_location (read docs)
        # Into fg_location type object
        # Method here should be similar to the method below

        # just copied the functions over and did a hatch job
        venueId = request.args.get('venueID')
        if venueId is None:
            abort(400, 'Invalid query')
        #foursquare requests
        fs_results = self.getVenue(venueId)
        if fs_results is None:
            abort(403, 'API can\'t handle request')

        name = fs_results['venue_name']
        #googlemaps results
        gm_results = self.get_details(name)
        if gm_results is None:
            abort(404, 'Places API can\'t handle request')

        final_results = {
            'foursquare':fs_results,
            'google':gm_results
        }

        return final_results

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
            future = session.get(
                'https://api.foursquare.com/v2/venues/' + venueId, params=params)
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

    def get_details(self, name):
        place_id = self.get_placeid(name)

        if check_cache('place_' + place_id + '.json', False):
            cache = retrieve_cache('place_' + place_id + '.json', False)
            dets = json.loads(cache)
        else:
            payload = {
                'place_id': place_id,
                'key': config.GOOGLE_WS_API_KEY,
                'fields': 'photo,url,rating,review,price_level'
            }

            response = requests.get(url=details_url, params=payload)

            if response.status_code != 200:
                return None

            dets = json.loads(response.text)
            store_cache(response.text, 'place_' + place_id + '.json')

        #get location rating
        if dets['result'].get('rating') != None:
            rating = dets['result']['rating']
        else:
            rating = None

        #get user reviews
        user_reviews = []
        if dets['result'].get('reviews') != None: 
            for i in range(len(dets['result']['reviews'])-1):
                user_reviews.append({
                    "name": dets['result']['reviews'][i]['author_name'],
                    "review": dets['result']['reviews'][i]['text'],
                    "time": dets['result']['reviews'][i]['relative_time_description']
                })

        

        # links to googlemaps of location
        url = dets['result']['url']

        #not sure this is needed in the google endpoint as it already exists in fs endpoint
        coords = {
            'latitude': 0,# dets['result']['geometry']['location']['lat'],
            'longitude':0 # dets['result']['geometry']['location']['lng']
        }

        return {
            'location_name': name,
            'reviews': user_reviews,
            'rating': rating,
            'maps_url': url,
            'place_id': place_id,
            'coordinate': coords
        }

    def get_placeid(self, name):
        params = {
            'input': name,
            'key': config.GOOGLE_WS_API_KEY,
            'inputtype': 'textquery'
        }

        response = requests.get(url=search_url, params=params)

        if response.status_code != 200:
            return None

        id = json.loads(response.text)

        if id['status'] == 'OK':
            return id['candidates'][0]['place_id']
        return None
        

@details.route('/google', strict_slashes=False)
class GoogleDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', g_location)
    @details.response(400, 'Malformed request input on user side')
    @details.response(403, 'FS API could not process or fulfill user request. Make sure that parameter is geocodable (refer to Geocoding API on Google Maps)')
    @details.response(404, 'Places API could not process or fulfill user request, assuming unavailable resource.')
    def get(self):
        venueId = request.args.get('venueID')
        venuename = request.args.get('venuename')

        if venueId is None and venuename is None:
            abort(400, 'Invalid query')

        result = None

        # print("start " + str(time.time()))

        if venueId is not None:
            # FS venueID is not empty
            # Check if retrieving venuename from FS is possible
            # If not possible, check if venuename field exists
            # If none, abort
            retrieved_venuename = self.getVenueNameFromFS(venueId)
            # print("retrieve venuename. " + str(time.time()))
            if retrieved_venuename is None:
                if venuename is None:
                    abort(403, 'FS API can\'t handle request')
                else:
                    # Request for venuename directly
                    result = self.get_details(venuename)
                    # print("getdetails from venuename. " + str(time.time()))
            else:
                result = self.get_details(retrieved_venuename)
                # print("getdetails from retrieved. " + str(time.time()))
        else:
            result = self.get_details(venuename)
            # print("getdetails from venuename direct. " + str(time.time()))

        if result is None:
            abort(404, 'Places API can\'t handle request')

        return result

    def getVenueNameFromFS(self, venueId):
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
            future = session.get(
                'https://api.foursquare.com/v2/venues/' + venueId, params=params)
            response = future.result()

            if response.status_code != 200:
                return None

            content = response.text
            dictres = json.loads(content)
            vid = dictres['response']['venue']['id']
            store_cache(content, 'venue_' + vid + '.json')

        # Name of the venue might be unclear, hence returns a lengthy response
        return dictres['response']['venue']['name'] + ' ' + dictres['response']['venue']['location']['city'] + ' ' + dictres['response']['venue']['location']['country']

    # return dets from either API or cache
    def get_details(self, name):
        place_id = self.get_placeid(name)

        if check_cache('place_' + place_id + '.json', False):
            cache = retrieve_cache('place_' + place_id + '.json', False)
            dets = json.loads(cache)
        else:
            payload = {
                'place_id': place_id,
                'key': config.GOOGLE_WS_API_KEY,
                'fields': 'photo,url,rating,review,price_level'
            }

            response = requests.get(url=details_url, params=payload)

            if response.status_code != 200:
                return None

            dets = json.loads(response.text)
            store_cache(response.text, 'place_' + place_id + '.json')

        #get location rating
        if dets['result'].get('rating') != None:
            rating = dets['result']['rating']
        else:
            rating = None

        #get user reviews
        user_reviews = []
        if dets['result'].get('reviews') != None: 
            for i in range(len(dets['result']['reviews'])-1):
                user_reviews.append({
                    "name": dets['result']['reviews'][i]['author_name'],
                    "review": dets['result']['reviews'][i]['text'],
                    "time": dets['result']['reviews'][i]['relative_time_description']
                })

        # links to googlemaps of location
        url = dets['result']['url']

        #not sure this is needed in the google endpoint as it already exists in fs endpoint
        coords = {
            'latitude': 0,# dets['result']['geometry']['location']['lat'],
            'longitude':0 # dets['result']['geometry']['location']['lng']
        }

        return {
            'location_name': name,
            'reviews': user_reviews,
            'rating': rating,
            'maps_url': url,
            'place_id': place_id,
            'coordinate': coords
        }

    # get googlemaps location idenitfier
    def get_placeid(self, name):
        params = {
            'input': name,
            'key': config.GOOGLE_WS_API_KEY,
            'inputtype': 'textquery'
        }

        response = requests.get(url=search_url, params=params)

        if response.status_code != 200:
            return None

        id = json.loads(response.text)

        if id['status'] == 'OK':
            return id['candidates'][0]['place_id']
        return None
