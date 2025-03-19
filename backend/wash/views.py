from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import ClientSerializer, ExternEmployeeSerializer, InternEmployeeSerializer
from django.contrib.auth import authenticate,logout
from rest_framework.authtoken.models import Token

from rest_framework.views import APIView

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
@permission_classes([IsAuthenticated, IsInternEmployee])
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