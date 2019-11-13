

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

user = api.namespace('user', description='User trips endpoint')


@user.route('/trip', strict_slashes=False)
class UserTrip(Resource):
    @user.response(200, 'Success')
    @user.response(400, 'Malformed request')
    @user.response(409, 'Username taken')
    @user.doc(description='Store user trip')
    def post(self):
        # if not request.mimetype != "text/calendar":
        #     abort(400, 'Malformed request, format is not text/calendar')
        
        # content = request.get_json()
        pass

    @user.response(200, 'Success')
    @user.response(404, 'Resource is not available')
    def get(self):
        pass

@user.route('/trips', strict_slashes=False)
class UserTrips(Resource):
    @user.response(200, 'Success')
    @user.response(404, 'Resource is not available')
    @user.doc(description='Get all trips by user')
    def get(self):
        pass
