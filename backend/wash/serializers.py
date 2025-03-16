from rest_framework import serializers
import re
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.settings import api_settings
from .models import (
    Client, 
    ExternEmployee, 
    InternEmployee, 
    AppointmentDomicile, 
    AppointmentLocation,
    ExternEmployeeHistory,
    InternEmployeeHistory,
    Admin
)





# دالة للتحقق من قوة كلمة المرور
def validate_password(password):
    if len(password) < 8:
        raise serializers.ValidationError("كلمة المرور يجب أن تكون أطول من 8 أحرف.")
    if not any(char.isdigit() for char in password):
        raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.")
    if not any(char.isalpha() for char in password):
        raise serializers.ValidationError("كلمة المرور يجب أن تحتوي على حرف واحد على الأقل.")
    return password

# دالة للتحقق من رقم الهاتف
def validate_phone(phone):
    if not re.fullmatch(r"^0\d{9}$", phone):
        raise serializers.ValidationError("رقم الهاتف يجب أن يحتوي على 10 أرقام ويبدأ بـ 0.")
    return phone

# دالة للتحقق من العمر
def validate_age(age):
    if age < 18:
        raise serializers.ValidationError("يجب أن يكون العمر أكبر من 18 عامًا.")
    return age

# دالة للتحقق من البريد الإلكتروني
def validate_email(email):
    if not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", email):
        raise serializers.ValidationError("البريد الإلكتروني غير صالح.")
    return email

# Serializer لتسجيل العملاء
class ClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    phone = serializers.CharField(validators=[validate_phone])
    email = serializers.EmailField(validators=[validate_email])
    age = serializers.IntegerField(validators=[validate_age])

    class Meta:
        model = Client
        fields = ['full_name', 'email', 'phone', 'age', 'password']

    def create(self, validated_data):
        return Client.objects.create(**validated_data)

# Serializer لتسجيل الموظفين الخارجيين
class ExternEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    phone = serializers.CharField(validators=[validate_phone])
    email = serializers.EmailField(validators=[validate_email])
    age = serializers.IntegerField(validators=[validate_age])

    class Meta:
        model = ExternEmployee
        fields = ['full_name', 'email', 'phone', 'age', 'password']

    def create(self, validated_data):
        return ExternEmployee.objects.create(**validated_data)

# Serializer لتسجيل الموظفين الداخليين
class InternEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    phone = serializers.CharField(validators=[validate_phone])
    email = serializers.EmailField(validators=[validate_email])
    age = serializers.IntegerField(validators=[validate_age])

    class Meta:
        model = InternEmployee
        fields = ['full_name', 'email', 'phone', 'age', 'password']

    def create(self, validated_data):
        return InternEmployee.objects.create(**validated_data)

# Add these to your serializers.py file
from .models import ExternEmployeeHistory, InternEmployeeHistory, AppointmentDomicile, AppointmentLocation

# Serializer for extern employee detailed information
class ExternEmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExternEmployee
        fields = ['id', 'full_name', 'phone', 'age', 'final_rating', 'email']

# Serializer for appointment domicile information
class AppointmentDomicileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentDomicile
        fields = ['id', 'time', 'car_type', 'car_name', 'wash_type', 'place', 'price', 'status']

# Serializer for extern employee history
class ExternEmployeeHistorySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    appointment_details = AppointmentDomicileSerializer(source='appointment', read_only=True)
    
    class Meta:
        model = ExternEmployeeHistory
        fields = ['id', 'client_name', 'cars_washed', 'appointment_details']

# Serializer for intern employee detailed information
class InternEmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternEmployee
        fields = ['id', 'full_name', 'phone', 'email']

# Serializer for appointment location information
class AppointmentLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentLocation
        fields = ['id', 'date', 'time', 'car_type', 'car_name', 'wash_type', 'price', 'status']

# Serializer for intern employee history
class InternEmployeeHistorySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    appointment_details = AppointmentLocationSerializer(source='appointment', read_only=True)
    
    class Meta:
        model = InternEmployeeHistory
        fields = ['id', 'client_name', 'cars_washed', 'appointment_details']
        





# Add these to your serializers.py file

# Client detail serializer
class ClientDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'full_name', 'email', 'phone', 'age']

# Appointment Domicile serializer with client information
class AppointmentDomicileWithClientSerializer(serializers.ModelSerializer):
    client_info = ClientDetailSerializer(source='client', read_only=True)
    
    class Meta:
        model = AppointmentDomicile
        fields = ['id', 'time', 'car_type', 'car_name', 'wash_type', 'place', 'price', 'status', 'client_info']

# Appointment Location serializer with client information
class AppointmentLocationWithClientSerializer(serializers.ModelSerializer):
    client_info = ClientDetailSerializer(source='client', read_only=True)
    
    class Meta:
        model = AppointmentLocation
        fields = ['id', 'date', 'time', 'car_type', 'car_name', 'wash_type', 'price', 'status', 'client_info']

# Serializer for creating a new appointment domicile
class CreateAppointmentDomicileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentDomicile
        fields = ['time', 'car_type', 'car_name', 'wash_type', 'place', 'price', 'client']
        
    def create(self, validated_data):
        # Set default status to 'Pending'
        validated_data['status'] = 'Pending'
        return super().create(validated_data)

# Serializer for creating a new appointment location
class CreateAppointmentLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentLocation
        fields = ['date', 'time', 'car_type', 'car_name', 'wash_type', 'price', 'client']
        
    def create(self, validated_data):
        # Set default status to 'Pending'
        validated_data['status'] = 'Pending'
        return super().create(validated_data)


class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(validators=[validate_email])

    class Meta:
        model = Admin
        fields = ['id', 'full_name', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Admin.objects.create(**validated_data)