import uuid
import datetime
import json

import psycopg2
import dateutil.parser
import pandas

import config


class DB:
    def __init__(self):
        dbname = "dbname='" + config.PGDBNAME + "'"
        dbuser = "user='" + config.PGUSER + "'"
        dbhost = "host='" + config.PGHOST + "'"
        dbpw = "password='" + config.PGPASSWORD + "'"

        dbconfig = dbname + ' ' + dbuser + ' ' + dbhost + ' ' + dbpw
        self.__conn = psycopg2.connect(dbconfig)

    # Authentication endpoints
    def available_email(self, email):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE email = %s;", (email,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)

    def register(self, email, hashedpw, displayname=None):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO creds (email, hashedpw, displayname) VALUES (%s, %s, %s);",
                      (email, hashedpw, displayname))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    def login(self, email, hashedpw):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT COUNT(*) FROM creds WHERE email = %s AND hashedpw = %s;", (email, hashedpw))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            c.close()
            return None
        rlen = rows[0][0]

        c.close()
        return (rlen == 1)

    def get_displayname(self, email, hashedpw):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT displayname FROM creds WHERE email = %s AND hashedpw = %s;", (email, hashedpw))
        except Exception as e:
            print(e)
            c.close()
            return None
        rows = c.fetchall()
        result = rows[0][0]

        c.close()
        return result

    def available_token(self, token):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE token = %s;", (token,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)

    def insert_token(self, email, token):
        c = self.__conn.cursor()

        try:
            c.execute("UPDATE creds SET token = %s WHERE email = %s;",
                      (token, email))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    def clear_token(self, email, token):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT COUNT(*) FROM creds WHERE email = %s AND token = %s;", (email, token))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None
        rlen = rows[0][0]

        if (rlen == 0):
            c.close()
            return False

        try:
            c.execute(
                "UPDATE creds SET token = NULL WHERE email = %s AND token = %s;", (email, token))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    # Details/picture endpoint

    def insert_picture(self, photo_reference, photo_link):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO photos (photo_reference, photo_link) VALUES (%s, %s);",
                      (photo_reference, photo_link))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    def get_picture(self, photo_reference):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT photo_link FROM photos WHERE photo_reference = %s;", (photo_reference,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        result = rows[0][0]

        c.close()
        return result

    def authorize(self, token):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT email FROM creds WHERE token = %s;", (token,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            return None
        result = rows[0][0]

        c.close()
        return result

    # Dealing with trip, either create, modify, read
    def post_trip(self, email, payload):
        c = self.__conn.cursor()

        (description, city, tripstart, tripend, blob) = payload

        try:
            uuid_r = getrand_uuid(c)
            c.execute("INSERT INTO trip (tripid, description, city, tripstart, tripend, blob, modifieddate) VALUES (%s, %s, %s, %s, %s, %s, now());",
                      (uuid_r, description, city, tztodate(tripstart), tztodate(tripend), blob))
            c.execute(
                "INSERT INTO user_trip (email, tripid, permission) VALUES (%s, %s, 0)", (email, uuid_r))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()
        return uuid_r

    def get_trip(self, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT description, city, tripstart, tripend, blob, modifieddate FROM trip WHERE tripid = %s;", (uuid_r,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None
        result = rows[0]

        c.close()
        return (result[0], result[1], datetotz(result[2]), datetotz(result[3]), bytes(result[4]), datetotz(result[5]))

    def patch_trip(self, uuid_r, payload):
        c = self.__conn.cursor()

        (description, city, tripstart, tripend, blob) = payload

        try:
            c.execute("UPDATE trip SET description = %s, city = %s, tripstart = %s, tripend = %s, blob = %s, modifieddate = now() WHERE uuid = %s;",
                      (description, city, tztodate(tripstart), tztodate(tripend), blob, uuid_r))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()
        return

    def delete_trip(self, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute("DELETE FROM user_trip WHERE tripid = %s;", (uuid_r,))
            c.execute("DELETE FROM trip WHERE tripid = %s;", (uuid_r,))
        except Exception as e:
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()
        return


    # List all trips information
    def retrieve_trips(self, email, orderby=None):
        c = self.__conn.cursor()

        try:
            c.execute(
                "SELECT trip.description, trip.city, trip.tripstart, trip.tripend, trip.modifieddate, trip.tripid, user_trip.permission FROM trip, user_trip WHERE trip.tripid = user_trip.tripid AND user_trip.email = %s;", (email,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()

        trips = []
        for detail in rows:
            dets = {
                "description": detail[0],
                "city": detail[1],
                "tripstart": datetotz(detail[2]),
                "tripend": datetotz(detail[3]),
                "modifieddate": datetotz(detail[4]),
                "uuid": detail[5],
                "permission": detail[6]
            }
            trips.append(dets)
        return trips

    # Trip-User relation
    # Authorization assertion is done under get_user_trip that needs to be called before these functions
    def post_user_trip(self, email, uuid_r, permission):
        # POST
        # 0 as owner
        # 1 as admin
        # 2 as editor
        # 3 as viewer
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO user_trip (email, tripid, permission) VALUES (%s, %s, %s);", (email, uuid_r, permission))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()
        return uuid_r

    def delete_user_trip(self, email, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute("DELETE FROM user_trip WHERE email = %s AND tripid = %s;", (email, uuid_r))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()

    def patch_user_trip(self, email, uuid_r, permission):
        c = self.__conn.cursor()

        try:
            c.execute("UPDATE user_trip SET permission = %s WHERE email = %s AND tripid = %s;", (permission, email, uuid_r))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()

    def get_user_trip(self, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT user_trip.email, user_trip.permission, creds.displayname FROM user_trip INNER JOIN creds ON user_trip.email = creds.email WHERE user_trip.tripid = %s;", (uuid_r,))
        except Exception as e:
            print(e)
            c.close()
            return None

        rows = c.fetchall()
                
        users = []
        for result in rows:
            user = {
                "email": result[0],
                "permission": result[1],
                "displayname": result[2]
            }
            users.append(user)

        c.close()
        return users

    # Permission stuff
    def get_perm(self, email, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM user_trip WHERE tripid = %s;", (uuid_r,))
        except Exception as e:
            print(e)
            c.close()
            return None
        
        rows = c.fetchall()
        if rows[0][0] == 0:
            c.close()
            return None

        try:
            c.execute("SELECT permission FROM user_trip WHERE email = %s AND tripid = %s;", (email, uuid_r))
        except Exception as e:
            print(e)
            c.close()
            return None
        
        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return -1
        
        perm = rows[0][0]
        c.close()
        return perm

    def exist_email(self, email):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE email = %s;", (email,))
        except Exception as e:
            print(e)
            c.close()
            return None
        
        rows = c.fetchall()

        exist = rows[0][0]
        c.close()
        return (exist == 1)


# Python is so bad that it needs to be dependent to third party package to parse a standardized datetime format...
def tztodate(s):
    return dateutil.parser.parse(s)

# And dateutil doesn't have the parser back...
def datetotz(s):
    return str(pandas.to_datetime(s, utc=True))

def getrand_uuid(curs):
    uuid_r = None
    count = 1

    while count:
        uuid_r = str(uuid.uuid4())
        curs.execute("SELECT COUNT(*) FROM trip WHERE tripid = %s;", (uuid_r,))
        rows = curs.fetchall()
        count = rows[0][0]

    if uuid_r is None:
        raise Exception("Can't insert uuid")

    return uuid_r
