from django.urls import path
from .auth_views import client_login, extern_employee_login, intern_employee_login, refresh_token
from .views import register_client, register_extern_employee, register_intern_employee
from .mohprote import get_current_user, client_only_view, extern_employee_only_view, intern_employee_only_view

urlpatterns = [
    # Auth endpoints
    path('auth/client/login/', client_login, name='client_login'),
    path('auth/extern_employee/login/', extern_employee_login, name='extern_employee_login'),
    path('auth/intern_employee/login/', intern_employee_login, name='intern_employee_login'),
    path('auth/refresh/', refresh_token, name='refresh_token'),
    
    # Registration endpoints
    path('auth/client/register/', register_client, name='register_client'),
    path('auth/extern_employee/register/', register_extern_employee, name='register_extern_employee'),
    path('auth/intern_employee/register/', register_intern_employee, name='register_intern_employee'),
    
    # Protected endpoints
    path('user/me/', get_current_user, name='get_current_user'),
    path('client/dashboard/', client_only_view, name='client_only_view'),
    path('extern_employee/dashboard/', extern_employee_only_view, name='extern_employee_only_view'),
    path('intern_employee/dashboard/', intern_employee_only_view, name='intern_employee_only_view'),
]