import psycopg2

import config

def singleton_startup(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS venue (
            venue_id varchar(24) NOT NULL,
            data jsonb,
            PRIMARY KEY (venue_id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS place (
            place_id varchar(27) NOT NULL,
            data jsonb,
            PRIMARY KEY (place_id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pv_relation (
            venue_id varchar(24),
            place_id varchar(27)
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


if __name__ == "__main__":
    start_db()
    