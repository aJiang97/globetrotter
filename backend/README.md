# Backend

## Setting up virtual environment

Note: Make sure that you're under `backend` directory

```bash
# create a sandbox for the backend. You might use different path for your python3 executable 
virtualenv -p /usr/bin/python3 env

# enter sandbox
source env/bin/activate

# set up sandbox
python3 -m pip install -r requirements.txt
```


## Modify configuration for token

Copy the file `config.example.py` to `config.py` and modify the new config file according to your token.


## Entering the virtual environment

Note: If you're already under env (having `(env)` on your console), you can skip the first command

```bash
source env/bin/activate

python3 server.py
```

## PostgreSQL Database for stuff

PostgreSQL version: `12.0`

### Installing on Windows
1. Install Postgres with your desired configuration on install (location of the db's data, postgres superuser password etc). Don't forget to use pgAdmin too if you don't want to deal with CLI.
2. Launch `pgAdmin 4`
3. Insert password
4. Add new server
5. Go to Connection, and put your desired config. These are recommended:
    - Host Name/Address: `127.0.0.1` (or `localhost`) (PGHOST)
    - Port: `5432` (PGHOST)
    - Maintenance database: `globetrotter` (PGDBNAME)
    - Username: `postgres` (PGUSER)
    - Password: the password that you put on installation (PGPASSWORD)
6. Go to General, put your desired server name. Anything will do since it won't affect the config.
7. Remember all of your creds for `config.py`
8. (Optional) if you want to use different login, you can add it by createuser

## About Postman

You can download Postman to test the backend API after starting the server. Download Postman [here](https://www.getpostman.com/downloads/).

