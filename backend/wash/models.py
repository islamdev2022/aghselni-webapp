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
    final_rating = models.FloatField(default=0.0)

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
    email = models.EmailField(unique=True)  # Add email field

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

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


# جدول المواعيد في المنازل (خاصة بالموظف الخارجي)
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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # إذا كان الموعد مكتملًا، نقوم بتحديث السجل التاريخي للموظف الخارجي
        if self.status == "Completed" and self.extern_employee:
            history, created = ExternEmployeeHistory.objects.get_or_create(
                extern_employee=self.extern_employee,
                client=self.client,
                appointment=self
            )
            history.cars_washed += 1
            history.save()

    def __str__(self):
        return f"{self.car_name} ({self.status})"


# جدول المواعيد في الموقع (خاصة بالموظف الداخلي)
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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # إذا كان الموعد مكتملًا، نقوم بتحديث السجل التاريخي للموظف الداخلي
        if self.status == "Completed":
            intern_employee = InternEmployee.objects.first()  # تحتاج إلى تعيين الموظف الصحيح هنا
            history, created = InternEmployeeHistory.objects.get_or_create(
                intern_employee=intern_employee,
                client=self.client,
                appointment=self
            )
            history.cars_washed += 1
            history.save()

    def __str__(self):
        return f"{self.car_name} ({self.status})"


# 🟢 **جدول تاريخ الموظف الخارجي (ExternEmployee History)**
class ExternEmployeeHistory(models.Model):
    extern_employee = models.ForeignKey(ExternEmployee, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    cars_washed = models.IntegerField(default=0)
    appointment = models.ForeignKey(AppointmentDomicile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.extern_employee.full_name} - {self.client.full_name} ({self.cars_washed} cars)"


# 🟢 **جدول تاريخ الموظف الداخلي (InternEmployee History)**
class InternEmployeeHistory(models.Model):
    intern_employee = models.ForeignKey(InternEmployee, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    cars_washed = models.IntegerField(default=0)
    appointment = models.ForeignKey(AppointmentLocation, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.intern_employee.full_name} - {self.client.full_name} ({self.cars_washed} cars)"


# les rendez vous ta3 clientwahd  d dar extern w intern ykon fihm informations dylo (tp w lassm w les rendez vous d dar)
#les appointments bin 2 get all  ndir hel get w hel update  f  2 api domicile w location wla f whda ida kdrt