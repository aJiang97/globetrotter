

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

user = api.namespace('user', description='User trips endpoint')


@user.route('/trip', strict_slashes=False)
class UserTrip(Resource):
    @user.response(200, 'Success', MODEL_trip_uuid)
    @user.response(400, 'Malformed request')
    @user.doc(security='authtoken', description='Store user calendar')
    # @user.expect(MODEL_calendar_header)  # This is intended because we will use pure text/calendar
    @user.param('description', 'Description of the trip. Can be empty string but don\'t be null',required=True)
    @user.param('location', 'Location of the trip', required=True)
    @user.param('tripstart', 'Start time of the trip, format is ISO8601. Read https://en.wikipedia.org/wiki/ISO_8601', required=True)
    @user.param('tripend', 'End time of the trip', required=True)
    def post(self):
        email = authorize(request)
        
        # Check query params
        description = request.args.get('description')
        location = request.args.get('location')
        tripstart = request.args.get('tripstart')
        tripend = request.args.get('tripend')

        if description is None or location is None or tripstart is None or tripend is None:
            abort(400, 'Required query field is empty')

        # Content is a blob
        content = request.get_data().decode('utf-8')

        uuid_r = None
        try:
            uuid_r = db.insert_calendar(email, description, location, tripstart, tripend, content)
        except Exception as e:
            abort(500, 'We screwed up')

        if uuid_r is None:
            abort(500, 'Yes, we screwed up')

        return {
            "uuid": uuid_r
        }

    @user.response(200, 'Success')
    @user.response(403, 'Resource is not yours')
    @user.response(404, 'Resource is not available')
    @user.doc(security='authtoken', description='Get the calendar of the user using UUID')
    def get(self):
        # Get BLOB based on UUID
        pass

    @user.response(200, 'Success')
    @user.response(403, 'Resource is not yours')
    @user.response(404, 'Resource is not available')
    @user.doc(security='authtoken', description='Update the calendar of the user using UUID and the raw data from the frontend')
    def patch(self):
        # Patch fields of the UUID
        pass

@user.route('/trips', strict_slashes=False)
class UserTrips(Resource):
    @user.response(200, 'Success')
    @user.response(404, 'Resource is not available')
    @user.doc(security='authtoken', description='Get all trips by user')
    def get(self):
        pass


def authorize(request):
    token = request.headers.get('AUTH-TOKEN', None)

    if not token:
        abort(403, 'Unsupplied authorization token')

    email = db.authorize(token)

    if email is None:
        abort(403, 'Invalid authorization token')

    return email