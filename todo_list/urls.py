from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create_task/", views.create_task, name="create_task"),
    path("completed_tasks/", views.completed_tasks, name="completed_tasks"),
    path("api/v1/", views.todo_list, name="todo_list"),
    path("api/v1/create/", views.todo_create, name="todo_create"),
    path("api/v1/<int:todo_id>/", views.todo_detail, name="todo_detail"),
    path("api/v1/<int:todo_id>/delete/", views.todo_delete, name="todo_delete"),
    path("api/v1/<int:todo_id>/update/", views.todo_update, name="todo_update")
]