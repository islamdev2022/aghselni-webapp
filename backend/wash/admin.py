from django.contrib import admin
from .models import *

admin.site.register(Client)
admin.site.register(ExternEmployee)
admin.site.register(InternEmployee)
admin.site.register(AppointmentDomicile)
admin.site.register(AppointmentLocation)
admin.site.register(ExternEmployeeHistory)
admin.site.register(InternEmployeeHistory)
admin.site.register(Feedback)

admin.site.register(Admin)