
const productosIniciales = [
    { id: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", precio: 29990, stock: 10 },
    { id: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precio: 24990, stock: 10 },
    { id: "AC001", categoria: "Accesorios", nombre: "Controlador Inalámbrico Xbox Series X", precio: 59990, stock: 10 },
    { id: "AC002", categoria: "Accesorios", nombre: "Auriculares Gamer HyperX Cloud II", precio: 79990, stock: 10 },
    { id: "CO001", categoria: "Consolas", nombre: "PlayStation 5", precio: 549990, stock: 5 },
    { id: "CG001", categoria: "Computadores Gamers", nombre: "PC Gamer ASUS ROG Strix", precio: 1299990, stock: 3 },
    { id: "SG001", categoria: "Sillas Gamers", nombre: "Silla Gamer Secretlab Titan", precio: 349990, stock: 7 },
    { id: "MS001", categoria: "Mouse", nombre: "Mouse Gamer Logitech G502 HERO", precio: 49990, stock: 15 },
    { id: "MP001", categoria: "Mousepad", nombre: "Mousepad Razer Goliathus Extended Chroma", precio: 29990, stock: 20 },
    { id: "PP001", categoria: "Poleras Personalizadas", nombre: "Polera Gamer Personalizada 'Level-Up'", precio: 14990, stock: 25 }
];


if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
}


function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}


function guardarProductos(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}


function agregarProducto(producto) {
    const productos = obtenerProductos();
    productos.push(producto); 
    guardarProductos(productos);
}


function editarProducto(id, datosActualizados) {
    const productos = obtenerProductos();
    const indice = productos.findIndex(p => p.id === id);
    if (indice !== -1) {
        productos[indice] = { ...productos[indice], ...datosActualizados };
        guardarProductos(productos);
    }
}


function eliminarProducto(id) {
    let productos = obtenerProductos();
    productos = productos.filter(p => p.id !== id);
    guardarProductos(productos);
}


function renderizarTabla() {
    const tabla = document.getElementById("tabla-productos");
    if (!tabla) return; 
    tabla.innerHTML = "";

    const productos = obtenerProductos();

    productos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>${p.precio.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td>${p.stock}</td>
            <td>
                <a href="editar.html?id=${p.id}" class="btn btn-sm btn-warning">Editar</a>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminar('${p.id}')">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}


function confirmarEliminar(id) {
    if (confirm("¿Desea eliminar este producto?")) {
        eliminarProducto(id);
        renderizarTabla();
    }
}


document.addEventListener("DOMContentLoaded", renderizarTabla);

function resetearProductos() {
    if (confirm("¿Seguro que quieres resetear la lista de productos?")) {
        localStorage.setItem("productos", JSON.stringify(productosIniciales));
        alert("Productos reseteados con éxito.");
        
        renderizarTabla();
    }
}