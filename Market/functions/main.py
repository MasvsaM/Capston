"""Sample Cloud Functions for Firebase App Hosting backend."""
from __future__ import annotations

from firebase_admin import initialize_app
from firebase_functions import https_fn
from flask import jsonify

# Ensure the default Firebase app is ready before any invocations.
initialize_app()


@https_fn.on_request()
def app(req: https_fn.Request) -> https_fn.Response:
    """Simple HTTP endpoint used by Firebase App Hosting."""
    return jsonify({"message": "Hello from Firebase Functions!"})
