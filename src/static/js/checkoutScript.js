let cartItems;
let cartCount;

class CartItem {
	constructor(user, id, quantity) {
        this.user = user;
		this.id = id;
		this.quantity = quantity;
	}
}
document.addEventListener("DOMContentLoaded", function () {
	SearchBarFunctionatility();
	AddUserOptions();
	ModalFunctionality();
	refreshCart();
    const payButton = document.getElementById("botonPagar");
    const emptyButton = document.getElementById("botonBorrar");
    localStorage.setItem("filter", "");
    localStorage.setItem("tipo", "");
    loadBoughtItems();


    emptyButton.addEventListener("click", function (event) {
        event.preventDefault();
        //Limpia el local storage
        localStorage.removeItem("cart");
        //Ejecuta la carga de los resultados de nuevo
        loadBoughtItems();
    });

    payButton.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = 'ticket';
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


function loadBoughtItems() {
    const cartTable = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
	let cartData;

	if(localStorage.getItem("cart")!=null&&localStorage.getItem("cart")!="undefined") {
		cartData = JSON.parse(localStorage.getItem("cart"));
		if (cartData) {
			cartItems = cartData.map(item => new CartItem(item.user,item.id, item.quantity));
		}
		if(cartItems.lenght==0)
		{
			//Elimina las filas de la tabla
		cartTable.innerHTML = "";
		
		document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
				+ "<center><a href=\"home\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
		}
		else{
			// Recorrer los envíos y agregar filas a la tabla
		cartCount = 0;
        cartItems.filter(item => item.user === current_user_id).forEach((item) => {
            const row = document.createElement("tr");
            const currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
			if(!currentItem)
				return;
			cartCount = cartCount +1;
            let imageURL = currentItem.img;
            if(!currentItem.img.toLowerCase().startsWith("http"))
			    imageURL = "../img/products/"+currentItem.img;

            row.innerHTML = `
            <td><img name="${currentItem.id}" class="cartImg" src="${imageURL}"></td>
            <td>${currentItem.name}</td>
            <td>${item.quantity}</td>
            <td>$${currentItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>$${(currentItem.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><button class="cartDeleteButton"><img style="" src="https://freepngtransparent.com/wp-content/uploads/2023/03/X-Png-112.png"></button></td>
        `;

            var deleteButton = row.querySelector('.cartDeleteButton');

            deleteButton.addEventListener('click', function () {
                var cartItemRow = deleteButton.closest('tr');
                var idTd = cartItemRow.querySelector('.cartImg').getAttribute('name');

                removeById(idTd);

                cartItemRow.remove();

                refreshTotal();
            });
            cartTable.appendChild(row);

        });
        refreshTotal();
		}
		
	}
	else
	{
		//Elimina las filas de la tabla
		cartTable.innerHTML = "";
		
		document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
				+ "<center><a href=\"home\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
	}
    


}

function refreshTotal() {
    let subTotal = 0;
    if (cartCount == 0) {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
            + "<center><a href=\"home\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else {
        // Recorrer los envíos y agregar filas a la tabla
        cartItems.filter(item => item.user === current_user_id).forEach((item) => {
            const currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
			if(currentItem)
            	subTotal = subTotal + Number.parseFloat(currentItem.price) * Number.parseFloat(item.quantity);
        });
        const subtotalTag = document.getElementById("subTotal");
        let prodLabel = "producto";
        if(cartCount>1)
            prodLabel = "productos";
        subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + cartCount + " "+prodLabel+"): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
    }

}
function removeById(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
};

