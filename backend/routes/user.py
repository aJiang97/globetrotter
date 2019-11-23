from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *
from util.authorize import authorize

user = api.namespace('user', description='Endpoint related to user')

@user.route('/search', strict_slashes=False)
@user.doc(security='authtoken')
class Search(Resource):
    @user.response(200, 'Success', MODEL_search_user_result)
    @user.response(400, 'Malformed request')
    @user.response(403, 'User is unauthorized')
    @user.doc(description='Search if the user exists in the database')
    @user.expect(MODEL_search_user)
    def post(self):
        authorize(request)

        content = request.get_json()
        email = content.get('email')
        if email is None:
            abort(400, 'Required email field is empty')

        exist = db.exist_email(email)
        username = db.get_username(email)

        if exist is None:
            abort(500, 'Database screwed up')
        
        return {
            "exist": exist,
            "displayname": username
        }
