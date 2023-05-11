const postTodoApi = async (todo) => {
    await fetch("../api/v1/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
}

const postTodo = async (todo) => {
    await postTodoApi(todo);
    const form = document.querySelector("#post-form");
    form.reset();
    window.location.href = "/todo_list";
};

document.addEventListener("DOMContentLoaded", async () => {
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

    await postTodo(todo);
  });
});