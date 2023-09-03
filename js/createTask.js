//setDateToday();
// ================================================ VARIABLES ==========================================================
/* let users = [];
let tasks = [];
let id;
let taskId;
 */

let selectedValues = []; // Define an empty array to store the selected values

let priority = "";
let allValueCheck = false;
let categoryValue = "";
let previousCategoryValue = "";

/* let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229"; */

let prevPriorityElement = null; // keep track of previously clicked button

// ================================================ CREATE TASK ==========================================================
/* async function createTask() {
    if (document.getElementById('title').value && document.getElementById('description').value && document.getElementById('dueDate').value && priority && categoryValue != "" && selectedValues.length !== 0) {
        let taskId = generateTaskId();
        let statusCategory = "toDo";
        let title = document.getElementById('title');
        let description = document.getElementById('description');
        let category = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        let categoryColor = addBackgroundColorCategory(category);
        let assignTo = selectedValues;
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
    
    if(selectedValues.length == 0){
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
    
    if(selectedValues.length !== 0){
        document.getElementById('assignedTo').classList.remove('redBorder');
    } 
    
    if (document.getElementById('title').value && document.getElementById('description').value && document.getElementById('dueDate').value && priority && categoryValue != "" && selectedValues.length !== 0) {
        let taskId = generateTaskId();
        let statusCategory = "toDo";
        let title = document.getElementById('title');
        let description = document.getElementById('description');
        let category = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        let categoryColor = addBackgroundColorCategory(category);
        let assignTo = selectedValues;
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

setTimeout(() => {
    //saveSelectedUsers();
    saveSelectedPriority();
    saveSelectedCategory();
}, 1500);

// Add an event listener to the checkboxes to update the selectedValues array
function saveSelectedUsers() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!selectedValues.includes(selectedValue)) { // Check for duplicates
                    selectedValues.push(selectedValue);
                }
            } else {
                const index = selectedValues.indexOf(selectedValue);
                if (index > -1) {
                    selectedValues.splice(index, 1);
                }
            }
            //console.log(selectedValues); // Print the selected values to the console
        });
    });
}

function deselectUsers() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });
}

/* =============== PRIORITY =============== */
function saveSelectedPriority() {
    Array.from(document.getElementsByClassName("prioButton")).forEach((button) => {
        button.addEventListener('click', (event) => {
            priority = event.target.id;
        });
    });
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

function selectUrgent() {
    select("urgent", ["medium", "low"], ["imgMedium", "imgLow"], ["urgent"], ["imgUrgent"]);
}

function selectUrgentEdit() {
    select("urgentEdit", ["mediumEdit", "lowEdit"], ["imgMediumEdit", "imgLowEdit"], ["urgentEdit"], ["imgUrgentEdit"]);
}

function selectMedium() {
    select("medium", ["urgent", "low"], ["imgUrgent", "imgLow"], ["medium"], ["imgMedium"]);
}

function selectMediumEdit() {
    select("mediumEdit", ["urgentEdit", "lowEdit"], ["imgUrgentEdit", "imgLowEdit"], ["mediumEdit"], ["imgMediumEdit"]);
}

function selectLow() {
    select("low", ["urgent", "medium"], ["imgUrgent", "imgMedium"], ["low"], ["imgLow"]);
}

function selectLowEdit() {
    select("lowEdit", ["urgentEdit", "mediumEdit"], ["imgUrgentEdit", "imgMediumEdit"], ["lowEdit"], ["imgLowEdit"]);
}

let editedTaskPriority = [];

/* ===================================== */

/* =============== CATEGORY =============== */
function addBackgroundColorCategory(element) {
    if (element == "Marketing") {
        return "#0038ff";
    } else if (element == "Media") {
        return "#ffc702";
    } else if (element == "Backoffice") {
        return "#1FD7C1";
    } else if (element == "Design") {
        return "#ff7a00";
    } else if (element == "Sales") {
        return "#fc71ff";
    }
}

function saveSelectedCategory() {
    Array.from(document.getElementsByClassName("category")).forEach((item) => {
        item.addEventListener('click', (event) => {
            let newCategoryValue = event.target.id;
            let upperCaseValue = newCategoryValue.charAt(0).toUpperCase() + newCategoryValue.slice(1);
            if (event.target.id) {
                if (newCategoryValue !== categoryValue) {
                    previousCategoryValue = categoryValue;
                    categoryValue = newCategoryValue;
                    document.getElementById("selectCategory").innerHTML = `
                    ${upperCaseValue}
                `;
                    let parentDiv = document.getElementById(`${categoryValue}`).parentNode;
                    //parentDiv.style.display = "none";
                    if (previousCategoryValue) {
                        let restoredParentDiv = document.getElementById(`${previousCategoryValue}`).parentNode;
                        restoredParentDiv.style.display = "flex";
                    }
                }
            }
        });
    });
}
/* ===================================== */

function clearAllInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    selectedValues = [];
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

//Ändert die Symbole für Unteraufgaben in die Symbole "Löschen" und "Hinzufügen", wenn das Eingabefeld geändert wird.
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}
//Fügt eine Unteraufgabe zur Liste und zum Unteraufgaben-Array hinzu, wenn die Schaltfläche "Hinzufügen" angeklickt wird.
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

function deleteAddSubtask(i) {
    subtasks.splice(i, 1);
    renderAddSubtasks();
}

//Löscht das Unteraufgabeneingabefeld und ändert die Unteraufgabensymbole zurück in das "Plus"-Symbol
function clearSubtask() {
    document.getElementById('subtask').value = "";
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}
