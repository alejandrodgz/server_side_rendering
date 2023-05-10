# Generated by Django 4.2.1 on 2023-05-09 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('description', models.TextField(blank=True)),
                ('due_date', models.DateTimeField(verbose_name='deadline')),
                ('priority_level', models.CharField(max_length=20)),
                ('done', models.BooleanField(default=False)),
            ],
        ),
    ]
