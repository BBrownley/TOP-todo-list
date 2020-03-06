const projectForm = action => {

return `
            <form action="#" id="project-form" class="form" data-form-action="${action}">
                <!-- <button class="close-form-button">Close</button> -->
                <h2 id="project-form-action-header">${action}</h2>
                <label for="Project name">Project name: </label>
                <input type="text" id="projectName" name="Project name">

                <div class="form-errors"></div>
                <input type="submit" value="${action}">

            </form>
            <div class="form-errors"></div>
        `
}

export default projectForm;