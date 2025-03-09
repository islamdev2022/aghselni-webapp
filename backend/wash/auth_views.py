from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Client, ExternEmployee, InternEmployee
from .auth_serializers import ClientLoginSerializer, ExternEmployeeLoginSerializer, InternEmployeeLoginSerializer, TokenSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Replace the client_login function with:
@api_view(['POST'])
def client_login(request):
    serializer = ClientLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            client = Client.objects.get(email=email)
            
            if client.check_password(password):  # Use the check_password method
                # Generate token
                refresh = RefreshToken()
                refresh['user_id'] = client.id
                refresh['user_type'] = 'client'
                refresh['full_name'] = client.full_name
                
                token_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'client',
                    'user_id': client.id,
                    'full_name': client.full_name
                }
                
                token_serializer = TokenSerializer(data=token_data)
                token_serializer.is_valid()
                
                return Response(token_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "كلمة المرور غير صحيحة"}, status=status.HTTP_401_UNAUTHORIZED)
        except Client.DoesNotExist:
            return Response({"error": "البريد الإلكتروني غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def extern_employee_login(request):
    serializer = ExternEmployeeLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            employee = ExternEmployee.objects.get(email=email)
            
            if employee.password == password:
                # Generate token
                refresh = RefreshToken()
                refresh['user_id'] = employee.id
                refresh['user_type'] = 'extern_employee'
                refresh['full_name'] = employee.full_name
                
                token_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'extern_employee',
                    'user_id': employee.id,
                    'full_name': employee.full_name
                }
                
                token_serializer = TokenSerializer(data=token_data)
                token_serializer.is_valid()
                
                return Response(token_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "كلمة المرور غير صحيحة"}, status=status.HTTP_401_UNAUTHORIZED)
        except ExternEmployee.DoesNotExist:
            return Response({"error": "البريد الإلكتروني غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def intern_employee_login(request):
    serializer = InternEmployeeLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            employee = InternEmployee.objects.get(email=email)
            
            if employee.password == password:
                # Generate token
                refresh = RefreshToken()
                refresh['user_id'] = employee.id
                refresh['user_type'] = 'intern_employee'
                refresh['full_name'] = employee.full_name
                
                token_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'intern_employee',
                    'user_id': employee.id,
                    'full_name': employee.full_name
                }
                
                token_serializer = TokenSerializer(data=token_data)
                token_serializer.is_valid()
                
                return Response(token_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "كلمة المرور غير صحيحة"}, status=status.HTTP_401_UNAUTHORIZED)
        except InternEmployee.DoesNotExist:
            return Response({"error": "البريد الإلكتروني غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def refresh_token(request):
    """
    Refresh token endpoint
    """
    from rest_framework_simplejwt.serializers import TokenRefreshSerializer
    serializer = TokenRefreshSerializer(data=request.data)
    
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)