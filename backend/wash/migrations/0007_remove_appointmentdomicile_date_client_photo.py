# Generated by Django 5.1.6 on 2025-03-22 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wash', '0006_appointmentdomicile_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='clients/'),
        ),
    ]
