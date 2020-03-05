export default function projectElement(project) {
    return `
        <p>${project.projectName} (${(project.todos.filter(todo => todo.completed === false)).length}/${project.todos.length})</p>
        <div class="project-options">
            <i class="fa fa-pencil-square-o edit-project" aria-hidden="true"></i>
            <i class="fa fa-trash-o delete-project" aria-hidden="true"></i></button>
        </div>
    `
}