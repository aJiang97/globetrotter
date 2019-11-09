import secrets

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

auth = api.namespace('auth', description='User authorization endpoint')

# Flask-JWT is probably more ideal but simpler feature is better

@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request')
    @auth.response(409, 'Username taken')
    @auth.expect(MODEL_signup_expect)
    @auth.doc(description='')
    def post(self):
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')
        
        content = request.get_json()
        username = content.get('username')
        hashedpw = content.get('hashedpw')
        displayname = content.get('displayname')

        if username is None or hashedpw is None:
            abort(400, 'Malformed request, username and hashedpw is not supplied')

        if not db.available_username(username):
            abort(409, 'Username \'{}\' is taken'.format(username))
        
        reg = db.register(username, hashedpw, displayname)

        if reg is None:
            abort(500, 'Backend is not working as intended or the supplied information was malformed')

        return


@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success', MODEL_auth_token)
    @auth.response(400, 'Malformed request (missing username/hashedpw)')
    @auth.response(403, 'Invalid username/password combination')
    @auth.expect(MODEL_login_expect)
    @auth.doc(description='')
    def post(self):
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')
        
        content = request.get_json()
        username = content.get('username')
        hashedpw = content.get('hashedpw')

        if username is None or hashedpw is None:
            abort(400, 'Malformed request, username and hashedpw is not supplied')
        
        login = db.login(username, hashedpw)

        print(login)
        
        if not login:
            abort(403, 'Invalid username/password combination')
        
        token = self.generate_token()

        db.insert_token(username, token)

        return {
            "token": token
        }

    def generate_token(self):
        token = secrets.token_hex(32)
        while not db.available_token(token):
            token = secrets.token_hex(32)
        return token
        

@auth.route('/logout', strict_slashes=False)
class Logout(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request')
    @auth.response(403, 'Bearer token mismatch. Your session (token) is not attached to the user and the auth token corresponding to the user is not removed unless user redo the login')
    @auth.expect(MODEL_logout_expect)
    @auth.doc(description='')
    def post(self):
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')
        
        content = request.get_json()
        username = content.get('username')
        token = content.get('token')

        if username is None or token is None:
            abort(400, 'Malformed request, username and token is not supplied')
                
        stat = db.clear_token(username, token)

        if not stat:
            abort(403, 'Bearer token mismatch. Your token is invalid and you should be signed out from your account')

        return
