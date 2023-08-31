// ================================================ VARIABLES ==========================================================
let users = [];
let tasks = [];
let id;
let taskId;

let selectedValues = []; // Define an empty array to store the selected values

let priority = "";
let allValueCheck = false;
let categoryValue = "";
let previousCategoryValue = "";

let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";

let prevPriorityElement = null; // keep track of previously clicked button

// ================================================ INIT FUNCTION ==========================================================
// Immer als erste Funktion ausführen!
async function init() {
    setURL('https://gruppenarbeit-486join.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    setInterval(setUserColor, 200);
}

// ================================================ SIGN UP ==========================================================
// Am besten eine separate "register.js" Datei erstellen
function generateUserId() {
    id = Math.floor((Math.random() * 1000000) + 1);
}

async function addUser() {
    generateUserId();
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // let color = document.getElementById('color');
    let userId = id;
    let userColor = document.getElementById('userColor');
    let userColorValue = userColor.options[userColor.selectedIndex].value;
    checkForExistingUserId(id);

    let userData = {name: name.value, surname: surname.value, email: email.value, password: password.value, userColor: userColorValue, userid: userId};
    let contactData = {name: name.value, surname: surname.value, email: email.value, phone: '-', contactColor: userColorValue};
    let user = users.find(u => u.email == email.value);
    validateSignup(userData, contactData, user, name, surname, email, password);
}

function checkForExistingUserId(id){
    for (let i = 0; i < users.length; i++) {
        if (users[i]['userid'].includes === id) {
            generateUserId();
        }
    }
}

async function validateSignup(userData, contactData, user, name, surname, email, password) {
    if (userData.name && userData.surname && userData.email && userData.password && userData.userColor && userData.userColor != "") {
        if(user) {
            displaySignedUpPopup('alreadySignedUp');
            name.value = '';
            surname.value = '';
            email.value = '';
            password.value = '';
        } else {
            users.push(userData);
            contacts.push(contactData);
            await save();
            await saveContacts();
            displaySignedUpPopup('successfullySignedUp');
            setInterval(backToLoginScreen, 1200);
        } 
    } else {
        displaySignedUpPopup('missingSignedUp');
    };
}

function backToLoginScreen() {
    window.location.href = '../login.html';
}

async function save() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

// ================================================ LOGIN ==========================================================
window.addEventListener('keydown', (event) => {
    if(window.location.href === 'https://gruppenarbeit-486join.developerakademie.net/login.html') { // =>  'http://127.0.0.1:5501/login.html' => IMMER ANPASSEN!!!
        if(event.keyCode == 13) {
            login();
        }
    }
});

function login() {
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');

    let user = users.find(u => u.email == emailLog.value && u.password == passwordLog.value);
    let existingUser = users.find(u => u.email == emailLog.value);
    let existingPw = users.find(u => u.password == passwordLog.value);

    validateLogin(emailLog, passwordLog, existingUser, existingPw, user);
}

function validateLogin(emailLog, passwordLog, existingUser, existingPw, user) {
    if(emailLog.value == '' || passwordLog.value == '') {
        displaySignedUpPopup('missingSignedUp');
    } else {
        if(existingUser && !existingPw) {
            displaySignedUpPopup('pwEmailIncorrect');
        } else if(!existingUser) {
            displaySignedUpPopup('userDoesNotExist')
        } else if(user) {
            //********************************** */
            let userName = user.name;
            localStorage.setItem('userName', userName);

            let userIdLogin = user.userid;
            localStorage.setItem('userIdLogin', userIdLogin);
            //********************************** */
    
            let currentUser = users.indexOf(existingUser);
            let userId = users[currentUser]['userid'];
            let userColor = users[currentUser]['userColor'];

            window.location.href = 'https://gruppenarbeit-486join.developerakademie.net/join.html?id=' + userId // => IMMER ANPASSEN!!!
            // ../join.html?id=' + userId; // => IMMER ANPASSEN!!!
        }
    }
}

function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    window.location.href = 'join.html';
    let userIdLogin = '';
    localStorage.setItem('userIdLogin', userIdLogin);
}

function setUserColor() {
       if(window.location.href === 'https://gruppenarbeit-486join.developerakademie.net/join.html' + window.location.search) { // => http://127.0.0.1:5501/join.html => IMMER ANPASSEN!!!
        let queryString = window.location.search.slice(4);
        let urlId = parseInt(queryString);
    
        if(queryString) {
            let existingUser = users.find(u => u.userid == urlId);
            let currentUser = users.indexOf(existingUser);
            let userColor = users[currentUser]['userColor'];
            document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
        }
    }
}

function showLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

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
        displaySignedUpPopup('taskCreated');
        clearAllInputs();
        document.getElementById('assignedToChoices').classList.add('d-none');
        await updateHTML();
        displayPage('mainBoardContainerDisplay');
    } else {
        displaySignedUpPopup('missingSignedUpTask');
    }
} */

async function createTask() {
    if(!document.getElementById('title').value) {
        document.getElementById('title').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
    } 
    
    if(!document.getElementById('description').value) {
        document.getElementById('description').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
    } 
    
    if(!document.getElementById('dueDate').value){
        document.getElementById('dueDate').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
    } 
    
    if(priority == "") {
        document.getElementById('urgent').classList.add('redBorder');
        document.getElementById('medium').classList.add('redBorder');
        document.getElementById('low').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
    } 
    
    if(categoryValue == "") {
        document.getElementById('selectCategoryForm').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
    } 
    
    if(selectedValues.length == 0){
        document.getElementById('assignedTo').classList.add('redBorder');
        displaySignedUpPopup('missingSignedUpTask');
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
        displaySignedUpPopup('taskCreated');
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

/* ================================================================= RESET PASSWORD ================================================================= */
/*  async function checkForCorrectEmail(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let response = await action(formData);

    if(response.ok) {
        alert('Email was send');
    } else {
        alert('Email not send!');
    }
}

function action(formData) {
    const input = "https://gruppenarbeit-486join.developerakademie.net/send_mail.php";
    const requestInit = {
        method: 'post',
        body: formData
    };

    return fetch (
        input, 
        requestInit
    );
}  */

function checkForCorrectEmail() {
    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw').value;
    let existingEmail = users.find(u => u.email == sendEmailToResetPw);
    //let correctUser = users.indexOf(existingEmail);
    if (sendEmailToResetPw == '') {
        displaySignedUpPopup('noEmailInsertedPopup');
        return false;
    }
    if ((users.find(u => u.email == sendEmailToResetPw)) == null) {
        displaySignedUpPopup('userDoesNotExistTwo');
        return false;
    }
    displaySignedUpPopup('sendEmail');
    document.getElementById('sendEmailToResetPw').value = '';
    setInterval(backToLoginScreen, 1200);
    return true;
} 

function resetPassword() {

    let urlParams = new URLSearchParams(window.location.search);
    let userEmail = urlParams.get('email');
    let newPassword = document.getElementById('newPassword');
    let confirmPassword = document.getElementById('confirmPassword');
    let existingEmail = users.find(u => u.email == userEmail)
    let currentUser = users.indexOf(existingEmail);

    validatePassword(newPassword, confirmPassword, existingEmail, currentUse);
}

function validatePassword(newPassword, confirmPassword, existingEmail, currentUser) {
    if (newPassword.value == confirmPassword.value) {
        if (existingEmail) {
            users[currentUser]['password'] = confirmPassword.value;
            save();
            displaySignedUpPopup('passwordReset');
            setInterval(backToLoginScreen, 1200);
        }
    } else {
        displaySignedUpPopup('passwordsNotIdentical');
    }
}


/* ================================== SNACKBAR =======================================*/
function displaySignedUpPopup(popupId) {
    var x = document.getElementById(popupId);
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

/* ================================== ACTIVE TAB =======================================*/
function activeTab() {
    let currentElement = document.getElementById('contactID' + c);
    let allElements = document.querySelectorAll('.contact');

    allElements.forEach((element) => {
        element.style.backgroundColor = '#F5F5F5';
        element.style.color = 'black';
    })
    currentElement.style.backgroundColor = '#2A3647';
    currentElement.style.color = 'white';
}


// ================================================ DATEN SPEICHERN ==========================================================
// IM LOCAL STORAGE
/* 
    allTasks.push(task);                                        => JSON mit Daten wird ins Array allTasks gepushed

    let allTasksAsString = JSON.stringify(allTasks);            => das Array allTasks wird in einen String umgewandelt
    localStorage.setItem('allTasks', allTasksAsString)          => Die Daten werden im Local Storage gespeichert / 'allTasks' ist der key und allTasksAsString ist der Wert der gespeichert wird 
*/

// AUF DEM SERVER
/* 
    let allTasksAsString = JSON.stringify(allTasks);
    backend.setItem('allTasks', allTasksAsString)
*/


// ================================================ DATEN LADEN ==========================================================
// VOM LOCAL STORAGE
/* 
    let allTasksAsString = localStorage.getItem('allTasks');    => Zugriff auf die Werte die unter dem key 'allTasks' gespeichert sind 
    allTasks = JSON.parse(allTasksAsString);                    => Die Werte werden wider von einem String in ein Array umgewandelt + Array allTasks wird überschrieben und die Werte eingefügt
*/

// VOM SERVER
/* 
    backend.setItem('users')    => Mehr Parameter nötig????
*/



