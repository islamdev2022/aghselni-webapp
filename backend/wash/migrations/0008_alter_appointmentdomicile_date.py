# Generated by Django 5.1.6 on 2025-03-23 12:47

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wash', '0007_remove_appointmentdomicile_date_client_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointmentdomicile',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
