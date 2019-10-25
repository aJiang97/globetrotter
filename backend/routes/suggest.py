import requests
import json 
import config

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from datetime import date, timedelta

from util.models import *
from util.caching import *

suggest = api.namespace('suggest', description='Suggest list of places')

@suggest.route('/', strict_slashes=False)
class Suggest(Resource):
    @suggest.param('city','City that the user wants to check')
    @suggest.response(200, 'Success')
    @suggest.response(400, 'Malformed request input on user side')
    @suggest.response(403, 'FS API could not process or fulfill user request. Make sure that parameter city is geocodable (refer to Geocoding API on Google Maps)')
    @suggest.response(412, 'Precondition was not fulfilled')
    @suggest.expect(location)
    def get(self):
        location = request.args.get('city')

        # check_cache = retrieve_cache(location + '.json')
        # if check_cache is None:
        #     return check_cache

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
            abort(resp.status_code, 'Error')

        parsed = jsonify(resp.text)
        parsed.status_code = 200
        return parsed

        # data = json.loads(resp.text)
        # store_cache(json.dumps(data, sort_keys=True, indent=2), location + '.json')

