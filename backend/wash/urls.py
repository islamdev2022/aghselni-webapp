from django.urls import path
from .auth_views import client_login, extern_employee_login, intern_employee_login, admin_login, refresh_token, logout_view
from .mohprote import get_current_user, client_only_view, extern_employee_only_view, intern_employee_only_view, admin_only_view
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
    get_update_appointment_location,
    create_appointment_domicile,
    create_appointment_location,
    update_client_profile,
    get_all_clients,
    get_delete_client,
    get_extern_appointments_stats,
    get_intern_appointments_stats,
    get_intern_appointments_revenue,
    get_extern_appointments_revenue,
    get_client_feedbacks,
    create_feedback,
    get_admin_feedbacks,
    approve_feedback,
    feedback_summary,
    get_pending_appointments,
    claim_appointment,
    update_extern_employee_profile,
    update_intern_employee_profile,
    get_extern_employee_public_details,
    delete_feedback,
    exchange_token
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth endpoints
    path('auth/client/login/', client_login, name='client_login'),
    path('auth/extern_employee/login/', extern_employee_login, name='extern_employee_login'),
    path('auth/intern_employee/login/', intern_employee_login, name='intern_employee_login'),
    path('auth/admin/login/', admin_login, name='admin_login'),
    path('auth/refresh/', refresh_token, name='refresh_token'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
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
    path('admin/dashboard/', admin_only_view, name='admin_only_view'),
    
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
    path('extern_employee/profile/', update_extern_employee_profile, name='update_extern_employee_profile'),
    path('intern_employee/profile/', update_intern_employee_profile, name='update_intern_employee_profile'),
    
    # Client information for appointments
   #  path('appointment_domicile/<int:appointment_id>/client/', get_client_for_appointment_domicile, name='get_client_for_appointment_domicile'),
   # path('appointment_location/<int:appointment_id>/client/', get_client_for_appointment_location, name='get_client_for_appointment_location'),
    
    # Get and update appointments
    path('appointments_domicile/get_all', get_pending_appointments, name='get_all_appointments_domicile'),
    path('appointments_domicile/<int:appointment_id>/claim', claim_appointment, name='claim_appointment'),
    path('appointments_domicile/get', get_update_appointment_domicile, name='get_all_claimed_appointments_domicile'),
    path('appointments_domicile/<int:appointment_id>/', get_update_appointment_domicile, name='update_appointment_domicile'),
    path('appointments_location/get', get_update_appointment_location, name='get_all_appointments_location'),
    path('appointments_location/<int:appointment_id>/', get_update_appointment_location, name='update_appointment_location'),
    
    #create appointment
    path('appointments_domicile/create',create_appointment_domicile , name='create_appointment_domicile'),
    path('appointments_location/create',create_appointment_location , name='create_appointment_location'),
    
    
    #get all clients by admin and delete client by admin
    
    path('admin/clients/', get_all_clients, name='get_all_clients'),
    path('admin/client/<int:pk>/', get_delete_client, name='get_update_delete_client'),
    #calculate appointments stats
    path('admin/appointments/stats/e', get_extern_appointments_stats, name='appointment_stats'),
    path('admin/appointments/stats/i', get_intern_appointments_stats, name='appointment_stats'),
    #calculate appointments revenues
    path('admin/appointments/revenue/i', get_intern_appointments_revenue, name='appointment_revenue'),
    path('admin/appointments/revenue/e', get_extern_appointments_revenue, name='appointment_revenue'),
    #get all feedbacks by admin and approve feedback by admin
    path('admin/feedbacks/', get_admin_feedbacks, name='admin_feedbacks'),
    path('admin/feedbacks/<int:pk>/approve/', approve_feedback, name='approve_feedback'),
    path('admin/feedbacks/<int:pk>/delete/', delete_feedback, name='delete_feedback'),
    path('admin/feedbacks/summary/', feedback_summary, name='feedback-summary'),
    # client modify his informations
    path('client/profile/', update_client_profile, name='update_client_profile'),
    path('client/profile/<int:pk>/', get_delete_client, name='get_update_delete_client'),
    # feedback  
    path('feedback/',create_feedback, name='create_feedback'),
    path('feedback/all/',get_client_feedbacks, name='client_feedbacks'),
    
    path('extern_employee/<int:employee_id>/', get_extern_employee_public_details),
    
path('token/', exchange_token, name='token_exchange'),
    ]