/* ============================================= VARIABLES ========================================= */
let allTasks = [];
let toDos = [];
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

/* ========================================= BOARD FUNCTIONS ========================================= */
function updateHTML() {
    if (tasks.length > 0) {
        for (let index = 0; index < tasks.length; index++) {
            let taskId = tasks[index]["taskId"];

            let toDo = tasks.filter(t => t["statusCategory"] == "toDo");
            document.getElementById("toDoCard").innerHTML = ``;
            for (let i = 0; i < toDo.length; i++) {
                let element = toDo[i]; 
                document.getElementById("toDoCard").innerHTML += generateToDoHTMLToDo(element, index, 'toDo');
            }

            let inProgress = tasks.filter(t => t["statusCategory"] == "inProgress");
            document.getElementById("inProgress").innerHTML = ``;
            for (let i = 0; i < inProgress.length; i++) {
                let element = inProgress[i];
                document.getElementById("inProgress").innerHTML += generateToDoHTML(element, index, 'inProgress');
            }

            let awaitingFeedback = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
            document.getElementById("awaitingFeedback").innerHTML = ``;
            for (let i = 0; i < awaitingFeedback.length; i++) {
                let element = awaitingFeedback[i];
                document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element, index, 'awaitingFeedback');
            }

            let done = tasks.filter(t => t["statusCategory"] == "done");
            document.getElementById("done").innerHTML = ``;
            for (let i = 0; i < done.length; i++) {
                let element = done[i];
                document.getElementById("done").innerHTML += generateToDoHTMLDone(element, index, 'done');
            }
        }
        for (let i = 0; i < tasks.length; i++) {
            let taskId = tasks[i]['taskId'];
            let subtasksProgress;

            calculateProgressbar(i, subtasksProgress, numerator, denominator);
            generateProgressbarHtml(i, taskId, progress, numerator, denominator);
        }
        createBubbles();
    }
}

function pushArrayToDo() {
    toDos = tasks;
}

function generateToDoHTMLToDo(element, index, currentStatusCategory) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["taskId"]})" onclick="openTask(${element["taskId"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${element["categoryColor"]}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                     <div id="pushToNextCategory${element["taskId"]}" onclick="pushToNextCategory('${currentStatusCategory}', ${element["taskId"]})">
                        <img src="./img/next.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["taskId"]})" class="boardContainerProgress" onclick="openTask(${element["taskId"]})" >
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["taskId"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

function generateToDoHTML(element, index, currentStatusCategory) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["taskId"]})" onclick="openTask(${element["taskId"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${element["categoryColor"]}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                    <div id="pushToPreviousCategory${element["taskId"]}" onclick="pushToPreviousCategory('${currentStatusCategory}', ${element["taskId"]})">
                        <img src="./img/previous.svg">
                    </div>
                    <div id="pushToNextCategory${element["taskId"]}" onclick="pushToNextCategory('${currentStatusCategory}', ${element["taskId"]})">
                        <img src="./img/next.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["taskId"]})" class="boardContainerProgress" onclick="openTask(${element["taskId"]})" >
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["taskId"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

function generateToDoHTMLDone(element, index, currentStatusCategory) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["taskId"]})" onclick="openTask(${element["taskId"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${element["categoryColor"]}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                    <div id="pushToPreviousCategory${element["taskId"]}" onclick="pushToPreviousCategory('${currentStatusCategory}', ${element["taskId"]})">
                        <img src="./img/previous.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["taskId"]})" class="boardContainerProgress" onclick="openTask(${element["taskId"]})" >
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["taskId"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
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
        if(tasks[i]['subtasks'].length === 0) {
            document.getElementById(`boardContainerProgress(${taskId})`).innerHTML = `
            <div class="noSubtasks">No subtasks</div>
        `;
        } else {
            document.getElementById(`boardContainerProgress(${taskId})`).innerHTML = `
            <div class="progress">
                <div class="progressBar" style="width: ${progress}%";>
                </div>
            </div>
            <div class="progressInNumbers">
                ${numerator} / ${denominator} Done
            </div>
            `;
        }
}

function getFirstLetter(index, i) {
    if (i < tasks[index]["assignTo"].length) {
        let y = tasks[index]["assignTo"][i];
        let x = users.filter(obj => {
            if (obj.userid == y) {
                return obj.name;
            }
        });
        let x1 = users.filter(obj => {
            if (obj.userid == y) {
                return obj.surname;
            }
        });
        x = x[0]["name"].split(' ').map(word => word.charAt(0)).join('');
        x1 = x1[0]["surname"].split(' ').map(word => word.charAt(0)).join('');
        let xx1 = x.toUpperCase() + x1.toUpperCase();
        return xx1;
    }
}

function createBubbles() {
    for (let j = 0; j < tasks.length; j++) {
        let bubbleTaskId = tasks[j]["taskId"];

        if (tasks[j]["assignTo"].length < 3) {
            for (let i = 0; i < tasks[j]["assignTo"].length; i++) {
                let name = getFirstLetter(j, i);
                document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);

                let currentUserId = tasks[j]['assignTo'][i];
                let existingUser = users.find(u => u.userid == parseInt(currentUserId));
                let correctUser = users.indexOf(existingUser);
                let correctUserBg = users[correctUser]['userColor']
                userBubbleOne.style.backgroundColor = correctUserBg;
            }
        }
        else if (tasks[j]["assignTo"].length >= 3) {
            for (let i = 0; i < 2; i++) {
                let name = getFirstLetter(j, i);
                document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);

                let currentUserId = tasks[j]['assignTo'][i];
                let existingUser = users.find(u => u.userid == parseInt(currentUserId));
                let correctUser = users.indexOf(existingUser);
                let correctUserBg = users[correctUser]['userColor']
                userBubbleOne.style.backgroundColor = correctUserBg;
            }

            let remainingCount = tasks[j]["assignTo"].length - 2;
            document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
                `;
            let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
            userBubbleOne.style.backgroundColor = "black";

        }
    }
}

function changeColorBubble() {
    let colors = [];
    let numColors = 42;
    for (let i = 0; i < numColors; i++) {
        colors.push(generateRandomColor());
    }
    let randomColor = Math.floor(Math.random() * colors.length);
    return colors[randomColor];
}

function generateRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

//Source: www.w3schools.com/html/html5_draganddrop.asp
function startDragging(id) {
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
}

function moveTo(statusCategory) {
    tasks[currentDraggedElement]["statusCategory"] = statusCategory;
    updateTasks();
    updateHTML();
}

async function updateTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function doNotOpenTask(event) {
    event.stopPropagation();
}

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

function openTaskTemplate(currentTask, categoryColor) {
    return `
        <div id="openTask" class="openTask">
            <div class="openTaskTop">
                <div style="background-color: ${tasks[currentTask]['categoryColor']};">
                    <p>${tasks[currentTask]['category']}</p>
                </div>
                <div onclick="closeTask()">
                    <img src="../img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                 <h1>${tasks[currentTask]['title']}</h1>
                 <p>${tasks[currentTask]['description']}</p>
                 <div class="openTaskDate">
                    <div>Due date:</div>
                    <div>${tasks[currentTask]['dueDate']}</div>
                </div>

                <div class="openTaskPriority">
                    <div>Priority:</div>
                    <div>
                        <div>
                            <button class="prioButton2" id="priority">
                                <span>${tasks[currentTask]['priorityValue']}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="openTaskMain">
                <div class="openTaskSubtask">
                    <div>Subtasks:</div>
                    <div id="subtaskContainer" class="boardSubtaskContainer">

                    </div>                
                </div>

                <div class="openTaskAssigned">
                     <div>Assigned To:</div>
                     <div id="assignedToContainer" class="assignedToContainer">

                    </div>                
                </div>
            </div>
        </div>

        <div class="openTaskButtonContainer">
            <div class="deleteTaskButton" onclick="deleteTask(${currentTask})">
                <img src="./img/deleteTask.svg">
            </div>
            <div class="openTaskEditButton" onclick="editTask(${currentTask})">
                <img src="./img/editWhite.svg">
            </div>
        </div>
     `;
}

function deleteTask(currentTask) {
    tasks.splice(currentTask, 1);
    updateTasks();
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
};

function renderSubtasksUndoneTemplate(subtask){
    return `
        <div class="openSubtask">
            <input type="checkbox" disabled>
            <div>${subtask}</div>
        </div>
    `;
}

function renderSubtasksTemplate(subtask) {
    return `
        <div class="openSubtask">
            <div class="coverCheckbox" style="z-index: 2";></div>
            <input type="checkbox" checked style="z-index: 0";>
            <div>${subtask}</div>
        </div>
    `;
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

function renderAssignedUserTemplate(assignColor, assignFirstLetters, assignName, assignSurname){
    return `
        <div class="openTaskAssignedPerson">
            <div style="background-color: ${assignColor};">
                <span>${assignFirstLetters.toUpperCase()}</span>
            </div>
            <div>${assignName} ${assignSurname}</div>
        </div>
    `;
}

function prioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priority = document.getElementById('priority');

    if (currentPriority == 'urgent') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/urgent.svg">`;
    } else if (currentPriority == 'medium') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/low.svg">`;
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

function editOpenTaskTemplate(currentTask) {
    return `
        <div id="openTask${currentTask}" class="openTask">
            <div class="openTaskTop">
                <div class="selectCategoryContainer" style="background-color: ${tasks[currentTask]['categoryColor']};">
                    <select class="selectCategory" name="category" id="editSelectCategory">
                        <option value="Marketing" style="background-color: #0038ff;">Marketing</option>
                        <option value="Media" style="background-color: #ffc702;">Media</option>
                        <option value="Backoffice" style="background-color: #1FD7C1;">Backoffice</option>
                        <option value="Design" style="background-color: #ff7a00;">Design</option>
                        <option value="Sales" style="background-color: #fc71ff;">Sales</option>
                    </select>
                    <img class="selectArrow" src="./img/arrowDown.png">
                </div>

                <div onclick="closeTask()">
                    <img src="../img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                <input placeholder="${tasks[currentTask]['title']}" class="titleEdit" id="titleEdit" required="">
                <input placeholder="${tasks[currentTask]['description']}" class="descriptionEdit" id="descriptionEdit" required="">
            </div>

            <div class="openTaskMain">

                <div class="openTaskDate openTaskDateEdit">
                    <div>Due date:</div>
                    <input class="date" type="date" class="editDueDate" id="editDueDate" value="${tasks[currentTask]['dueDate']}">
                </div>

                <div class="openTaskPriority openTaskPriorityEdit">
                    <div>Priority:</div>
                    <div>
                        <div class="prioButtons prioButtonsEdit">
                            <button class="urgent prioButtonEdit" id="urgentEdit" type="button" onclick="selectUrgentEdit(), savePriorityValueEdit('urgent', ${currentTask})">
                                <div>Urgent</div>
                                <img id="imgUrgentEdit" src="./img/urgent.svg">
                            </button>
                            <button class="medium prioButtonEdit" id="mediumEdit" type="button" onclick="selectMediumEdit(), savePriorityValueEdit('medium', ${currentTask})">
                                <div>Medium</div>
                                <img id="imgMediumEdit" src="./img/medium.svg">
                            </button>
                            <button class="low prioButtonEdit" id="lowEdit" type="button" onclick="selectLowEdit(), savePriorityValueEdit('low', ${currentTask})">
                                <div>Low</div>
                                <img id="imgLowEdit" src="./img/low.svg">
                            </button>
                        </div>
                    </div>
                </div>

                <div class="openTaskSubtask">
                    <div>Subtasks:</div>
                    <div id="subtaskContainerEdit" class="boardSubtaskContainer">

                    </div>                
                </div>

                <div class="openTaskAssigned">
                    <div>Assigned To:</div>
                    <div id="assignedToContainerEdit" class="assignedToContainer">

                    </div>                
                </div>
            </div>
        </div>

        <div class="openTaskButtonContainer">
            <div class="cancleTaskEditButton" onclick="closeTask()">
                Cancle
            </div>
            <div class="saveChangesTask" onclick="saveEditedTask(${currentTask})">
                Save
            </div>

        </div>
    `;
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

function subtasksEditUndoneTemplate(subtaskIndex, currentTask, subtask) {
    return `
        <div class="openSubtask" onclick="saveCompletedTasks(${subtaskIndex}, ${currentTask})">
            <input id="subtask${subtaskIndex}" type="checkbox" value="${subtaskIndex}" checked>
            <div>${subtask}</div>
        </div>
    `;
}

function subtasksEditTemplate(subtaskIndex, currentTask, subtask) {
    return `
        <div class="openSubtask" onclick="saveCompletedTasks(${subtaskIndex}, ${currentTask})">
            <input id="subtask${subtaskIndex}" type="checkbox" value="${subtaskIndex}">
            <div>${subtask}</div>
        </div>
    `;
}

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

function assignedUserEditCheckedTemplate(j, assignFirstLetters) {
    return `
        <div class="openTaskAssignedPerson" onclick="saveSelectedUsersEdit()">
            <input type="checkbox" value="${users[j]['userid']}" checked>
            <div style="background-color: ${users[j]['userColor']};">
                <span>${assignFirstLetters}</span>
            </div>
            <div>${users[j]['name']} ${users[j]['surname']}</div>
        </div>
    `;
}

function assignedUserEditTemplate(j, assignFirstLetters) {
    return `
        <div class="openTaskAssignedPerson" onclick="saveSelectedUsersEdit()">
            <input type="checkbox" value="${users[j]['userid']}">
            <div style="background-color: ${users[j]['userColor']};">
                <span>${assignFirstLetters}</span>
            </div>
            <div>${users[j]['name']} ${users[j]['surname']}</div>
        </div>
    `;
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
    tasks[currentTask]['categoryColor'] = addBackgroundColorCategory(editCategory);
    tasks[currentTask]['title'] = document.getElementById('titleEdit').value;
    tasks[currentTask]['description'] = document.getElementById('descriptionEdit').value;
    tasks[currentTask]['dueDate'] = document.getElementById('editDueDate').value;
    tasks[currentTask]['priorityValue'] = priorityValueEdit;
    tasks[currentTask]['assignTo'] = usersTaskEdit;
    await updateTasks();
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

