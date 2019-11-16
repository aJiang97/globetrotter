import json
import ast

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

trip = api.namespace('trip', description='User trips endpoint')


@trip.route('', strict_slashes=False)
@trip.doc(security='authtoken')
class Trip(Resource):
    @trip.response(200, 'Success', MODEL_trip_uuid)
    @trip.response(400, 'Malformed request')
    @trip.response(403, 'Invalid authorization')
    @trip.doc(description='Store user trip')
    @trip.expect(MODEL_trip_payload)
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
            uuid_r = db.post_trip(email, payload)
        except Exception as e:
            abort(500, 'We screwed up')

        if uuid_r is None:
            abort(500, 'Yes, we screwed up')

        return {
            "uuid": uuid_r
        }

    @trip.response(200, 'Success', MODEL_trip_payload)
    @trip.response(403, 'Invalid authorization')
    @trip.response(404, 'Resource is not available')
    @trip.param('uuid', 'UUID of the trip', required=True)
    @trip.doc(description='Get the trip of the user using UUID')
    def get(self):
        email = authorize(request)

        # Get payload and set variables
        uuid_r = request.args.get('uuid')
        if uuid_r is None:
            abort(400, 'Need the uuid')

        authorize_access(email, uuid_r)

        result = db.get_trip(uuid_r)

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

    @trip.response(200, 'Success')
    @trip.response(403, 'Invalid authorization')
    @trip.response(404, 'Resource to patch is not available')
    @trip.doc(description='Update the trip of the user using UUID and the raw data from the frontend')
    @trip.param('uuid', 'UUID of the trip', required=True)
    @trip.expect(MODEL_trip_payload)
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
            db.patch_trip(uuid_r, payload)
        except Exception as e:
            abort(500, 'We screwed up')

        return

    def delete(self):
        # TODO
        # Delete the trip
        # User needs to be owner
        pass


@trip.route('/all', strict_slashes=False)
@trip.doc(security='authtoken')
class AllTrip(Resource):
    @trip.response(200, 'Success', MODEL_trips)
    @trip.response(403, 'User is unauthorized')
    @trip.doc(description='Get all trips by user with their info')
    def get(self):
        email = authorize(request)

        trips = db.retrieve_trips(email)

        return {
            "trips": trips
        }

@trip.route('/user', strict_slashes=False)
@trip.doc(security='authtoken')
class UserTrip(Resource):
    @trip.response(200, 'Success')
    @trip.response(403, 'User is unauthorized')
    @trip.doc(description='Add user to read/modify the trip')
    @trip.param('uuid', 'UUID of the trip', required=True)
    @trip.expect(MODEL_trip_user)
    def post(self):
        # Only owner can do this
        # Hence db.authorize_access(email, uuid, 0)
        # Add user to the trip
        pass

    def delete(self):
        # Only owner can do this
        # Delete user from the trip
        pass

    def patch(self):
        # Only owner can do this
        # Modify access permission for user on that trip
        pass

    def get(self):
        # All users can see this
        # List users of the trip
        pass

    

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
