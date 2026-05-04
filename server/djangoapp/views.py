# Required imports

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import logging
import json

from .populate import initiate

# Logger
logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            # Leer datos del body
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')

            # Autenticar usuario
            user = authenticate(username=username, password=password)

            if user is not None:
                # Login exitoso
                login(request, user)
                return JsonResponse({
                    "userName": username,
                    "status": "Authenticated"
                })
            else:
                # Login fallido
                return JsonResponse({
                    "userName": username,
                    "status": "Failed"
                })

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return JsonResponse({
                "userName": "",
                "status": "Error"
            })

    # Si no es POST
    return JsonResponse({
        "userName": "",
        "status": "Invalid request"
    })

# Create a `logout_request` view to handle sign out request
# def logout_request(request):
# ...

# Create a `registration` view to handle sign up request
# @csrf_exempt
# def registration(request):
# ...

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
