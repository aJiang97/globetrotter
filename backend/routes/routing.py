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


routing = api.namespace('routing', description='Routing of places')

@routing.route('/itinerary', strict_slashes=False)
class ItineraryAlgorithm(Resource):
    @routing.response(200, 'Success', model=MODEL_route_result)
    @routing.expect(MODEL_route_input)
    @suggest.doc(description='''takes in locations that are selected to generate distance matrix and itinerary
                                format accepted json
                                "place_id":"place_id:{put_id_here}"
                                "place_id":"place_id:{put_id_here}|place_id{extra_ids}|..."''')
    def post(self):
        #locations = request.form['place_id']
        locations =  request.get_json()
        
        payload = {
            'key': config.GOOGLE_WS_API_KEY,
            'origins':locations["place_id"],
            'destinations':locations["place_id"]
        }

        query = requests.get(url="https://maps.googleapis.com/maps/api/distancematrix/json?", params=payload)
        response = json.loads(query.text)
        if query.status_code != 200:
            abort(403,message=response['error_message'])

        #algo/change data into preferred format here
        return response
        

