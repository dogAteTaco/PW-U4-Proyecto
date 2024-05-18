let cartItems;

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
        window.location.href = 'ticket.html';
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
    cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    //Elimina las filas de la tabla
    cartTable.innerHTML = "";
    if (cartItems.length == 0) {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
            + "<center><a href=\"landing.html\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else {
        // Recorrer los envíos y agregar filas a la tabla
        cartItems.forEach((item) => {
            const row = document.createElement("tr");
            const currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
			console.log(currentItem.id);
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

function refreshTotal() {
    let subTotal = 0;
    if (cartItems.length == 0) {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
            + "<center><a href=\"landing.html\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else {
        // Recorrer los envíos y agregar filas a la tabla
        cartItems.forEach((item) => {
            const currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
            subTotal = subTotal + Number.parseFloat(currentItem.price) * Number.parseFloat(item.quantity);
        });
        const subtotalTag = document.getElementById("subTotal");
        let prodLabel = "producto";
        if(cartItems.length>1)
            prodLabel = "productos";
        subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + cartItems.length + " "+prodLabel+"): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
    }

}
function removeById(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
};

