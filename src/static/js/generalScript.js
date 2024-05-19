class CartItem {
	constructor(id, quantity) {
		this.id = id;
		this.quantity = quantity;
	}
}

export function ModalFunctionality() {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent"); // Get modal content

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Initialize variables for dragging
    var offsetX, offsetY, isDown = false;

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // When the user starts dragging the modal
    modalContent.addEventListener('mousedown', function(e) {
        isDown = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });

    // When the user stops dragging the modal
    document.addEventListener('mouseup', function() {
        isDown = false;
    });

    // When the user drags the modal
    document.addEventListener('mousemove', function(e) {
        if (isDown) {
            e.preventDefault();
            var x = e.clientX - offsetX;
            var y = e.clientY - offsetY;
            modal.style.left = x + 'px';
            modal.style.top = y + 'px';
        }
    });
}


export function AddUserOptions() {
	const userOptionsDiv = document.getElementById("userOptions");
	if (type_user==1) {
		userOptionsDiv.innerHTML = "<a class=\"dropdown-item\" href=\"catalog\"><span>Catálogo</span></a>" +
			"<a class=\"dropdown-item\" href=\"users\"><span>Usuarios</span></a><div class=\"dropdown-divider\"></div>";
	}
}

export function refreshCart() {
	let cartItems;
	let cartData;

	if(localStorage.getItem("cart")!=null&&localStorage.getItem("cart")!="undefined") {
		cartData = JSON.parse(localStorage.getItem("cart"));
		if (cartData) {
			cartItems = cartData.map(item => new CartItem(item.id, item.quantity));
		}
	}
	const cartTag = document.getElementById("cart");
	const cartTotal = document.getElementById("totalSpan");
	//Resets the total
	let total = 0;
	let added = 0;
	const items = document.getElementById("cartItems");
	items.innerHTML = "";
	let cartItemDiv = document.createElement("div");
	// Recalculates the total of the cart and redraws it
	if(cartItems)
		cartItems.forEach((item) => {
			var currentItem = complete_catalog.find(p => p.id.toString() === item.id.toString());
			if(!currentItem)
				return;
			added = added +1;
			total = Number.parseFloat(total) + Number.parseFloat(item.quantity) * currentItem.price;
			cartItemDiv = document.createElement("div");

			let imageURL = currentItem.img;
			if (!currentItem.img.toLowerCase().startsWith("http"))
				imageURL = "../img/products/" + currentItem.img;

			cartItemDiv.innerHTML = `
			<div class="cartItem" name="${currentItem.id}">
				<div style="display: inline; margin-right:10px;"><img src="${imageURL}"></div>
				<span style="flex-grow: 1; padding-right: 15px;">${currentItem.name}</span>
				<span style="text-align: right;">$${currentItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x${item.quantity}</span>
				<span><button class="cartDeleteButton"><img style="width: 30px; height:30px" src="https://freepngtransparent.com/wp-content/uploads/2023/03/X-Png-112.png"></button></span>
			</div>
			`;

			var deleteButton = cartItemDiv.querySelector('.cartDeleteButton');

			// Add event listener to the delete button
			deleteButton.addEventListener('click', function (event) {
				event.stopPropagation();
				// Get the parent div of the delete button, which is the cartItem div
				var cartItemDiv = deleteButton.closest('.cartItem');
				// Get the span containing the currentItem.id

				// Removes it based on the ID of the row
				removeById(cartItemDiv.getAttribute('name'));
				// Remove the cartItem div
				cartItemDiv.remove();
				refreshCart();
				// Get a reference to the dropdown menu's parent element
				var dropdownParent = document.querySelector('.dropdown-menu').parentNode;

				// Add the 'show' class to the dropdown menu's parent element to open the dropdown
				dropdownParent.classList.add('show');
			});

		// Append the Cart Item to the items container
		items.appendChild(cartItemDiv);
	});

	localStorage.setItem("cart", JSON.stringify(cartItems));
	cartTotal.textContent = "$" + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	cartTag.textContent = added;
}

function removeById(id) {
	let cartItems;
	let cartData = JSON.parse(localStorage.getItem("cart"));
	if (cartData) {
		cartItems = cartData.map(item => new CartItem(item.id, item.quantity));
	}
	const index = cartItems.findIndex(item => item.id === id);
	if (index !== -1) {
		cartItems.splice(index, 1);
		localStorage.setItem("cart", JSON.stringify(cartItems));
	}
};