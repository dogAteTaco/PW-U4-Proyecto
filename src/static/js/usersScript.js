let userIdField;
let userField;
let passwordField;
let confirmPasswordField;
let fullNameField;
let saveButton;
let deleteButton;
let typeButton;
let listedUsers;
let isNewUser = false;
let errorArea;
let successArea;
let typeAdminButton;
let typeClientButton;
let cartItems;

class User {
	constructor(id, password, type) {
		this.id = id;
		this.password = password;
		this.type = type;
	}
}


document.addEventListener("DOMContentLoaded", function () {
	SearchBarFunctionatility();
	AddUserOptions();
	ModalFunctionality();
	refreshCart();
	userIdField = document.getElementById("userIdField");
	userField = document.getElementById("userField");
	fullNameField = document.getElementById("fullNameField");
	passwordField = document.getElementById("passwordField");
	confirmPasswordField = document.getElementById("confirmPasswordField");
	saveButton = document.getElementById("saveButton");
	deleteButton = document.getElementById("deleteButton");
	typeButton = document.getElementById("typeButton");
	listedUsers = document.getElementById("listedUsers");
	typeAdminButton = document.getElementById("typeAdmin");
	typeClientButton = document.getElementById("typeClient");

	errorArea = document.getElementById("errorArea");
	successArea = document.getElementById("successArea");
	// If a user is already logged on it moves on to the landing page

	// Verifies that the logged user is an admin
	listUsers();
	const addUserButton = document.getElementById("addUserButton");
	addUserButton.addEventListener("click", function (event) {
		event.preventDefault();
		userField.value = "";
		userField.removeAttribute("disabled");
		userField.focus();
		passwordField.value = "";
		isNewUser = true;

		passwordField.removeAttribute("disabled");
		saveButton.removeAttribute("disabled");
		deleteButton.setAttribute("disabled", "true");
		typeButton.removeAttribute("disabled");
		typeButton.innerText = "Cliente";
	});

	saveButton.addEventListener("click", function (event) {
		if (userExists(userField.value) && isNewUser) {
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "Ya existe un usuario con ese Id.";
		}
		else if (userField.value.trim() == "" || passwordField.value.length < 5) {
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "Los campos de usuario y contrasena no deben estar vacios y la contrasena debe contener al menos 5 caracteres.";
		}
		else if (userExists(userField.value) && !isNewUser) {
			let existingUser = users.find(u => u.id == userField.value);
			existingUser.password = passwordField.value;
			existingUser.type = typeButton.innerText.charAt(0);
			errorArea.setAttribute("style", "display:none");
			successArea.innerText = "Se guardo el usuario correctamente.";
			successArea.setAttribute("style", "display:grid");
			refreshUsers();
		}
		else {
			addUser(userField.value, passwordField.value, typeButton.innerText.charAt(0));
			deleteButton.removeAttribute("disabled");
			errorArea.setAttribute("style", "display:none");
			successArea.innerText = "Se guardo el usuario correctamente.";
			successArea.setAttribute("style", "display:grid");
			listUsers();
			isNewUser = false;
		}
	});

	deleteButton.addEventListener("click", function (event) {
		// Deletes the user from the list and the storage
		var index = users.map(x => {
			return x.Id;
		}).indexOf(userField.value);

		users.splice(index, 1);
		refreshUsers();
		listUsers();
		userField.value = "";
		passwordField.value = "";
		userField.setAttribute("disabled", "true");
		passwordField.setAttribute("disabled", "true");
		saveButton.setAttribute("disabled", "true");
		deleteButton.setAttribute("disabled", "true");
		typeButton.setAttribute("disabled", "true");
		errorArea.setAttribute("style", "display:none");
		successArea.setAttribute("style", "display:grid");
		successArea.innerText("Se elimino el usuario correctamente.");
	});
	typeAdminButton.addEventListener("click", function (event) {
		event.preventDefault();
		typeButton.innerText = typeAdminButton.innerText;
	});
	typeClientButton.addEventListener("click", function (event) {
		event.preventDefault();
		typeButton.innerText = typeClientButton.innerText;
	});
});

// Imports functions for shared functionality of the searchbar
import { refreshCart } from './generalScript.js';
refreshCart();
import { AddUserOptions } from './generalScript.js';
AddUserOptions();
import { ModalFunctionality } from './generalScript.js';
ModalFunctionality();
import { SearchBarFunctionatility } from './searchScript.js';
SearchBarFunctionatility();


// Function to add new users
function addUser(userId, userPass, userType) {
	if (userExists(userId)) {
		console.log(`User with ID ${userId} exists.`);
	} else {


		refreshUsers();
	}
}

// Refreshes the users on the localstorage
function refreshUsers() {

}

//Checks if user already exists
function userExists(userId) {

}

function listUsers() {
	// Empties the users list
	listedUsers.innerHTML = "";
	let users = users_catalog;
	if (users)
		users.forEach((user) => {
			//Creates a button for each user
			let userElement = document.createElement("button");
			userElement.className = "listedUser";
			userElement.textContent = user.username;
			// Creates an event listener for the click of the user button
			userElement.addEventListener("click", function (event) {
				event.preventDefault();
				// Enables the fields and buttons
				userField.removeAttribute("disabled")
				passwordField.removeAttribute("disabled");
				fullNameField.removeAttribute("disabled");
				confirmPasswordField.removeAttribute("disabled");
				saveButton.removeAttribute("disabled");
				deleteButton.removeAttribute("disabled");
				typeButton.removeAttribute("disabled");
				userIdField.value = user.id;
				userField.value = user.username;
				fullNameField.value = user.fullname;
				passwordField.value = "";
				confirmPasswordField.value = "";
	
				if (user.usertype == 1) {
					typeButton.innerText = "Administrador";
				}
				else {
					typeButton.innerText = "Cliente";
				}
				// Removes the ability to delete or change type of user of admin user
				if (user.id == "1") {
					typeButton.setAttribute("disabled", "true");
					deleteButton.setAttribute("disabled", "true");
				}
				isNewUser = false;
				errorArea.setAttribute("style", "display:none");
				successArea.setAttribute("style", "display:none");
			});
			// Adds the button for the user on the list
			listedUsers.appendChild(userElement);

		});
}
