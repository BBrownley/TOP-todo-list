import Project from "../classes/Project";
import DOM from "./DOM";

const appData = (() => {

    let projects = [];
  
    const getProjects = () => {
      return projects;
    }
  
    const loadProjects = () => {
      if (localStorage.getItem("localStorageProjects") === null) {
  
        const project1 = new Project("My first project", []);
        project1.addTodo(new Todo("Do homework", "Here is an example description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit recusandae animi corporis minus, est voluptatum vitae et, voluptatibus consequatur suscipit distinctio mollitia voluptatem ut sint dolorum iure tenetur nulla. Maxime, maiores rem quod nam minus doloremque soluta natus numquam velit!", "", "Low", "3"))
        project1.addTodo(new Todo("Wash the dishes", "", "", "Very Low", "20"))
        project1.addTodo(new Todo("Busy work", "", "", "Very High", "60"))
  
        projects.push(project1);
  
        const project2 = new Project("Another project", []);
        project2.addTodo(new Todo("Take out trash", "", "", "Normal", "30"))
        project2.addTodo(new Todo("Work out", "", "", "High", "2"))
  
        projects.push(project2);
  
        const project3 = new Project("Anotha one", []);
        project3.addTodo(new Todo("Task 1", "", "", "Normal", "30"))
        project3.addTodo(new Todo("Task 2", "", "", "High", "2"))
  
        projects.push(project3);
      } else {
  
        let storedProjects = JSON.parse(localStorage.getItem("localStorageProjects"));
  
        storedProjects = storedProjects.map(savedProject => {
  
          let projectProperties = [];
  
          for (let key in savedProject) {
            projectProperties.push(savedProject[key]);
          }
  
          return new Project(...projectProperties);
        })
  
        // Retain reference to original projects array, insert stored projects into it
        projects.length = 0;
  
        projects.push(...storedProjects);
        
      }
  
    }
  
    const addProject = project => projects.push(project);
  
    const deleteTodo = (projectIndex, todoIndex) => {
  
      projects[projectIndex].deleteTodo(todoIndex);
  
      DOM.renderTodosFromProject(projects[projectIndex], projectIndex);
    }
  
    const deleteProject = projectIndex => {
      projects.splice(projectIndex, 1);
      DOM.renderProjects(projects);
    }
  
    const getTodoObject = (projectIndex, todoIndex) => {
      return projects[projectIndex].todos[todoIndex];
    }
  
    return {projects, addProject, deleteTodo, getTodoObject, deleteProject, loadProjects, getProjects};
  
})();

export default appData;