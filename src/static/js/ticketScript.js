class CartItem {
	constructor(id, quantity) {
		this.id = id;
		this.quantity = quantity;
	}
}

document.addEventListener("DOMContentLoaded", function () {
	loadBoughtItems();
});



function loadBoughtItems() {
	let subTotal = 0;
	const cartTable = document.getElementById("tablaCarrito");

	//Elimina las filas de la tabla
	if (localStorage.getItem("cart") != null && localStorage.getItem("cart") != "undefined") {
		let cartData = JSON.parse(localStorage.getItem("cart"));
		let items;
		if (cartData) {
			items = cartData.map(item => new CartItem(item.id, item.quantity));
		}
		if (items.length != 0) {
			cartTable.innerHTML = "";
			console.log(items);
			// Recorrer los envíos y agregar filas a la tabla
			items.forEach((item) => {
				const currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
				if (!currentItem)
					return;
				const fila = document.createElement("tr");
				let imageURL = currentItem.img;
				if (currentItem.img && !currentItem.img.toLowerCase().startsWith("http"))
					imageURL = "../img/products/" + currentItem.img;

				fila.innerHTML = `
            <td><img class="cartImg" src="${imageURL}"></td>
            <td>${currentItem.name}</td>
            <td>${item.quantity}</td>
            <td>$${currentItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>$${(currentItem.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
				cartTable.appendChild(fila);
				subTotal = subTotal + Number.parseFloat(currentItem.price) * Number.parseFloat(item.quantity);
			});
			localStorage.setItem("cart","[]");
			let prodLabel = "producto";
			if (items.length > 1)
				prodLabel = "productos";
			const subtotalTag = document.getElementById("subTotal");
			subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + items.length + " " + prodLabel + "): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
		}
	}
}