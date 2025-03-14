from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Client, ExternEmployee, InternEmployee
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
            else:
                raise AuthenticationFailed('Invalid user type')
                
            # Add user_type attribute to user object
            user.user_type = user_type
            
            return user
        except (Client.DoesNotExist, ExternEmployee.DoesNotExist, InternEmployee.DoesNotExist):
            raise AuthenticationFailed('User not found')