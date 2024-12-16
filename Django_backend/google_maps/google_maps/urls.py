from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from rest_framework.routers import DefaultRouter
from gmaps import views

router = DefaultRouter()
router.register(r'get-shortest-path', views.ShortestPathViewSet, basename='shortest-path')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Include the router URLs under the 'api/' prefix
]
