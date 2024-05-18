
let completeCatalog;

let added = 0;
var typeFilter = "E";
let userLogged;
let users = [];

class User {
	constructor(name, password, type) {
		this.name = name;
		this.password = password;
		this.type = type;
	}
}

class CartItem {
	constructor(id, quantity) {
		this.id = id;
		this.quantity = quantity;
	}
}

class Product {
	constructor(id, name, author, price, img, type) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.price = price;
		this.img = img;
		this.type = type;
	}
}

let cartItems = [];


document.addEventListener("DOMContentLoaded", function () {
	ModalFunctionality();
	AddUserOptions();
	// Turns the catalog in the server into an array of objects
	var current_catalog = [];
	for (var i = 0; i < shown_items.length; i++) {
		var productData = shown_items[i];
		var product = new Product(productData.id, productData.name, productData.author, productData.price, productData.img, productData.type);
		current_catalog.push(product);
	}

	completeCatalog = [];
	for (var i = 0; i < complete_catalog.length; i++) {
		var productData = complete_catalog[i];
		var product = new Product(productData.id, productData.name, productData.author, productData.price, productData.img, productData.type);
		completeCatalog.push(product);
	}
	// createConnection();
	loadProducts(current_catalog);
	const searchButton = document.getElementById("searchbutton");
	const searchBar = document.getElementById("searchbar");
	const allItems = document.getElementById("allItems");
	const cdItems = document.getElementById("cdItems");
	const bookItems = document.getElementById("bookItems");
	const catButton = document.getElementById("categoriesButton");
	const logoutButton = document.getElementById("logoutButton");

	

	//Loads the saved cart
	refreshCart();
	//Sets up the UI correctly if it navigates with filters from another page
	if(type_filter=="E")
		catButton.textContent = "Todas las categorías";
	else if(type_filter=="A")
		catButton.textContent = "Albúms";
	else if(type_filter=="B")
		catButton.textContent = "Libros";

	if(text_filter!="None")
		searchBar.value = text_filter;
	

	allItems.addEventListener("click", function () {
		typeFilter = "E";
		filterProducts(searchBar.value);
		catButton.textContent = "Todas las categorías";
	});

	logoutButton.addEventListener("click", function () {
		localStorage.removeItem("logged");
		localStorage.removeItem("user");
		window.location.href = "../index.html";
	});

	cdItems.addEventListener("click", function () {
		typeFilter = "A";
		filterProducts(searchBar.value);
		catButton.textContent = "Albúms";
	});

	bookItems.addEventListener("click", function () {
		typeFilter = "B";
		filterProducts(searchBar.value);
		catButton.textContent = "Libros";
	});

	searchButton.addEventListener("click", function () {
		filterProducts(searchBar.value);
	});

	searchBar.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			filterProducts(searchBar.value);
		}
	});
});

// Imports functions for shared functionality of the searchbar
import { refreshCart } from './generalScript.js';
refreshCart();
import { AddUserOptions } from './generalScript.js';
AddUserOptions();
import { ModalFunctionality } from './generalScript.js';
ModalFunctionality();

function loadProducts(catalog) {
	const catalogContainer = document.getElementById("catalogo");
	catalogContainer.innerHTML = "";
	// Genera las tarjetas de productos en el catálogo
	if (catalog) {
		catalog.forEach((product) => {
			const card = document.createElement("div");
			//card.classList.add("col-md-4", "mb-4");
			let imageURL = product.img;
			if (product.img&&!product.img.toLowerCase().startsWith("http"))
				imageURL = "{{ url_for('static',filename='img/" + product.img+"')}}";

			card.innerHTML = `
				<div id="${product.id}" class="card-container">
					<div class="card">
						<div><img src="${imageURL}" class="card-img-top" alt="${product.name}"></div>
						<div class="card-body">
							<h5 class="card-title">${product.name}</h5>
							<p class="card-author">${product.author}</p>
							<div class="card-price">
								<span class="main-price">$${parseInt(product.price)}</span>
								<span class="cents">${(product.price % 1).toFixed(2).substr(2)}</span>
							</div>
							<input type="number" min="0" class="form-control" data-id="cantidadProducto" value="1">
							<button class="cantidadField btn btn-primary mt-2" data-id="${product.name}">Añadir</button>
						</div>
					</div>
				</div>
				`;
			catalogContainer.appendChild(card);

		});
		const buttons = document.querySelectorAll('.cantidadField');



		buttons.forEach(button => {
			button.addEventListener('click', function () {
				
				let cartItems;
				let cartData = JSON.parse(localStorage.getItem("cart"));
				if (cartData) {
					cartItems = cartData.map(item => new CartItem(item.id, item.quantity));
				}
				console.log(cartItems);
				// Gets the card tag where it was clicked
				const cardContainer = this.closest('.card-container');
				// Gets the id from the card
				var productId = cardContainer.id;
				// Gets the input of the "Add to card" field
				const quantityField = cardContainer.querySelector('input[data-id="cantidadProducto"]');
				// Gets the value for the quantity
				const quantity = quantityField.value;
				// Checks if the item is already on the cart
				if (!cartItems.some(i => i.id == productId)) {
					cartItems.push(new CartItem(productId, quantity));
					added = added + 1;
				}
				else {
					const cardProduct = cartItems.find(p => p.id === productId);
					cardProduct.quantity = Number.parseInt(cardProduct.quantity) + Number.parseInt(quantity);
				}
				localStorage.setItem("cart", JSON.stringify(cartItems));
				// Refreshes the Cart
				refreshCart();
			});
		});
	}
}



// Filtra los productos basados en tipo, author o nombre
function filterProducts(filter) {
	const lowerCaseFilter = filter.toLowerCase();
	const filteredItems = completeCatalog.filter(item => {
		const lowerCaseId = item.name.toLowerCase();
		const lowerCaseAutor = item.author.toLowerCase();
		const lowerCaseTipo = item.type.toLowerCase();
		return (filter === "" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter)) && (typeFilter === "E" || lowerCaseTipo === typeFilter.toLowerCase());
	});
	current_catalog = filteredItems;
	loadProducts(filteredItems);
}

function createConnection(){
	
	console.log("MySQL Host:", mysqlHost);
	console.log("MySQL User:", mysqlUser);
	console.log("MySQL Password:", mysqlPassword);
	console.log("MySQL Database:", mysqlDb);

	// Create a connection to the MySQL database
	const connection = mysql.createConnection({
	host: mysqlHost, 
	user: mysqlUser,    
	password: mysqlPassword,
	database: mysqlDb   
	});

	// Connect to the database
	connection.connect((err) => {
	if (err) {
		console.error('Error connecting to MySQL database: ' + err.stack);
		return;
	}
	console.log('Connected to MySQL database as ID ' + connection.threadId);
	});

	// Perform database operations here...

	// Close the connection
	connection.end((err) => {
	if (err) {
		console.error('Error closing MySQL database connection: ' + err.stack);
		return;
	}
	console.log('Connection to MySQL database closed.');
	});
	return connection;
}

