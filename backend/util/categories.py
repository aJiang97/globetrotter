# README
# If you want to add FScategoryID and Categories, make sure that both categoryIDReference and categoryIDReverse has two way relationships

categoryIDReference = {
    'night_life': '4d4b7105d754a06376d81259',
    'restaurants': '4d4b7105d754a06374d81259',
    'national_monument': '4bf58dd8d48988d12d941735',
    'religious_sites': '4bf58dd8d48988d131941735',
    'museums': '4bf58dd8d48988d181941735',
    'themeparks': '4bf58dd8d48988d182941735,4bf58dd8d48988d193941735',
    'shopping': '4bf58dd8d48988d1fd941735,5744ccdfe4b0c0459246b4dc',
    'markets': '4bf58dd8d48988d1fa941735,4bf58dd8d48988d10e951735,4bf58dd8d48988d1f7941735,53e510b7498ebcb1801b55d4',
    'nature': '4bf58dd8d48988d1e2941735,4bf58dd8d48988d159941735,4bf58dd8d48988d165941735,52e81612bcbc57f1066b7a22,52e81612bcbc57f1066b7a21,52e81612bcbc57f1066b7a13',

    # Newly added in case we need it
    'wildlife': '4bf58dd8d48988d17b941735,4fceea171983d5d06c3e9823,52e81612bcbc57f1066b7a21,52e81612bcbc57f1066b7a13,52e81612bcbc57f1066b7a22,52e81612bcbc57f1066b7a23',
    'historical': '4deefb944765f83613cdba6e,4bf58dd8d48988d190941735',
    'beaches': '4bf58dd8d48988d1e2941735'
}

categoryIDReverse = {
    '4d4b7105d754a06376d81259': 'night_life',
    '4d4b7105d754a06374d81259': 'restaurants',
    '4bf58dd8d48988d12d941735': 'national_monument',
    '4bf58dd8d48988d131941735': 'religious_sites,museums',
    '4bf58dd8d48988d182941735': 'themeparks',
    '4bf58dd8d48988d193941735': 'themeparks',
    '4bf58dd8d48988d1fd941735': 'shopping',
    '5744ccdfe4b0c0459246b4dc': 'shopping',
    '4bf58dd8d48988d1fa941735': 'markets',
    '4bf58dd8d48988d10e951735': 'markets',
    '4bf58dd8d48988d1f7941735': 'markets',
    '53e510b7498ebcb1801b55d4': 'markets',
    '4bf58dd8d48988d1e2941735': 'nature,beaches',
    '4bf58dd8d48988d159941735': 'nature',
    '4bf58dd8d48988d165941735': 'nature',
    '52e81612bcbc57f1066b7a22': 'nature,wildlife',
    '52e81612bcbc57f1066b7a21': 'nature,wildlife',
    '52e81612bcbc57f1066b7a13': 'nature,wildlife',

    '4bf58dd8d48988d17b941735': 'wildlife',
    '4fceea171983d5d06c3e9823': 'wildlife',
    '52e81612bcbc57f1066b7a23': 'wildlife',
    '4deefb944765f83613cdba6e': 'historical',
    '4bf58dd8d48988d190941735': 'historical'
}