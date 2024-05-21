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
let actionType;
let typeField;

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
	typeField = document.getElementById("typeField");
	errorArea = document.getElementById("errorArea");
	successArea = document.getElementById("successArea");
	actionType = document.getElementById("actionType");
	// Blocks the fields
	userField.setAttribute("readonly","true");
		passwordField.setAttribute("readonly", "true");
		saveButton.setAttribute("disabled", "true");
		confirmPasswordField.setAttribute("readonly", "true");
		fullNameField.setAttribute("readonly", "true");
		deleteButton.setAttribute("disabled", "true");
		typeButton.setAttribute("readonly", "true");
	// Verifies that the logged user is an admin
	listUsers();
	const addUserButton = document.getElementById("addUserButton");
	addUserButton.addEventListener("click", function (event) {
		event.preventDefault();
		userField.value = "";
		fullNameField.value = "";
		
		userField.focus();
		passwordField.value = "";
		isNewUser = true;

		userField.removeAttribute("readonly");
		passwordField.removeAttribute("readonly");
		saveButton.removeAttribute("disabled");
		confirmPasswordField.removeAttribute("readonly");
		fullNameField.removeAttribute("readonly");
		deleteButton.setAttribute("disabled", "true");
		typeButton.removeAttribute("readonly");
		typeButton.innerText = "Cliente";
	});

	saveButton.addEventListener("click", function (event) {
		event.preventDefault();
		event.stopPropagation();
		if (userExists(userField.value) && isNewUser) {
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "Ya existe un usuario con este nombre de Usuario";
			//Removes the invalid class on the other fields
			fullNameField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");

			//Adds the invalid class to the username field
			userField.classList.add("is-invalid");
		}
		else if (userField.value.trim() == ""){
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "El campo de usuario no puede estar vacío.";
			//Removes the invalid class on the other fields
			fullNameField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");

			//Adds the invalid class to the username field
			userField.classList.add("is-invalid");
		}
		else if (fullNameField.value.trim() == ""){
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "El campo de Nombre Completo no puede estar vacío.";
			//Removes the invalid class on the other fields
			userField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");

			//Adds the invalid class to the username field
			
			fullNameField.classList.add("is-invalid");
		}
		else if(passwordField.value.length < 5&&isNewUser) {
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "La contraseña debe contener al menos 5 caractéres.";
			//Removes the invalid class on it
			userField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");
			fullNameField.classList.remove("is-invalid");

			passwordField.classList.add("is-invalid");
		}
		else if(confirmPasswordField.value.length < 5&&isNewUser){
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "La contraseña debe contener al menos 5 caractéres.";
			//Removes the invalid class on it
			userField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			fullNameField.classList.remove("is-invalid");

			confirmPasswordField.classList.add("is-invalid");
		}
		else if(confirmPasswordField.value!=passwordField.value){
			errorArea.setAttribute("style", "display:grid");
			errorArea.innerText = "Las contraseñas deben coincidir.";
			//Removes the invalid class on it
			userField.classList.remove("is-invalid");
			fullNameField.classList.remove("is-invalid");

			confirmPasswordField.classList.add("is-invalid");
			passwordField.classList.add("is-invalid");
		}
		else if (userExists(userField.value) && !isNewUser) {
			//Removes the invalid class on it
			userField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");
			fullNameField.classList.remove("is-invalid");

			errorArea.setAttribute("style", "display:none");
			successArea.innerText = "Se actualizo el usuario correctamente.";
			successArea.setAttribute("style", "display:grid");
			listUsers();
			isNewUser = false;
			actionType.value = "update";
			var form = deleteButton.closest('form');
				form.submit();
		}
		else {
			userField.classList.remove("is-invalid");
			passwordField.classList.remove("is-invalid");
			confirmPasswordField.classList.remove("is-invalid");
			fullNameField.classList.remove("is-invalid");
			deleteButton.removeAttribute("disabled");
			errorArea.setAttribute("style", "display:none");
			successArea.innerText = "Se guardo el usuario correctamente.";
			successArea.setAttribute("style", "display:grid");
			// Resets the UI and reloads the users
			listUsers();
			isNewUser = false;
			var form = deleteButton.closest('form');
				form.submit();
		}
	});

	deleteButton.addEventListener("click", function (event) {
		// Sets the POST method to be a delete POST method
		actionType.value = "delete";
	});
	typeAdminButton.addEventListener("click", function (event) {
		event.preventDefault();
		typeButton.innerText = typeAdminButton.innerText;
		typeField.value = "1";

	});
	typeClientButton.addEventListener("click", function (event) {
		event.preventDefault();
		typeButton.innerText = typeClientButton.innerText;
		typeField.value = "0";
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

//Checks if user already exists
function userExists(username) {
	console.log(username);
	console.log(users_catalog);
	if(users_catalog.find(u => u.username == username))
		return true;
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
				userField.setAttribute("readonly",true)
				passwordField.removeAttribute("readonly");
				fullNameField.removeAttribute("readonly");
				confirmPasswordField.removeAttribute("readonly");
				saveButton.removeAttribute("disabled");
				deleteButton.removeAttribute("disabled");
				typeButton.removeAttribute("readonly");
				userIdField.value = user.id;
				userField.value = user.username;
				fullNameField.value = user.fullname;
				passwordField.value = "";
				confirmPasswordField.value = "";
	
				if (user.usertype == 1) {
					typeButton.innerText = "Administrador";
					typeField.value = 1;
				}
				else {
					typeButton.innerText = "Cliente";
					typeField.value = 0;
				}
				// Removes the ability to delete or change type of user of admin user
				if (user.id == "1") {
					typeButton.setAttribute("readonly", "true");
					deleteButton.setAttribute("disabled", "true");
				}
				// Indicates that the user was loaded
				isNewUser = false;
				errorArea.setAttribute("style", "display:none");
				successArea.setAttribute("style", "display:none");
			});
			// Adds the button for the user on the list
			listedUsers.appendChild(userElement);

		});
}
