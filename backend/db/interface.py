import psycopg2

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
    def available_username(self, username):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE username = %s;", (username,))
        except Exception as e:
            print(e)
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)
    
    def register(self, username, hashedpw, displayname=None, email=None):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO creds (username, hashedpw, displayname, email) VALUES (%s, %s, %s, %s);", (username, hashedpw, displayname, email))
        except Exception as e:
            print(e)
            return None
        
        c.close()
        self.__conn.commit()
        return True

    def login(self, username, hashedpw):
        c = self.__conn.cursor()
        
        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE username = %s AND hashedpw = %s;", (username, hashedpw))
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

    def insert_token(self, username, token):
        c = self.__conn.cursor()

        try:
            c.execute("UPDATE creds SET token = %s WHERE username = %s;", (token, username))
        except Exception as e:
            print(e)
            return None

        c.close()
        self.__conn.commit()
        return True

    def clear_token(self, username, token):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM creds WHERE username = %s AND token = %s;", (username, token))
        except Exception as e:
            print(e)
            return None
        
        rows = c.fetchall()
        rlen = rows[0][0]

        if (rlen == 0):
            c.close()
            return False

        try:
            c.execute("UPDATE creds SET token = NULL WHERE username = %s AND token = %s;", (username, token))
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
