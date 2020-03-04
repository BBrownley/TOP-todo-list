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

// BUGS

-User can tab over to buttons that are on the z-index baseline while form is open

// TO DO



*/

import Project from "./Project";
import Todo from "./Todo";

import projectForm from '../modules/projectForm.js';
import todoForm from '../modules/todoForm';

import projectElement from "../modules/projectElement";

const moment = require("moment");

require("../scss/main.scss");

const dataStorage = (() => {

  let projects = [];

  const project1 = new Project("My first project");
  project1.addTodo(new Todo("Do homework", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit recusandae animi corporis minus, est voluptatum vitae et, voluptatibus consequatur suscipit distinctio mollitia voluptatem ut sint dolorum iure tenetur nulla. Maxime, maiores rem quod nam minus doloremque soluta natus numquam velit!", "", "Low", "3"))
  project1.addTodo(new Todo("Wash the dishes", "", "", "Very Low", "20"))
  project1.addTodo(new Todo("Busy work", "", "", "Very High", "60"))

  projects.push(project1);

  const project2 = new Project("Another project");
  project2.addTodo(new Todo("Take out trash", "", "", "Normal", "30"))
  project2.addTodo(new Todo("Work out", "", "", "High", "2"))

  projects.push(project2);


  const addProject = project => projects.push(project);

  const deleteTodo = (projectIndex, todoIndex) => {

    projects[projectIndex].deleteTodo(todoIndex);

    DOM.renderTodosFromProject(projects[projectIndex], projectIndex);
    //DOM.removeChildTodoFromProject(todoIndex);
  }

  const deleteProject = projectIndex => {
    console.log(projects);
    console.log(projectIndex);
    projects.splice(projectIndex, 1);
    DOM.renderProjects(projects);
    console.log(projects);
  }

  const getTodoObject = (projectIndex, todoIndex) => {
    return projects[projectIndex].todos[todoIndex];
  }

  return {projects, addProject, deleteTodo, getTodoObject, deleteProject};

})();

const DOM = (() => {

  const renderProjects = projects => {

    let projectIndex = 0; // Assign each rendered project to a data-index so we can locate them later

    const projectContainer = document.querySelector(".sidebar .project-container");
    projectContainer.innerHTML = "";

    projects.forEach(project => {

      // Refactor this

      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");
      projectDiv.setAttribute("data-project-index", projectIndex);

      projectDiv.innerHTML = projectElement(project);

      // const projectInner = document.createElement("p");

      
      
      projectIndex++;

      // projectInner.textContent += project.projectName;
      // projectInner.textContent += " (" + project.todos.length + ")";

      // projectDiv.appendChild(projectInner);
      projectContainer.appendChild(projectDiv);

    });

  }

  const removeChildTodoFromProject = todoIndex => {
    const todosContainer = document.querySelector(".todos-container");
    const todoElements = todosContainer.querySelectorAll(".todo");

    todosContainer.removeChild(todoElements[todoIndex]);
  }

  const colorTodoPriority = priority => {
    switch(priority) {
      case "Very Low":
        return "green";
      case "Low":
        return "yellowgreen";
      case "Normal":
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

    todosContainer.innerHTML += `<button id="add-todo">+ Add todo</button>`;

    if (project.todos.length === 0) {
      const message = document.createElement("p");
      message.textContent = "You don't have any todos in this project!";
      todosContainer.appendChild(message);
      
    } else {

      project.todos.forEach(todo => {

        console.log(todo.completed);

        const todoElement = 

        `
          <div class="todo" data-todo-index=${todoIndex} data-child-of-project-at-index=${projectIndex} style="border-left: 5px solid ${colorTodoPriority(todo.priority)}">
            <div class="todo-info">
                <p class="todo-title ${todo.completed ? "crossed-off" : ""}">${todo.title}</p>
                <span class="todo-duration">
                (Est. ${parseInt(todo.estimatedTime)} minutes, 
                due ${moment(todo.dueDate, "YYYY-DD-MM").format("MM-DD-YYYY")})
                </span>
                <div class="todo-details">
                  <span class="todo-priority"><div class="todo-priority-marker" style="background-color: ${colorTodoPriority(todo.priority)}"></div>${todo.priority} priority</span>
                  <p class="todo-description">${todo.description}</p>
                </div>
            </div>
            <div class="todo-options">
              <button class="check-todo"><i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
              <button class="edit-todo"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
              <button class="delete-todo"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
            </div>
          </div>
        `

        todosContainer.innerHTML += todoElement;
        todoIndex++;
      })
    }

    

    const addTodoButton = document.getElementById("add-todo");
    addTodoButton.addEventListener("click", () => openForm("Add todo"));

  }

  const markSelectedProject = targetProjectElement => {

    const allProjectElements = Array.from(document.getElementsByClassName("project"));
    allProjectElements.forEach(project => project.classList.remove("selected"));
    targetProjectElement.classList.add("selected");

  }

  const checkIfTargetWithinElement = (target, selector) => {
    return target.closest(selector);
  }

  const addFormEventListeners = () => {

    console.log("heyu")
    const submitButton = document.querySelector('input[type="submit"]');
    console.log(submitButton);
    submitButton.addEventListener("click", e => {
      e.preventDefault();
      console.log("Added form event listeners")
    })
  }

  const openForm = action => {

    if (action === "New project" || action === "Edit project") {

      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");

      formContainer.innerHTML = projectForm(action);
      document.getElementById("app").appendChild(formContainer);
      
      document.querySelector('input[type="submit"]').addEventListener("click", e => {

        e.preventDefault();
        controller.submitForm(formContainer);
      });

    } else if (action === "Add todo" || action === "Edit todo") {

      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");

      formContainer.innerHTML = todoForm(action);
      document.getElementById("app").appendChild(formContainer);

      console.log(document.querySelector('input[type="submit"]'));
      
      document.querySelector('input[type="submit"]').addEventListener("click", e => {
        e.preventDefault();
        controller.submitForm(formContainer);
      });

      if (action === "Add todo") {
        formContainer.querySelector("#todo-form").reset();
        document.getElementById("todoDueDate").value = moment(new Date()).add(1, "days").format("YYYY-DD-MM");
      } else {
        return;
      }

    }
  }

  const populateTodoFormData = todo => {

    const todoForm = document.getElementById("todo-form");
    
    // These form names are inconsistent :O
    todoForm.elements["Title"].value = todo.title;
    todoForm.elements["Description"].value = todo.description;
    todoForm.elements["priority"].value = todo.priority;
    todoForm.elements["todoDueDate"].value = todo.dueDate;
    todoForm.elements["Estimated time"].value = todo.estimatedTime;

  }

  const populateProjectFormData = project => {
    const projectForm = document.getElementById("project-form");
    projectForm.elements["Project name"].value = project.projectName;
  }

  const resetForm = form => form.reset();

  const closeForm = e => {
    if (e) e.preventDefault();
    const allForms = Array.from(document.getElementsByClassName("form-container"));
    allForms.forEach(form =>  {
      form.remove();
    });
  }

  const toggleTodoDetails = todoElement => {

    todoElement.classList.toggle("expanded");

  }

  const closeFormButtons = Array.from(document.getElementsByClassName("close-form-button"));
  closeFormButtons.forEach(button => button.addEventListener("click", closeForm));

  const formSubmitButtons = Array.from(document.querySelectorAll(`input[type="submit"]`));

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
    toggleTodoDetails,
    removeChildTodoFromProject,
    populateTodoFormData,
    populateProjectFormData
    
  };

})();

const controller = (() => {

  let selectedProjectIndex = 0;

  let indexOfProjectBeingEdited;

  let projectIndexOfTodoBeingEdited;
  let editedTodoIndex;

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
      DOM.renderTodosFromProject(dataStorage.projects[projectIndex], projectIndex);

  }

  const createProject = (projectName) => {
    dataStorage.projects.push(new Project(projectName));
    DOM.renderProjects(dataStorage.projects);
    DOM.closeForm();
  }


  const newProjectButton = document.getElementById("new-project");

  const submitForm = formContainer => {

    const form = formContainer.querySelector("form");

    const formValidationErrors = validateForm(form);

    if (formValidationErrors.length > 0) {

      console.log(form)

      const formErrorContainer = form.querySelector(".form-errors");
      formErrorContainer.innerHTML = "";

      formValidationErrors.forEach(err => {
        const errorElement = document.createElement("p");
        errorElement.textContent = err;
        formErrorContainer.appendChild(errorElement);
      });

      return;
    }

    if (form.getAttribute("data-form-action") === "Edit project") {

      console.log(form.elements["Project name"])

      dataStorage.projects[indexOfProjectBeingEdited].projectName = form.elements["Project name"].value;
      DOM.renderProjects(dataStorage.projects);
      DOM.closeForm();
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(document.getElementsByClassName("project")[selectedProjectIndex]);
    }

    // Extract values from form
    else if (form.getAttribute("id") === "project-form") {
      
      const newProjectName = document.getElementById("projectName").value;
      createProject(newProjectName);
      selectProject(document.querySelector(".project:last-child"));
      DOM.resetForm(form);
    } else if (form.getAttribute("data-form-action") === "Add todo") {

      const todoProperties = [];

      todoProperties[0] = form["todoTitle"].value;
      todoProperties[1] = form["todoDescription"].value;
      todoProperties[2] = form["todoDueDate"].value;
      todoProperties[3] = document.querySelector(`input[name="priority"]:checked`).value;
      todoProperties[4] = form["todoEstimatedTime"].value;

      const newTodo = new Todo(...todoProperties);

      // Get selected project and add the new todo to it
      selectedProjectIndex = getSelectedProjectIndex();
      dataStorage.projects[selectedProjectIndex].addTodo(newTodo);

      // Close/Reset form, render updated list of todos
      DOM.closeForm();
      DOM.resetForm(form);
      DOM.renderTodosFromProject(dataStorage.projects[selectedProjectIndex], selectedProjectIndex);

      // Updates the count displayed on project tab
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(document.getElementsByClassName("project")[selectedProjectIndex]);

    } else if (form.getAttribute("data-form-action") === "Edit todo") {
      console.log(dataStorage.projects[projectIndexOfTodoBeingEdited].todos[editedTodoIndex])

      dataStorage.projects[projectIndexOfTodoBeingEdited].todos[editedTodoIndex] = new Todo(
        form["todoTitle"].value,
        form["todoDescription"].value,
        form["todoDueDate"].value,
        document.querySelector(`input[name="priority"]:checked`).value,
        form["todoEstimatedTime"].value
      )

        // Close/Reset form, render updated list of todos
        DOM.closeForm();
        DOM.resetForm(form);
        DOM.renderTodosFromProject(dataStorage.projects[selectedProjectIndex], selectedProjectIndex);

        // Updates the count displayed on project tab
        DOM.renderProjects(dataStorage.projects);
        DOM.markSelectedProject(document.getElementsByClassName("project")[selectedProjectIndex]);
      }
      
    }

  

  // formContainer - Represents the wrapper around the HTML form
  const validateForm = form => {
    
    const errors = [];

    const formInputsToValidate = Array.from(form.elements).filter(formElement => {
      return formElement.type === "text" || formElement.type === "number";
    });

    formInputsToValidate.forEach(input => {
      input.style.border = "1px solid #A9A9A9";
      console.log("hey");
    });    
    formInputsToValidate.forEach(textInput => {
      if (textInput.value.trim().length === 0) {

        errors.push(`${textInput.name} not specified`)

        textInput.style.border = "1px solid red";

      }
    })

    return errors;

  }

  

  document.addEventListener("click", e => {

    // My personal rule of thumb is "the nearest static container is where I want to listen." - snowmonkey

    console.log(e.target);

    if (e.target.getAttribute("id") === "new-project") {
      DOM.openForm("New project");
    }

    // else if (e.target.getAttribute("id") === "add-todo") {
    //   DOM.openForm("Add todo")
    // }

    else if (e.target.classList.contains("edit-project")) {
      console.log(e.target.parentNode.parentNode);

      indexOfProjectBeingEdited = e.target.parentNode.parentNode.getAttribute("data-project-index");

      DOM.openForm("Edit project");
      DOM.populateProjectFormData(dataStorage.projects[parseInt(e.target.parentNode.parentNode.getAttribute("data-project-index"))]);

    }

    else if (e.target.classList.contains("check-todo")) {
      console.log("Checking off project");

      const projectElementToCheck = e.target.parentNode.parentNode;

      const projectIndex = projectElementToCheck.getAttribute("data-child-of-project-at-index");
      const todoIndex = projectElementToCheck.getAttribute("data-todo-index");

      const todoToToggleCompleted = dataStorage.projects[projectIndex].todos[todoIndex];

      todoToToggleCompleted.completed = !todoToToggleCompleted.completed;
      DOM.renderTodosFromProject(dataStorage.projects[projectIndex], projectIndex);

    }

    else if (e.target.classList.contains("delete-project")) {
      console.log("Deleting project");

      dataStorage.deleteProject(e.target.parentNode.parentNode.getAttribute("data-project-index"));
      selectProject(document.querySelector(".project"));

    }

    else if (e.target.classList.contains("form-container")) {
      DOM.closeForm();
    }

    else if (DOM.checkIfTargetWithinElement(e.target, ".project")) {

      selectProject(DOM.checkIfTargetWithinElement(e.target, ".project"));

    } 

    else if (e.target.classList.contains("edit-todo")) {
      
      const todoElementToEdit = DOM.checkIfTargetWithinElement(e.target, ".todo");

      projectIndexOfTodoBeingEdited = parseInt(todoElementToEdit.getAttribute("data-child-of-project-at-index"));
      editedTodoIndex = parseInt(todoElementToEdit.getAttribute("data-todo-index"));

      DOM.openForm("Edit todo");
      DOM.populateTodoFormData(dataStorage.getTodoObject(projectIndexOfTodoBeingEdited, editedTodoIndex));
      
    }

    else if (e.target.classList.contains("delete-todo")) {

      const todoElementToDelete = DOM.checkIfTargetWithinElement(e.target, ".todo");

      const projectIndexOfTodo = parseInt(todoElementToDelete.getAttribute("data-child-of-project-at-index"));
      const todoIndex = parseInt(todoElementToDelete.getAttribute("data-todo-index"));

      selectedProjectIndex = projectIndexOfTodo;

      dataStorage.deleteTodo(projectIndexOfTodo, todoIndex);
      console.log(Array.from(document.getElementsByClassName("project"))[selectedProjectIndex]);
      
      DOM.renderProjects(dataStorage.projects);
      selectProject(document.getElementsByClassName("project")[selectedProjectIndex]);
    }
    
    else if (DOM.checkIfTargetWithinElement(e.target, ".todo")) {
      DOM.toggleTodoDetails(DOM.checkIfTargetWithinElement(e.target, ".todo"))
    }

  })

  window.addEventListener("load", () => {
    if (testingUI) return;
    DOM.renderProjects(dataStorage.projects);
    selectProject(document.querySelector(".project"));
    
    // document.getElementById("todoDueDate").value = "2014-02-09"
    console.log(moment(new Date()).add(1, "days").format("MM-DD-YYYY"));
    // console.log(document.getElementById("todoDueDate").value);
  })

  return {submitForm, newProjectButton}

})();



const testingUI = false;