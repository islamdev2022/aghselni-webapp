# Generated by Django 5.1.6 on 2025-03-18 01:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wash', '0004_admin_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='internemployee',
            name='age',
            field=models.IntegerField(default=0),
        ),
    ]
