from rest_framework.permissions import BasePermission

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'client'

class IsExternEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'extern_employee'

class IsInternEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'user_type') and request.user.user_type == 'intern_employee'