import os
from flask import Flask
from flask_restplus import Api
from flask_cors import CORS

from util.model_interpret import ModelProc

app = Flask(__name__)
CORS(app)

api = Api(app)
mp = ModelProc()

import pdb

if 'HOST' in os.environ:
    print()
    print('***')
    print('*** Current backend is served on: http://{}:{}'.format(
        os.environ['HOST'], os.environ['PORT']))
    print('***')
    print()
