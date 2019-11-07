import os
import time
import config

def expired(path):
    t2 = os.stat(path).st_mtime
    t1 = time.time()

    if config.CACHETIME < 24:
        if (t2 + 86400) > t1:
            return False
        else:
            return True
    elif (t2 + (config.CACHETIME * 3600)) > t1:
        return False
    else:
        return True

def check_cache(filename, expiryCheck=True):
    path = os.getcwd() + config.DIR_NAME

    if not os.path.exists(path):
        return False

    for root, dirs, files in os.walk(path):
        if filename in files:
            fpath = os.path.join(path, filename)
            if expiryCheck == False:
                return True
            elif expired(fpath) == False:
                # File is relatively new, use it
                return True
    return False

def retrieve_cache(filename, expiryCheck=True):
    path = os.getcwd() + config.DIR_NAME

    if not os.path.exists(path):
        os.makedirs(path, 777)  

    for root, dirs, files in os.walk(path):
        if filename in files:
            fpath = os.path.join(path, filename)
            if expiryCheck == False:
                # No expiry needed, use it
                f = open(fpath, 'r',encoding="utf-8")
                content = f.read()
                f.close()
                return content
            elif expired(fpath) == False:
                # File is relatively new, use it
                f = open(fpath, 'r',encoding="utf-8")
                content = f.read()
                f.close()
                return content

    return None

def store_cache(content, filename):
    path = os.getcwd() + config.DIR_NAME

    if not os.path.exists(path):
        os.makedirs(path, 777)

    # print("filename: " + filename)
    # print("content:")
    # print(content)

    f = open(os.path.join(path, filename), "w",encoding="utf-8")
    f.write(content)
    f.close()
