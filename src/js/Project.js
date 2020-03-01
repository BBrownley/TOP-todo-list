// A Project is a seperated list of todos

class Project {

    constructor(projectName) {
        this.projectName = projectName;
        this.todos = [];
    }
    
    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(todoIndex) {
        this.todos.splice(todoIndex, 1);
    }

};

export default Project;