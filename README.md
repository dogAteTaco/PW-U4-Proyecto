# Proyecto Unidad 4
El proyecto consta de una tienda online en la que se tiene un catálogo dinámico que se almacena en una base de datos de MySQL. La página consta de un Inicio, Página Principal, Página de Catálogos, Página de Alta de productos nuevos, página para modificar y agregar usuarios,  y páginas para mostrar un Carrito de compras y de ticket. El servicio opera a través de *Flask* y la lógica para cargar usuarios y catálogos, así como renderizar las páginas se hace a través de él utilizando código Python.

Los archivos están organizados en HTML, JS y CSS. Existiendo un CSS general para elementos presentes en más de una página y CSS para elementos solo presentes en páginas específicas. Además de esto, cada página consta con su script separado.

Se hace uso de módulos de JavaScript que permiten reutilizar la lógica de la barra de búsqueda a través de todas las páginas. También se utilizan plantillas de HTML para mostrar elementos en distintas páginas que son reutilizados.

## Página de Inicio
Para la página de inicio se tiene un arreglo de usuarios al cual se compara con los datos que el usuario inserta en el inicio haciendo uso de la librería de *Flask_login*. Si el usuario y contraseña son correctos, la página redireccionará a la página principal. Una que determina si existe un usuario ingresado y otro que determina el nombre del usuario que inicio sesión. Esto se utilizará para verificar que opciones le aparecerán al usuario en la página principal.

La verificación de las variables de inicio de sesión y usuario se utilizan en cada una de las páginas. Si no existe un usuario en sesión se redireccionará a la página de inicio y si el usuario no cuenta con permisos de administrador e intentar entrar a una página solo para administradores se le direccionará a la página principal.

## Página principal
En esta página es donde se carga el carrito, la calculadora, el catálogo de productos y las demás opciones a las que pueden acceder los usuarios. Como las demás páginas, esta verifica si existe un usuario. Por defecto, muestra la opción de Calculadora y Cerrar Sesión y  si verifica que el usuario es administrador, agrega las opciones de Catálogo y Usuarios. 

Para los productos se utilizaron elementos de clase *card* de Bootstrap. Al dar clic en los botones para añadir se agregan al carrito almacenado en el *localStorage* y se cargarán dentro de un Dropdown menu que se utiliza como carrito en la sección de arriba. Al dar clic en Pagar dentro del carrito se direcciona a la página de Checkout. El carrito se considera de forma separada para cada usuario.

Para mostrar la calculadora dentro de la misma página se muestra un *iframe* al hacer clic en la opción del menú.
## Página de Checkout

Aquí se mostrará el subtotal por producto y total y un botón para realizar el pago. Para regresar a la ventana principal se puede hacer clic en el banner de la página.

## Página de Ticket

En esta se muestra un mensaje de agradecimiento y el listado de los artículos comprados, así como un subtotal y total de la compra. De igual manera, se podrá regresar a través de un botón para seguir comprando o haciendo clic en el banner. Al cargar esta página se vacía el carrito almacenado en él para el usuario que está en sesión.
