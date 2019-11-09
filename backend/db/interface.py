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

    # Doesn't work for some reason...
    # def __del__(self):
    #     if self.__conn is not None:
    #         self.__conn.close()

    # Add stuff down here...
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
    
    def register(self, username, hashedpw, displayname=None):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO creds (username, hashedpw, displayname) VALUES (%s, %s, %s);", (username, hashedpw, displayname))
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
        