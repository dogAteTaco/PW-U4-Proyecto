let imageShown;
let imageURL;
let productsArea;
let searchBar;

class User {
	constructor(name, password, type) {
		this.name = name;
		this.password = password;
		this.type = type;
	}
}

document.addEventListener("DOMContentLoaded", function () {

	SearchBarFunctionatility();
	AddUserOptions();
	ModalFunctionality();
	refreshCart();
	const catalogSearchBar = document.getElementById("catalogSearchbar");

	// completeCatalog = 
	loadProducts(complete_catalog);

		
	catalogSearchBar.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			filterProducts(catalogSearchBar.value);
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
import { SearchBarFunctionatility } from './searchScript.js';
SearchBarFunctionatility();

function loadProducts(products) {
	productsArea = document.getElementById("catalogProductsArea");
	productsArea.innerHTML = "";
	products.forEach((currentItem) => {
		let imageURL = currentItem.img;
		if (!currentItem.img.toLowerCase().startsWith("http"))
			imageURL = "../img/products/" + currentItem.img;

		let typeLabel = "Álbum";
		if (currentItem.type == "B")
			typeLabel = "Libro";
		let newItemDiv = document.createElement("div");
		newItemDiv.innerHTML = `
			<div name="${currentItem.id}" class="card">
			<div class="card-body">
				<form method="POST">
					<table class="table">
						<tbody>
							<tr>
								<td class="coverSection"><img class="imageShown" src="${imageURL}"></th>
								<td>
									<div>
										<span>Nombre de Producto</span>
										<input name="id" class="form-control" type="text" placeholder="Id de Producto" value="${currentItem.id}" style="display: none;">
										<input name="name" class="nameField form-control" type="text" placeholder="Nombre de Producto" value="${currentItem.name}">
									</div>
									<div>
										<span>Autor o Artista</span>
										<input name="author" class="authorField form-control" type="text" placeholder="Autor o Artista" value="${currentItem.author}">
										
									</div>
									<div>
										<span>Imagen</span>
										<input name="img" class="imageField form-control" type="text" placeholder="URL de imagen" value="${currentItem.img}">
									</div>
									<div>
										<span>Precio</span>
										<input name="price" class="priceField form-control" type="number" step="any" placeholder="Precio" value="${currentItem.price}">
									</div>
									<div>
										<div class="dropdown">
											<span>Tipo</span>
											<input name="type" class="form-control typeField" type="text" placeholder="Tipo del Producto" value="${currentItem.type}" style="display: none;">
											<button class="typeButton btn btn-secondary dropdown-toggle" type="button"
												data-bs-toggle="dropdown" aria-expanded="false">${typeLabel}</button>
											<ul class="typeMenu dropdown-menu">
												<li><a class="typeAlbum dropdown-item" href="#">Álbum</a></li>
												<li><a class="typeBook dropdown-item" href="#">Libro</a></li>
											</ul>
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="productCatalogButtons">
						<input class="actionType form-control" type="hidden" name="action" value="save">
						<button class="saveButton btn btn-primary" type="submit">Guardar</button>
						<button class="deleteButton btn btn-danger" type="submit">Borrar</button>
					</div>
				</form>
				
			</div>
		</div>
		`;
		productsArea.appendChild(newItemDiv);
	});


	const deleteButtons = document.querySelectorAll('.deleteButton.btn.btn-danger');
	deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click', function (event) {
			var confirmation = confirm("Estas seguro que de eliminar el Producto?");
			// If the user confirms, proceed with deletion
			if (confirmation) {
				// Get the closest card item (its corresponding card)
				var card = deleteButton.closest('.card');

				// Changes the commit action to "delete"
				var parentElement = deleteButton.closest('.productCatalogButtons');
				var actionType = parentElement.querySelector('.actionType');
				actionType.value = "delete";

				// Submit the form programmatically
				var form = deleteButton.closest('form');
				form.submit();

			} else {
				// If the user cancels, do nothing
				return;
			}
		});
	});

	const saveButtons = document.querySelectorAll('.saveButton.btn.btn-primary');
	saveButtons.forEach(saveButton => {
		saveButton.addEventListener('click', function (event) {
			event.stopPropagation();
			// Get the closest card item (it's corresponding card)
			var card = saveButton.closest('.card');
			// Removes background showing that values have changed if there were unsavedchanges
			card.style.backgroundColor = 'transparent';
			//Gets all the fields
			var id = card.getAttribute('name');
			var name = card.querySelector('.nameField').value;
			var author = card.querySelector('.authorField').value;
			var image = card.querySelector('.imageField').value;
			var price = card.querySelector('.priceField').value;
			var type = card.querySelector('.typeButton.btn.btn-secondary.dropdown-toggle').innerText.trim();
			if (type == "Libro")
				type = "B";
			else
				type = "A";

			updateItem(id, name, author, price, image, type);
		});
	});

	const imageFieldInputs = document.querySelectorAll('.imageField');

	// Loop through each input field and add an event listener
	imageFieldInputs.forEach(input => {
		input.addEventListener('input', function () {
			// Get the value entered in the input field
			let imageURL = input.value;
			if (!input.value.toLowerCase().startsWith("http"))
				imageURL = "../img/products/" + input.value;

			const imgElement = input.closest('.card').querySelector('.imageShown');
			imgElement.src = imageURL;
		});
	});

	const albumCatButtons = document.querySelectorAll('.typeAlbum.dropdown-item');
	albumCatButtons.forEach(albumButton => {
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
	});

	const bookCatButtons = document.querySelectorAll('.typeBook.dropdown-item');
	bookCatButtons.forEach(bookButton => {
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

	//Detect value changes in the fields
	var elements = document.querySelectorAll('.nameField, .authorField, .imageField, .priceField');
	elements.forEach(field => {
		field.addEventListener('input', function () {
			var card = field.closest('.card');
			card.style.backgroundColor = '#f7d800';
		});
	});
}

// Filtra los productos basados en tipo, author o nombre
function filterProducts(filter) {
	const lowerCaseFilter = filter.toLowerCase();
	const filteredItems = complete_catalog.filter(item => {
		const lowerCaseId = item.name.toLowerCase();
		const lowerCaseAutor = item.author.toLowerCase();
		return (filter === "" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter));
	});

	loadProducts(filteredItems);
}

function removeItem(productId) {
	complete_catalog = complete_catalog.filter(item => item.id !== productId);
	refreshStorage();
}

function updateItem(id, name, author, price, image, type) {
	complete_catalog.forEach(item => {
		if (item.id === id) {
			item.name = name;
			item.author = author;
			item.price = price;
			item.image = image;
			item.type = type;
		}
	});
	refreshStorage();
}

function refreshStorage() {
	const catalogJSON = JSON.stringify(complete_catalog);
	localStorage.setItem("catalog", catalogJSON);
}