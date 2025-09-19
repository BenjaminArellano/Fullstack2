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

const prefijos = {
    "Juegos de Mesa": "JM",
    "Accesorios": "AC",
    "Consolas": "CO",
    "Computadores Gamers": "CG",
    "Sillas Gamers": "SG",
    "Mouse": "MS",
    "Mousepad": "MP",
    "Poleras Personalizadas": "PP"
};

function generateId(categoria) {
    const productos = obtenerProductos();
    const prefijo = prefijos[categoria];
    if (!prefijo) return null;
    const idsCategoria = productos.filter(p => p.categoria === categoria).map(p => p.id);
    let maxNum = 0;
    idsCategoria.forEach(id => {
        if (id.startsWith(prefijo)) {
            const num = parseInt(id.slice(prefijo.length));
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    const nextNum = maxNum + 1;
    return prefijo + nextNum.toString().padStart(3, '0');
}

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

let productosFiltrados = [];
let paginaActual = 1;
const itemsPorPagina = 5;

function renderizarTabla(productos = null) {
    const tabla = document.getElementById("tabla-productos");
    if (!tabla) return;
    tabla.innerHTML = "";

    const productosMostrar = productos || obtenerProductos();
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const productosPaginados = productosMostrar.slice(inicio, fin);

    productosPaginados.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>${p.precio.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td>${p.stock}</td>
            <td>
                <a href="editar.html?id=${p.id}" class="btn btn-sm btn-warning me-1" title="Editar">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminar('${p.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    renderizarPaginacion(productosMostrar.length);
}

function renderizarPaginacion(totalItems) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

    if (totalPaginas <= 1) return;


    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);


    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>`;
        pagination.appendChild(li);
    }


    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a>`;
    pagination.appendChild(nextLi);
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    renderizarTabla(productosFiltrados.length > 0 ? productosFiltrados : null);
}

function filtrarProductos(query) {
    const productos = obtenerProductos();
    productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.categoria.toLowerCase().includes(query.toLowerCase())
    );
    paginaActual = 1;
    renderizarTabla(productosFiltrados);
}

function confirmarEliminar(id) {
    if (confirm("¿Desea eliminar este producto?")) {
        eliminarProducto(id);
        renderizarTabla();
    }
}

function mostrarModalProductoAgregado() {
    const modalHtml = `
    <div class="modal fade" id="productoAgregadoModal" tabindex="-1" aria-labelledby="productoAgregadoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header">
                    <h5 class="modal-title" id="productoAgregadoModalLabel">Producto Agregado</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    Producto agregado correctamente.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="modalCerrarBtn">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById('productoAgregadoModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    const cerrarBtn = document.getElementById('modalCerrarBtn');
    cerrarBtn.addEventListener('click', () => {
        modal.hide();
        modalElement.remove();
        window.location.href = 'listado.html';
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
        window.location.href = 'listado.html';
    });
}



document.addEventListener("DOMContentLoaded", function() {
    renderizarTabla();


    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query === '') {
                productosFiltrados = [];
                paginaActual = 1;
                renderizarTabla();
            } else {
                filtrarProductos(query);
            }
        });
    }


    const form = document.getElementById('form-nuevo-producto');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            const formData = new FormData(this);
            const producto = {
                id: generateId(formData.get('categoria')),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion') || '',
                precio: parseFloat(formData.get('precio')),
                stock: parseInt(formData.get('stock')),
                stockCritico: formData.get('stockCritico') ? parseInt(formData.get('stockCritico')) : 0,
                categoria: formData.get('categoria')
            };

            agregarProducto(producto);
            setTimeout(() => {
                mostrarModalProductoAgregado();
            }, 100);
        });
    }


});

function resetearProductos() {
    if (confirm("¿Seguro que quieres resetear la lista de productos?")) {
        localStorage.setItem("productos", JSON.stringify(productosIniciales));
        alert("Productos reseteados con éxito.");
        
        renderizarTabla();
    }
}
