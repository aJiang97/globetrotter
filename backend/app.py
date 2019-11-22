import os
from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from flask_socketio import SocketIO, send

from util.model_interpret import ModelProc
from db.interface import DB

app = Flask(__name__)
CORS(app)

authorization = {
    'authtoken': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'AUTH-TOKEN'
    }
}
api = Api(app, authorizations=authorization)
socketio = SocketIO(app, cors_allowed_origins="*")

# Runs app using socketio enabled
def run_app(host, port):
    socketio.run(app, host=host, port=port, debug=True)

mp = ModelProc()

db = DB()

import pdb

if 'HOST' in os.environ:
    print()
    print('***')
    print('*** Current backend is served on: http://{}:{}'.format(
        os.environ['HOST'], os.environ['PORT']))
    print('***')
    print()

# SocketIO Routes
@socketio.on('message')
def handle_message(message):
    print('Message: ' + message)
    send(message, broadcast=True)

@socketio.on('json')
def handle_json(json):
    print('Received JSON: ' + str(json))
