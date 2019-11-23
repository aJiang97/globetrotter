from datetime import date
import requests
import json
from pathlib import Path
import config

FS_ID = config.FOURSQUARE_CLIENT_ID
FS_SECRET = config.FOURSQUARE_CLIENT_SECRET
GM_KEY = config.GOOGLE_WS_API_KEY
CURRENT_DATE = date.today().strftime('%Y%m%d')

categories = {
    'night_life': '4d4b7105d754a06376d81259',
    # night life spot
    'restaurants': '4d4b7105d754a06374d81259',
    # food
    'national_monument': '4bf58dd8d48988d12d941735',
    # monuement/landmark
    'religious_sites': '4bf58dd8d48988d131941735',
    # spiritual centre
    'museums': '4bf58dd8d48988d181941735',
    # museums
    'themeparks': '4bf58dd8d48988d182941735,4bf58dd8d48988d193941735',
    # theme park, water park 
    'shopping': '4bf58dd8d48988d1fd941735,5744ccdfe4b0c0459246b4dc',
    #shopping mall, shopping plaza
    'markets': '4bf58dd8d48988d1fa941735,4bf58dd8d48988d10e951735,4bf58dd8d48988d1f7941735,53e510b7498ebcb1801b55d4',
    # farmers market, fish market, flea market, night market
    'nature': '4bf58dd8d48988d1e2941735,4bf58dd8d48988d159941735,52e81612bcbc57f1066b7a22,52e81612bcbc57f1066b7a21,52e81612bcbc57f1066b7a13',
    # b/*each, trail, botanical garden, national park, nature preserve
}

#change city here
city = 'New York'

def get_place_id(lat,lng,name):
    coords = str(lat)+","+str(lng)
    gpayload = {
        'key':GM_KEY,
        'location':coords,
        'rankby':'distance',
        'name':name
    }
    g_reply = requests.get(url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?",params=gpayload)
    resp = json.loads(g_reply.text)
    try:
        placeid = resp['results'][0]['place_id']
        rating=0
        if "rating" in resp['results'][0]:
            rating = resp['results'][0]["rating"]
        return {
            'id':placeid,
            'rating':rating
        }
    except IndexError:
        return None


path = Path(__file__).parent
f = open(str(path)+"/"+city+".txt","w",encoding='utf-8')

payload = {
        'near':city,
        'client_id':FS_ID,
        'client_secret':FS_SECRET,
        'v':CURRENT_DATE,
        'sortByPopularity':'1',
        'limit':'50'
    }

reply = requests.get(url="https://api.foursquare.com/v2/venues/explore",params=payload)

response = json.loads(reply.text)

locations = response['response']['groups'][0]['items']

#f.write("Popular:\n")
for location in locations:
    long = location['venue']['location']['lng']
    lat = location['venue']['location']['lat']
    name = location['venue']['name']
    res = get_place_id(lat,long,name)
    if res is None:
        pass
    else:
        f.write('{0:50};{1:24};{2};{3}\n'.format(name,res['rating'],location['venue']['id'],res['id']))
f.write("\n")

for category in categories:
    print(category+" start")
    payload = {
        'near':city,
        'client_id':FS_ID,
        'client_secret':FS_SECRET,
        'v':CURRENT_DATE,
        'categoryId':categories[category],
        'limit':'50'
    }

    reply = requests.get(url="https://api.foursquare.com/v2/venues/explore",params=payload)

    response = json.loads(reply.text)

    locations = response['response']['groups'][0]['items']

    #f.write(category+":\n")
    for location in locations:
        long = location['venue']['location']['lng']
        lat = location['venue']['location']['lat']
        name = location['venue']['name']
        res = get_place_id(lat,long,name)
        if res is None:
            pass
        else:
            f.write('{0:50};{1:24};{2};{3}\n'.format(name,res['rating'],location['venue']['id'],res["id"]))
    f.write("\n")


f.close()

