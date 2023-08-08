const socket = io();

socket.on('products', products => {
// Actualiza la lista de productos en la vista en tiempo real
const productsList = document.getElementById("products-list");
productsList.innerHTML = products.map(product => `
    <li>
    <h2>Nombre: ${product.title}</h2>
    <p>Descripción: ${product.description}</p>
    <p>Precio: ${product.price}</p>
    <p>Stock: ${product.stock}</p>
    <p>Categoría: ${product.category}</p>
    <button onclick="addToCart('${product._id}')">Agregar al carrito</button>
    </li>
`).join('');
});


const addToCart = async (req, res, productId) => {
    // Alerta con formulario para solicitar el ID del carrito
    const { value: cartId } = await Swal.fire({
    title: 'Ingrese el ID del carrito',
    input: 'text',
    inputLabel: 'ID del carrito',
    inputPlaceholder: 'Ingrese el ID del carrito aquí'
    });

    if (!cartId) return;

    try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'POST' });
    const responseData = await response.json();
    Swal.fire('Producto agregado al carrito');
    }
    catch (error) {
    req.logger(req, 'error', `${error.message}`);
    Swal.fire('Error al agregar producto al carrito');
    }

};