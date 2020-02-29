// A Project is a seperated list of todos

class Project {

    constructor(projectName) {
        this.projectName = projectName;
        this.todos = [];
    }
    
    addTodo(todo) {
        this.todos.push(todo);
    }

};

export default Project;