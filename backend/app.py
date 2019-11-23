import os
from flask import Flask, request
from flask_restplus import Api
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit, join_room, leave_room

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


@socketio.on('join')
def on_join(data):
    user = data['user']
    room = data['room']
    join_room(room)
    print('in on-join')
    print(data)
    print(user)
    print(room)
    send(user['name'] + ' has entered room ' + room, room=room)

@socketio.on('leave')
def on_leave(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    print('in on-leave')
    print(user)
    print(room)
    send(user['name'] + ' has left room ' + room, room=room)

@socketio.on('edit_title')
def handle_edit_title(new_title, room):
    print('Title Edited')
    print(new_title)
    emit("editTitle", new_title, room=room)

@socketio.on('edit_dates')
def handle_edit_dates(new_dates, room):
    print('Date Edited')
    print(new_dates)
    emit('editDates', new_dates, room=room)

@socketio.on('edit_locations')
def handle_edit_locations(new_locations):
    print('Locations Edited')
    print(new_locations)
    emit('editLocations', new_locations)

@socketio.on('edit_users')
def handle_edit_users(new_users, room):
    print('Users Edited')
    print(new_users)
    emit('editUsers', new_users, room=room)

@socketio.on('send_to_room')
def handle_send_to_room(message, room):
    send(message, room=room)
