from app import api
from flask_restplus import fields

import enum

# /suggest
# /details
MODEL_user_reviews = api.model('user_reviews', {
    "name": fields.String(),
    "review": fields.String(),
    "time": fields.String()
})

MODEL_location_types = api.model('location_types',{
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

MODEL_location_coordinate = api.model('location_coordinate',{
    "latitude": fields.Float(),
    "longitude": fields.Float()
})

MODEL_f_location = api.model('foursquare_location',{
    "location_types": fields.Nested(MODEL_location_types),
    "venue_name": fields.String(),
    "coordinate": fields.Nested(MODEL_location_coordinate),
    "pictures": fields.List(fields.String()),
    "location_id": fields.String(),
    "url": fields.String(description='Can be null'),
    "description": fields.String(description='Can be null')
})

MODEL_f_location_short = api.model('foursquare_location_short',{
    "location_types": fields.Nested(MODEL_location_types, description="Might not be complete"),
    "venue_name": fields.String(),
    "coordinate": fields.Nested(MODEL_location_coordinate),
    "location_id": fields.String()
})

MODEL_g_location = api.model('google_location', {
    "location_name": fields.String(),
    "reviews": fields.List(fields.Nested(MODEL_user_reviews)),
    "rating": fields.Float(min=1.0, max=5.0),
    "maps_url": fields.String(),
    "place_id": fields.String(),
    "coordinate": fields.Nested(MODEL_location_coordinate)
})

MODEL_fg_location = api.model('detailed_location', {
    "foursquare": fields.Nested(MODEL_f_location),
    "google": fields.Nested(MODEL_g_location)
})

MODEL_f_locations = api.model('foursquare_locations',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(MODEL_f_location))
})

MODEL_f_locations_short = api.model('foursquare_locations_short',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(MODEL_f_location_short))
})

MODEL_locations = api.model('locations',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(MODEL_fg_location))
})

# /details/google/photo
MODEL_photoref = api.model('photo_reference', {
    "reference": fields.String(description='Google Photos reference', required=True),
    "maxheight": fields.Integer(),
    "maxwidth": fields.Integer()
})

MODEL_photorefs = api.model('photo_references', {
    "references": fields.List(fields.Nested(MODEL_photoref), required=True)
})

# /routing
# Inputs
# Individual venue item
MODEL_route_item = api.model('route_item', {
    "name": fields.String(required=True, description='Name or label of the location. It is advisable for frontend to use venue_id or place_id on this field. The word "START" and "END" is reserved for pathconfig\'s starting and ending point (if starting and ending point is specified with other name, it will be changed to "START" and/or "END")'),
    "coordinate": fields.Nested(MODEL_location_coordinate, required=True),
    "priority": fields.Integer(required=False),
    "dwell_time": fields.Integer(required=True, description='Time spent on the vertice (location) in minutes')
})

# Input path config and route options
MODEL_route_options = api.model('route_options', {
    "days": fields.Integer(required=True, description='Number of the days', min=1),
    "start": fields.Integer(required=True, description='Minute of the day when the trip starts', min=0, max=1439),
    "end": fields.Integer(required=True, description='Minute of the day when the trip ends', min=1, max=1440),
    "break_time": fields.Integer(required=True, description='Time spent for break on the travel. 0 value means no break.', min=0, max=60)
})

MODEL_route_pathconfig = api.model('route_pathconfig', {
    "starting_point": fields.Nested(MODEL_route_item, required=False),
    "ending_point": fields.Nested(MODEL_route_item, required=False),
    "entire_route": fields.Boolean(required=True, description='If this is true, starting and ending point are set for the entire route. Otherwise, starting and ending point is configured for daily route.')
})

MODEL_route_input = api.model('route_input', {
    "place_id":fields.String(description='placeIds of selected locations')
    # "items": fields.List(fields.Nested(MODEL_route_item), required=True),
    # "options": fields.Nested(MODEL_route_options, required=True),
    # "config": fields.Nested(MODEL_route_pathconfig, required=False)
})


# /routing
# Outputs
class EnumItemResult(enum.Enum):
    ONVENUE = 'ONVENUE'
    BREAK = 'BREAK'
    MOVING = 'MOVING'

MODEL_route_item_result = api.model('route_item_result', {
    "type": fields.String(description='Status of route item, whether it is moving between points or on the venue', enum=EnumItemResult._member_names_),
    "start": fields.Integer(description='Minute of the day when this item starts'),
    "end": fields.Integer(description='Minute of the day when this item ends. Could be identical to start if field name is "START" or "END"'),
    "name": fields.String(description='Name or label of the location specified on route_item if field type is ONVENUE. "START" and "END" means starting and ending point that was supplied under pathconfig\'s input'),
})

MODEL_route_day = api.model('route_day', {
    "venues": fields.List(fields.Nested(MODEL_route_item_result))
})

MODEL_route_matrix_item = api.model('route_matrix_item', {
    "ok_status": fields.Boolean(description='Show if the item is OK'),
    "distance": fields.Integer(description='Distance in metre'),
    "duration": fields.Integer(description='Duration in seconds'),
    "name": fields.String(description='Name or label of the location specified on route_item if field type is ONVENUE. "START" and "END" means starting and ending point that was supplied under pathconfig\'s input'),
})

MODEL_route_rows = api.model('route_rows', {
    "columns": fields.List(fields.Nested(MODEL_route_matrix_item))
})

MODEL_route_matrix = api.model('route_matrix', {
    "origins": fields.List(fields.String(description='Array of name supplied from route_item (or "START") where index of this origin will be index of row.')),
    "destinations": fields.List(fields.String(description='Array of name supplied from route_item (or "END") where index of this destination will be index of column.')),
    "rows": fields.List(fields.Nested(MODEL_route_rows))
})

MODEL_route_result = api.model('route_result', {
    "distance_matrix": fields.List(fields.Nested(MODEL_route_matrix)),
    "days": fields.List(fields.Nested(MODEL_route_day))
})
