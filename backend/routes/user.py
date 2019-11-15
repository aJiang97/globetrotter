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
        details = content.get('details')
        if details is None:
            abort(400, 'Required details field is empty')

        description = details.get('description')
        location = details.get('location')
        tripstart = details.get('tripstart')
        tripend = details.get('tripend')

        if description is None or location is None or tripstart is None or tripend is None:
            abort(400, 'Required detail field is empty')

        jsonblob = content.get('blob')

        payload = (email, description, location, tripstart, tripend, json.dumps(blob).encode('utf-8'))

        uuid_r = None
        try:
            uuid_r = db.insert_trip(payload)
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

        result = db.retrieve_trip_uuid(uuid_r)
        
        if result is None:
            abort(404, 'Resource is not available')

        blob = result[4].decode('utf-8')

        return {
            "details": {
                "description": result[0],
                "location": result[1],
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
        # TODO
        # Patch fields of the UUID
        # db.update_trip(....) <- you may want to update the function to adapt
        pass

@user.route('/trips', strict_slashes=False)
class UserTrips(Resource):
    @user.response(200, 'Success')
    @user.response(404, 'Resource is not available')
    @user.doc(security='authtoken', description='Get all trips by user with their details')
    def get(self):
        # TODO
        pass


def authorize(request):
    token = request.headers.get('AUTH-TOKEN', None)

    if not token:
        abort(403, 'Unsupplied authorization token')

    email = db.authorize(token)

    if email is None:
        abort(403, 'Invalid authorization token')

    return email