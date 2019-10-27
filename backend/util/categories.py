def category(header, categories=None):
    if categories == None:
        return
    try:
        cats = categories.lower().split(',')
        categoryId = categorization(cats)
        header['categoryId'] = ','.join(categoryId)
    except (TypeError):
        raise AssertionError('Invalid type given')


def categorization(cats):
    d = []
    for cat in cats:
        f = switch.get(cat, None)
        if f is not None:
            d.extend(f(cat))
    return d

switch = {
    "romance": None,
    "nature": None,
    "wildlife": None,
    "shopping": shopping,
    "historical": None,
    "cultural": None,
    "family": None,
    "beaches": beaches,
    "food": food,
    "buildings": buildings
}

def shopping():
    ret = []
    ret.append("4d4b7105d754a06378d81259")
    return ret

def beaches():
    ret = []
    ret.append("4bf58dd8d48988d1e2941735")
    return ret

def wildlife():
    ret = []
    ret.append("4bf58dd8d48988d17b941735") # Zoo
    ret.append("4fceea171983d5d06c3e9823") # Aquarium
    return ret

def historical():
    ret = []
    ret.append("4deefb944765f83613cdba6e") # Historic site
    ret.append("4bf58dd8d48988d190941735") # History museum
    return ret

def food():
    return ["4d4b7105d754a06374d81259"] # Food

def buildings():
    return ["4d4b7104d754a06370d81259"]
