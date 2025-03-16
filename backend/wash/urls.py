from django.urls import path
from .auth_views import client_login, extern_employee_login, intern_employee_login, admin_login, refresh_token, logout_view
from .mohprote import get_current_user, client_only_view, extern_employee_only_view, intern_employee_only_view
from .views import (
    register_client, 
    register_extern_employee, 
    register_intern_employee,
    register_admin,
    get_extern_employee_details,
    get_intern_employee_details,
    get_all_extern_employees_details,
    get_all_intern_employees_details,
    get_update_delete_extern_employee,
    get_update_delete_intern_employee,
    extern_employee_appointments,
    intern_employee_appointments,
    get_client_for_appointment_domicile,
    get_client_for_appointment_location,
    get_update_appointment_domicile,
    get_update_appointment_location
)

urlpatterns = [
    # Auth endpoints
    path('auth/client/login/', client_login, name='client_login'),
    path('auth/extern_employee/login/', extern_employee_login, name='extern_employee_login'),
    path('auth/intern_employee/login/', intern_employee_login, name='intern_employee_login'),
    path('auth/admin/login/', admin_login, name='admin_login'),
    path('auth/refresh/', refresh_token, name='refresh_token'),
    
    # Registration endpoints
    path('auth/client/register/', register_client, name='register_client'),
    path('auth/extern_employee/register/', register_extern_employee, name='register_extern_employee'), 
    path('auth/intern_employee/register/', register_intern_employee, name='register_intern_employee'),
    path('auth/admin/register/', register_admin, name='register_admin'),
    
    # Protected endpoints
    path('user/me/', get_current_user, name='get_current_user'),
    path('client/dashboard/', client_only_view, name='client_only_view'),
    path('extern_employee/dashboard/', extern_employee_only_view, name='extern_employee_only_view'),
    path('intern_employee/dashboard/', intern_employee_only_view, name='intern_employee_only_view'),
    
    # Employee details endpoints
    path('extern_employee/details/', get_extern_employee_details, name='get_extern_employee_details'),
    path('intern_employee/details/', get_intern_employee_details, name='get_intern_employee_details'),
    path('admin/extern_employees/', get_all_extern_employees_details, name='get_all_extern_employees_details'),
    path('admin/intern_employees/', get_all_intern_employees_details, name='get_all_intern_employees_details'),
    
    path('auth/logout/', logout_view, name='logout'),
    
    # Updated endpoints for employee management
    path('admin/extern_employee/<int:pk>/', get_update_delete_extern_employee, name='get_update_delete_extern_employee'),
    path('admin/intern_employee/<int:pk>/', get_update_delete_intern_employee, name='get_update_delete_intern_employee'),
    
    # Appointments
    path('extern_employee/appointments/', extern_employee_appointments, name='extern_employee_appointments'),
    path('intern_employee/appointments/', intern_employee_appointments, name='intern_employee_appointments'),
    
    # Client information for appointments
   #  path('appointment_domicile/<int:appointment_id>/client/', get_client_for_appointment_domicile, name='get_client_for_appointment_domicile'),
   # path('appointment_location/<int:appointment_id>/client/', get_client_for_appointment_location, name='get_client_for_appointment_location'),
    
    # Get and update appointments
    path('appointments_domicile/', get_update_appointment_domicile, name='get_all_appointments_domicile'),
    path('appointments_domicile/<int:appointment_id>/', get_update_appointment_domicile, name='update_appointment_domicile'),
    path('appointments_location/', get_update_appointment_location, name='get_all_appointments_location'),
    path('appointments_location/<int:appointment_id>/', get_update_appointment_location, name='update_appointment_location'),
]