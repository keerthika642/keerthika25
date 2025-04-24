document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const taskInput = document.getElementById('newTaskInput');
    const addTaskButton = document.getElementById('addTaskBtn');
    const taskListElement = document.getElementById('stellarTaskList');
    const statusMessageElement = document.getElementById('statusMessage');

    // --- Unique Local Storage Key ---
    const STORAGE_KEY = 'stellarTaskAppStorage_v1_alpha';

    // --- State ---
    let taskOrbit = []; // Our array of tasks

    // --- Core Functions ---

    /**
     * Loads tasks from Local Storage into the taskOrbit array.
     */
    function loadTasksFromOrbit() {
        try {
            const storedTasks = localStorage.getItem(STORAGE_KEY);
            if (storedTasks) {
                taskOrbit = JSON.parse(storedTasks);
                 // Basic validation: ensure it's an array
                if (!Array.isArray(taskOrbit)) {
                    console.warn("Stored data is not an array. Resetting.");
                    taskOrbit = [];
                    persistTasksToOrbit(); // Clear invalid storage
                }
            } else {
                taskOrbit = []; // Initialize if nothing is stored
            }
        } catch (error) {
            console.error("Error parsing tasks from localStorage:", error);
            setStatusMessage("Error loading tasks. Storage might be corrupted.", true);
            taskOrbit = []; // Reset on error
        }
        renderTaskConstellation(); // Display the loaded tasks
    }

    /**
     * Saves the current taskOrbit array to Local Storage.
     */
    function persistTasksToOrbit() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(taskOrbit));
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
            setStatusMessage("Could not save tasks. Storage might be full or disabled.", true);
        }
    }

    /**
     * Renders the tasks from the taskOrbit array onto the page.
     */
    function renderTaskConstellation() {
        taskListElement.innerHTML = ''; // Clear existing list

        if (taskOrbit.length === 0) {
            setStatusMessage("No tasks yet. Add one above!");
            return; // No need to render if empty
        }

        setStatusMessage(""); // Clear status message if tasks exist

        taskOrbit.forEach((taskText, index) => {
            const listItem = document.createElement('li');

            // Task Text Span
            const textSpan = document.createElement('span');
            textSpan.textContent = taskText;
            textSpan.className = 'task-text';
            listItem.appendChild(textSpan);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.className = 'delete-btn';
            deleteButton.setAttribute('aria-label', `Remove task: ${taskText}`);
            deleteButton.addEventListener('click', () => {
                removeTaskFromOrbit(index);
            });
            listItem.appendChild(deleteButton);

            taskListElement.appendChild(listItem);
        });
    }

    /**
     * Adds a new task to the taskOrbit array.
     */
    function launchNewTask() {
        const newTaskText = taskInput.value.trim();

        if (newTaskText === '') {
            setStatusMessage("Cannot add an empty task.", true);
            taskInput.focus(); // Keep focus on input
            return; // Don't add empty tasks
        }

        taskOrbit.push(newTaskText);
        taskInput.value = ''; // Clear the input field
        setStatusMessage(`Task "${newTaskText.substring(0, 20)}..." added.`, false, 3000); // Temporary success message
        persistTasksToOrbit();
        renderTaskConstellation();
        taskInput.focus(); // Return focus for quick adding
    }

    /**
     * Removes a task from the taskOrbit array by its index.
     * @param {number} index - The index of the task to remove.
     */
    function removeTaskFromOrbit(index) {
        if (index >= 0 && index < taskOrbit.length) {
            const removedTaskText = taskOrbit[index];
            taskOrbit.splice(index, 1); // Remove the item
            persistTasksToOrbit();
            renderTaskConstellation();
            setStatusMessage(`Task "${removedTaskText.substring(0, 20)}..." removed.`, false, 3000); // Temporary confirmation
        } else {
            console.warn("Attempted to remove task with invalid index:", index);
            setStatusMessage("Error removing task.", true);
        }
    }

    /**
     * Sets a message in the status area.
     * @param {string} message - The text to display.
     * @param {boolean} [isError=false] - If true, styles as an error.
     * @param {number|null} [timeout=null] - If set, clears message after timeout (ms).
     */
    function setStatusMessage(message, isError = false, timeout = null) {
        statusMessageElement.textContent = message;
        statusMessageElement.style.color = isError ? '#e74c3c' : '#7f8c8d';

        // Clear previous timeout if one exists
        if (statusMessageElement.timerId) {
            clearTimeout(statusMessageElement.timerId);
        }

        if (timeout !== null) {
            statusMessageElement.timerId = setTimeout(() => {
                // Only clear if the current message is the one we set
                if (statusMessageElement.textContent === message) {
                     statusMessageElement.textContent = '';
                }
               statusMessageElement.timerId = null;
            }, timeout);
        }
    }


    // --- Event Listeners ---
    addTaskButton.addEventListener('click', launchNewTask);

    taskInput.addEventListener('keypress', (event) => {
        // Add task on Enter key press
        if (event.key === 'Enter') {
            launchNewTask();
        }
    });

    // --- Initial Load ---
    loadTasksFromOrbit();
});