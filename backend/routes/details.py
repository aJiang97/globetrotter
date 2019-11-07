import requests
import json
import config
from datetime import date, timedelta


from concurrent.futures import ThreadPoolExecutor

from app import api, mp
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
    @details.deprecated
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.response(200, 'Success', model=MODEL_f_location)
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

        if dictres is None:
            return None

        return mp.f_location(dictres)      

@details.route('/google', strict_slashes=False)
class GoogleDetails(Resource):
    @details.deprecated
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.')
    @details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', model=MODEL_g_location)
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
        return mp.fs_venuename(dictres['response']['venue'])

    # return dets from either API or cache
    def get_details(self, name):
        place_id = self.get_placeid(name)

        if place_id is None:
            return None

        dets = None

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

        if dets is None:
            return None

        return mp.g_location(dets, place_id, name)

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


@details.route('/fs_google', strict_slashes=False)
class DepthDetails(Resource):
    @details.param('venueID', 'Location the user wants details on, using Foursquare VenueID.', required=True)
    #@details.param('venuename', 'Location the user wants details on, using venue name. If param venueID is not empty, venuename will be ignored.')
    @details.response(200, 'Success', model=MODEL_fg_location)
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

        if dictres is None:
            return None

        return mp.f_location(dictres)

    def get_details(self, name):
        place_id = self.get_placeid(name)

        if place_id is None:
            return None
        
        dets = None

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

        if dets is None:
            return None

        return mp.g_location(dets, place_id, name)

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

@details.route('/google_photo', strict_slashes=False)
class GooglePhoto(Resource):
    @details.expect(MODEL_photorefs)
    def post(self):
        pass
