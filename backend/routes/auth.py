import secrets

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
import json

from util.models import *

auth = api.namespace('auth', description='User authorization endpoint')

# Flask-JWT is probably more ideal but simpler feature is better

@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request')
    @auth.response(409, 'Email is already taken')
    @auth.expect(MODEL_signup_expect)
    @auth.doc(description='')
    def post(self):
        content = json.loads(list(request.form.to_dict().keys())[0])
        email = content['email']
        hashedpw = content['hashedpw']
        displayname = content['displayname']

        if email is None or hashedpw is None:
            abort(400, 'Malformed request, email and hashedpw is not supplied')

        if not db.available_email(email):
            abort(409, 'Email \'{}\' is taken'.format(email))
        
        reg = db.register(email, hashedpw, displayname)

        if reg is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your email is unique.')

        return


@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success', MODEL_auth_token)
    @auth.response(400, 'Malformed request (missing email/hashedpw)')
    @auth.response(403, 'Invalid email/password combination')
    @auth.expect(MODEL_login_expect)
    @auth.doc(description='')
    def post(self):
        content = json.loads(list(request.form.to_dict().keys())[0])
        email = content['email']
        hashedpw = content['hashedpw']

        if email is None or hashedpw is None:
            abort(400, 'Malformed request, email and hashedpw is not supplied')
        
        login = db.login(email, hashedpw)

        print(login)
        
        if not login:
            abort(403, 'Invalid email/password combination')
        
        token = self.generate_token()

        db.insert_token(email, token)

        displayname = db.get_displayname(email, hashedpw)

        return {
            "token": token,
            "displayname": displayname
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
        email = content.get('email')
        token = content.get('token')

        if email is None or token is None:
            abort(400, 'Malformed request, email and token is not supplied')
                
        stat = db.clear_token(email, token)

        if not stat:
            abort(403, 'Bearer token mismatch. Your token is invalid and you should be signed out from your account')

        return
