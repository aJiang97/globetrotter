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
    @user.doc(security='authtoken', description='Store user calendar')
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

        matrix = content.get('matrix')
        matrix_places = content.get('matrix_places')
        ordered_places = content.get('ordered_places')
        # Calendar is a blob
        calendar = content.get('calendar')

        payload = (email, description, location, tripstart, tripend, json.dumps(matrix).encode('utf-8'), json.dumps(matrix_places).encode('utf-8'), json.dumps(ordered_places).encode('utf-8'), calendar)

        uuid_r = None
        try:
            uuid_r = db.insert_calendar(payload)
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
    @user.doc(security='authtoken', description='Get the calendar of the user using UUID')
    def get(self):
        email = authorize(request)
        
        # Get payload and set variables
        uuid_r = request.args.get('uuid')
        if uuid_r is None:
            abort(400, 'Need the uuid')

        result = db.retrieve_calendar_uuid(uuid_r)
        
        if result is None:
            abort(404, 'Resource is not available')

        mat = result[4].decode('utf-8')
        mpl = result[5].decode('utf-8')
        opl = result[6].decode('utf-8')
        cal = result[7].decode('utf-8')

        return {
            "details": {
                "description": result[0],
                "location": result[1],
                "tripstart": result[2],
                "tripend": result[3]
            },
            "matrix": json.loads(mat),
            "matrix_places": json.loads(mpl),
            "ordered_places": json.loads(opl),
            "calendar": cal,
            "modifieddate": result[8]
        }

    @user.response(200, 'Success')
    @user.response(403, 'Invalid authorization')
    @user.response(404, 'Resource to patch is not available')
    @user.doc(security='authtoken', description='Update the calendar of the user using UUID and the raw data from the frontend')
    @user.expect(MODEL_trip_payload)
    def patch(self):
        # TODO
        # Patch fields of the UUID
        # db.update_calendar(....) <- you may want to update the function to adapt
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