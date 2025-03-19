from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Client, ExternEmployee, InternEmployee, Admin
from rest_framework_simplejwt.tokens import AccessToken

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Return user based on the token claims
        """
        user_id = validated_token.get('user_id')
        user_type = validated_token.get('user_type')
        
        if not user_id or not user_type:
            raise AuthenticationFailed('Token contains no valid user identification')
        
        try:
            if user_type == 'client':
                user = Client.objects.get(id=user_id)
            elif user_type == 'extern_employee':
                user = ExternEmployee.objects.get(id=user_id)
            elif user_type == 'intern_employee':
                user = InternEmployee.objects.get(id=user_id)
            elif user_type == 'admin':
                user = Admin.objects.get(id=user_id)
            else:
                raise AuthenticationFailed('Invalid user type')
                
            # Add user_type attribute to user object
            user.user_type = user_type
            
            # Add authentication related attributes
            user.is_authenticated = True
            user.is_active = True
            
            return user
        except (Client.DoesNotExist, ExternEmployee.DoesNotExist, InternEmployee.DoesNotExist, Admin.DoesNotExist):
            raise AuthenticationFailed('User not found')
        
from rest_framework_simplejwt.tokens import AccessToken

def decode_token(token):
    access_token = AccessToken(token)
    print("User ID:", access_token['user_id'])
    print("User Type:", access_token['user_type'])