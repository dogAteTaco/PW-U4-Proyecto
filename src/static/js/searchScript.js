export function SearchBarFunctionatility()
{
	let typeFilter = "E";
	const searchButton = document.getElementById("searchbutton");
	const searchBar = document.getElementById("searchbar");
	const allItems = document.getElementById("allItems");
	const cdItems = document.getElementById("cdItems");
	const bookItems = document.getElementById("bookItems");
	const catButton = document.getElementById("categoriesButton");
	const logoutButton = document.getElementById("logoutButton");
    
	allItems.addEventListener("click", function () {
		typeFilter = "E";
		catButton.textContent = "Todas las categorías";
	});

	logoutButton.addEventListener("click", function () {
		localStorage.removeItem("logged");
		localStorage.removeItem("user");
		// window.location.href = "../index.html";
	});

	cdItems.addEventListener("click", function () {
		typeFilter = "A";
		
		catButton.textContent = "Albúms";
	});

	bookItems.addEventListener("click", function () {
		typeFilter = "B";
		
		catButton.textContent = "Libros";
	});

	searchButton.addEventListener("click", function () {
		window.location.href = '/home?text_filter=' + encodeURIComponent(searchBar.value) + '&type_filter=' + encodeURIComponent(typeFilter);
	});

	searchBar.addEventListener('keypress', function (e) {
		console.log("ENTER");
		if (e.key === 'Enter') {
			
			window.location.href = '/home?text_filter=' + encodeURIComponent(searchBar.value) + '&type_filter=' + encodeURIComponent(typeFilter);
		}
	});
}