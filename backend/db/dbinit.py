import psycopg2

import config

def singleton_startup(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS creds (
            username varchar(32) NOT NULL,
            hashedpw varchar(128) NOT NULL,
            displayname varchar(64),
            token varchar(64),
            PRIMARY KEY (username)
        )
    """)

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

