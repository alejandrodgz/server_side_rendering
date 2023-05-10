from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Todo
import json
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'todo_list/index.html')

def todo_list(request):
    if request.method == 'GET':
        todos = Todo.objects.all().values()
        data = {'todos': list(todos)}
        return JsonResponse(data)


# Get a single todo
def todo_detail(request, todo_id):
    if request.method == 'GET':
        todo = get_object_or_404(Todo, pk=todo_id)
        data = {'todo': model_to_dict(todo)}
        return JsonResponse(data)

@csrf_exempt
def todo_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        todo = Todo.objects.create(
            title=data['title'],
            description=data['description'],
            due_date=data['due_date'],
            priority_level=data['priority_level'],
            done=data.get('done', False),
        )
        return JsonResponse({'todo': model_to_dict(todo)})
    
@csrf_exempt
def todo_update(request, todo_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        todo = get_object_or_404(Todo, pk=todo_id)
        todo.title = data['title']
        todo.description = data['description']
        todo.due_date = data['due_date']
        todo.priority_level = data['priority_level']
        todo.done = data.get('done', False)
        todo.save()
        return JsonResponse({'todo': model_to_dict(todo)})

@csrf_exempt
def todo_delete(request, todo_id):
    if request.method == 'DELETE':
        todo = get_object_or_404(Todo, pk=todo_id)
        todo.delete()
        return JsonResponse({'status': 'success'})



