/*

### OBJECTS ###

Project
  todos:
    todo
      title
      description
      dueDate
      priority
      notes
      checklist
      est. time

### USER INTERFACE ###

Header
  Logo
  Search
  Settings
    Color theme
    Font size

Sidebar
  View upcoming deadlines (today, next 7 days)
  Choose random todo
  Search for todo

  Project (A)
  Project
  Project

Project (A) - Displays the following:
  > # of todos in that project
  > When the next todo is due

Main
  Todos
    Todo (B) -> Event(click)

Todo (B) - Displays the following:
  > Title
  > Due when
  > Priority

  ClickEvent:
    - Expands element to view the rest of the properties


// NOTES

-There is an "Add todo" button in the project window
-User clicks "Add todo"
-Form appears, info to be filled out for the new todo object
-User submits form, new todo is added to the currently selected project

// BUGS

-Empty forms can be submitted
-User can tab over to buttons that are on the z-index baseline while form is open

*/

import Project from "./Project";

const projects = [];

const project1 = new Project("My first project");
project1.addTodo("Do homework");
project1.addTodo("Wash the dishes");
project1.addTodo("Busy work");

projects.push(project1);

const project2 = new Project("Another project");
project2.addTodo("Take out trash");
project2.addTodo("Work out");

projects.push(project2);

require("../scss/main.scss");

const events = (() => {



})

const DOM = (() => {

  const renderProjects = projects => {

    let projectIndex = 0; // Assign each rendered project to a data-index so we can locate them later

    const projectContainer = document.querySelector(".sidebar .project-container");
    projectContainer.innerHTML = "";

    projects.forEach(project => {

      const projectDiv = document.createElement("div");
      const projectInner = document.createElement("p");

      projectDiv.classList.add("project");
      projectDiv.setAttribute("data-project-index", projectIndex);
      projectIndex++;

      projectInner.textContent += project.projectName;
      projectInner.textContent += " (" + project.todos.length + ")";

      projectDiv.appendChild(projectInner);
      projectContainer.appendChild(projectDiv);

    });

  }

  const renderTodosFromProject = project => {

    const todosContainer = document.querySelector(".todos-container");

    todosContainer.innerHTML = "";

    if (project.todos.length === 0) {
      const message = document.createElement("p");
      message.textContent = "You don't have any todos in this project!";
      todosContainer.appendChild(message);
    } else {
      project.todos.forEach(todo => {
        const todoElement = document.createElement("p");
        todoElement.classList.add("todo");
        todoElement.textContent = todo;
        todoElement.style.color = "blue";
        todosContainer.appendChild(todoElement);
      })
    }

  }

  const markSelectedProject = targetProjectElement => {

    const allProjectElements = Array.from(document.getElementsByClassName("project"));
    allProjectElements.forEach(project => project.classList.remove("selected"));
    targetProjectElement.classList.add("selected");

  }

  const checkIfTargetWithinElement = (target, selector) => {
    return target.closest(selector);
  }

  const openForm = action => {
    switch(action) {
      case "New Project":
        const newProjectForm = document.getElementById("new-project-form-container");
        newProjectForm.style.display = "block";
        break;
      case "Add todo":
        const addTodoForm = document.getElementById("add-todo-form-container");
        addTodoForm.style.display = "block";
        break;
      default:
        break;
    }
  }

  const resetForm = form => form.reset();

  const closeForm = () => {
    const allForms = Array.from(document.getElementsByClassName("form-container"));
    allForms.forEach(form =>  {
      form.style.display = "none"
    });
  }

  const closeFormButtons = Array.from(document.getElementsByClassName("close-form-button"));
  closeFormButtons.forEach(button => button.addEventListener("click", closeForm));

  const formSubmitButtons = Array.from(document.querySelectorAll(`input[type="submit"]`));
  console.log(formSubmitButtons);

  formSubmitButtons.forEach(button => button.addEventListener("click", e => {
    e.preventDefault();
    controller.submitForm(e.target.parentNode);
  }))

  return {
    renderProjects, 
    renderTodosFromProject, 
    checkIfTargetWithinElement, 
    markSelectedProject, 
    openForm,
    resetForm,
    closeForm
  };

})();

const controller = (() => {

  const allProjects = projects;

  const updateProject = () => {

  }

  const updateTodo = () => {

  }

  const selectProject = project => {

      const projectIndex = project.getAttribute("data-project-index");

      DOM.markSelectedProject(project);
      DOM.renderTodosFromProject(projects[projectIndex]);

  }

  const createProject = (projectName) => {
    allProjects.push(new Project(projectName));
    console.log("Project created: " + projectName)
    DOM.renderProjects(allProjects);
    DOM.closeForm();
  }

  // ¯\_(ツ)_/¯
  const newProjectButton = document.getElementById("new-project");

  newProjectButton.addEventListener("click", () => {
    DOM.openForm("New Project");
  })

  const addTodoButton = document.getElementById("add-todo");

  addTodoButton.addEventListener("click", () => {
    DOM.openForm("Add todo");
  })
  // ¯\_(ツ)_/¯

  const submitForm = form => {
    if (form.getAttribute("id") === "new-project-form") {
      const newProjectName = document.getElementById("projectName").value;
      createProject(newProjectName);
      selectProject(document.querySelector(".project:last-child"));
      DOM.resetForm(form);
    } else if (form.getAttribute("id") === "add-todo-form") {

      const todoProperties = {};

      todoProperties.title = form["todoTitle"].value;
      todoProperties.description = form["todoDescription"].value;
      todoProperties.dueDate = form["todoDueDate"].value;
      todoProperties.priority = document.querySelector(`input[name="priority"]:checked`).value;
      todoProperties.estimatedTime = form["todoEstimatedTime"].value;

      console.log(todoProperties)

    }
  }

  document.addEventListener("click", e => {

    if (e.target.classList.contains("form-container")) {
      DOM.closeForm();
    }

    else if (DOM.checkIfTargetWithinElement(e.target, ".project")) {

      selectProject(DOM.checkIfTargetWithinElement(e.target, ".project"));

    } else if (DOM.checkIfTargetWithinElement(e.target, ".todo")) {
      console.log("todo clicked")
    }

  })

  window.addEventListener("load", () => {
    DOM.renderProjects(allProjects);
    selectProject(document.querySelector(".project"));
  })

  return {submitForm}

})();