from app import api
from flask_restplus import fields

location_types = api.model('location_types',{
    "romance": fields.Boolean(),
    "nature": fields.Boolean(),
    "wildlife": fields.Boolean(),
    "shopping": fields.Boolean(),
    "historical": fields.Boolean(),
    "cultural": fields.Boolean(),
    "family": fields.Boolean(),
    "beaches": fields.Boolean(),
    "food": fields.Boolean()
})

location_coordinate = api.model('location_coordinate',{
    "latitude": fields.Float(),
    "longitude": fields.Float()
})

location = api.model('location',{
    "location_types": fields.Nested(location_types),
    "venue_name": fields.String(),
    "coordinate": fields.Nested(location_coordinate),
    "pictures": fields.List(fields.String()),
    "location_id": fields.String()
})

locations = api.model('locations',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(location))
})

location_short = api.model('location_short',{
    "venue_name": fields.String(),
    "coordinate": fields.Nested(location_coordinate),
    "location_id": fields.String()
})

locations_short = api.model('locations_short',{
    "city": fields.String(),
    "locations": fields.List(fields.Nested(location_short))
})

user_reviews = api.model('user_reviews', {
    "name": fields.String(),
    "review": fields.String(),
    "time": fields.String()
})

g_location = api.model('g_location', {
    "location_name": fields.String(),
    "reviews": fields.List(fields.Nested(user_reviews)),
    "rating": fields.Float(min=1.0, max=5.0),
    "maps_url": fields.String(),
    "place_id": fields.String(),
    "coordinate": fields.Nested(location_coordinate)
})

fg_location = api.model('fg_location', {
    "foursquare": fields.Nested(location),
    "google": fields.Nested(g_location)
})
