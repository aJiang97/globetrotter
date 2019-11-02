import psycopg2

import config

def singleton_startup(cursor):
    pass

def start_db():
    dbname = "dbname='" + config.PGDBNAME + "'"
    dbuser = "user='" + config.PGUSER + "'"
    dbhost = "host='" + config.PGHOST + "'"
    dbpw = "password='" + config.PGPASSWORD + "'"
    
    dbconfig = dbname + ' ' + dbuser + ' ' + dbhost + ' ' + dbpw
    conn = psycopg2.connect(dbconfig)

    c = conn.cursor()

    singleton_startup(c)

    conn.commit()
    c.close()
    conn.close()


if __name__ == "__main__":
    start_db()
    