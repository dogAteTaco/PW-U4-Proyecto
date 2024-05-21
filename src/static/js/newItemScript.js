let completeCatalog;

class User {
    constructor(name, password, type) {
        this.name = name;
        this.password = password;
        this.type = type;
    }
}


document.addEventListener("DOMContentLoaded", function () {
	let albumButton = document.getElementById("typeAlbum");
	let bookButton = document.getElementById("typeBook");
	let imageField = document.getElementById("imageField");
	let imageShown = document.getElementById("imageShown");
	
	imageField.addEventListener("input", function(event){
		if(imageField.value.toLowerCase().startsWith("http"))
			imageShown.src = imageField.value;
		else
			imageShown.src = "../img/products/"+imageField.value;	
	});

	imageField.addEventListener('input', function() {
		// Get the value entered in the input field
		let imageURL = imageField.value;
		if(!imageField.value.toLowerCase().startsWith("http"))
			imageURL = "../img/products/"+imageField.value;
		imageShown.src = imageURL;
	});
	let event = new Event('input', {
		bubbles: true,
		cancelable: true,
	});
	
	// Dispatch the 'input' event on 'imageField'
	imageField.dispatchEvent(event);
	// const backButton = document.getElementById("backButton");
	// backButton.addEventListener('click', function(event){
	// 	event.stopPropagation();
	// 	console.log("algo");
	// 	window.location.href = "catalog.html";
	// });
	albumButton.addEventListener('click', function (event) {
		event.preventDefault(); 
		// Get the closest card item (it's corresponding card)
		var card = this.closest('.card');
		var category = card.querySelector('.typeButton.btn.btn-secondary.dropdown-toggle');
		category.innerText = this.innerText;
		
		var typeInput = card.querySelector('.typeField');
		typeInput.value = 'A'; 

		card.style.backgroundColor = '#f7d800';
	});

	bookButton.addEventListener('click', function (event) {
		event.preventDefault();  
		var card = this.closest('.card');
		
		var category = card.querySelector('.typeButton.btn.btn-secondary.dropdown-toggle');
		category.innerText = this.innerText;
		
		var typeInput = card.querySelector('.typeField');
		typeInput.value = 'B'; 

		card.style.backgroundColor = '#f7d800';
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
