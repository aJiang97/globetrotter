from ics import Calendar, Event
from app import api, mp
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
from util.models import *
from datetime import datetime, timedelta

export = api.namespace('export', description='export to a ics file')

@export.route('/',strict_slashes=False)
class exportTrip(Resource):
    @export.param('itinerary','The trip the user wants to export to ics format')
    @export.expect(MODEL_calendar)
    # 'itinerary':[{
    #               'name':'"{"name of event"}",
    #               'start':"start time of event"}",
    #               'duration':duration of even in minutes
    #               },
    #               {next event details...}
    #              ]

    def post(self):
        data = request.get_json()
        if data is None:
            abort(400,'Trip Data not received')
        itinerary = data.get('itinerary')
        #start_dates = data.get('startdate')


        c = Calendar()
        for event in itinerary:
            e = Event()
            e.name = event['name']
            e.begin = event['start']
            e.duration = timedelta(minutes=event['duration'])
            c.events.add(e)
        return str(c)
