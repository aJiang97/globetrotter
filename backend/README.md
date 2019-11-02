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

I will add further details here soon


## About Postman

You can download Postman to test the backend API after starting the server. Download Postman [here](https://www.getpostman.com/downloads/).

