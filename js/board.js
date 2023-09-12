/* =============================================================================== VARIABLES =================================================================== */
let allTasks = [];
let userChar = [];
let allUsers = [];
let currentDraggedElement;
let subtasks = [];
let priorityValueEdit;
let usersTaskEdit = [];
let startWithLetter = [];
let numerator;
let denominator;
let progress;

/* ============================================================================ BOARD FUNCTIONS ======================================================================== */
function updateHTML() {
    if(tasks.length > 0) {
        for (let index = 0; index < tasks.length; index++) {
            filterToDo();
            filterInProgress();
            filterAwaitingFeedback();
            filterDone();

            let taskId = tasks[index]['taskId'];
            let subtasksProgress;
            calculateProgressbar(index, subtasksProgress, numerator, denominator);
            generateProgressbarHtml(index, taskId, progress, numerator, denominator);
        }

        /* for (let i = 0; i < tasks.length; i++) {
            let taskId = tasks[i]['taskId'];
            let subtasksProgress;

            calculateProgressbar(i, subtasksProgress, numerator, denominator);
            generateProgressbarHtml(i, taskId, progress, numerator, denominator);
        } */
        createBubbles();
    } else {
        checkForEmptyCategories();
    }
}

function filterToDo() {
    let toDo = tasks.filter(t => t["statusCategory"] == "toDo");
    document.getElementById("toDo").innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        let element = toDo[i]; 
        document.getElementById("toDo").innerHTML += generateToDoHTMLToDo(element, 'toDo');
    }
}

function filterInProgress() {
    let inProgress = tasks.filter(t => t["statusCategory"] == "inProgress");
    document.getElementById("inProgress").innerHTML = ``;
    for (let i = 0; i < inProgress.length; i++) {
        let element = inProgress[i];
        document.getElementById("inProgress").innerHTML += generateToDoHTML(element, 'inProgress');
    }
}

function filterAwaitingFeedback() {
    let awaitingFeedback = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
    document.getElementById("awaitingFeedback").innerHTML = ``;
    for (let i = 0; i < awaitingFeedback.length; i++) {
        let element = awaitingFeedback[i];
        document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element, 'awaitingFeedback');
    }
}

function filterDone() {
    let done = tasks.filter(t => t["statusCategory"] == "done");
    document.getElementById("done").innerHTML = ``;
    for (let i = 0; i < done.length; i++) {
        let element = done[i];
        document.getElementById("done").innerHTML += generateToDoHTMLDone(element, 'done');
    }
}

function calculateProgressbar(i) {
    subtasksProgress = tasks[i]['subtasks'];
    numerator = 0;
    denominator = tasks[i]['subtasks'].length;

    for (let j = 0; j < subtasksProgress.length; j++) {
        let subtask = tasks[i]['subtasks'][j]['status'];

        if(!subtask.includes('undone')) {
            numerator++;
        }
    }
    progress = numerator / denominator;
    progress = progress * 100;
}

function generateProgressbarHtml(i, taskId, progress, numerator, denominator) {
    if(tasks[i]['subtasks'].length == 0) {

    } else if(tasks[i]['subtasks'].length === 1) {
        document.getElementById(`boardContainerProgress(${taskId})`).innerHTML = progressbarTaskTemplate(progress, numerator, denominator);
    } else {
        document.getElementById(`boardContainerProgress(${taskId})`).innerHTML = progressbarTasksTemplate(progress, numerator, denominator);
    }
}

function createBubbles() {
    for (let j = 0; j < tasks.length; j++) {
        let bubbleTaskId = tasks[j]["taskId"];

        if (tasks[j]["assignTo"].length <= 3) {
            bubblesLessThanThree(j, bubbleTaskId);

        } else if (tasks[j]["assignTo"].length > 3) {
            bubblesMoreThanThree(j, bubbleTaskId);
            getRemainingCount(j, bubbleTaskId);
        }
    }
}

function bubblesLessThanThree(j, bubbleTaskId) {
    for (let i = 0; i < tasks[j]["assignTo"].length; i++) {
        let assignedUsers = tasks[j]['assignTo'];
        let name = getFirstLetter(assignedUsers, i);

        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
            <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>`;

        let userBubble = document.getElementById(`userBubbleOne${[j]}${[i]}`);
        userBubble.style.backgroundColor = getUserColor(assignedUsers, i);
    }
}

function bubblesMoreThanThree(j, bubbleTaskId) {
    for (let i = 0; i < 2; i++) {
        let assignedUsers = tasks[j]['assignTo'];
        let name = getFirstLetter(assignedUsers, i);

        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
            <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>`;

        let userBubble = document.getElementById(`userBubbleOne${[j]}${[i]}`);
        userBubble.style.backgroundColor = getUserColor(assignedUsers, i);
    }
}

function getFirstLetter(assignedUsers, i) {
    let assignedUser = assignedUsers[i];
    let existingUser = users.find(u => u.userid == parseInt(assignedUser));
    let correctUser = users.indexOf(existingUser);
    let assignName = users[correctUser]['name'];
    assignName.toUpperCase();
    let assignSurname = users[correctUser]['surname'];
    assignSurname.toUpperCase();
    let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
    return assignFirstLetters;
}

function getUserColor(assignedUsers, i) {
    let assignedUser = assignedUsers[i];
    let existingUser = users.find(u => u.userid == parseInt(assignedUser));
    let correctUser = users.indexOf(existingUser);
    let assignColor = users[correctUser]['userColor'];
    return assignColor;
}

function getRemainingCount(j, bubbleTaskId) {
    let remainingCount = tasks[j]["assignTo"].length - 2;
    document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
        <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
        `;
    let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
    userBubbleOne.style.backgroundColor = "black";
}

function generateRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function checkForEmptyCategories() {
    let toDoCategory = document.getElementById('toDo');
    let inProgressCategory = document.getElementById('inProgress');
    let awaitingFeedbackCategory = document.getElementById('awaitingFeedback');
    let doneCategory = document.getElementById('done');

    if(toDoCategory.innerHTML == ""){
        toDoCategory.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks to do</div>
            </div>
        `;
    } 

    if(inProgressCategory.innerHTML == ""){
        inProgressCategory.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks in progress</div>
            </div>
        `;
    } 
    
    if(awaitingFeedbackCategory.innerHTML == ""){
        awaitingFeedbackCategory.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks awaiting feedback</div>
            </div>
        `;
    } 

    if(doneCategory.innerHTML == ""){
        doneCategory.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks done</div>
            </div>
        `;
    } 
}

/* ============================================================================ DRAG & DROP ======================================================================== */

//Source: www.w3schools.com/html/html5_draganddrop.asp
function startDragging(id) {
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
}

function moveTo(statusCategory) {
    tasks[currentDraggedElement]["statusCategory"] = statusCategory;
    saveTasks();
    updateHTML();
}

function highlight(id) {
    if(document.getElementById(id) !== id)
    document.getElementById(id).classList.add('dragAreahighlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragAreahighlight');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function doNotOpenTask(event) {
    event.stopPropagation();
}

/* ======================================================================= TASK FUNCTIONS ================================================================================= */
async function pushToPreviousCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.taskId == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'done') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback';
        await saveTasks();
        updateHTML();
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'inProgress'; 
        await saveTasks();
        updateHTML();
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'toDo';
        await saveTasks();
        updateHTML();
    } 
}

async function pushToNextCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.taskId == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'toDo') {
        tasks[currentTask]['statusCategory'] = 'inProgress';
        await saveTasks();
        updateHTML();
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback'; 
        await saveTasks();
        updateHTML();
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'done';
        await saveTasks();
        updateHTML();
    }
}

function openTask(currentTaskId) {
    document.getElementById('openTaskBackground').style.display = 'flex';
    let existingTask = tasks.find(u => u.taskId == currentTaskId)
    let currentTask = tasks.indexOf(existingTask);
    let openTaskContainer = document.getElementById('openTaskContainer');
    openTaskContainer.innerHTML = '';
    openTaskContainer.innerHTML = openTaskTemplate(currentTask);
    renderSubtasks(currentTask);
    renderAssignedUsers(currentTask);
    prioritySymbol(currentTask);
}

async function deleteTask(currentTask) {
    tasks.splice(currentTask, 1);
    await saveTasks();
    await init();
    updateHTML();
    document.getElementById('openTaskBackground').style.display = 'none';
}

function renderSubtasks(currentTask){
    let userSubtasks = tasks[currentTask]['subtasks'];
    for (let j = 0; j < userSubtasks.length; j++) {
        let subtask = userSubtasks[j]['subtaskName'];
        let subtaskStatus = userSubtasks[j]['status'];

        if(subtaskStatus == 'undone') {
            document.getElementById('subtaskContainer').innerHTML += renderSubtasksUndoneTemplate(subtask);
        } else {
            document.getElementById('subtaskContainer').innerHTML += renderSubtasksTemplate(subtask);
        }
    }
}

function renderAssignedUsers(currentTask) {
    let assignedUsers = tasks[currentTask]['assignTo'];

    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUser = assignedUsers[i];
        let existingAssignUser = users.find(u => u.userid == assignedUser)
        let currentAssignUser = users.indexOf(existingAssignUser);

        let assignName = users[currentAssignUser]['name'];
        let assignSurname = users[currentAssignUser]['surname'];
        let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
        let assignColor = users[currentAssignUser]['userColor'];

        document.getElementById('assignedToContainer').innerHTML += renderAssignedUserTemplate(assignColor, assignFirstLetters, assignName, assignSurname);
    }
}

function prioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priorityOpenTask = document.getElementById('priorityOpenTask');

    if (currentPriority == 'urgent') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="../img/urgent.svg">`;
    } else if (currentPriority == 'medium') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="../img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="../img/low.svg">`;
    }
}

function editTask(currentTask) {
    document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask);

    let titleEdit = document.getElementById('titleEdit');
    titleEdit.value = tasks[currentTask]['title'];
    let descriptionEdit = document.getElementById('descriptionEdit');
    descriptionEdit.value = tasks[currentTask]['description'];
    document.getElementById('editSelectCategory').value = tasks[currentTask]['category'];

    usersTaskEdit = [];
    let assignedUsersToCurrentTask = tasks[currentTask]['assignTo'];
    for (let i = 0; i < assignedUsersToCurrentTask.length; i++) {
        let assignedUser = assignedUsersToCurrentTask[i];
        usersTaskEdit.push(assignedUser);
    }
    renderUrgency(currentTask);
    renderSubtasksEdit(currentTask);
    renderAssignedUsersEdit(currentTask);
}

function renderUrgency(currentTask) {
    if (tasks[currentTask]['priorityValue'] == 'urgent') {
        selectUrgentEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'medium') {
        selectMediumEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'low') {
        selectLowEdit();
    }

    priorityValueEdit = tasks[currentTask]['priorityValue'];
}

function renderSubtasksEdit(currentTask){
    let userSubtasks = tasks[currentTask]['subtasks'];
    for (let j = 0; j < userSubtasks.length; j++) {

        let subtaskIndex = j;
        let subtask = userSubtasks[j]['subtaskName'];
        let subtaskStatus = userSubtasks[j]['status'];
        if (!subtaskStatus.includes('undone')) {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditUndoneTemplate(subtaskIndex, currentTask, subtask);
        } else {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditTemplate(subtaskIndex, currentTask, subtask);
        }
    }
};

async function saveCompletedTasks(subtaskIndex, currentTask) {
    let currentSubtask = document.getElementById('subtask' + subtaskIndex);
    if(!currentSubtask.checked == true) {
        tasks[currentTask]['subtasks'][subtaskIndex]['status'] = 'undone';
    } 

    if(currentSubtask.checked == true) {
        tasks[currentTask]['subtasks'][subtaskIndex]['status'] = 'done';
    } 
};

function renderAssignedUsersEdit(currentTask) {
    let assignedUsers = tasks[currentTask]['assignTo'];

    for (let j = 0; j < users.length; j++) {
        let userid = users[j]['userid'];
        let assignName = users[j]['name'];
        let assignSurname = users[j]['surname'];
        let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);

        if (assignedUsers.includes(userid.toString())) {
            document.getElementById('assignedToContainerEdit').innerHTML += assignedUserEditCheckedTemplate(j, assignFirstLetters);
        } else {
            document.getElementById('assignedToContainerEdit').innerHTML += assignedUserEditTemplate(j, assignFirstLetters);
        }
    }
}

function saveSelectedUsersEdit() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!usersTaskEdit.includes(selectedValue)) { // Check for duplicates
                    usersTaskEdit.push(selectedValue);
                }
            } else {
                const index = usersTaskEdit.indexOf(selectedValue);
                if (index > -1) {
                    usersTaskEdit.splice(index, 1);
                }
            }
            //console.log(usersTaskEdit); // Print the selected values to the console
        });
    });
}

async function saveEditedTask(currentTask) {
    let editCategory = document.getElementById('editSelectCategory').value;
    tasks[currentTask]['category'] = editCategory;
    //tasks[currentTask]['categoryColor'] = addBackgroundColorCategory(editCategory);
    tasks[currentTask]['title'] = document.getElementById('titleEdit').value;
    tasks[currentTask]['description'] = document.getElementById('descriptionEdit').value;
    tasks[currentTask]['dueDate'] = document.getElementById('editDueDate').value;
    tasks[currentTask]['priorityValue'] = priorityValueEdit;
    tasks[currentTask]['assignTo'] = usersTaskEdit;
    await saveTasks();
    updateHTML();
    usersTaskEdit = [];
    document.getElementById('openTaskBackground').style.display = 'none';
}

function savePriorityValueEdit(priority, currentTask) {
    priorityValueEdit = priority;
}

function closeTask(priority, currentTask) {
    savePriorityValueEdit(priority, currentTask);
    document.getElementById('openTaskBackground').style.display = 'none';
}


function searchFunction() {
    let originalToDos = tasks;
    let input = document.getElementById('searchValue');

    input.addEventListener('input', debounce(function (event) {
        let selectedValue = event.target.value.toLowerCase().trim();

        let newArray;
        if (selectedValue === '') {
            newArray = [...originalToDos];
            tasks = originalToDos;
        } else {
            newArray = tasks.filter(item => {
                if (item.description.toLowerCase().includes(selectedValue) || item.title.toLowerCase().includes(selectedValue) || item.category.toLowerCase().includes(selectedValue)) {
                    return item;
                }
            });
            if (newArray.length === 0 || selectedValue.length > 0) {
                newArray = originalToDos.filter(item => {
                    if (item.description.toLowerCase().includes(selectedValue) || item.title.toLowerCase().includes(selectedValue) || item.category.toLowerCase().includes(selectedValue)) {
                        return item;
                    }
                });
            }
        }
        tasks = newArray;
        updateHTML();
        if (tasks.length > 0) {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "block";
            });
        } else {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "none";
            });
        }
    }, 200));

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            input.dispatchEvent(new Event('input'));
        }
    });
}

