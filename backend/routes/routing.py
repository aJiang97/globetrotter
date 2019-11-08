import requests
import json
import config
from datetime import date, timedelta


from concurrent.futures import ThreadPoolExecutor

from app import api
from flask_restplus import Resource, abort, reqparse, fields
from flask import request, jsonify
from requests_futures.sessions import FuturesSession

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
        #locations = request.form['place_id']
        locations =  request.get_json()
        
        payload = {
            'key': config.GOOGLE_WS_API_KEY,
            'origins':locations["place_id"],
            'destinations':locations["place_id"]
        }

        query = requests.get(url="https://maps.googleapis.com/maps/api/distancematrix/json?", params=payload)
        response = json.loads(query.text)
        if query.status_code != 200:
            abort(403,message=response['error_message'])

        #collecting data for algorithm
        locations_id = locations["place_id"].replace("place_id:","").split("|")

        distance_matrix = []
        time_matrix = []
        rows = response["rows"]
        for row in rows:
            dm_row = []
            time_row = []
            for col in row["elements"]:
                dm_row.append(col["distance"]["value"])
                time_row.append(col["duration"]["text"])
            distance_matrix.append(dm_row)
            time_matrix.append(time_row)

        # print(distance_matrix,locations_id)
        # print(time_matrix)

        ordered_locations = self.calculate_path_without_start(distance_matrix,locations_id)
        return {
            "travel_matrix":time_matrix,
            "path":ordered_locations
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
