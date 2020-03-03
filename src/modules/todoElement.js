const moment = require("moment");

export default function createTodoElement(todo, todoIndex, projectIndex) {

    return `
    
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

}