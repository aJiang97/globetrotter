import psycopg2

import config

def singleton_startup(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS creds (
            email varchar(64) NOT NULL,
            hashedpw varchar(128) NOT NULL,
            displayname varchar(64),
            token varchar(64),
            PRIMARY KEY (email),
            UNIQUE (token)
        );
    
        CREATE TABLE IF NOT EXISTS photos (
            photo_reference varchar(256) NOT NULL,
            photo_link varchar(2048) NOT NULL,
            PRIMARY KEY (photo_reference)
        );
    
        INSERT INTO photos (photo_reference, photo_link) VALUES ('CmRaAAAAGrUAys45JWutAEjIG-Mw4LkOhHJL7sC1XRhaU4LyVgh4tlxs93Wz1mcGn-IZKSMpWeyGTFJc2izoKwk1n6uNn4Z_Ah1DyU4fvTwcd9UU_Qyx07byBIm3C5jMD1gIgMCvEhARUuVhS74HqqYKrKbPaGp0GhQUyY-_p_HZFXHKsBVAzxdHWgSv5w', 'https://lh3.googleusercontent.com/p/AF1QipPqslww7frssPpvqXWHCATl6iYspbB4MmbHEtZr') ON CONFLICT DO NOTHING;
    
        INSERT INTO photos (photo_reference, photo_link) VALUES('CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU', 'https://lh4.googleusercontent.com/-1wzlVdxiW14/USSFZnhNqxI/AAAAAAAABGw/YpdANqaoGh4/s1600-w400/Google%2BSydney') ON CONFLICT DO NOTHING;
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

