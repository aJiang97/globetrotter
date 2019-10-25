import requests
import json 

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request

from util.models import *

suggest = api.namespace('suggest', description='Suggest list of places')

@suggest.route('/', strict_slashes=False)
class Suggest(Resource):
    @suggest.param('city','City that the user wants to check')
    @suggest.response(200, 'Success')
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(412, 'Precondition was not fulfilled')
    def get(self):
        location = request.args.get('city')
        url = 'GET https://api.foursquare.com/v2/venues/explore'
        params = dict(
            near=location,
            limit=50
        )
        resp = requests.get(url=url, params=params)
        data = json.loads(resp.text)
        print(data)

