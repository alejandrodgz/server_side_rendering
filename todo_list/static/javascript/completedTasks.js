const baseURL = window.location.origin;

const getTodos = async () => {
  const response = await fetch(`${baseURL}/todo_list/api/v1/`);
  const data = await response.json();
  return data.todos;
};

const deleteTodoApi = async (todoId) => {
  await fetch(`../api/v1/${todoId}/delete`, {
    method: "DELETE",
  });
};

const updateTodoApi = async (todoId, todoUpdated) => {
  await fetch(`../api/v1/${todoId}/update/`, {
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

const updateForm = async (todoId) => {
  const response = await fetch(`../api/v1/${todoId}`);
  const todo = await response.json();
  const data = todo.todo;
  console.log(data.due_date);
  const form = document.querySelector("#edit-form");
  const elementId = document.querySelector("#element-id");
  elementId.setAttribute("get-id", data.id);
  //form.elements["element-id"].setAttribute("get-id", data.id);
  form.elements["title-edit"].value = data.title;
  form.elements["description-edit"].value = data.description;
  form.elements["time-edit"].value = data.due_date.slice(0, -4);
  form.elements["priority-edit"].value = data.priority_level;
  form.elements["edit-completed"].checked = data.done;
};

const updateTodo = async (containerId) => {
  const editForm = document.querySelector("#edit-form");
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#title-edit");
    const descriptionInput = document.querySelector("#description-edit");
    const dateTimeInput = document.querySelector("#time-edit");
    const prioritySelect = document.querySelector("#priority-edit");
    const completedCheckbox = document.querySelector("#edit-completed");
    const elementId = document.querySelector("#element-id");
    const updatedTodo = {
      title: titleInput.value,
      description: descriptionInput.value,
      due_date: dateTimeInput.value,
      priority_level: prioritySelect.value,
      done: completedCheckbox.checked,
    };
    console.log(elementId.getAttribute("get-id"));
    await updateTodoApi(`${elementId.getAttribute("get-id")}`, updatedTodo);
    const container = document.getElementById(containerId);
    await makeTodos(container);
  });
};

const cardMaker = (element, date, ContainerToAppend) => {
  return `
  <div priority-fil="${
    element.priority_level
  }" class="card mt-3 mx-auto card-priority-filter">
    <div class="card-body mx-auto mt-3 mb-2">
      <h4 class="card-title">${element.title.toUpperCase()}</h4>
      <div>
        <p class="card-title card-priority mt-3" level="${
          element.priority_level
        }">
          Priority: ${
            element.priority_level == 1
              ? "High"
              : element.priority_level == 2
              ? "Medium"
              : "Low"
          }
        </p>
        <div>
          <p style="display: inline-block;">
            completed:&nbsp${
              element.done
                ? `<div class="completed-task"> </div> YES `
                : `<div class="incompleted-task"> </div> NO `
            }
          </p>
        </div>
      </div>
      <p class="card-text mt-4">Description: ${element.description}</p>
      <p class="mt-3">
        <span class="badge text-bg-secondary">
          ${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}
        </span>
        <span class="badge text-bg-secondary">${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }</span>
      </p>  
      <button class="btn btn-danger delete-todo mt-3 mb-2 mx-2" onclick="deleteTodo('${
        element.id
      }', '${ContainerToAppend.id}')" todo-id="${element.id}">Delete</button>
      <button type="button" onclick="updateForm('${
        element.id
      }')" class="btn btn-primary mt-3 mb-2 edit-button" data-bs-toggle="modal" data-bs-target="#edit-todo">
        Edit
      </button>
    </div>
  </div>
`;
};

const makeTodos = async (ContainerToAppend, filter = null) => {
  // Fetch todos data
  const data = await getTodos();
  let high = 0;
  let medium = 0;
  let low = 0;

  // Clear the container first
  ContainerToAppend.innerHTML = "";

  data.forEach((element) => {
    // Only create todo card if it's not marked as done
    if (element.done && !filter) {
      // Count priorities
      switch (element.priority_level) {
        case "1":
          high++;
          break;
        case "2":
          medium++;
          break;
        case "3":
          low++;
      }
      // Format date for display
      const date = new Date(element.due_date);
      const todo_card = cardMaker(element, date, ContainerToAppend);
      const cardDiv = document.createElement("div");
      cardDiv.innerHTML = todo_card;
      ContainerToAppend.appendChild(cardDiv);
    } else if (!element.done && (filter == "1" || filter == "2" || filter == "3")) {
      // Count priorities and filter by priority level
      switch (element.priority_level) {
        case "1":
          high++;
          break;
        case "2":
          medium++;
          break;
        case "3":
          low++;
      }
      if (element.priority_level == filter) {
        // Format date for display
        const date = new Date(element.due_date);
        const todo_card = cardMaker(element, date, ContainerToAppend);
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = todo_card;
        ContainerToAppend.appendChild(cardDiv);
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#todo-container");
  await makeTodos(container);
  const datetime = document.querySelector("#dateTimeInput");

  const updateButtom = document.querySelector("#submit-edit");
  updateButtom.addEventListener("click", async () => {
    await updateTodo(container.id);
  });
});
