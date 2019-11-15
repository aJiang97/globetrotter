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
            c.execute("INSERT INTO creds (email, hashedpw, displayname) VALUES (%s, %s, %s);", (email, hashedpw, displayname))
        except Exception as e:
            print(e)
            c.close()
            return None
        
        c.close()
        self.__conn.commit()
        return True

    def login(self, email, hashedpw):
        c = self.__conn.cursor()
        
        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE email = %s AND hashedpw = %s;", (email, hashedpw))
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
            c.execute("SELECT displayname FROM creds WHERE email = %s AND hashedpw = %s;", (email, hashedpw))
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
            c.execute("UPDATE creds SET token = %s WHERE email = %s;", (token, email))
        except Exception as e:
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    def clear_token(self, email, token):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE email = %s AND token = %s;", (email, token))
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
            c.execute("UPDATE creds SET token = NULL WHERE email = %s AND token = %s;", (email, token))
        except Exception as e:
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
            c.execute("INSERT INTO photos (photo_reference, photo_link) VALUES (%s, %s);", (photo_reference, photo_link))
        except Exception as e:
            print(e)
            c.close()
            return None

        c.close()
        self.__conn.commit()
        return True

    def get_picture(self, photo_reference):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT photo_link FROM photos WHERE photo_reference = %s;", (photo_reference,))
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

    def insert_trip(self, payload):
        c = self.__conn.cursor()

        (email, description, location, tripstart, tripend, blob) = payload

        try:
            uuid_r = getrand_uuid(c)
            c.execute("INSERT INTO trip (email, tripid, description, location, tripstart, tripend, blob, modifieddate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now());", (email, uuid_r, description, location, tztodate(tripstart), tztodate(tripend), blob))
        except Exception as e:
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()
        return uuid_r

    def retrieve_trip_uuid(self, uuid_r):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT description, location, tripstart, tripend, blob, modifieddate FROM trip WHERE tripid = %s;", (uuid_r,))
        except Exception as e:
            print(e)
            c.close()
            return None
        
        rows = c.fetchall()
        if len(rows) == 0:
            return None
        result = rows[0]
        
        c.close()
        return (result[0], result[1], datetotz(result[2]), datetotz(result[3]), bytes(result[4]), datetotz(result[5]))

    def update_trip(self, uuid_r, payload):
        # TODO
        pass

    def retrieve_trips(self, email, orderby=None):
        # TODO
        # Returns all (tripid, description, location, tripstart, tripend) of user with email email
        pass


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
        raise

    return uuid_r
