from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    
    path(route='login', view=views.login_user, name='login'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)