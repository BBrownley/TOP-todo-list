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

-User can tab over to buttons that are on the z-index
baseline while form is open (post MVP)

// TO DO (heh)

-Implement localStorage

When do we want to update the storage? Whenever we:
  -Submit a form (Add/edit project, Add/edit todo)
  -Delete a todo or project
  -Mark a todo as complete

*/

import Project from "./Project";
import Todo from "./Todo";

import projectForm from "../modules/projectForm.js";
import todoForm from "../modules/todoForm";

import projectElement from "../modules/projectElement";

const moment = require("moment");

require("../scss/main.scss");

const dataStorage = (() => {
  const projects = [];

  const getProjects = () => {
    return projects;
  };

  const loadProjects = () => {
    if (localStorage.getItem("localStorageProjects") === null) {
      const project1 = new Project("My first project", []);
      project1.addTodo(
        new Todo(
          "Do homework",
          "Here is an example description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit recusandae animi corporis minus, est voluptatum vitae et, voluptatibus consequatur suscipit distinctio mollitia voluptatem ut sint dolorum iure tenetur nulla. Maxime, maiores rem quod nam minus doloremque soluta natus numquam velit!",
          "",
          "Low",
          "3"
        )
      );
      project1.addTodo(new Todo("Wash the dishes", "", "", "Very Low", "20"));
      project1.addTodo(new Todo("Busy work", "", "", "Very High", "60"));

      projects.push(project1);

      const project2 = new Project("Another project", []);
      project2.addTodo(new Todo("Take out trash", "", "", "Normal", "30"));
      project2.addTodo(new Todo("Work out", "", "", "High", "2"));

      projects.push(project2);

      const project3 = new Project("Anotha one", []);
      project3.addTodo(new Todo("Task 1", "", "", "Normal", "30"));
      project3.addTodo(new Todo("Task 2", "", "", "High", "2"));

      projects.push(project3);
    } else {
      let storedProjects = JSON.parse(
        localStorage.getItem("localStorageProjects")
      );

      storedProjects = storedProjects.map(savedProject => {
        const projectProperties = [];

        for (const key in savedProject) {
          if (savedProject.hasOwnProperty(key)) {
            projectProperties.push(savedProject[key]);
          }
        }

        return new Project(...projectProperties);
      });

      // Retain reference to original projects array
      // insert stored projects into it
      projects.length = 0;

      projects.push(...storedProjects);
    }
  };

  const addProject = project => projects.push(project);

  const deleteTodo = (projectIndex, todoIndex) => {
    projects[projectIndex].deleteTodo(todoIndex);

    DOM.renderTodosFromProject(projects[projectIndex], projectIndex);
  };

  const deleteProject = projectIndex => {
    projects.splice(projectIndex, 1);
    DOM.renderProjects(projects);
  };

  const getTodoObject = (projectIndex, todoIndex) => {
    return projects[projectIndex].todos[todoIndex];
  };

  return {
    projects,
    addProject,
    deleteTodo,
    getTodoObject,
    deleteProject,
    loadProjects,
    getProjects
  };
})();

const DOM = (() => {
  const renderProjects = projects => {
    // Assign each rendered project to a data-index so we can locate them later
    let projectIndex = 0;

    const projectContainer = document.querySelector(
      ".sidebar .project-container"
    );
    projectContainer.innerHTML = "";

    if (projects.length === 0) {
      DOM.resetTodosContainer();
      return;
    }

    projects.forEach(project => {
      // Refactor this

      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");
      projectDiv.setAttribute("data-project-index", projectIndex);

      projectDiv.innerHTML = projectElement(project);

      projectIndex++;

      projectContainer.appendChild(projectDiv);
    });
  };

  const removeChildTodoFromProject = todoIndex => {
    const todosContainer = document.querySelector(".todos-container");
    const todoElements = todosContainer.querySelectorAll(".todo");

    todosContainer.removeChild(todoElements[todoIndex]);
  };

  const colorTodoPriority = priority => {
    switch (priority) {
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
  };

  // project - represents an Object of type Project
  const renderTodosFromProject = (project, projectIndex) => {
    const todosContainer = document.querySelector(".todos-container");

    todosContainer.innerHTML = "";

    let todoIndex = 0; // Assign each rendered todo to a data attribute so we can locate them later

    todosContainer.innerHTML += `<button id="add-todo">+ Add todo</button>`;

    if (project.todos.length === 0) {
      const message = document.createElement("p");
      message.textContent = "You don't have any todos in this project!";
      todosContainer.appendChild(message);
    } else {
      project.todos.forEach(todo => {
        const todoElement = `
          <div class="todo" 
            data-todo-index=${todoIndex} 
            data-child-of-project-at-index=${projectIndex} 
            style="border-left: 5px solid ${colorTodoPriority(todo.priority)}"
            >
            <div class="todo-info">
                <p class="todo-title ${todo.completed ? "crossed-off" : ""}">${
          todo.title
        }</p>
                <span class="todo-duration">
                
                <i class="fa fa-clock-o" aria-hidden="true"></i> ${parseInt(
                  todo.estimatedTime
                )} min, 
                due ${moment(todo.dueDate, "YYYY-DD-MM").format("DD-MM-YYYY")}
                </span>
                <div class="todo-details">
                  <span class="todo-priority"><div class="todo-priority-marker" style="background-color: ${colorTodoPriority(
                    todo.priority
                  )}"></div>${todo.priority} priority</span>
                  <p class="todo-description">${todo.description}</p>
                </div>
            </div>
            <div class="todo-options">
              <button class="check-todo"><i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
              <button class="edit-todo"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
              <button class="delete-todo"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
            </div>
          </div>
        `;

        todosContainer.innerHTML += todoElement;
        todoIndex++;
      });
    }

    const addTodoButton = document.getElementById("add-todo");
    addTodoButton.addEventListener("click", () => openForm("Add todo"));
  };

  const resetTodosContainer = () => {
    document.querySelector(".todos-container").innerHTML = `
      <p class="no-project-notification">You have no projects - <span class="new-project">Click here</a> to make one.</span>
    `;
  };

  const markSelectedProject = targetProjectElement => {
    const allProjectElements = Array.from(
      document.getElementsByClassName("project")
    );
    allProjectElements.forEach(project => project.classList.remove("selected"));
    targetProjectElement.classList.add("selected");
  };

  const checkIfTargetWithinElement = (target, selector) => {
    return target.closest(selector);
  };

  const openForm = action => {
    if (action === "New project" || action === "Edit project") {
      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");

      formContainer.innerHTML = projectForm(action);
      document.getElementById("app").appendChild(formContainer);

      document
        .querySelector('input[type="submit"]')
        .addEventListener("click", e => {
          e.preventDefault();
          controller.submitForm(formContainer);
        });

      formContainer.addEventListener("mousedown", e => {
        if (e.target.classList.contains("form-container")) {
          DOM.closeForm();
        }
      });
    } else if (action === "Add todo" || action === "Edit todo") {
      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");

      formContainer.innerHTML = todoForm(action);
      document.getElementById("app").appendChild(formContainer);

      document
        .querySelector('input[type="submit"]')
        .addEventListener("click", e => {
          e.preventDefault();
          controller.submitForm(formContainer);
        });

      formContainer.addEventListener("mousedown", e => {
        if (e.target.classList.contains("form-container")) {
          DOM.closeForm();
        }
      });

      if (action === "Add todo") {
        formContainer.querySelector("#todo-form").reset();
        document.getElementById("todoDueDate").value = moment(new Date())
          .add(1, "days")
          .format("YYYY-MM-DD");
      } else {
        return;
      }
    }
  };

  const populateTodoFormData = todo => {
    const todoForm = document.getElementById("todo-form");

    // These form names are inconsistent :O
    todoForm.elements.Title.value = todo.title;
    todoForm.elements.Description.value = todo.description;
    todoForm.elements.priority.value = todo.priority;
    todoForm.elements.todoDueDate.value = moment(todo.dueDate).format(
      "YYYY-MM-DD"
    );
    todoForm.elements["Estimated time"].value = todo.estimatedTime;
  };

  const populateProjectFormData = project => {
    const projectForm = document.getElementById("project-form");
    projectForm.elements["Project name"].value = project.projectName;
  };

  const resetForm = form => form.reset();

  const closeForm = e => {
    if (e) e.preventDefault();
    const allForms = Array.from(
      document.getElementsByClassName("form-container")
    );
    allForms.forEach(form => {
      form.remove();
    });
  };

  const toggleTodoDetails = todoElement => {
    todoElement.classList.toggle("expanded");
  };

  const closeFormButtons = Array.from(
    document.getElementsByClassName("close-form-button")
  );
  closeFormButtons.forEach(button =>
    button.addEventListener("click", closeForm)
  );

  const formSubmitButtons = Array.from(
    document.querySelectorAll(`input[type="submit"]`)
  );

  formSubmitButtons.forEach(button =>
    button.addEventListener("click", e => {
      e.preventDefault();
      controller.submitForm(e.target.parentNode);
    })
  );

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
    populateProjectFormData,
    resetTodosContainer
  };
})();

const controller = (() => {
  let selectedProjectIndex = 0;

  let indexOfProjectBeingEdited;

  let projectIndexOfTodoBeingEdited;
  let editedTodoIndex;

  const getSelectedProjectIndex = () => {
    return parseInt(
      Array.from(document.getElementsByClassName("project"))
        .find(project => {
          return project.classList.contains("selected");
        })
        .getAttribute("data-project-index")
    );
  };

  // project - Represents a project HTML element
  const selectProject = project => {
    const projectIndex = project.getAttribute("data-project-index") || null;

    DOM.markSelectedProject(project);
    selectedProjectIndex = document
      .querySelector(".project.selected")
      .getAttribute("data-project-index");
    DOM.renderTodosFromProject(
      dataStorage.projects[projectIndex],
      projectIndex
    );
  };

  const createProject = projectName => {
    dataStorage.projects.push(new Project(projectName, []));
    DOM.renderProjects(dataStorage.projects);
    DOM.closeForm();
  };

  const newProjectButton = document.getElementById("new-project");

  const submitForm = formContainer => {
    const form = formContainer.querySelector("form");

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

    if (form.getAttribute("data-form-action") === "Edit project") {
      selectedProjectIndex = getSelectedProjectIndex();

      dataStorage.projects[indexOfProjectBeingEdited].projectName =
        form.elements["Project name"].value;
      DOM.renderProjects(dataStorage.projects);
      DOM.closeForm();
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(
        document.getElementsByClassName("project")[selectedProjectIndex]
      );
    }

    // Extract values from form
    else if (form.getAttribute("id") === "project-form") {
      const newProjectName = document.getElementById("projectName").value;
      createProject(newProjectName);
      selectProject(document.querySelector(".project:last-child"));
      DOM.resetForm(form);
    } else if (form.getAttribute("data-form-action") === "Add todo") {
      const todoProperties = [];

      todoProperties[0] = form.todoTitle.value;
      todoProperties[1] = form.todoDescription.value;
      todoProperties[2] = form.todoDueDate.value;
      todoProperties[3] = document.querySelector(
        `input[name="priority"]:checked`
      ).value;
      todoProperties[4] = form.todoEstimatedTime.value;

      const newTodo = new Todo(...todoProperties);

      // Get selected project and add the new todo to it
      selectedProjectIndex = getSelectedProjectIndex();
      dataStorage.projects[selectedProjectIndex].addTodo(newTodo);

      // Close/Reset form, render updated list of todos
      DOM.closeForm();
      DOM.resetForm(form);
      DOM.renderTodosFromProject(
        dataStorage.projects[selectedProjectIndex],
        selectedProjectIndex
      );

      // Updates the count displayed on project tab
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(
        document.getElementsByClassName("project")[selectedProjectIndex]
      );
    } else if (form.getAttribute("data-form-action") === "Edit todo") {
      dataStorage.projects[projectIndexOfTodoBeingEdited].todos[
        editedTodoIndex
      ] = new Todo(
        form.todoTitle.value,
        form.todoDescription.value,
        form.todoDueDate.value,
        document.querySelector(`input[name="priority"]:checked`).value,
        form.todoEstimatedTime.value
      );

      selectedProjectIndex = getSelectedProjectIndex();

      // Close/Reset form, render updated list of todos
      DOM.closeForm();
      DOM.resetForm(form);
      DOM.renderTodosFromProject(
        dataStorage.projects[selectedProjectIndex],
        selectedProjectIndex
      );

      // Updates the count displayed on project tab
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(
        document.getElementsByClassName("project")[selectedProjectIndex]
      );
    }

    localStorage.setItem(
      "localStorageProjects",
      JSON.stringify(dataStorage.projects)
    );
  };

  // formContainer - Represents the wrapper around the HTML form
  const validateForm = form => {
    const errors = [];

    const formInputsToValidate = Array.from(form.elements).filter(
      formElement => {
        return formElement.type === "text" || formElement.type === "number";
      }
    );

    formInputsToValidate.forEach(input => {
      input.style.border = "1px solid #A9A9A9";
    });
    formInputsToValidate.forEach(textInput => {
      if (textInput.value.trim().length === 0) {
        errors.push(`${textInput.name} not specified`);

        textInput.style.border = "1px solid red";
      }
    });

    return errors;
  };

  document.addEventListener("click", e => {
    // My personal rule of thumb is "the nearest static container is where I want to listen." - snowmonkey

    if (
      e.target.getAttribute("id") === "new-project" ||
      e.target.classList.contains("new-project")
    ) {
      DOM.openForm("New project");
    } else if (e.target.classList.contains("edit-project")) {
      indexOfProjectBeingEdited = e.target.parentNode.parentNode.getAttribute(
        "data-project-index"
      );

      DOM.openForm("Edit project");
      DOM.populateProjectFormData(
        dataStorage.projects[
          parseInt(
            e.target.parentNode.parentNode.getAttribute("data-project-index")
          )
        ]
      );
    } else if (e.target.classList.contains("check-todo")) {
      const projectElementToCheck = e.target.parentNode.parentNode;

      const projectIndex = projectElementToCheck.getAttribute(
        "data-child-of-project-at-index"
      );
      const todoIndex = projectElementToCheck.getAttribute("data-todo-index");

      const todoToToggleCompleted =
        dataStorage.projects[projectIndex].todos[todoIndex];

      todoToToggleCompleted.completed = !todoToToggleCompleted.completed;
      DOM.renderProjects(dataStorage.projects);
      DOM.markSelectedProject(
        document.getElementsByClassName("project")[selectedProjectIndex]
      );
      DOM.renderTodosFromProject(
        dataStorage.projects[projectIndex],
        projectIndex
      );

      localStorage.setItem(
        "localStorageProjects",
        JSON.stringify(dataStorage.projects)
      );
    } else if (e.target.classList.contains("delete-project")) {
      const deletedProjectIndex = parseInt(
        e.target.parentNode.parentNode.getAttribute("data-project-index")
      );

      selectedProjectIndex = getSelectedProjectIndex();

      dataStorage.deleteProject(
        e.target.parentNode.parentNode.getAttribute("data-project-index")
      );

      if (dataStorage.projects.length !== 0) {
        // Retain the previously selected project, or select the last project after deletion of the last project
        if (deletedProjectIndex < selectedProjectIndex) {
          selectedProjectIndex--;
        } else if (selectedProjectIndex >= dataStorage.projects.length) {
          selectedProjectIndex--;
        }

        selectProject(
          document.getElementsByClassName("project")[selectedProjectIndex]
        );
        DOM.markSelectedProject(
          document.getElementsByClassName("project")[selectedProjectIndex]
        );
      } else {
        DOM.renderProjects(dataStorage.projects);
      }

      localStorage.setItem(
        "localStorageProjects",
        JSON.stringify(dataStorage.projects)
      );
    } else if (DOM.checkIfTargetWithinElement(e.target, ".project")) {
      selectProject(DOM.checkIfTargetWithinElement(e.target, ".project"));
    } else if (e.target.classList.contains("edit-todo")) {
      const todoElementToEdit = DOM.checkIfTargetWithinElement(
        e.target,
        ".todo"
      );

      projectIndexOfTodoBeingEdited = parseInt(
        todoElementToEdit.getAttribute("data-child-of-project-at-index")
      );
      editedTodoIndex = parseInt(
        todoElementToEdit.getAttribute("data-todo-index")
      );

      DOM.openForm("Edit todo");
      DOM.populateTodoFormData(
        dataStorage.getTodoObject(
          projectIndexOfTodoBeingEdited,
          editedTodoIndex
        )
      );
    } else if (e.target.classList.contains("delete-todo")) {
      const todoElementToDelete = DOM.checkIfTargetWithinElement(
        e.target,
        ".todo"
      );

      const projectIndexOfTodo = parseInt(
        todoElementToDelete.getAttribute("data-child-of-project-at-index")
      );
      const todoIndex = parseInt(
        todoElementToDelete.getAttribute("data-todo-index")
      );

      selectedProjectIndex = projectIndexOfTodo;

      dataStorage.deleteTodo(projectIndexOfTodo, todoIndex);

      DOM.renderProjects(dataStorage.projects);
      selectProject(
        document.getElementsByClassName("project")[selectedProjectIndex]
      );

      localStorage.setItem(
        "localStorageProjects",
        JSON.stringify(dataStorage.projects)
      );
    } else if (DOM.checkIfTargetWithinElement(e.target, ".todo")) {
      DOM.toggleTodoDetails(DOM.checkIfTargetWithinElement(e.target, ".todo"));
    }
  });

  window.addEventListener("load", () => {
    if (testingUI) return;
    // localStorage.removeItem("localStorageProjects")
    dataStorage.loadProjects();
    DOM.renderProjects(dataStorage.projects);
    if (dataStorage.projects.length > 0) {
      selectProject(document.querySelector(".project"));
    }
  });

  return { submitForm, newProjectButton };
})();

const testingUI = false;
