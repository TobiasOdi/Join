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

/* ======================================================= INCLUDE HTML ========================================================== */
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
/**
 * This function accesses the users, tasks and contacts data that is stored on the ftp server.
 */
async function init() {
    setURL('https://tobias-odermatt.developerakademie.net/Projekte/Join/smallest_backend_ever');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    setInterval(setUserColor, 200);
}

/**
 * This function sets the color of the user. Border around the user icon in the top right corner.
 */
function setUserColor() {
    // 'https://tobias-odermatt.developerakademie.net/Projekte/Join/join.html'
    if(window.location.href === 'http://127.0.0.1:5500/join.html' + window.location.search) { // => IMMER ANPASSEN!!!
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
/**
 * This function generates the user id.
 */
function generateUserId() {
    id = Math.floor((Math.random() * 1000000) + 1);
}

/**
 * This function adds a new user to the users array and saves it on the ftp server.
 */
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

/**
 * This function checkes if the user id already exists.
 * @param {number} id - index of the current user
 */
function checkForExistingUserId(id){
    for (let i = 0; i < users.length; i++) {
        if (users[i]['userid'].includes === id) {
            generateUserId();
        }
    }
}

/**
 * This function validates the sign up form and throws an error if necessary.
 * @param {array} userData - array with all the user data
 * @param {array} contactData - array with all the user data for the contacts
 * @param {string} user - existing email address in the users array
 * @param {string} name - the name of the user
 * @param {string} surname - the surname of the user
 * @param {string} email - the email address of the user
 * @param {string} password - the passowrd of the user
 */
async function validateSignup(userData, contactData, user, name, surname, email, password) {
    if(user) {
        displaySnackbar('alreadySignedUp');
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value = '';
    } else {
        users.push(userData);
        contacts.push(contactData);
        await saveUsers();
        await saveContacts();
        displaySnackbar('successfullySignedUp');
        setInterval(backToLoginScreen, 1200);
    } 
}
 /**
  * This function brings you back to the main login.html.
  */
function backToLoginScreen() {
    window.location.href = 'http://127.0.0.1:5500/login.html'; // => IMMER ANPASSEN!!!
    // 'https://tobias-odermatt.developerakademie.net/Projekte/Join/login.html'
}

/**
 * This function closes the legal notice/privacy policy on the login/sing up page.
 * @param {string} pageId - id of a container
 * @param {string} n - id coun
 * @param {string} arrowId - id of a container 
 */
function back(pageId, n, arrowId) {
    document.getElementById(pageId + n).style.display = "none";
    document.getElementById(arrowId + n).style.display = "none";
    document.getElementById('loginScreen' + n).style.display = "flex";
    document.getElementById('policies' + n).style.display = "flex";
    document.getElementById('contentContainerLogin' + n).classList.remove('displayPageLogin');
}

/**
 * This function saves the user data in the users array on the ftp server.
 */
async function saveUsers() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

// ================================================ LOGIN ==========================================================
/**
 * This event listener lets you lets you login with the enter key.
 */
window.addEventListener('keydown', (event) => {
    // 'https://tobias-odermatt.developerakademie.net/Projekte/Join/login.html'
    if(window.location.href === 'http://127.0.0.1:5500/login.html') { // => IMMER ANPASSEN!!!
        if(event.keyCode == 13) {
            login();
        }
    }
});

/**
 * This function logs you into an existing user account.
 */
function login() {
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');

    let user = users.find(u => u.email == emailLog.value && u.password == passwordLog.value);
    let existingUser = users.find(u => u.email == emailLog.value);
    let existingPw = users.find(u => u.password == passwordLog.value);

    validateLogin(emailLog, passwordLog, existingUser, existingPw, user);
}

/**
 * This function validates the login up form and throws an error if necessary.
 */
function validateLogin(emailLog, passwordLog, existingUser, existingPw, user) {
    if(emailLog.value == '' || passwordLog.value == '') {
        displaySnackbar('missingSignedUp');
    } else {
        if(existingUser && !existingPw) {
            displaySnackbar('pwEmailIncorrect');
        } else if(!existingUser) {
            displaySnackbar('userDoesNotExist')
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

            // 'https://tobias-odermatt.developerakademie.net/Projekte/Join/join.html'
            window.location.href = 'http://127.0.0.1:5500/join.html?id=' + userId // => IMMER ANPASSEN!!!
        }
    }
}

/**
 * This function logs the user in as a guest (without email or password).
 */
function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    window.location.href = 'join.html';
    let userIdLogin = '';
    localStorage.setItem('userIdLogin', userIdLogin);
}

/* ================================================================= FORGOT PASSWORD ================================================================= */
/**
 * This function validates the forgot password form and throws an error if necessary.
 */
function checkForCorrectEmail() {
    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw').value;
    let existingEmail = users.find(u => u.email == sendEmailToResetPw);
    //let correctUser = users.indexOf(existingEmail);
    
    if ((users.find(u => u.email == sendEmailToResetPw)) == null) {
        displaySnackbar('userDoesNotExist2');
        return false;
    }
    displaySnackbar('sendEmail');
    document.getElementById('sendEmailToResetPw').value = '';
    setInterval(backToLoginScreen, 1200);
    return true;
} 

/* ================================================================= RESET PASSWORD ================================================================= */
/**
 * This function validates the reset password form and throws an error if necessary.
 */
function resetPassword() {
    let urlParams = new URLSearchParams(window.location.search);
    let userEmail = urlParams.get('email');
    let newPassword = document.getElementById('newPassword');
    let confirmPassword = document.getElementById('confirmPassword');
    let existingEmail = users.find(u => u.email == userEmail)
    let currentUser = users.indexOf(existingEmail);
    validatePassword(newPassword, confirmPassword, existingEmail, currentUser);
}

/**
 * This function validates the new password and throws an error if necessary.
 * @param {*} newPassword - input of the new passoword
 * @param {*} confirmPassword - input of the new confirmed password
 * @param {*} existingEmail - email adress of an existing user
 * @param {*} currentUser - index of the current user
 */
function validatePassword(newPassword, confirmPassword, existingEmail, currentUser) {
    if (newPassword.value == confirmPassword.value) {
        if (existingEmail) {
            users[currentUser]['password'] = confirmPassword.value;
            saveUsers();
            displaySnackbar('passwordReset');
            setInterval(backToLoginScreen, 1200);
        } else {
            displaySnackbar('userDoesNotExist3');
        }
    } else {
        displaySnackbar('passwordsNotIdentical');
    }
}

/* ================================================================= TOP BAR FUNCTIONS ================================================================= */
/**
 * This function shows and hides the logout button.
 */
function toggleLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

/**
 * This function logs the current user out and returns the user to the login page.
 */
function logout() {
    localStorage.removeItem("userName");
    window.location.href = 'login.html';
}

/* ================================================================= SIDE BAR FUNCTIONS ================================================================= */
/**
 * 
 * @param {*} func 
 * @param {*} delay 
 * @returns 
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * This function displays the html templates.
 * @param {string} pageId - id of the of the html template that needs to be displayed
 */
function displayPage(pageId) {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    document.getElementById(pageId).style.display = "block";
}

/**
 * This function displays the html template legal notice.
 * @param {number} pageId - number of the the id
 */
function displayPageLogin(pageId, n, arrowId) {
    document.getElementById('contentContainerLogin' + n).classList.add('displayPageLogin');
    document.getElementById(pageId + n).style.display = "flex";
    document.getElementById(arrowId + n).style.display = "flex";
    document.getElementById('loginScreen' + n).style.display = "none";
    document.getElementById('policies' + n).style.display = "none";
}

/* ================================================================= SNACKBAR ================================================================= */
/**
 * This funktion displays the snackbars.
 * @param {string} popupId - id of the snackbar
 */
function displaySnackbar(popupId) {
    // Get the snackbar DIV
    var x = document.getElementById(popupId);
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

/* ================================================================= ACTIVE TAB ================================================================= */
/**
 * This funciton displays the active tab on the side nav bar.
 */
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



