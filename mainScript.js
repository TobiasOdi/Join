// ================================================ VARIABLES ==========================================================
let users = [];
let tasks = [];
let id;
let taskId;

let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";

/* ================================== INCLUDE HTML ================================================== */
//Source: https://developer-akademie.teachable.com/courses/902235/lectures/31232815
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }

    await init();
    pushArrayToDo();
    updateHTML();
    searchFunction();
    counters();
    addAssignedToList();
    setDateToday();
}

// ================================================ INIT FUNCTION ==========================================================
// Immer als erste Funktion ausführen!
async function init() {
    setURL('https://tobias-odermatt.developerakademie.net/Projekte/Join/smallest_backend_ever');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    setInterval(setUserColor, 200);
}

function setUserColor() {
    if(window.location.href === 'https://tobias-odermatt.developerakademie.net/Projekte/Join/join.html' + window.location.search) { // => http://127.0.0.1:5501/join.html => IMMER ANPASSEN!!!
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

function showLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

/* ================================================================= RESET PASSWORD ================================================================= */
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

/* ================================== TOP BAR FUNCTION ============================================ */
function logout() {
    localStorage.removeItem("userName");
    window.location.href = 'login.html';
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function displayPage(pageId) {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    document.getElementById(pageId).style.display = "block";
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



