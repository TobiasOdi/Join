//setDateToday();
// ================================================ VARIABLES ==========================================================
/* let users = [];
let tasks = [];
let id;
let taskId;
 */

let selectedUsers = []; // Define an empty array to store the selected values
let priority = "";
let allValueCheck = false;
let categoryValue = "";
let categoryColorValue = "";
let categories = [
    {'categoryName': 'Marketing', 'color': 'rgb(0, 56, 255)', 'categoryType': 'default'},
    {'categoryName': 'Media', 'color': 'rgb(255, 199, 2)', 'categoryType': 'default'},
    {'categoryName': 'Backoffice', 'color': 'rgb(31, 215, 193)', 'categoryType': 'default'},
    {'categoryName': 'Design', 'color': 'rgb(255, 122, 0)', 'categoryType': 'default'},
    {'categoryName': 'Sales', 'color': 'rgb(252, 113, 255)', 'categoryType': 'default'}
];
let statusCategory;
let editedTaskPriority = [];


/* let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229"; */

let prevPriorityElement = null; // keep track of previously clicked button

// ================================================ INIT FUNCTIONS ==========================================================
function initCreateTask() {
    setStatusCategory('toDo');
    renderCategories();
}

function setStatusCategory(statusCategoryToDo) {
    statusCategory  = statusCategoryToDo
}

// ================================================ CREATE TASK ==========================================================
/* async function createTask() {
    if (document.getElementById('title').value && document.getElementById('description').value && document.getElementById('dueDate').value && priority && categoryValue != "" && selectedUsers.length !== 0) {
        let taskId = generateTaskId();
        let statusCategory = "toDo";
        let title = document.getElementById('title');
        let description = document.getElementById('description');
        let category = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        let categoryColor = addBackgroundColorCategory(category);
        let assignTo = selectedUsers;
        let dueDate = document.getElementById('dueDate'); 
        let priorityValue = priority;
        let taskData = {taskId: taskId, statusCategory: statusCategory, title: title.value, description: description.value, category: category, categoryColor: categoryColor, assignTo: assignTo, dueDate: dueDate.value, priorityValue: priorityValue, subtasks: subtasks};
        tasks.push(taskData);
        await saveTasks();
        displaySnackbar('taskCreated');
        clearAllInputs();
        document.getElementById('assignedToChoices').classList.add('d-none');
        await updateHTML();
        displayPage('mainBoardContainerDisplay');
    } else {
        displaySnackbar('missingSignedUpTask');
    }
} */

async function createTask() {
    if(!document.getElementById('title').value) {
        document.getElementById('title').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 
    
    if(!document.getElementById('description').value) {
        document.getElementById('description').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 
    
    if(!document.getElementById('dueDate').value){
        document.getElementById('dueDate').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 
    
    if(priority == "") {
        document.getElementById('urgent').classList.add('redBorder');
        document.getElementById('medium').classList.add('redBorder');
        document.getElementById('low').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 
    
    if(categoryValue == "") {
        document.getElementById('selectCategoryForm').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 
    
    if(selectedUsers.length == 0){
        document.getElementById('assignedTo').classList.add('redBorder');
        displaySnackbar('missingSignedUpTask');
    } 

    if(document.getElementById('title').value) {
        document.getElementById('title').classList.remove('redBorder');
    } 
    
    if(document.getElementById('description').value) {
        document.getElementById('description').classList.remove('redBorder');
    } 
    
    if(document.getElementById('dueDate').value){
        document.getElementById('dueDate').classList.remove('redBorder');
    } 
    
    if(priority !== "") {
        document.getElementById('urgent').classList.remove('redBorder');
        document.getElementById('medium').classList.remove('redBorder');
        document.getElementById('low').classList.remove('redBorder');
    } 
    
    if(categoryValue !== "") {
        document.getElementById('selectCategoryForm').classList.remove('redBorder');
    } 
    
    if(selectedUsers.length !== 0){
        document.getElementById('assignedTo').classList.remove('redBorder');
    } 
    
    if (document.getElementById('title').value && document.getElementById('description').value && document.getElementById('dueDate').value && priority && categoryValue != "" && selectedUsers.length !== 0) {
        let taskId = generateTaskId(); // OK
        // statusCategory > is beeing set wehn clicked on "Add Task" Tab or on plus sign on the board
        let title = document.getElementById('title'); // OK
        let description = document.getElementById('description'); // OK
        let category = categoryValue;
        let categoryColor = categoryColorValue;
        let assignTo = selectedUsers; // To be checked
        let dueDate = document.getElementById('dueDate'); // To be checked
        let priorityValue = priority; // To be checked
        let taskData = {taskId: taskId, statusCategory: statusCategory, title: title.value, description: description.value, category: category, categoryColor: categoryColor, assignTo: assignTo, dueDate: dueDate.value, priorityValue: priorityValue, subtasks: subtasks};
        tasks.push(taskData);
        await saveTasks();
        displaySnackbar('taskCreated');
        clearAllInputs();
        document.getElementById('assignedToChoices').classList.add('d-none');
        await updateHTML();
        displayPage('mainBoardContainerDisplay');
    }
}

function generateTaskId() {
    taskId = Math.floor((Math.random() * 1000000) + 1);
    return taskId;
}

async function saveTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}

// Add an event listener to the checkboxes to update the selectedUsers array
function saveSelectedUsers() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!selectedUsers.includes(selectedValue)) { // Check for duplicates
                    selectedUsers.push(selectedValue);
                }
            } else {
                const index = selectedUsers.indexOf(selectedValue);
                if (index > -1) {
                    selectedUsers.splice(index, 1);
                }
            }
            //console.log(selectedUsers); // Print the selected values to the console
        });
    });
}

function deselectUsers() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function clearAllInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    selectedUsers = [];
    subtasks = [];
    priority = "";
    categoryValue = "";
    document.getElementById('urgent').style.backgroundColor = white;
    document.getElementById('medium').style.backgroundColor = white;
    document.getElementById('low').style.backgroundColor = white;
    document.getElementById('urgent').style.color = black;
    document.getElementById('medium').style.color = black;
    document.getElementById('low').style.color = black;
    document.getElementById('imgUrgent').style.filter = '';
    document.getElementById('imgMedium').style.filter = '';
    document.getElementById('imgLow').style.filter = '';
    document.getElementById('subtaskList').innerHTML = "";
    deselectUsers();
    renderCategories();
}

// ================================================ PRIORITY FUNCTIONS ==========================================================
function selectUrgent() {
    select("urgent", ["medium", "low"], ["imgMedium", "imgLow"], ["urgent"], ["imgUrgent"]);
    saveSelectedPriority();
}

function selectUrgentEdit() {
    select("urgentEdit", ["mediumEdit", "lowEdit"], ["imgMediumEdit", "imgLowEdit"], ["urgentEdit"], ["imgUrgentEdit"]);
}

function selectMedium() {
    select("medium", ["urgent", "low"], ["imgUrgent", "imgLow"], ["medium"], ["imgMedium"]);
    saveSelectedPriority();
}

function selectMediumEdit() {
    select("mediumEdit", ["urgentEdit", "lowEdit"], ["imgUrgentEdit", "imgLowEdit"], ["mediumEdit"], ["imgMediumEdit"]);
}

function selectLow() {
    select("low", ["urgent", "medium"], ["imgUrgent", "imgMedium"], ["low"], ["imgLow"]);
    saveSelectedPriority();
}

function selectLowEdit() {
    select("lowEdit", ["urgentEdit", "mediumEdit"], ["imgUrgentEdit", "imgMediumEdit"], ["lowEdit"], ["imgLowEdit"]);
}

function select(id, idsToDeselect, filtersToDeselect, idsToSelect, filtersToSelect) {
    // Set background and color for IDs to deselect
    for (var i = 0; i < idsToDeselect.length; i++) {
        var element = document.getElementById(idsToDeselect[i]);
        element.style.background = "white";
        element.style.color = "black";
        if (filtersToDeselect[i]) {
            var imgElement = document.getElementById(filtersToDeselect[i]);
            imgElement.style.filter = "";
        }
    }

    // Set background and color for IDs to select
    for (var i = 0; i < idsToSelect.length; i++) {
        var element = document.getElementById(idsToSelect[i]);
        switch (idsToSelect[i]) {
            case "urgent":
                element.style.background = orange;
                element.style.color = white;
                break;
            case "urgentEdit":
                element.style.background = orange;
                element.style.color = white;
                break;

            case "medium":
                element.style.background = lightorange;
                element.style.color = white; // change to white
                break;
            case "mediumEdit":
                element.style.background = lightorange;
                element.style.color = white; // change to white
                break;

            case "low":
                element.style.background = green;
                element.style.color = white; // change to white
                break;
            case "lowEdit":
                element.style.background = green;
                element.style.color = white; // change to white
                break;
            default:
                element.style.background = white;
                element.style.color = black;
        }

        if (filtersToSelect[i]) {
            var imgElement = document.getElementById(filtersToSelect[i]);
            imgElement.style.filter = "brightness(0) invert(1)";
        }
    }
}


function saveSelectedPriority() {
    Array.from(document.getElementsByClassName("prioButton")).forEach((button) => {
        button.addEventListener('click', (event) => {
            priority = event.target.id;
        });
    });
}

// ================================================ CATEGORY FUNCTIONS ==========================================================

function renderCategories() {
    let selectCategoryForm = document.getElementById('selectCategoryForm');
    selectCategoryForm.innerHTML = "";

    selectCategoryForm.innerHTML += `
        <div class="sectorTop" id='placeholderCategory'>
            <p>Select task category</p>
            <img src="/img/arrow.svg">
        </div>

        <div class="categoryChoices d-none" id="categoryChoices"></div>
    `;

    let categoryConatiner = document.getElementById('categoryChoices');
    categoryConatiner.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let categoryName = categories[i]['categoryName'];
        let categoryColor = categories[i]['color'];
        let categoryType = categories[i]['categoryType']

        if(categoryType == 'default') {
            categoryConatiner.innerHTML += `
            <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
                <div>${categoryName}</div>
                <div class="circle" style="background: ${categoryColor};"></div>
            </div>`;
        } else {
            categoryConatiner.innerHTML += `
            <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
                <div>${categoryName} <img src="../img/delete.svg" onclick="deleteNewCategory(${i}), doNotAdd(event)">
                </div>
                <div class="circle" style="background: ${categoryColor};"></div>
            </div>`;
        }
    }
}

function saveSelectedCategory(categoryName, categoryColor) {
    categoryValue = categoryName;
    categoryColorValue = categoryColor;
    document.getElementById('categoryChoices').classList.add('d-none');
    let placeholderCategory = document.getElementById('placeholderCategory')
    placeholderCategory.innerHTML = `
        <div class="category">
            <div>${categoryName}</div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        <img src="/img/arrow.svg">
    `;
}

/**
 * This function prevents the inherit function to run.
 * @param {*} event 
 */
function doNotAdd(event) {
    event.stopPropagation();
}

/**
 * This function adds a new category to the the category array.
 */
async function addNewCategory() {
    let newCategory = document.getElementById('newCategory').value;
    if (!newCategory == '') {
        generateCategoryColor();
        categories.push({'categoryName': newCategory, 'color': categoryColor, 'categoryType': 'custom'});
        await saveCategories();
        renderCategories();
        document.getElementById('newCategory').value = '';
    }
    document.getElementById('plusNewCategoryImg').classList.remove('d-none');
    document.getElementById('clearNewCategoryImg').classList.add('d-none');
    document.getElementById('addNewCategoryImg').classList.add('d-none');
    displaySnackbar('newCategoryAdded');
}

/**
 * This function generates a random color.
 */
function generateCategoryColor() {
    let x = Math.floor(Math.random() * 256)
    let y = Math.floor(Math.random() * 256)
    let z = Math.floor(Math.random() * 256)
    categoryColor = `rgb(${x}, ${y}, ${z})`;
}

async function saveCategories() {
    let categoriesAsString = JSON.stringify(categories);
    await backend.setItem('categories', categoriesAsString);
}

/**
 * This function deletes an added category.
 */
async function deleteNewCategory(i) {
    if(categoryValue == categories[i]['categoryName']) {
        categoryValue = "";
        categoryColorValue = "";
    
    }
    categories.splice(i, 1);
    await saveCategories();
    let placeholderCategory = document.getElementById('placeholderCategory')
    placeholderCategory.innerHTML = `
        <div class="sectorTop" id='placeholderCategory'>
        <p>Select task category</p>
        <img src="/img/arrow.svg">
        </div>
    `;
    renderCategories();
}

/**
 * This function clears the categories array and changes the symbol back to the "Plus"-symbol.
 */
function clearNewCategory() {
    document.getElementById('newCategory').value = "";
    document.getElementById('plusNewCategoryImg').classList.remove('d-none');
    document.getElementById('clearNewCategoryImg').classList.add('d-none');
    document.getElementById('addNewCategoryImg').classList.add('d-none');
}

// ================================================ SITE FUNCTIONS ==========================================================
function addAssignedToList() {
    document.getElementById('assignedToChoices').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let userID = users[i]["userid"];
        // let contact = users[i];
        let name = users[i]["name"];
        document.getElementById('assignedToChoices').innerHTML += `
        <div class="assignedToLine" onclick="saveSelectedUsers()">
            <label for="assigned-to-${i}" id="assigned_name${i}">${name}</label>
            <input type="checkbox" id="assigned-to-${i}"value="${userID}">
        </div>`
    }
}

function openDropdown(id) {
    if (document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.remove('d-none');
    }
    else if (!document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.add('d-none');
    }
}

function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("dueDate").setAttribute('min', String(today));
}
//Ändert die Symbole für Unteraufgaben in die Symbole "Löschen" und "Hinzufügen", wenn das Eingabefeld für die Unteraufgabe angeklickt wird.//
function changeSubIcon() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

function changeNewCatIcon() {
    document.getElementById('plusNewCategoryImg').classList.add('d-none');
    document.getElementById('clearNewCategoryImg').classList.remove('d-none');
    document.getElementById('addNewCategoryImg').classList.remove('d-none');
}

//Ändert die Symbole für Unteraufgaben in die Symbole "Löschen" und "Hinzufügen", wenn das Eingabefeld geändert wird.
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

function inputChangeNewCatIcons() {
    document.getElementById('plusNewCategoryImg').classList.add('d-none');
    document.getElementById('clearNewCategoryImg').classList.remove('d-none');
    document.getElementById('addNewCategoryImg').classList.remove('d-none');
}

// ================================================ SUBTASK FUNCTIONS ==========================================================
/**
 * This function adds a subtask to the the subtask array.
 */
async function addSubtask() {
    let subtask = document.getElementById('subtask').value;

    if (!subtask == '') {
        await subtasks.push({'subtaskName': subtask, 'status': 'undone'});
        document.getElementById('subtask').value = '';
        renderAddSubtasks();
    }
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}

/**
 * This function renders the subtasks into the subtask container.
 */
function renderAddSubtasks() {
    document.getElementById('subtaskList').innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskRender = subtasks[i]['subtaskName'];
        document.getElementById('subtaskList').innerHTML += `
        <div class="subtask">
            <div>- ${subtaskRender}</div>
            <img src="../img/delete.svg" onclick="deleteAddSubtask(${i})">
        </div>`;
    }
}

/**
 * This function deletes the subtask.
 */
function deleteAddSubtask(i) {
    subtasks.splice(i, 1);
    renderAddSubtasks();
}

/**
 * This function clears the subtask array and changes the subtask symbol back to the "Plus"-symbol.
 */
function clearSubtask() {
    document.getElementById('subtask').value = "";
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}


