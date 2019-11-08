import psycopg2

import config

class DB:
    def __init__(self):
        dbname = "dbname='" + config.PGDBNAME + "'"
        dbuser = "user='" + config.PGUSER + "'"
        dbhost = "host='" + config.PGHOST + "'"
        dbpw = "password='" + config.PGPASSWORD + "'"
        
        self.__dbconfig = dbname + ' ' + dbuser + ' ' + dbhost + ' ' + dbpw
        self.__conn = psycopg2.connect(dbconfig)

    def __del__(self):
        self.__conn.close()

    # Private template query
    def __read(self, query):
        c = self.__conn.cursor()
        try:
            c.execute(query)
        except Exception as e:
            raise
    
        rows = cur.fetchall()

        result = []
        for row in rows:
            result.append(row[1:-1])
        
        c.close()
        return result

    # Private template query
    def __execute(self, query):
        c = self.__conn.cursor()
        try:
            c.execute(query)
        except Exception as e:
            raise

        c.close()
        self.__conn.commit()

    # Add stuff down here...
    