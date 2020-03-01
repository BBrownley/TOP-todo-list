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

-User clicks on todo
-Box appears on screen, listing all its details

-User clicks delete on todo
-Todo is removed from the project

// BUGS

-Form validation errors don't disappear after submitting them
-User can tab over to buttons that are on the z-index baseline while form is open
-Todo counts on project tabs not updating after todo is added

*/

import Project from "./Project";
import Todo from "./Todo";

const moment = require("moment");

const projects = [];

const project1 = new Project("My first project");
project1.addTodo(new Todo("Do homework", "", "", "Low", "3"))
project1.addTodo(new Todo("Wash the dishes", "", "", "Very Low", "20"))
project1.addTodo(new Todo("Busy work", "", "", "Very High", "60"))

projects.push(project1);

const project2 = new Project("Another project");
project2.addTodo(new Todo("Take out trash", "", "", "Medium", "30"))
project2.addTodo(new Todo("Work out", "", "", "High", "2"))

projects.push(project2);

require("../scss/main.scss");

const dataStorage = (() => {

  

})();

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

  const colorTodoPriority = priority => {
    switch(priority) {
      case "Very Low":
        return "green";
      case "Low":
        return "yellowgreen";
      case "Medium":
        return "yellow";
      case "High":
        return "orange";
      case "Very High":
        return "red";
      default:
        return "black";
    }
  }

  // project - represents an Object of type Project
  const renderTodosFromProject = (project, projectIndex) => {

    const todosContainer = document.querySelector(".todos-container");

    todosContainer.innerHTML = "";

    let todoIndex = 0; // Assign each rendered todo to a data-index so we can locate them later

    if (project.todos.length === 0) {
      const message = document.createElement("p");
      message.textContent = "You don't have any todos in this project!";
      todosContainer.appendChild(message);
    } else {
      project.todos.forEach(todo => {

        const todoElement = 

        `
          <div class="todo" data-todo-index=${todoIndex} data-child-of-project-at-index=${projectIndex} style="border-left: 5px solid ${colorTodoPriority(todo.priority)}">
            <div class="todo-info">
                <p class="todo-title">${todo.title}</p>
                <span class="todo-duration">(${parseInt(todo.estimatedTime)} minutes)</span>
                <span class="todo-priority"><div class="todo-priority-marker" style="background-color: ${colorTodoPriority(todo.priority)}"></div>${todo.priority} priority</span>
            </div>
            <div class="todo-options">
                <button class="edit-todo">Edit</button>
                <button class="delete-todo">Delete</button>
            </div>
          </div>
        `

        todosContainer.innerHTML += todoElement;
        todoIndex++;
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

  const showTodoDetails = todoElement => {
    console.log(todoElement);


    // These two variables are essentially "coordinates" for locating the selected todo in data
    const projectIndex = todoElement.getAttribute("data-child-of-project-at-index");
    const todoIndex = todoElement.getAttribute("data-todo-index");

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
    closeForm,
    showTodoDetails
  };

})();

const controller = (() => {

  const allProjects = projects;

  let selectedProjectIndex = 0;

  const updateProject = () => {

  }

  const updateTodo = () => {

  }

  const getSelectedProjectIndex = () => {
    return Array.from(document.getElementsByClassName("project")).find(project => {
      return project.classList.contains("selected")
    }).getAttribute("data-project-index");
  }

  // project - Represents a project tab element
  const selectProject = project => {

      const projectIndex = project.getAttribute("data-project-index");

      DOM.markSelectedProject(project);
      DOM.renderTodosFromProject(projects[projectIndex], projectIndex);

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

    const formValidationErrors = validateForm(form);

    if (formValidationErrors.length > 0) {

      const formErrorContainer = form.querySelector(".form-errors");
      formErrorContainer.innerHTML = "";

      formValidationErrors.forEach(err => {
        const errorElement = document.createElement("p");
        errorElement.textContent = err;
        formErrorContainer.appendChild(errorElement);
      });

      return;
    }

    // Extract values from form
    if (form.getAttribute("id") === "new-project-form") {
      const newProjectName = document.getElementById("projectName").value;
      createProject(newProjectName);
      selectProject(document.querySelector(".project:last-child"));
      DOM.resetForm(form);
    } else if (form.getAttribute("id") === "add-todo-form") {

      const todoProperties = [];

      todoProperties[0] = form["todoTitle"].value;
      todoProperties[1] = form["todoDescription"].value;
      todoProperties[2] = form["todoDueDate"].value;
      todoProperties[3] = document.querySelector(`input[name="priority"]:checked`).value;
      todoProperties[4] = form["todoEstimatedTime"].value;

      const newTodo = new Todo(...todoProperties);

      // Get selected project and add the new todo to it
      selectedProjectIndex = getSelectedProjectIndex();
      allProjects[selectedProjectIndex].addTodo(newTodo);

      // Close/Reset form, render updated list of todos
      DOM.closeForm();
      DOM.resetForm(form);
      DOM.renderTodosFromProject(allProjects[selectedProjectIndex], selectedProjectIndex);

      // Updates the count displayed on project tab
      DOM.renderProjects(allProjects);

    }

  }

  // form - Represents the HTML form
  const validateForm = form => {
    
    const errors = [];

    console.log(form.elements)

    const formInputsToValidate = Array.from(form.elements).filter(formElement => {
      return formElement.type === "text" || formElement.type === "number";
    });
    
    formInputsToValidate.forEach(textInput => {
      if (textInput.value.trim().length === 0) {

        errors.push(`${textInput.name} not specified`)

        textInput.style.border = "2px solid red";

      }
    })

    return errors;

  }

  document.addEventListener("click", e => {

    if (e.target.classList.contains("form-container")) {
      DOM.closeForm();
    }

    else if (DOM.checkIfTargetWithinElement(e.target, ".project")) {

      selectProject(DOM.checkIfTargetWithinElement(e.target, ".project"));

    } else if (DOM.checkIfTargetWithinElement(e.target, ".todo")) {
      DOM.showTodoDetails(DOM.checkIfTargetWithinElement(e.target, ".todo"))
    }

  })

  window.addEventListener("load", () => {
    DOM.renderProjects(allProjects);
    //selectProject(document.querySelector(".project"));
    document.getElementById("todoDueDate").value = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
  })

  return {submitForm}

})();