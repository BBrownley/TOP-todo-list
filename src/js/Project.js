// A Project is a seperated list of todos

class Project {

    constructor(projectName, todos) {
        this.projectName = projectName;
        this.todos = todos;
    }
    
    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(todoIndex) {
        this.todos.splice(todoIndex, 1);
    }

};

export default Project;