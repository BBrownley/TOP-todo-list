export default function todoForm(action) {

    return `
                <form action="#" id="todo-form" class="form" data-form-action="${action}">
                    <button class="close-form-button">Close</button>

                    <h2 id="todo-form-action-header">${action}</h2>

                    <label for="Title">Title: </label>
                    <input type="text" id="todoTitle" name="Title">

                    <label for="Description">Description: </label>
                    <input type="text" id="todoDescription" name="Description">

                    <label for="todoDueDate">Due Date: </label>
                    <input type="date" id="todoDueDate" name="todoDueDate">

                    <p>Priority:</p>
                    <div class="radio-buttons" id="priority-radio-buttons">
                        <input type="radio" id="veryLow" name="priority" value="Very Low">
                        <label for="veryLow">Very Low</label><br>

                        <input type="radio" id="low" name="priority" value="Low">
                        <label for="low">Low</label><br>

                        <input type="radio" id="normal" name="priority" value="Normal" checked>
                        <label for="normal">Normal</label><br>

                        <input type="radio" id="high" name="priority" value="High">
                        <label for="high">High</label><br>

                        <input type="radio" id="veryHigh" name="priority" value="Very High">
                        <label for="veryHigh">Very High</label><br>
                    </div>

                    <label for="Estimated time">Estimated Time (Minutes): </label>
                    <input type="number" id="todoEstimatedTime" name="Estimated time">

                    <div class="form-errors"></div>
                    
                    <input type="submit" value="${action}">
                </form>
                
            `
    }