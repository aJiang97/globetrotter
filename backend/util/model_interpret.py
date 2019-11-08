# Move the details proc to this part, to uniform all endpoints
import os
import json

from util.categories import categoryIDReference, categoryIDReverse
import config

class ModelProc:
    def __init__(self):
        self.__nestedDict = self.__procfile(config.CATEGORIES_FILE)

    def __procfile(self, filepath):
        path = os.getcwd() + filepath
        
        # categories file doesn't exist, return none and ignore config
        if not os.path.exists(path):
            return None

        fh = open(path, 'r', encoding="utf-8")
        fc = fh.read()
        fh.close()

        it = json.loads(fc)

        # Key=child, Value=parent
        selfdict = dict()

        array = it['response']['categories']
        self.__insertparent(array, None, selfdict)

        return selfdict

    def __insertparent(self, array, parentId, selfdict):
        for item in array:
            selfdict[item['id']] = parentId
            self.__insertparent(item['categories'], item['id'], selfdict)

    def __checkparent(self, id, categoryname):
        cats = categoryIDReverse.get(id)
        if cats is None:
            if self.__nestedDict is None:
                return False
            parentId = self.__nestedDict.get(id)
            if parentId is None:
                return False
            return self.__checkparent(parentId, categoryname)
        if categoryname in cats:
            return True
        return False


    def parseCategory(self, FScategories):
        # Avoid hardcoding
        locs = dict()
        for key in categoryIDReference.keys():
            locs[key] = self.checkdict(key, FScategories)

        return locs

    def checkdict(self, category, FScategories):
        for item in FScategories:
            id = item['id']
            # cats = categoryIDReverse.get(id)
            # if cats is None:
            #     continue
            # if category in cats:
            #     return True
            if self.__checkparent(id, category) == True:
                return True
        return False

    # Receives direct response or direct cache of FSVenue response JSONObject dictionary
    def f_location(self, jsonobject):
        locs = self.parseCategory(jsonobject['response']['venue']['categories'])

        pics = []

        # Add best photo
        bp = jsonobject['response']['venue']['bestPhoto']
        pics.append(bp['prefix'] + str(bp['width']) +
                    'x' + str(bp['height']) + bp['suffix'])

        coords = {
            "latitude": jsonobject['response']['venue']['location']['lat'],
            "longitude": jsonobject['response']['venue']['location']['lng']
        }

        return {
            "venue_name": jsonobject['response']['venue']['name'],
            "location_types": locs,
            "coordinate": coords,
            "pictures": pics,
            "location_id": jsonobject['response']['venue']['id'],
            "url": jsonobject['response']['venue'].get('url'),
            "description": jsonobject['response']['venue'].get('description')
        }

    def fs_venuename(self, venue):
        name = venue['name']
        addr = ', '.join(venue['location']['formattedAddress'])

        return name + ' ' + addr

    def g_location(self, jsonobject, place_id, name=None):
        #get location rating
        if jsonobject['result'].get('rating') != None:
            rating = jsonobject['result']['rating']
        else:
            rating = None

        #get user reviews
        user_reviews = []
        if jsonobject['result'].get('reviews') != None: 
            for i in range(len(jsonobject['result']['reviews'])-1):
                user_reviews.append({
                    "name": jsonobject['result']['reviews'][i]['author_name'],
                    "review": jsonobject['result']['reviews'][i]['text'],
                    "time": jsonobject['result']['reviews'][i]['relative_time_description']
                })

        # links to googlemaps of location
        url = jsonobject['result']['url']

        #not sure this is needed in the google endpoint as it already exists in fs endpoint
        coords = {
            'latitude': 0,# jsonobject['result']['geometry']['location']['lat'],
            'longitude':0 # jsonobject['result']['geometry']['location']['lng']
        }

        return {
            'location_name': name,
            'reviews': user_reviews,
            'rating': rating,
            'maps_url': url,
            'place_id': place_id,
            'coordinate': coords
        }
