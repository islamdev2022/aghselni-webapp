from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# جدول العملاء
class Client(models.Model):
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    age = models.IntegerField()

        
    def save(self, *args, **kwargs):
        # Hash password if it's not already hashed
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    def __str__(self):
        return self.full_name
    
    

# جدول الموظفين الخارجيين
class ExternEmployee(models.Model):
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profile_images/')
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    age = models.IntegerField()
    final_rating = models.FloatField(default=0.0)  # التقييم النهائي

    def __str__(self):
        return self.full_name

# جدول الموظفين الداخليين
class InternEmployee(models.Model):
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profile_images/')
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.full_name

# جدول الإداريين
class Admin(models.Model):
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

# جدول التقييمات
class Rating(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    extern_employee = models.ForeignKey(ExternEmployee, on_delete=models.CASCADE)
    rating = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.full_name} → {self.extern_employee.full_name}: {self.rating}"

# جدول المواعيد في المنازل
class AppointmentDomicile(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Deleted', 'Deleted'),
    ]

    time = models.TimeField()
    car_type = models.CharField(max_length=50)
    car_name = models.CharField(max_length=50)
    wash_type = models.CharField(max_length=50)
    place = models.CharField(max_length=255)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    extern_employee = models.ForeignKey(ExternEmployee, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.car_name} ({self.status})"

# جدول المواعيد في الموقع
class AppointmentLocation(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Deleted', 'Deleted'),
    ]

    date = models.DateField()
    time = models.TimeField()
    car_type = models.CharField(max_length=50)
    car_name = models.CharField(max_length=50)
    wash_type = models.CharField(max_length=50)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.car_name} ({self.status})"
