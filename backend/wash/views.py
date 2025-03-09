from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import ClientSerializer, ExternEmployeeSerializer, InternEmployeeSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

# تسجيل العميل
@api_view(['POST'])
def register_client(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل العميل بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# تسجيل الموظف الخارجي
@api_view(['POST'])
def register_extern_employee(request):
    serializer = ExternEmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل الموظف الخارجي بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# تسجيل الموظف الداخلي
@api_view(['POST'])
def register_intern_employee(request):
    serializer = InternEmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "تم تسجيل الموظف الداخلي بنجاح"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
