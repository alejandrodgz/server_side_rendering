from django.db import models

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField("deadline")
    priority_level = models.CharField(max_length=20)
    done = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title