import projectElement from "./projectElement";

import projectForm from './projectForm';
import todoForm from './todoForm';

const moment = require("moment");

const DOM = (() => {

    const renderProjects = projects => {
  
      let projectIndex = 0; // Assign each rendered project to a data-index so we can locate them later
  
      const projectContainer = document.querySelector(".sidebar .project-container");
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
  
      let todoIndex = 0; // Assign each rendered todo to a data attribute so we can locate them later
  
      todosContainer.innerHTML += `<button id="add-todo">+ Add todo</button>`;
  
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
                  <p class="todo-title ${todo.completed ? "crossed-off" : ""}">${todo.title}</p>
                  <span class="todo-duration">
                  
                  <i class="fa fa-clock-o" aria-hidden="true"></i> ${parseInt(todo.estimatedTime)} min, 
                  due ${moment(todo.dueDate, "YYYY-DD-MM").format("DD-MM-YYYY")}
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
  
    const resetTodosContainer = () => {
      document.querySelector(".todos-container").innerHTML = `
        <p class="no-project-notification">You have no projects - <span class="new-project">Click here</a> to make one.</span>
      `;
  
    };
  
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
  
        const formContainer = document.createElement("div");
        formContainer.classList.add("form-container");
  
        formContainer.innerHTML = projectForm(action);
        document.getElementById("app").appendChild(formContainer);
        
        document.querySelector('input[type="submit"]').addEventListener("click", e => {
  
          e.preventDefault();
          controller.submitForm(formContainer);
        });
  
        formContainer.addEventListener("mousedown", e => {
          if (e.target.classList.contains("form-container")) {
            DOM.closeForm()
          }
        });
  
      } else if (action === "Add todo" || action === "Edit todo") {
  
        const formContainer = document.createElement("div");
        formContainer.classList.add("form-container");
  
        formContainer.innerHTML = todoForm(action);
        document.getElementById("app").appendChild(formContainer);
        
        document.querySelector('input[type="submit"]').addEventListener("click", e => {
          e.preventDefault();
          controller.submitForm(formContainer);
        });
  
        formContainer.addEventListener("mousedown", e => {
          if (e.target.classList.contains("form-container")) {
            DOM.closeForm()
          }
        });
  
        if (action === "Add todo") {
          formContainer.querySelector("#todo-form").reset();
          document.getElementById("todoDueDate").value = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
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
      todoForm.elements["todoDueDate"].value = moment(todo.dueDate).format("YYYY-MM-DD");
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
      populateProjectFormData,
      resetTodosContainer
      
    };
  
  })();

export default DOM;