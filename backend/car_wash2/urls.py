from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include


urlpatterns = [
    path('admin/', admin.site.urls),
  
    path("api/", include("wash.urls")),
    path("api/auth/", include("social_django.urls", namespace="social")),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)