from app import db
from flask import request
from flask_restplus import abort


def authorize(request):
    token = request.headers.get('AUTH-TOKEN', None)

    if not token:
        abort(403, 'Unsupplied authorization token')

    email = db.authorize(token)

    if email is None:
        abort(403, 'Invalid authorization token')

    return email

def authorize_access(email, uuid_r, accessType=None):
    perm = db.get_perm(email, uuid_r)

    if perm is None:
        abort(404, 'Resource is unavailable')
    elif perm == -1:
        abort(403, 'Resource is not yours')

    if accessType is None:
        return
    elif not accessType >= perm:
        abort(403, 'Unauthorized access')
