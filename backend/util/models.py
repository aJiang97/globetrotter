from app import api
from flask_restplus import fields

# /suggest
# /details
user_reviews = api.model('user_reviews', {
    "name": fields.String(),
    "review": fields.String(),
    "time": fields.String()
})

location_types = api.model('location_types',{
    "night_life": fields.Boolean(),
    "restaurants": fields.Boolean(),
    "national_monument": fields.Boolean(),
    "religious_sites": fields.Boolean(),
    "museums": fields.Boolean(),
    "themeparks": fields.Boolean(),
    "shopping": fields.Boolean(),
    "markets": fields.Boolean(),
    "nature": fields.Boolean()

    # Hidden fields:
    # "wildlife"
    # "historical"
    # "beaches"
})

location_coordinate = api.model('location_coordinate',{
    "latitude": fields.Float(),
    "longitude": fields.Float()
})

f_location = api.model('foursquare_location',{
    "location_types": fields.Nested(location_types),
    "venue_name": fields.String(),
    "coordinate": fields.Nested(location_coordinate),
    "pictures": fields.List(fields.String()),
    "location_id": fields.String(),
    "url": fields.String(description='Can be null'),
    "description": fields.String(description='Can be null')
})

f_location_short = api.model('foursquare_location_short',{
    "location_types": fields.Nested(location_types, description="Might not be complete"),
    "venue_name": fields.String(),
    "coordinate": fields.Nested(location_coordinate),
    "location_id": fields.String()
})

g_location = api.model('google_location', {
    "location_name": fields.String(),
    "reviews": fields.List(fields.Nested(user_reviews)),
    "rating": fields.Float(min=1.0, max=5.0),
    "maps_url": fields.String(),
    "place_id": fields.String(),
    "coordinate": fields.Nested(location_coordinate)
})

fg_location = api.model('detailed_location', {
    "foursquare": fields.Nested(f_location),
    "google": fields.Nested(g_location)
})

f_locations = api.model('foursquare_locations',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(f_location))
})

f_locations_short = api.model('foursquare_locations_short',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(f_location_short))
})

locations = api.model('locations',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(fg_location))
})

# /routing
route_item = api.model('route_item', {
    "name": fields.String(required=True, description='Name or label of the location'),
    "coordinate": fields.Nested(location_coordinate, required=True),
    "priority": fields.Integer(required=False),
    "dwell_time": fields.Integer(required=True, description='Time spent on the vertice (location) in minutes')
})

route_options = api.model('route_options', {
    "start": fields.Integer(required=True, description='Minute of the day when the trip starts', min=0, max=1439),
    "end": fields.Integer(required=True, description='Minute of the day when the trip ends', min=1, max=1440),
    "days": fields.Integer(required=True, description='Number of the days', min=1),
    "break_time": fields.Integer(required=True, description='Time spent for break on the travel. 0 value means no break.', min=0, max=60)
})

route_pathconfig = api.model('route_pathconfig', {
    "starting_point": fields.Nested(route_item, required=False),
    "ending_point": fields.Nested(route_item, required=False),
    "entire_route": fields.Boolean(required=True, description='If this is true, starting and ending point are set for the entire route. Otherwise, starting and ending point is configured for daily route.')
})

route_input = api.model('route_input', {
    "items": fields.List(fields.Nested(route_item), required=True),
    "options": fields.Nested(route_options, required=True),
    "config": fields.Nested(route_pathconfig, required=False)
})

route_item_result = api.model('route_item_result', {
    "type": fields.String(),        # Make this enum of ONVENUE, BREAK, MOVING
    "start": fields.Integer(),
    "end": fields.Integer()
})

route_day = api.model('route_day', {
    "venues": fields.List(fields.Nested(route_item_result))
})

route_result = api.model('route_result', {
    "days": fields.List(fields.Nested(route_day))
})
