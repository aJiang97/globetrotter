import uuid
import datetime

import psycopg2
import dateutil.parser

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
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)
    
    def register(self, email, hashedpw, displayname=None):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO creds (email, hashedpw, displayname) VALUES (%s, %s, %s);", (email, hashedpw, displayname))
        except Exception as e:
            print(e)
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
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        c.close()
        return (rlen == 1)

    def available_token(self, token):
        c = self.__conn.cursor()
        
        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE token = %s;", (token,))
        except Exception as e:
            print(e)
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)

    def insert_token(self, email, token):
        c = self.__conn.cursor()

        try:
            c.execute("UPDATE creds SET token = %s WHERE email = %s;", (token, email))
        except Exception as e:
            print(e)
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
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        if (rlen == 0):
            c.close()
            return False

        try:
            c.execute("UPDATE creds SET token = NULL WHERE email = %s AND token = %s;", (email, token))
        except Exception as e:
            print(e)
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
        self.__conn.commit()

    def get_picture(self, photo_reference):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT photo_link FROM photos WHERE photo_reference = %s;", (photo_reference,))
        except Exception as e:
            print(e)

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
        
        rows = c.fetchall()
        result = rows[0][0]
        
        c.close()
        return result

    def insert_calendar(self, email, description, location, tripstart, tripend, blob):
        c = self.__conn.cursor()

        try:
            uuid_r = getrand_uuid(c)
            c.execute("INSERT INTO calendars (email, calendarid, description, location, tripstart, tripend, calendar, modifieddate) VALUES (%s, %s, %s, %s, %s, %s, %s, now());", (email, uuid_r, description, location, tztodate(tripstart), tztodate(tripend), blob))
        except Exception as e:
            print(e)
            raise e

        c.close()
        self.__conn.commit()
        return uuid_r

    def retrieve_calendar_uuid(self, uuid):
        # Returns BLOB of the UUID
        pass

    def retrieve_calendars(self, email, orderby=None):
        # Returns all UUIDs of user
        pass


# Python is so bad that it needs to be dependent to third party package to parse a standardized datetime format...
def tztodate(s):
    return dateutil.parser.parse(s)

def getrand_uuid(curs):
    uuid_r = None
    count = 1

    while count:
        uuid_r = str(uuid.uuid4())
        curs.execute("SELECT COUNT(*) FROM calendars WHERE calendarid = %s;", (uuid_r,))
        rows = curs.fetchall()
        count = rows[0][0]

    if uuid_r is None:
        raise

    return uuid_r
