document.addEventListener('DOMContentLoaded', async () => {
    const taskList = document.getElementById('taskList');
    const taskTemplate = Handlebars.compile(document.getElementById('task-template').innerHTML);

    async function displayTasks() {
        try {
            const response = await fetch('/api/tasks');
            console.log('Response from server:', response);
    
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
    
            const tasks = await response.json();
            console.log('Tasks received:', tasks);
    
            taskList.innerHTML = taskTemplate({ tasks });
    
            const updateButtons = document.querySelectorAll('.update-status');
            updateButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const taskId = event.target.parentElement.dataset.taskId;
                    const newStatus = event.target.previousElementSibling.value;
                    await updateStatus(taskId, newStatus);
                });
            });
        } catch (error) {
            console.error('Error fetching or displaying tasks:', error);
        }
    }
    

    async function updateStatus(taskId, newStatus) {
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            displayTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    const addTaskForm = document.getElementById('addTaskForm');

    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addTaskForm);
        // const title = formData.get('title');
        // const description = formData.get('description');
        const taskData = {};
        formData.forEach((value, key) => {
            taskData[key] = value;
        });

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
            addTaskModal.hide();

            displayTasks();
        } catch (error) {
            console.error(error);

        }
    });

    

    displayTasks();
});
