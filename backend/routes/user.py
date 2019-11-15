import json
import ast

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

user = api.namespace('user', description='User trips endpoint')


@user.route('/trip', strict_slashes=False)
class UserTrip(Resource):
    @user.response(200, 'Success', MODEL_trip_uuid)
    @user.response(400, 'Malformed request')
    @user.response(403, 'Invalid authorization')
    @user.doc(security='authtoken', description='Store user trip')
    @user.expect(MODEL_trip_payload)
    def post(self):
        email = authorize(request)

        # Get payload and set variables
        content = request.get_json()
        info = content.get('info')
        if info is None:
            abort(400, 'Required info field is empty')

        description = info.get('description')
        city = info.get('city')
        tripstart = info.get('tripstart')
        tripend = info.get('tripend')
        jsonblob = content.get('blob')

        if description is None or city is None or tripstart is None or tripend is None:
            abort(400, 'Required field inside info is empty')

        payload = (description, city, tripstart, tripend,
                   json.dumps(jsonblob).encode('utf-8'))

        uuid_r = None
        try:
            uuid_r = db.insert_trip(email, payload)
        except Exception as e:
            abort(500, 'We screwed up')

        if uuid_r is None:
            abort(500, 'Yes, we screwed up')

        return {
            "uuid": uuid_r
        }

    @user.response(200, 'Success', MODEL_trip_payload)
    @user.response(403, 'Invalid authorization')
    @user.response(404, 'Resource is not available')
    @user.param('uuid', 'UUID of the trip', required=True)
    @user.doc(security='authtoken', description='Get the trip of the user using UUID')
    def get(self):
        email = authorize(request)

        # Get payload and set variables
        uuid_r = request.args.get('uuid')
        if uuid_r is None:
            abort(400, 'Need the uuid')

        authorize_access(email, uuid_r)

        result = db.retrieve_trip(uuid_r)

        if result is None:
            abort(404, 'Resource is not available')

        blob = result[4].decode('utf-8')

        return {
            "info": {
                "description": result[0],
                "city": result[1],
                "tripstart": result[2],
                "tripend": result[3],
                "modifieddate": result[5]
            },
            "blob": json.loads(blob)
        }

    @user.response(200, 'Success')
    @user.response(403, 'Invalid authorization')
    @user.response(404, 'Resource to patch is not available')
    @user.doc(security='authtoken', description='Update the trip of the user using UUID and the raw data from the frontend')
    @user.param('uuid', 'UUID of the trip', required=True)
    @user.expect(MODEL_trip_payload)
    def patch(self):
        email = authorize(request)

        # Get payload and set variables
        uuid_r = request.args.get('uuid')
        if uuid_r is None:
            abort(400, 'Need the uuid')

        authorize_access(email, uuid_r)

        # Get payload and set variables
        content = request.get_json()
        info = content.get('info')
        if info is None:
            abort(400, 'Required info is empty')

        description = info.get('description')
        city = info.get('city')
        tripstart = info.get('tripstart')
        tripend = info.get('tripend')
        jsonblob = content.get('blob')

        if description is None or city is None or tripstart is None or tripend is None:
            abort(400, 'Required field inside info is empty')

        payload = (description, city, tripstart, tripend, json.dumps(jsonblob).encode('utf-8'))

        try:
            db.update_trip(uuid_r, payload)
        except Exception as e:
            abort(500, 'We screwed up')

        return


@user.route('/trips', strict_slashes=False)
class UserTrips(Resource):
    @user.response(200, 'Success', MODEL_trips)
    @user.response(403, 'User is unauthorized')
    @user.doc(security='authtoken', description='Get all trips by user with their info')
    def get(self):
        email = authorize(request)

        trips = db.retrieve_trips(email)

        return {
            "trips": trips
        }


def authorize(request):
    token = request.headers.get('AUTH-TOKEN', None)

    if not token:
        abort(403, 'Unsupplied authorization token')

    email = db.authorize(token)

    if email is None:
        abort(403, 'Invalid authorization token')

    return email


def authorize_access(email, uuid_r, accessType=None):
    perm = db.check_permission(email, uuid_r)

    if perm is None:
        abort(404, 'Resource is unavailable')
    elif perm == -1:
        abort(403, 'Resource is not yours')

    if accessType is None:
        return
    elif not accessType > perm:
        abort(403, 'Unauthorized access')
