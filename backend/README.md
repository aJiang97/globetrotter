# Backend

## Setting up virtual environment

Note: Make sure that you're under `backend` directory

```bash
# create a sandbox for the backend. You might use different path for your python3 executable 
virtualenv -p /usr/bin/python3 env

# enter sandbox
source env/bin/activate

# set up sandbox
pip install -r requirements.txt
```

## Entering the virtual environment

Note: If you're already under env (having `(env)` on your console), you can skip the first command

```bash
source env/bin/activate

python3 testApp.py
```

