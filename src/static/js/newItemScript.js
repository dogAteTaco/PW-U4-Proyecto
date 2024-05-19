let completeCatalog;

class User {
    constructor(name, password, type) {
        this.name = name;
        this.password = password;
        this.type = type;
    }
}


document.addEventListener("DOMContentLoaded", function () {

	let saveButton = document.getElementById("saveButton");
	let nameField = document.getElementById("nameField");
	let authorField = document.getElementById("authorField");
	let priceField = document.getElementById("priceField");
	let albumButton = document.getElementById("typeAlbum");
	let bookButton = document.getElementById("typeBook");
	let typeButton = document.getElementById("typeButton");
	let imageField = document.getElementById("imageField");
	let imageShown = document.getElementById("imageShown");
	
	imageField.addEventListener("input", function(event){
		if(imageField.value.toLowerCase().startsWith("http"))
			imageShown.src = imageField.value;
		else
			imageShown.src = "../img/products/"+imageField.value;	
	});

	const catalogJSON = localStorage.getItem("catalog");

    if(catalogJSON)
        completeCatalog = JSON.parse(catalogJSON);
	
	saveButton.addEventListener('click', function(event) {
		event.stopPropagation();
		// Get the closest card item (it's corresponding card)
		var card = saveButton.closest('.card');
		// Removes background showing that values have changed if there were unsavedchanges
		card.style.backgroundColor = 'transparent';


		//Gets all the fields
		var id = parseInt(completeCatalog[completeCatalog.length-1].id)+1;
		
		var name = nameField.value;
		var author = authorField.value;
		var price = priceField.value;
		var type = typeButton.innerText;
		var image = imageField.value;

		if(type=="Libro")
			type = "Book";
		else
			type = "CD";
		
		addItem(id,name,author,price,image,type);
		window.location.href = "catalog.html";
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

function addItem(id,name,author,price,image,type)
{
	var newItem = {
		id: id,
		name: name,
		author: author,
		price: price,
		image: image,
		type: type
	};

	console.log(newItem);
	completeCatalog.push(newItem);
	refreshStorage();
}
