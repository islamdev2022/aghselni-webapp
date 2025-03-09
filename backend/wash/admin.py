from django.contrib import admin
from .models import Client, ExternEmployee, InternEmployee, Admin, Rating, AppointmentDomicile, AppointmentLocation

admin.site.register(Client)
admin.site.register(ExternEmployee)
admin.site.register(InternEmployee)
admin.site.register(Admin)
admin.site.register(Rating)
admin.site.register(AppointmentDomicile)
admin.site.register(AppointmentLocation)
