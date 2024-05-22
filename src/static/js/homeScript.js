let completeCatalog;
let added = 0;
var typeFilter = "E";
let current_catalog = [];

class CartItem {
	constructor(user,id, quantity) {
		this.user = user;
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



document.addEventListener("DOMContentLoaded", function () {
	ModalFunctionality();
	AddUserOptions();

	const searchButton = document.getElementById("searchbutton");
	const searchBar = document.getElementById("searchbar");
	const allItems = document.getElementById("allItems");
	const cdItems = document.getElementById("cdItems");
	const bookItems = document.getElementById("bookItems");
	const catButton = document.getElementById("categoriesButton");
	const logoutButton = document.getElementById("logoutButton");
	// Turns the catalog in the server into an array of objects
	
	for (var i = 0; i < shown_items.length; i++) {
		var productData = shown_items[i];
		var product = new Product(productData.id, productData.name, productData.author, productData.price, productData.img, productData.type);
		//console.log(product);
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
			let product_type = "CD de audio";
			if(product.type=="B")
				product_type = "Libro";
			card.innerHTML = `
				<div id="${product.id}" class="card-container">
					<div class="card">
						<div class="vertical-center" style="height:298px;"><img src="${imageURL}" class="card-img-top" alt="${product.name}"></div>
							
						<div class="card-body">
						<img style=" height:24px;width:100px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/5_stars.svg/1280px-5_stars.svg.png"></img>
							<h5 class="card-title">${product.name}</h5>
							<p class="card-author"><font size="2.5">de ${product.author}</font></p>
							<p style="color:#007185;font-weight:500;height:15px;">${product_type}</p>
							<div class="card-price">

								<span class="main-price">$${parseInt(product.price)}</span>
								<span class="cents">${(product.price % 1).toFixed(2).substr(2)}</span>
							</div>
							<font size="2.5" align="top"><p>Hasta 24 meses de $${(product.price/24).toFixed(2).substr(2)} con costo de financiamiento.</p>
							<p>Entrega GRATIS el <b>lun, 27 de may </b> si compras $299 en artículos enviados por Amazon</p></font>
							<input type="number" min="0" class="form-control" data-id="cantidadProducto" value="1">
							<center><button class="cantidadField btn btn-warning mt-2 rounded-5 custom-button" data-id="${product.name}">Agregar al Carrito</button></center>
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
				let cartData;

				if(localStorage.getItem("cart")!=null&&localStorage.getItem("cart")!="undefined") {
					cartData = JSON.parse(localStorage.getItem("cart"));
				}
				else
				{
					localStorage.setItem("cart","[]");
					cartData = JSON.parse(localStorage.getItem("cart"));
				}
				if (cartData) {
					cartItems = cartData.map(item => new CartItem(item.user,item.id, item.quantity));
				}
				// Gets the card tag where it was clicked
				const cardContainer = this.closest('.card-container');
				// Gets the id from the card
				var productId = cardContainer.id;
				// Gets the input of the "Add to card" field
				const quantityField = cardContainer.querySelector('input[data-id="cantidadProducto"]');
				// Gets the value for the quantity
				const quantity = quantityField.value;
				// Checks if the item is already on the cart
				if (!cartItems.some(i => i.id == productId && i.user==current_user_id)) {
					cartItems.push(new CartItem(current_user_id,productId, quantity));
					added = added + 1;
				}
				else {
					const cardProduct = cartItems.find(p => p.id === productId&& p.user==current_user_id);
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

