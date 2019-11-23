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
    #               'name':"name of event",
    #               'start':"start time of event",
    #               'duration':duration of even in minutes
    #               },
    #               {next event details...}
    #              ]

# example...
#     {
#   "itinerary": [
#     {
#       "name": "opera house",
#       "start": "2019-11-25 09:00:00",
#       "duration": 60
#     },
#     {
#       "name": "harbour bridge",
#       "start": "2019-11-25 11:00:00",
#       "duration": 60
#     },
#     {
#       "name": "bondi beach",
#       "start": "2019-11-25 04:00:00",
#       "duration": 60
#     }
#   ]
# }

    def post(self):
        data = request.get_json()
        if data is None:
            abort(400,'Trip Data not received')
        itinerary = data.get('itinerary')

        # start_date = data.get('startdate')
        # start = datetime.strptime(start_date,'%y-%m-%d %H:%M:%S')
        # # account for gmt, sydney+11
        # start = start - timedelta(hours=-11)
        # # assume starting day at 9am
        # start = start + timedelta(hours=9)

        c = Calendar()
        for event in itinerary:
            e = Event()
            e.name = event['name']
            e.begin = datetime.strptime(event['start'],'%Y-%m-%d %H:%M:%S')+timedelta(hours=-11) #account for tz
            e.duration = timedelta(minutes=event['duration'])
            c.events.add(e)
        # with open('my.ics', 'w') as f:
        #     f.write(str(c))
        return str(c)
