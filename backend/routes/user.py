

from app import api, db
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *

user = api.namespace('user', description='User trips endpoint')


