from rest_framework_simplejwt.tokens import RefreshToken

def generate_jwt_token(strategy, details, user=None, *args, **kwargs):
    if user:
        refresh = RefreshToken.for_user(user)
        return {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }

def save_extra_fields( user, response, *args, **kwargs):
    name = response.get('name', '')
    user.first_name = name.split(' ')[0] if name else ''
    user.last_name = ' '.join(name.split(' ')[1:]) if name else ''
    user.save()
    
# In a file like wash/pipeline.py
def create_client(backend, user, response, *args, **kwargs):
    """Create a Client instance for social users"""
    if not hasattr(user, 'client'):
        from wash.models import Client  # Import your Client model
        
        # Extract fields from response
        email = user.email
        
        # Set default/placeholder values for required fields
        client = Client.objects.create(
            full_name=user.get_full_name() or email.split('@')[0],
            email=email,
            password=user.password,  # This will be the hashed password from the User model
            phone="",  # Set a default or placeholder
            age=0,     # Set a default or placeholder
        )
        
        return {'client': client}

def mark_user_status(backend, user, is_new=False, *args, **kwargs):
    """Mark whether the user is new or existing in the session"""
    if kwargs.get('request'):
        kwargs['request'].session['social_auth_is_new'] = is_new
    return {'is_new': is_new}

def create_or_get_client(backend, user, response, *args, **kwargs):
    """Create or retrieve a Client instance for social users"""
    from wash.models import Client  # Update with your actual app name
    
    email = user.email
    
    # Check if a client with this email already exists
    try:
        client = Client.objects.get(email=email)
        # Client exists, no need to create a new one
        is_new = False
    except Client.DoesNotExist:
        # Create a new client
        client = Client.objects.create(
            full_name=user.get_full_name() or email.split('@')[0],
            email=email,
            password=user.password,  # This is already hashed
            phone="",  # Placeholder
            age=0,     # Placeholder
        )
        is_new = True
    
    # Store the is_new flag in the session
    if kwargs.get('request'):
        kwargs['request'].session['social_auth_is_new'] = is_new
    
    return {'client': client, 'is_new': is_new}