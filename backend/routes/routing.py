import requests
import json
import config

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify

from util.models import *


routing = api.namespace('routing', description='Routing of places')

@routing.route('/itinerary', strict_slashes=False)
class ItineraryAlgorithm(Resource):
    @routing.response(200, 'Success', model=MODEL_route_result)
    @routing.expect(MODEL_route_input)
    @routing.doc(description='''takes in locations that are selected to generate distance matrix and itinerary
                                format accepted json
                                "place_id":"place_id:{put_id_here}"
                                "place_id":"place_id:{put_id_here}|place_id{extra_ids}|..."''')
    def post(self):
        locations = request.get_json()
        locations_id = locations.get("place_id").replace("place_id:","").split("|")

        if len(locations_id) <= 1:
            return {
                "travel_matrix":[["0 mins"]],
                "path":locations_id,
                "matrix_places": locations.get("place_id")
            }

        #collecting data for algorithm
        #first tries driving mode then bicycling
        matrix = self.get_distancematrix(locations.get("place_id"))
        if matrix is None:
            matrix = self.get_distancematrix(locations.get("place_id"),mode='bicycling')
            if matrix is None:
                abort(403,message="Error with google API request or response")

        ordered_locations = self.calculate_path_without_start(matrix["dm"],locations_id)

        return {
            "travel_matrix":matrix["tm"],
            "path":ordered_locations,
            "matrix_places": locations.get("place_id")      # This is for /user/trip endpoint
        }


    def calculate_path_without_start(self, distance_matrix, locations):
        # Used to keep track of the target location for each location
        path_dict = {}
        for location in locations:
            path_dict[location] = None
        path = []
        cost = 0
        
        # Find our starting edge by finding the smallest distance between 2 locations
        num_loc = len(locations)
        smallest_distance = distance_matrix[0][1]
        smallest_edge = (0, 1)
        for src_loc_index in range(num_loc):
            for dest_loc_index in range(num_loc):
                if src_loc_index == dest_loc_index:
                    # Distance to itself is 0
                    continue
                if distance_matrix[src_loc_index][dest_loc_index] < smallest_distance:
                    smallest_distance = distance_matrix[src_loc_index][dest_loc_index]
                    smallest_edge = (src_loc_index, dest_loc_index)

        # By this point, have the minimum first edge
        cost += smallest_distance
        start_loc = locations[smallest_edge[0]]
        next_loc = locations[smallest_edge[1]]
        next_loc_index = smallest_edge[1]
        path.append(start_loc)
        path.append(next_loc)
        path_dict[start_loc] = next_loc

        # Initialise next_loc to be the location adjacent to it in the distance matrix
        for _ in range(num_loc - 2):
            src_loc = next_loc_index
            smallest_distance = None
            for col in range(num_loc):
                if src_loc == col or path_dict[locations[col]] is not None:
                    # Edge already has a next location
                    continue
                if smallest_distance is None or distance_matrix[src_loc][col] < smallest_distance:
                    smallest_distance = distance_matrix[src_loc][col]
                    next_loc_index = col
            start_loc = locations[src_loc]
            next_loc = locations[next_loc_index]
            path_dict[start_loc] = next_loc
            path.append(next_loc)
            cost += smallest_distance
        return path

    # request distance matrix from google api
    #   locations are string of place_ids from google places
    #   mode is one of: driving,walking,bicycling,transit
    def get_distancematrix(self,locations,mode='driving'):

        payload = {
            'key': config.GOOGLE_WS_API_KEY,
            'origins':locations,
            'destinations':locations,
            'mode':mode
        }

        query = requests.get(url="https://maps.googleapis.com/maps/api/distancematrix/json?", params=payload)
        response = json.loads(query.text)
        
        if query.status_code != 200:
            return None
        
        rows = response["rows"]
        distance_matrix = []
        travel_matrix = []
        
        for row in rows:
            dm_row = []
            travel_row = []
            for col in row["elements"]:
                try:
                    dm_row.append(col["distance"]["value"])
                    travel_row.append(col["duration"]["text"])
                except KeyError:
                    return None
            distance_matrix.append(dm_row)
            travel_matrix.append(travel_row)

        return {
            'dm':distance_matrix,
            'tm':travel_matrix,
        }

