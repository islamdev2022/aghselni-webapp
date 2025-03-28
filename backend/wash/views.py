from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import ClientSerializer, ExternEmployeeSerializer, InternEmployeeSerializer
from django.contrib.auth import authenticate,logout
from rest_framework.authtoken.models import Token

from rest_framework.views import APIView
from datetime import datetime
from django.utils import timezone
from django.db.models import Count, Sum

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import ExternEmployee, InternEmployee, ExternEmployeeHistory, InternEmployeeHistory
from .serializers import (
    ExternEmployeeDetailSerializer, 
    ExternEmployeeHistorySerializer,
    InternEmployeeDetailSerializer,
    InternEmployeeHistorySerializer
)
from .authoo import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated



from .serializers import (
    ClientSerializer, 
    ExternEmployeeSerializer, 
    InternEmployeeSerializer,
    AppointmentDomicileSerializer,
    AppointmentLocationSerializer,
    ClientDetailSerializer,
    AppointmentDomicileWithClientSerializer,
    AppointmentLocationWithClientSerializer,
    CreateAppointmentDomicileSerializer,
    CreateAppointmentLocationSerializer,
    AdminSerializer
)
from .models import (
    Client, 
    ExternEmployee, 
    InternEmployee, 
    AppointmentDomicile, 
    AppointmentLocation,
    ExternEmployeeHistory,
    InternEmployeeHistory
)

from .mohper import IsClient, IsExternEmployee, IsInternEmployee, IsAdmin

# تسجيل العميل
@api_view(['POST'])
def register_client(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل العميل بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import AllowAny
# تسجيل الموظف الخارجي
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])

@permission_classes([IsAdminUser])  
def register_extern_employee(request):
    serializer = ExternEmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل الموظف الخارجي بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.views.decorators.csrf import csrf_exempt

# تسجيل الموظف الداخلي
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAdmin])
def register_intern_employee(request):
    print("Headers:", request.headers)  # Check if token is received
    print("User:", request.user)  # Should be a valid user, not AnonymousUser

    serializer = InternEmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل الموظف الداخلي بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Get extern employee details with history
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsExternEmployee])
def get_extern_employee_details(request):
    """
    Get details of the currently authenticated extern employee along with their history
    """
    try:
        # Get the current extern employee
        extern_employee = ExternEmployee.objects.get(id=request.user.id)
        
        # Serialize their details
        employee_data = ExternEmployeeDetailSerializer(extern_employee).data
        
        # Get their history records
        history_records = ExternEmployeeHistory.objects.filter(extern_employee=extern_employee)
        history_data = ExternEmployeeHistorySerializer(history_records, many=True).data
        
        # Safely calculate totals
        try:
            total_cars_washed = sum(record.cars_washed for record in history_records)
        except Exception as e:
            # If there's an error calculating, default to 0
            total_cars_washed = 0
            
        # Compile response
        response_data = {
            'employee': employee_data,
            'history': history_data,
            'total_cars_washed': total_cars_washed,
            'total_clients': history_records.values('client').distinct().count()
        }
        
        return Response(response_data)
    
    except ExternEmployee.DoesNotExist:
        return Response(
            {"error": "Extern employee not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        # Log the exception and return a generic error
        print(f"Error in get_extern_employee_details: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



# Get intern employee details with history
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsInternEmployee])
def get_intern_employee_details(request):
    """
    Get details of the currently authenticated intern employee along with their history
    """
    try:
        # Get the current intern employee
        intern_employee = InternEmployee.objects.get(id=request.user.id)
        
        # Serialize their details
        employee_data = InternEmployeeDetailSerializer(intern_employee).data
        
        # Get their history records
        history_records = InternEmployeeHistory.objects.filter(intern_employee=intern_employee)
        history_data = InternEmployeeHistorySerializer(history_records, many=True).data
        
        # Compile response
        response_data = {
            'employee': employee_data,
            'history': history_data,
            'total_cars_washed': sum(record.cars_washed for record in history_records),
            'total_clients': history_records.values('client').distinct().count()
        }
        
        return Response(response_data)
    
    except InternEmployee.DoesNotExist:
        return Response(
            {"error": "Intern employee not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )

# Admin view to get details of all extern employees
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_extern_employees_details(request):
    """
    Admin endpoint to get details of all extern employees with their history
    """
    # Get all extern employees
    extern_employees = ExternEmployee.objects.all()
    
    response_data = []
    
    for employee in extern_employees:
        # Get employee details
        employee_data = ExternEmployeeDetailSerializer(employee).data
        
        # Get history records
        history_records = ExternEmployeeHistory.objects.filter(extern_employee=employee)
        history_data = ExternEmployeeHistorySerializer(history_records, many=True).data
        
        # Compile employee data
        employee_info = {
            'employee': employee_data,
            'history': history_data,
            'total_cars_washed': sum(record.cars_washed for record in history_records),
            'total_clients': history_records.values('client').distinct().count()
        }
        
        response_data.append(employee_info)
    
    return Response(response_data)

# Admin view to get details of all intern employees
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_intern_employees_details(request):
    """
    Admin endpoint to get details of all intern employees with their history
    """
    # Get all intern employees
    intern_employees = InternEmployee.objects.all()
    
    response_data = []
    
    for employee in intern_employees:
        # Get employee details
        employee_data = InternEmployeeDetailSerializer(employee).data
        
        # Get history records
        history_records = InternEmployeeHistory.objects.filter(intern_employee=employee)
        history_data = InternEmployeeHistorySerializer(history_records, many=True).data
        
        # Compile employee data
        employee_info = {
            'employee': employee_data,
            'history': history_data,
            'total_cars_washed': sum(record.cars_washed for record in history_records),
            'total_clients': history_records.values('client').distinct().count()
        }
        
        response_data.append(employee_info)
    
    return Response(response_data)





# Add these to your views.py file

# Update and delete extern employee
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_update_delete_extern_employee(request, pk):
    """
    Get, update or delete an extern employee
    """
    try:
        employee = ExternEmployee.objects.get(pk=pk)
        
        if request.method == 'GET':
            serializer = ExternEmployeeDetailSerializer(employee)
            return Response(serializer.data)
        
        elif request.method == 'DELETE':
            employee.delete()
            return Response({"message": "تم حذف الموظف الخارجي بنجاح"}, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method == 'PUT':
            serializer = ExternEmployeeSerializer(employee, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except ExternEmployee.DoesNotExist:
        return Response({"error": "الموظف غير موجود"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_update_delete_intern_employee(request, pk):
    """
    Get, update or delete an intern employee
    """
    try:
        employee = InternEmployee.objects.get(pk=pk)
        
        if request.method == 'GET':
            serializer = InternEmployeeDetailSerializer(employee)
            return Response(serializer.data)
        
        elif request.method == 'DELETE':
            employee.delete()
            return Response({"message": "تم حذف الموظف الداخلي بنجاح"}, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method == 'PUT':
            serializer = InternEmployeeSerializer(employee, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except InternEmployee.DoesNotExist:
        return Response({"error": "الموظف غير موجود"}, status=status.HTTP_404_NOT_FOUND)


# Get and create appointments for extern employee
@api_view(['GET', 'POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsExternEmployee])
def extern_employee_appointments(request):
    """
    Get all appointments for an extern employee or create a new one
    """
    if request.method == 'GET':
        appointments = AppointmentDomicile.objects.filter(extern_employee=request.user.id)
        serializer = AppointmentDomicileSerializer(appointments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CreateAppointmentDomicileSerializer(data=request.data)
        if serializer.is_valid():
            # Set the extern employee as the current user
            serializer.validated_data['extern_employee'] = ExternEmployee.objects.get(id=request.user.id)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get and create appointments for intern employee
@api_view(['GET', 'POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsInternEmployee])
def intern_employee_appointments(request):
    """
    Get all appointments for an intern employee or create a new one
    """
    if request.method == 'GET':
        appointments = AppointmentLocation.objects.all()
        serializer = AppointmentLocationSerializer(appointments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CreateAppointmentLocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get client information for an appointment domicile
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsExternEmployee])
def get_client_for_appointment_domicile(request, appointment_id):
    """
    Get client information for a specific appointment domicile
    """
    try:
        appointment = AppointmentDomicile.objects.get(id=appointment_id, extern_employee=request.user.id)
        serializer = AppointmentDomicileWithClientSerializer(appointment)
        return Response(serializer.data)
    except AppointmentDomicile.DoesNotExist:
        return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)

# Get client information for an appointment location
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsInternEmployee])
def get_client_for_appointment_location(request, appointment_id):
    """
    Get client information for a specific appointment location
    """
    try:
        appointment = AppointmentLocation.objects.get(id=appointment_id)
        serializer = AppointmentLocationWithClientSerializer(appointment)
        return Response(serializer.data)
    except AppointmentLocation.DoesNotExist:
        return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)

# POST appointments domicile

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsClient])
def create_appointment_domicile(request):
    serializer = CreateAppointmentDomicileSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # Set the client as the current user
        serializer.save(client=Client.objects.get(id=request.user.id))
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#POST appointements location

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsClient])
def create_appointment_location(request):
    serializer = CreateAppointmentLocationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # Set the client as the current user
        serializer.save(client=Client.objects.get(id=request.user.id))
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get and update all appointments domicile
@api_view(['GET', 'PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_update_appointment_domicile(request, appointment_id=None):
    """
    Get all appointments domicile, get a specific appointment, or update a specific one
    """
    if appointment_id is None and request.method == 'GET':
        # Get all appointments
        if hasattr(request.user, 'user_type') and request.user.user_type == 'extern_employee':
            appointments = AppointmentDomicile.objects.filter(extern_employee=request.user.id)
        elif hasattr(request.user, 'user_type') and request.user.user_type == 'client':
            appointments = AppointmentDomicile.objects.filter(client=request.user.id)
        else:
            appointments = AppointmentDomicile.objects.all()
            
        serializer = AppointmentDomicileWithClientSerializer(appointments, many=True)
        return Response(serializer.data)
    
    elif appointment_id is not None and request.method == 'GET':
        # Get a specific appointment by ID
        try:
            appointment = AppointmentDomicile.objects.get(id=appointment_id)
            
            # Check if user has permission to view this appointment
            if hasattr(request.user, 'user_type'):
                if request.user.user_type == 'extern_employee' and appointment.extern_employee.id != request.user.id:
                    return Response({"error": "ليس لديك إذن لعرض هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
                elif request.user.user_type == 'client' and appointment.client.id != request.user.id:
                    return Response({"error": "ليس لديك إذن لعرض هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
            
            # Use AppointmentDomicileSerializer instead of AppointmentDomicileWithClientSerializer
            serializer = AppointmentDomicileSerializer(appointment)
            return Response(serializer.data)
        except AppointmentDomicile.DoesNotExist:
            return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    elif appointment_id is not None and request.method == 'PUT':
        # Update a specific appointment
        try:
            appointment = AppointmentDomicile.objects.get(id=appointment_id)
            
            # Check if user has permission to update
            if hasattr(request.user, 'user_type'):
                if request.user.user_type == 'extern_employee' and appointment.extern_employee.id != request.user.id:
                    return Response({"error": "ليس لديك إذن لتحديث هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
                elif request.user.user_type == 'client' and appointment.client.id != request.user.id:
                    return Response({"error": "ليس لديك إذن لتحديث هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = AppointmentDomicileSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except AppointmentDomicile.DoesNotExist:
            return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"error": "طلب غير صالح"}, status=status.HTTP_400_BAD_REQUEST)

# Get and update all appointments location
@api_view(['GET', 'PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated]) 
def get_update_appointment_location(request, appointment_id=None):
    """
    Get all appointments location, get a specific appointment, or update a specific one
    """
    if appointment_id is None and request.method == 'GET':
        # Get all appointments
        if hasattr(request.user, 'user_type') and request.user.user_type == 'client':
            appointments = AppointmentLocation.objects.filter(client=request.user.id)
        else:
            appointments = AppointmentLocation.objects.all()
            
        serializer = AppointmentLocationWithClientSerializer(appointments, many=True)
        return Response(serializer.data)
    
    elif appointment_id is not None and request.method == 'GET':
        # Get a specific appointment by ID
        try:
            appointment = AppointmentLocation.objects.get(id=appointment_id)
            
            # Check if user has permission to view this appointment
            if hasattr(request.user, 'user_type') and request.user.user_type == 'client' and appointment.client.id != request.user.id:
                return Response({"error": "ليس لديك إذن لعرض هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
            
            # Use AppointmentLocationSerializer instead of AppointmentLocationWithClientSerializer
            serializer = AppointmentLocationSerializer(appointment)
            return Response(serializer.data)
        except AppointmentLocation.DoesNotExist:
            return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    elif appointment_id is not None and request.method == 'PUT':
        # Update a specific appointment
        try:
            appointment = AppointmentLocation.objects.get(id=appointment_id)
            
            # Check if user has permission to update
            if hasattr(request.user, 'user_type') and request.user.user_type == 'client' and appointment.client.id != request.user.id:
                return Response({"error": "ليس لديك إذن لتحديث هذا الموعد"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = AppointmentLocationSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except AppointmentLocation.DoesNotExist:
            return Response({"error": "الموعد غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"error": "طلب غير صالح"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_admin(request):
    serializer = AdminSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل المسؤول بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all clients
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_all_clients(request):
    """
    Admin endpoint to get details of all clients
    """
    # Get all clients
    clients = Client.objects.all()
    
    # Serialize client data
    serializer = ClientDetailSerializer(clients, many=True)
    
    return Response(serializer.data)

# Get, delete a client
@api_view(['GET', 'DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin,IsClient])
def get_delete_client(request, pk):
    """
    Get or delete a client - admin only
    """
    try:
        client = Client.objects.get(pk=pk)
        
        if request.method == 'GET':
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data)
        
        elif request.method == 'DELETE':
            client.delete()
            return Response({"message": "تم حذف العميل بنجاح"}, status=status.HTTP_204_NO_CONTENT)
            
    except Client.DoesNotExist:
        return Response({"error": "العميل غير موجود"}, status=status.HTTP_404_NOT_FOUND)

# Update client profile
@api_view(['GET', 'PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsClient])
def update_client_profile(request):
    """
    Get or update the currently authenticated client's profile
    """
    try:
        # Get the current client
        client = Client.objects.get(id=request.user.id)
        
        if request.method == 'GET':
            serializer = ClientDetailSerializer(client)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Use partial=True to allow partial updates
            serializer = ClientSerializer(client, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "تم تحديث البيانات بنجاح", "data": serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Client.DoesNotExist:
        return Response({"error": "العميل غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_extern_appointments_stats(request):
    """
    Admin endpoint to get statistics about extern employee appointments
    for a specific date or today by default
    """
    # Get date from query params or use today's date
    date_param = request.GET.get('date')
    
    if date_param:
        try:
            # Parse the date from the parameter
            stats_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "تنسيق التاريخ غير صحيح. يرجى استخدام YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        # Use today's date by default
        stats_date = timezone.now().date()
    
    # Get all appointments for the specified date
    appointments = AppointmentDomicile.objects.filter(date=stats_date)
    
    # Get count of total appointments
    total_appointments = appointments.count()
    
    # Get count of appointments by status
    status_counts = appointments.values('status').annotate(count=Count('status'))
    
    # Get count of appointments by wash type
    wash_type_counts = appointments.values('wash_type').annotate(count=Count('wash_type'))
    
    # Convert status counts to a more user-friendly format
    status_stats = {
        'Pending': 0,
        'In Progress': 0,
        'Completed': 0,
        'Deleted': 0
    }
    
    for item in status_counts:
        status_stats[item['status']] = item['count']
    
    # Convert wash type counts to a dictionary
    wash_type_stats = {}
    for item in wash_type_counts:
        wash_type_stats[item['wash_type']] = item['count']
    
    # Get count of unique extern employees who have appointments on this date
    total_employees = appointments.values('extern_employee').distinct().count()
    
    # Compile response
    response_data = {
        'date': stats_date.strftime('%Y-%m-%d'),
        'total_appointments': total_appointments,
        'total_employees_with_appointments': total_employees,
        'status_breakdown': status_stats,
        'wash_type_breakdown': wash_type_stats,
    }
    
    return Response(response_data)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_intern_appointments_stats(request):
    """
    Admin endpoint to get statistics about extern employee appointments
    for a specific date or today by default
    """
    # Get date from query params or use today's date
    date_param = request.GET.get('date')
    
    if date_param:
        try:
            # Parse the date from the parameter
            stats_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "تنسيق التاريخ غير صحيح. يرجى استخدام YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        # Use today's date by default
        stats_date = timezone.now().date()
    
    # Get all appointments for the specified date
    appointments = AppointmentLocation.objects.filter(date=stats_date)
    
    # Get count of appointments by wash type
    wash_type_counts = appointments.values('wash_type').annotate(count=Count('wash_type'))
    
    
    # Get count of total appointments
    total_appointments = appointments.count()
    
    # Get count of appointments by status
    status_counts = appointments.values('status').annotate(count=Count('status'))
    
    # Convert wash type counts to a dictionary
    wash_type_stats = {}
    for item in wash_type_counts:
        wash_type_stats[item['wash_type']] = item['count']
    
    # Convert to a more user-friendly format
    status_stats = {
        'Pending': 0,
        'In Progress': 0,
        'Completed': 0,
        'Deleted': 0
    }
    
    for item in status_counts:
        status_stats[item['status']] = item['count']
    
    # Get count of unique extern employees who have appointments on this date
    
    
    # Compile response
    response_data = {
        'date': stats_date.strftime('%Y-%m-%d'),
        'total_appointments': total_appointments,
        'status_breakdown': status_stats,
        'wash_type_breakdown': wash_type_stats,
    }
    
    return Response(response_data)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_intern_appointments_revenue(request):
    """
    Calculate total revenue for all completed intern appointments for a specific date
    """
    try:
        # Get date from query params or use today's date
        date_param = request.GET.get('date')
        
        if date_param:
            try:
                # Parse the date from the parameter
                stats_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Please use YYYY-MM-DD"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Use today's date by default
            stats_date = timezone.now().date()
        
        # Get all completed appointments for the specified date
        appointments_completed = AppointmentLocation.objects.filter(
            date=stats_date,
            status='Completed'
        )
        
        # Calculate total revenue, handle case where no appointments exist
        total_revenue = appointments_completed.aggregate(total=Sum('price'))['total'] or 0
        
        response_data = {
            'date': stats_date.strftime('%Y-%m-%d'),
            'total_revenue': float(total_revenue),  # Convert Decimal to float for JSON serialization
            'appointment_count': appointments_completed.count()
        }
        
        return Response(response_data)
    
    except Exception as e:
        # Log the exception for debugging
        print(f"Error in get_intern_appointments_revenue: {str(e)}")
        # Always return a Response object, even in case of errors
        return Response(
            {"error": "An error occurred while processing your request."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated, IsAdmin])
def get_extern_appointments_revenue(request):
    """
    Calculate total revenue for all completed intern appointments for a specific date
    """
    try:
        # Get date from query params or use today's date
        date_param = request.GET.get('date')
        
        if date_param:
            try:
                # Parse the date from the parameter
                stats_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Please use YYYY-MM-DD"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Use today's date by default
            stats_date = timezone.now().date()
        
        # Get all completed appointments for the specified date
        appointments_completed = AppointmentDomicile.objects.filter(
            date=stats_date,
            status='Completed'
        )
        
        # Calculate total revenue, handle case where no appointments exist
        total_revenue = appointments_completed.aggregate(total=Sum('price'))['total'] or 0
        
        response_data = {
            'date': stats_date.strftime('%Y-%m-%d'),
            'total_revenue': float(total_revenue),  # Convert Decimal to float for JSON serialization
            'appointment_count': appointments_completed.count()
        }
        
        return Response(response_data)
    
    except Exception as e:
        # Log the exception for debugging
        print(f"Error in get_extern_appointments_revenue: {str(e)}")
        # Always return a Response object, even in case of errors
        return Response(
            {"error": "An error occurred while processing your request."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )