from rest_framework.permissions import BasePermission

class IsClient(BasePermission):
    """
    Custom permission to only allow access to authenticated clients.
    Works with both Client model instances and User instances with client association.
    """
    def has_permission(self, request, view):
        # First check if user is authenticated
        if not request.user.is_authenticated:
            return False
            
        # Check if this is a Client model instance directly
        from wash.models import Client  # Import your Client model
        if isinstance(request.user, Client):
            return True
            
        # Check if this is a User with user_type attribute set to 'client'
        if hasattr(request.user, 'user_type') and request.user.user_type == 'client':
            return True
            
        # If we reach here, try to match by email
        try:
            # See if there's a Client with the same email as this user
            client_exists = Client.objects.filter(email=request.user.email).exists()
            return client_exists
        except:
            return False

class IsExternEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'extern_employee'

class IsInternEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'intern_employee'
    

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'admin'