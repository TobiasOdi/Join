/* ========================================================== BOARD TASKS TEMPLATE ========================================= */
/**
 * This function returns the template for the tasks in the "todo" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} currentStatusCategory - The current category in which the task is.
 * @returns 
 */
function generateToDoHTMLToDo(element, currentStatusCategory) {
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
                    <img class="priorityImg" src="../img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template for the tasks in the "inProgress" and "awaitingFeedback" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} currentStatusCategory - The current category in which the task is.
 * @returns 
 */
function generateToDoHTML(element, currentStatusCategory) {
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
                    <img class="priorityImg" src="../img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template for the tasks in the "done" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} currentStatusCategory - The current category in which the task is.
 * @returns 
 */
function generateToDoHTMLDone(element, currentStatusCategory) {
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
                    <img class="priorityImg" src="../img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the progressbar template (one subtask).
 * @param {number} progress - percentage of the completed subtasks
 * @param {number} numerator - the number 0
 * @param {number} denominator - number of subtasks in the current task
 * @returns 
 */
function progressbarTaskTemplate(progress, numerator, denominator) {
    return `
    <div class="progress">
        <div class="progressBar" style="width: ${progress}%";>
        </div>
    </div>
    <div class="progressInNumbers">${numerator}/${denominator} Subtask</div>`;
}

/**
 * This function returns the progressbar template (more than one subtak).
 * @param {number} progress - percentage of the completed subtasks
 * @param {number} numerator - the value 0
 * @param {number} denominator - number of subtasks in the current task
 * @returns 
 */
function progressbarTasksTemplate(progress, numerator, denominator) {
    return `
    <div class="progress">
        <div class="progressBar" style="width: ${progress}%";>
        </div>
    </div>
    <div class="progressInNumbers">${numerator}/${denominator} Subtasks</div>`;
}



/* ========================================= OPEN TASK TEMPLATE ========================================= */
/**
 * This function return the template for an opened task.
 * @param {number} currentTask - index of the current task
 * @returns 
 */
function openTaskTemplate(currentTask) {
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

/* ========================================= EDIT OPEN TASK TEMPLATE ========================================= */
/**
 * This function returns the template of an opened task that can be edited.
 * @param {number} currentTask - index of the current task
 * @returns 
 */
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

/* ========================================= OPEN TASK - SUBTASKS TEMPLATE ========================================= */
/**
 * This function returns the template of a undone subtask within the opened task.
 * @param {number} currentTask - index of the current subtask
 * @returns 
 */
function renderSubtasksUndoneTemplate(subtask){
    return `
        <div class="openSubtask">
            <input type="checkbox" disabled>
            <div>${subtask}</div>
        </div>
    `;
}

/**
 * This function returns the template of a done subtask within the opened task.
 * @param {number} currentTask - index of the current subtask
 * @returns 
 */
function renderSubtasksTemplate(subtask) {
    return `
        <div class="openSubtask">
            <div class="coverCheckbox" style="z-index: 2";></div>
            <input type="checkbox" checked style="z-index: 0";>
            <div>${subtask}</div>
        </div>
    `;
}

/* ========================================= EDIT TASK - SUBTASKS TEMPLATE ========================================= */
/**
 * This function returns the template of a undone subtask within an editable opened task.
 * @param {number} subtaskIndex - index of the current subtask
 * @param {number} currentTask - index of the current task
 * @param {string} subtask - name of the current subtask
 * @returns 
 */
function subtasksEditUndoneTemplate(subtaskIndex, currentTask, subtask) {
    return `
        <div class="openSubtask" onclick="saveCompletedTasks(${subtaskIndex}, ${currentTask})">
            <input id="subtask${subtaskIndex}" type="checkbox" value="${subtaskIndex}" checked>
            <div>${subtask}</div>
        </div>
    `;
}

/**
 * This function returns the template of a done subtask within an editable opened task.
 * @param {number} subtaskIndex - index of the current subtask
 * @param {number} currentTask - index of the current task
 * @param {string} subtask - name of the current subtask
 * @returns 
 */
function subtasksEditTemplate(subtaskIndex, currentTask, subtask) {
    return `
        <div class="openSubtask" onclick="saveCompletedTasks(${subtaskIndex}, ${currentTask})">
            <input id="subtask${subtaskIndex}" type="checkbox" value="${subtaskIndex}">
            <div>${subtask}</div>
        </div>
    `;
}

/* ========================================= OPEN TASK - ASSIGNED USERS TEMPLATE ========================================= */
/**
 * This function returns the template for the user that are assigned to the current opened task.
 * @param {string} assignColor - color of the assigned user
 * @param {string} assignFirstLetters - first letters of the assigned user
 * @param {string} assignName - name of the assigned user
 * @param {string} assignSurname - surname of the assigned user
 * @returns 
 */
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

/* ========================================= EDIT TASK - ASSIGNED USERS TEMPLATE ========================================= */
/**
 * This function returns the template for the selected user that are assigned to the current opened edited task.
 * @param {string} j - index of the current user
 * @param {string} assignFirstLetters - first letters of the assigned user
 * @returns 
 */
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

/**
 * This function returns the template for the available/deselected user in the opened edited task.
 * @param {string} j - index of the current user
 * @param {string} assignFirstLetters - first letters of the assigned user
 * @returns 
 */
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

/* ========================================= CREATE TASK TEMPLATES ========================================= */

/**
 * This function returns the template for the category placeholder on the create task html.
 * @returns 
 */
function categoryPlaceholderTemplate() {
 return `
    <div class="sectorTop" id='placeholderCategory'>
        <p>Select task category</p>
        <img src="/img/arrow.svg">
    </div>

    <div class="categoryChoices d-none" id="categoryChoices"></div>
    `;
}

/**
 * This function returns the template for the default categories.
 * @param {string} categoryName - name of the category
 * @param {string} categoryColor - color of the category
 * @returns 
 */
function defaultCategoryTemplate(categoryName, categoryColor){
    return `
        <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
            <div>${categoryName}</div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        `;
}

/**
 * This function returns the template for the new categories.
 * @param {string} categoryName - name of the category
 * @param {string} categoryColor - color of the category
 * @returns 
 */
function newCategoryTemplate(categoryName, categoryColor, i){
    return `
        <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
            <div>${categoryName} <img src="../img/delete.svg" onclick="deleteNewCategory(${i}), doNotAdd(event)">
            </div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        `;
}

/**
 * This function returns the template for the assigned users placeholder on the create task html.
 * @returns 
 */
function assignToPlaceholderTemplate() {
    return `
        <div class="sectorTop">
            <div id="selectedUsersPlaceholder">
                <p id="assignedToHeader">Select contacts to assign</p>
            </div>
            <img src="/img/Vector 2.png">
        </div>

        <div class="assignedToChoices d-none" id="avatarPicker"></div>
       `;
}

function assignUserTemplate(availableUserId, userColor, firstLettersAvailableUser, userName, userSurname) {
    return `
        <div id="${availableUserId}" class="avatarContainer" onclick="selectUser(${availableUserId}), doNotAdd(event)">
            <div id="icon${availableUserId}"class="avatar" style="background-color: ${userColor};">
                <div>${firstLettersAvailableUser}</div>
            </div>
            <div class="nameText">
                <div>${userName} ${userSurname}</div>
            </div>
        </div>
    `;
}

function selectedUsersPlaceholderTemplate(userColor, firstLettersAvailableUser) {
    return `
        <div class="avatarContainer">
            <div class="avatar" style="background-color: ${userColor};">
                <div>${firstLettersAvailableUser}</div>
            </div>
        </div>
    `;
}

   