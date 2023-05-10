const getTodos = async () => {
  const response = await fetch("./api/v1/");
  const data = await response.json();
  return data.todos;
};

const deleteTodoApi = async (todoId) => {
  await fetch(`./api/v1/${todoId}/delete`, {
    method: "DELETE",
  });
};

const postTodoApi = async (todo) => {
  await fetch("./api/v1/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
};

const updateTodoApi = async (todoId, todoUpdated) => {
  await fetch(`api/v1/${todoId}/update/`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(todoUpdated),
  });
};

const deleteTodo = async (todoId, containerId) => {
  await deleteTodoApi(todoId);
  const container = document.getElementById(containerId);
  await makeTodos(container);
};

const postTodo = async (todo, containerId) => {
  await postTodoApi(todo);
  const container = document.getElementById(containerId);
  await makeTodos(container);
  const form = document.querySelector("#post-form");
  form.reset();
};

const updateForm = async (todoId) => {
  const response = await fetch(`./api/v1/${todoId}`);
  const todo = await response.json();
  const data = todo.todo;
  console.log(data.due_date);
  const form = document.querySelector("#edit-form");
  const elementId = document.querySelector("#element-id");
  elementId.setAttribute("get-id", data.id);
  //form.elements["element-id"].setAttribute("get-id", data.id);
  form.elements["title-edit"].value = data.title;
  form.elements["description-edit"].value = data.description;
  form.elements["time-edit"].value = data.due_date;
  form.elements["priority-edit"].value = data.priority_level;
  form.elements["edit-completed"].checked = data.done;
};

const updateTodo = async (containerId) => {
  const editForm = document.querySelector("#edit-form");
  editForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#title-edit");
    const descriptionInput = document.querySelector("#description-edit");
    const dateTimeInput = document.querySelector("#time-edit");
    const prioritySelect = document.querySelector("#priority-edit");
    const completedCheckbox = document.querySelector("#edit-completed");
    const elementId = document.querySelector('#element-id');
    const updatedTodo = {
      title: titleInput.value,
      description: descriptionInput.value,
      due_date: dateTimeInput.value,
      priority_level: prioritySelect.value,
      done: completedCheckbox.checked,
    };
    console.log(elementId.getAttribute("get-id"))
    await updateTodoApi(`${elementId.getAttribute("get-id")}`, updatedTodo);
    const container = document.getElementById(containerId);
    await makeTodos(container);
  });
  
};

const makeTodos = async (ContainerToAppend) => {
  const data = await getTodos();
  ContainerToAppend.innerHTML = ""; // clear the container first
  data.forEach((element) => {
    // Create new todo card and append to container
    const todo_card = `
      <div class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">Task: ${element.title}</h5>
          <p class="card-text">Description: ${element.description}</p>
          <button class="btn btn-danger delete-todo" onclick="deleteTodo('${element.id}', '${ContainerToAppend.id}')" todo-id="${element.id}">Delete</button>
          <button type="button" onclick="updateForm('${element.id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-todo">
          Launch demo modal
          </button>
        </div>
      </div>
    `;
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = todo_card;
    ContainerToAppend.appendChild(cardDiv);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#todo-container");
  await makeTodos(container);

  const form = document.querySelector("#post-form");
  const completedCheckbox = document.querySelector("#completed");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title-todo").value;
    const description = document.getElementById("description-text").value;
    const dueDate = document.getElementById("dateTimeInput").value;
    const priorityLevel = document.getElementById("priority-select").value;
    const isDone = completedCheckbox.checked ? true : false;

    const todo = {
      title: title,
      description: description,
      due_date: dueDate,
      priority_level: priorityLevel,
      done: isDone,
    };

    await postTodo(todo, container.id);
  });

  const updateButtom = document.querySelector("#submit-edit");
  updateButtom.addEventListener('click',async ()=> {
    await updateTodo(container.id)
  })

});
