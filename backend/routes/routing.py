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
    @routing.response(200, 'Success')
    @routing.expect(route_array)
    def post(self):
        received_item = request.json
        pass

