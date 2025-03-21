# Generated by Django 5.1.6 on 2025-03-11 14:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wash', '0002_rename_fullname_admin_full_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExternEmployeeHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cars_washed', models.IntegerField(default=0)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.appointmentdomicile')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.client')),
                ('extern_employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.externemployee')),
            ],
        ),
        migrations.CreateModel(
            name='InternEmployeeHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cars_washed', models.IntegerField(default=0)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.appointmentlocation')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.client')),
                ('intern_employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wash.internemployee')),
            ],
        ),
    ]
