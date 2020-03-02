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

-Form validation errors don't disappear after submitting them
-User can tab over to buttons that are on the z-index baseline while form is open

*/

import Project from "./Project";
import Todo from "./Todo";

const moment = require("moment");

require("../scss/main.scss");

const dataStorage = (() => {

  const projects = [];

  const project1 = new Project("My first project");
  project1.addTodo(new Todo("Do homework", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit recusandae animi corporis minus, est voluptatum vitae et, voluptatibus consequatur suscipit distinctio mollitia voluptatem ut sint dolorum iure tenetur nulla. Maxime, maiores rem quod nam minus doloremque soluta natus numquam velit!", "", "Low", "3"))
  project1.addTodo(new Todo("Wash the dishes", "", "", "Very Low", "20"))
  project1.addTodo(new Todo("Busy work", "", "", "Very High", "60"))

  projects.push(project1);

  const project2 = new Project("Another project");
  project2.addTodo(new Todo("Take out trash", "", "", "Normal", "30"))
  project2.addTodo(new Todo("Work out", "", "", "High", "2"))

  projects.push(project2);

  console.log(projects);

  const addProject = project => projects.push(project);

  const deleteTodo = (projectIndex, todoIndex) => {
    console.log(projects[0]);
    projects[projectIndex].deleteTodo(todoIndex);
    console.log(projects);
    DOM.renderTodosFromProject(projects[projectIndex], projectIndex);
    //DOM.removeChildTodoFromProject(todoIndex);
  }

  const getTodoObject = (projectIndex, todoIndex) => {
    return projects[projectIndex].todos[todoIndex];
  }

  return {projects, addProject, deleteTodo, getTodoObject};

})();

console.log(dataStorage);

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

    if (project.todos.length === 0) {
      const message = document.createElement("p");
      message.textContent = "You don't have any todos in this project!";
      todosContainer.appendChild(message);
    } else {
      project.todos.forEach(todo => {

        console.log(todo)

        const todoElement = 

        `
          <div class="todo" data-todo-index=${todoIndex} data-child-of-project-at-index=${projectIndex} style="border-left: 5px solid ${colorTodoPriority(todo.priority)}">
            <div class="todo-info">
                <p class="todo-title">${todo.title}</p>
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
                <button class="edit-todo"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                <button class="delete-todo"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
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

    if (action === "New project" || action === "Edit project") {
      
      const projectForm = document.getElementById("project-form-container");
      document.getElementById("project-form-action-header").textContent = action;

      projectForm.style.display = "block";

      if (action === "New project") {
        projectForm.reset();
      } 

    } else if (action === "Add todo" || action === "Edit todo") {
      const todoForm = document.getElementById("todo-form-container");
      document.getElementById("todo-form-action-header").textContent = action;
      todoForm.style.display = "block";

      if (action === "Add todo") {
        todoForm.querySelector("#todo-form").reset();
      } 

    }
  }

  const populateTodoFormData = todo => {
    console.log(todo)
    const todoForm = document.getElementById("todo-form");
    
    // These form names are inconsistent :O
    todoForm.elements["Title"].value = todo.title;
    todoForm.elements["Description"].value = todo.description;
    todoForm.elements["priority"].value = todo.priority;
    todoForm.elements["todoDueDate"].value = todo.dueDate;
    todoForm.elements["Estimated time"].value = todo.estimatedTime;

  }

  const resetForm = form => form.reset();

  const closeForm = e => {
    if (e) e.preventDefault();
    const allForms = Array.from(document.getElementsByClassName("form-container"));
    allForms.forEach(form =>  {
      form.style.display = "none"
    });
  }

  const toggleTodoDetails = todoElement => {
    console.log(todoElement);


    // These two variables are essentially "coordinates" for locating the selected todo in data
    // const projectIndex = todoElement.getAttribute("data-child-of-project-at-index");
    // const todoIndex = todoElement.getAttribute("data-todo-index");

    todoElement.classList.toggle("expanded");

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
    toggleTodoDetails,
    removeChildTodoFromProject,
    populateTodoFormData
  };

})();

const controller = (() => {

  let selectedProjectIndex = 0;

  const updateProject = () => {

  }

  const updateTodo = () => {

  }

  const getSelectedProjectIndex = () => {
    return Array.from(document.getElementsByClassName("project")).find(project => {
      console.log(project)
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
    console.log("Project created: " + projectName)
    DOM.renderProjects(dataStorage.projects);
    DOM.closeForm();
  }

  // ¯\_(ツ)_/¯
  const newProjectButton = document.getElementById("new-project");

  newProjectButton.addEventListener("click", () => {
    DOM.openForm("New project");
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
    if (form.getAttribute("id") === "project-form") {
      const newProjectName = document.getElementById("projectName").value;
      createProject(newProjectName);
      selectProject(document.querySelector(".project:last-child"));
      DOM.resetForm(form);
    } else if (form.getAttribute("id") === "todo-form") {

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

    console.log(e.target);

    if (e.target.classList.contains("form-container")) {
      DOM.closeForm();
    }

    else if (DOM.checkIfTargetWithinElement(e.target, ".project")) {

      selectProject(DOM.checkIfTargetWithinElement(e.target, ".project"));

    } 

    else if (e.target.classList.contains("edit-todo")) {
      
      const todoElementToEdit = DOM.checkIfTargetWithinElement(e.target, ".todo");

      const projectIndexOfTodo = parseInt(todoElementToEdit.getAttribute("data-child-of-project-at-index"));
      const todoIndex = parseInt(todoElementToEdit.getAttribute("data-todo-index"));

      DOM.openForm("Edit todo");
      DOM.populateTodoFormData(dataStorage.getTodoObject(projectIndexOfTodo, todoIndex));
      
    }

    else if (e.target.classList.contains("delete-todo")) {

      const todoElementToDelete = DOM.checkIfTargetWithinElement(e.target, ".todo");

      const projectIndexOfTodo = parseInt(todoElementToDelete.getAttribute("data-child-of-project-at-index"));
      const todoIndex = parseInt(todoElementToDelete.getAttribute("data-todo-index"));

      console.table([projectIndexOfTodo, todoIndex]);

      dataStorage.deleteTodo(projectIndexOfTodo, todoIndex);
    }
    
    else if (DOM.checkIfTargetWithinElement(e.target, ".todo")) {
      DOM.toggleTodoDetails(DOM.checkIfTargetWithinElement(e.target, ".todo"))
    }

  })

  window.addEventListener("load", () => {
    if (testingUI) return;
    DOM.renderProjects(dataStorage.projects);
    selectProject(document.querySelector(".project"));
    document.getElementById("todoDueDate").value = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
  })

  return {submitForm}

})();

const testingUI = false;