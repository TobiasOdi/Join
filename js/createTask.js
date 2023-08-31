//setDateToday();

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
