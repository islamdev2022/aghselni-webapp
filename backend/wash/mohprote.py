from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .authoo import CustomJWTAuthentication

from .mohper import IsClient, IsExternEmployee, IsInternEmployee, IsAdmin
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user information
    """
    user = request.user
    user_data = {
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'user_type': user.user_type
    }
    return Response(user_data)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsClient])
def client_only_view(request):
    """
    Endpoint accessible only by clients
    """
    return Response({"message": "You are authenticated as a client", "user_id": request.user.id})

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsExternEmployee])
def extern_employee_only_view(request):
    """
    Endpoint accessible only by external employees
    """
    return Response({"message": "You are authenticated as an external employee", "user_id": request.user.id})

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsInternEmployee])
def intern_employee_only_view(request):
    """
    Endpoint accessible only by internal employees
    """
    return Response({"message": "You are authenticated as an internal employee", "user_id": request.user.id})


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAdmin])
def admin_only_view(request):
    """
    Endpoint accessible only by admins
    """
    return Response({"message": "You are authenticated as an admin", "user_id": request.user.id})