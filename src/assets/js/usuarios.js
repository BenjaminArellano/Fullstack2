// Array de usuarios iniciales para poblar la aplicación al cargar por primera vez
const usuariosIniciales = [
    { id: 1, rut: "12345678-9", nombre: "Juan Pérez", email: "juan@duoc.cl", region: "Región Metropolitana", comuna: "Santiago", tipo: "Cliente" },
    { id: 2, rut: "98765432-1", nombre: "María González", email: "maria@profesor.duoc.cl", region: "Región de Valparaíso", comuna: "Viña del Mar", tipo: "Cliente" },
    { id: 3, rut: "11223344-5", nombre: "Carlos López", email: "carlos@gmail.com", region: "Región del Biobío", comuna: "Concepción", tipo: "Cliente" },
    { id: 4, rut: "55667788-0", nombre: "Ana Rodríguez", email: "ana@duoc.cl", region: "Región Metropolitana", comuna: "Providencia", tipo: "Cliente" },
    { id: 5, rut: "99887766-4", nombre: "Pedro Martínez", email: "pedro@profesor.duoc.cl", region: "Región de Los Lagos", comuna: "Puerto Montt", tipo: "Cliente" }
];

// Inicializar localStorage con usuarios por defecto si no existe
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}

// Función para obtener todos los usuarios desde localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Función para guardar la lista completa de usuarios en localStorage
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Función para agregar un nuevo usuario al sistema
function agregarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
}

// Función para editar un usuario existente por su ID
function editarUsuario(id, datosActualizados) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice !== -1) {
        usuarios[indice] = { ...usuarios[indice], ...datosActualizados };
        guardarUsuarios(usuarios);
    }
}

// Función para eliminar un usuario por su ID
function eliminarUsuario(id) {
    let usuarios = obtenerUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);
}

// Función para generar un ID único para nuevos usuarios
function generateUserId() {
    const usuarios = obtenerUsuarios();
    const maxId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0;
    return maxId + 1;
}

// Función para validar el formato y dígito verificador de un RUT chileno
function validarRUT(rut) {
    // Convertir a mayúsculas para manejar tanto 'k' como 'K'
    rut = rut.toUpperCase();
    if (!/^\d{7,8}-?[\dK]$/.test(rut)) return false;

    // Agregar guion si no está presente
    if (rut.indexOf('-') === -1) {
        rut = rut.slice(0, -1) + '-' + rut.slice(-1);
    }
    const [numero, dv] = rut.split('-');
    let suma = 0;
    let multiplicador = 2;
    // Calcular dígito verificador usando algoritmo módulo 11
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = suma % 11;
    const dvCalculado = 11 - resto === 11 ? '0' : 11 - resto === 10 ? 'K' : (11 - resto).toString();
    return dv === dvCalculado;
}

// Función para validar que el email tenga un dominio permitido
function validarEmailDominio(email) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
}

// Función para poblar dinámicamente el select de comunas basado en la región seleccionada
function poblarComunas(regionSelectId, comunaSelectId) {
    const regionSelect = document.getElementById(regionSelectId);
    const comunaSelect = document.getElementById(comunaSelectId);
    if (!regionSelect || !comunaSelect) return;

    regionSelect.addEventListener('change', function() {
        const region = this.value;
        // Limpiar opciones anteriores y agregar placeholder
        comunaSelect.innerHTML = '<option value="" selected disabled>Seleccione una comuna</option>';
        if (regiones[region]) {
            // Agregar cada comuna como opción del select
            regiones[region].forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });
}

// Variables globales para el sistema de paginación y filtrado
let usuariosFiltrados = []; // Array para almacenar usuarios filtrados por búsqueda
let paginaActual = 1; // Página actual en la paginación
const itemsPorPagina = 5; // Número de elementos a mostrar por página

// Función para renderizar la tabla de usuarios con paginación
function renderizarTabla(usuarios = null) {
    const tabla = document.getElementById("tabla-usuarios");
    if (!tabla) return;
    tabla.innerHTML = ""; // Limpiar tabla antes de renderizar

    const usuariosMostrar = usuarios || obtenerUsuarios();
    // Calcular índices para paginación
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const usuariosPaginados = usuariosMostrar.slice(inicio, fin);

    // Crear fila para cada usuario con botones de editar y eliminar
    usuariosPaginados.forEach(u => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.id}</td>
            <td>${u.rut}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.region}</td>
            <td>${u.comuna}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="abrirModalEditar(${u.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminar(${u.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    renderizarPaginacion(usuariosMostrar.length);
}

// Función para renderizar la paginación de la tabla de usuarios
function renderizarPaginacion(totalItems) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = ""; // Limpiar paginación anterior

    const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

    // No mostrar paginación si solo hay una página
    if (totalPaginas <= 1) return;

    // Crear botón "Anterior"
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);

    // Crear botones numéricos de página
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>`;
        pagination.appendChild(li);
    }

    // Crear botón "Siguiente"
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a>`;
    pagination.appendChild(nextLi);
}

// Función para cambiar la página actual en la paginación
function cambiarPagina(pagina) {
    paginaActual = pagina;
    renderizarTabla(usuariosFiltrados.length > 0 ? usuariosFiltrados : null);
}

// Función para filtrar usuarios por nombre o email
function filtrarUsuarios(query) {
    const usuarios = obtenerUsuarios();
    usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
    paginaActual = 1; // Resetear a primera página al filtrar
    renderizarTabla(usuariosFiltrados);
}

// Función para confirmar y ejecutar la eliminación de un usuario
function confirmarEliminar(id) {
    if (confirm("¿Desea eliminar este usuario?")) {
        eliminarUsuario(id);
        renderizarTabla();
    }
}

// Función para mostrar modal de confirmación cuando se agrega un usuario exitosamente
function mostrarModalUsuarioAgregado() {
    const modalHtml = `
    <div class="modal fade" id="usuarioAgregadoModal" tabindex="-1" aria-labelledby="usuarioAgregadoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header">
                    <h5 class="modal-title" id="usuarioAgregadoModalLabel">Usuario Agregado</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    Usuario agregado correctamente.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="modalCerrarBtn">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    // Agregar modal al DOM dinámicamente
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById('usuarioAgregadoModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    const cerrarBtn = document.getElementById('modalCerrarBtn');
    // Manejar evento de cierre del modal
    cerrarBtn.addEventListener('click', () => {
        modal.hide();
        modalElement.remove();
        window.location.href = 'listado.html';
    });

    // Limpiar modal del DOM cuando se cierre
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
        window.location.href = 'listado.html';
    });
}

// Event listener principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar la tabla al cargar la página
    renderizarTabla();

    // Configurar funcionalidad de búsqueda en tiempo real
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query === '') {
                // Si no hay búsqueda, mostrar todos los usuarios
                usuariosFiltrados = [];
                paginaActual = 1;
                renderizarTabla();
            } else {
                // Filtrar usuarios según la consulta
                filtrarUsuarios(query);
            }
        });
    }

    // Configurar formulario para agregar nuevos usuarios
    const form = document.getElementById('form-nuevo-usuario');
    if (form) {
        // Inicializar selector de comunas
        poblarComunas('region', 'comuna');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Validar formulario HTML5
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            const formData = new FormData(this);
            let rut = formData.get('rut');
            const email = formData.get('email');

            // Formatear RUT agregando guion si es necesario
            if (rut.indexOf('-') === -1 && rut.length > 1) {
                rut = rut.slice(0, -1) + '-' + rut.slice(-1);
            }

            // Validar RUT y email
            if (!validarRUT(rut)) {
                alert("RUT inválido. Debe ingresarse sin puntos y con guion, ej: 19011022-K");
                return;
            }

            if (!validarEmailDominio(email)) {
                alert("Email debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                return;
            }

            // Crear objeto usuario con los datos del formulario
            const usuario = {
                id: generateUserId(),
                rut: rut,
                nombre: formData.get('nombre'),
                email: email,
                region: formData.get('region'),
                comuna: formData.get('comuna'),
                tipo: formData.get('tipo')
            };

            // Guardar usuario y mostrar modal de confirmación
            agregarUsuario(usuario);
            setTimeout(() => {
                mostrarModalUsuarioAgregado();
            }, 100);
        });
    }

    // Configurar formulario para editar usuarios existentes
    const formEditar = document.getElementById('form-editar-usuario-modal');
    if (formEditar) {
        // Inicializar selector de comunas para edición
        poblarComunas('edit-region-modal', 'edit-comuna-modal');
        formEditar.addEventListener('submit', function(event) {
            event.preventDefault();
            // Validar formulario HTML5
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            const id = parseInt(this.getAttribute('data-id'));
            const formData = new FormData(this);

            let rut = formData.get('rut');
            const email = formData.get('email');

            // Formatear RUT agregando guion si es necesario
            if (rut.indexOf('-') === -1 && rut.length > 1) {
                rut = rut.slice(0, -1) + '-' + rut.slice(-1);
            }

            // Validar email
            if (!validarEmailDominio(email)) {
                alert("Email debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                return;
            }

            // Crear objeto con datos actualizados
            const datosActualizados = {
                rut: rut,
                nombre: formData.get('nombre'),
                email: email,
                region: formData.get('region'),
                comuna: formData.get('comuna'),
                tipo: formData.get('tipo')
            };

            // Actualizar usuario y cerrar modal
            editarUsuario(id, datosActualizados);
            alert("Usuario actualizado correctamente.");

            const modalElement = document.getElementById('editarUsuarioModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            // Refrescar tabla para mostrar cambios
            renderizarTabla();
        });
    }
});

// Función para resetear la lista de usuarios a los valores iniciales
function resetearUsuarios() {
    if (confirm("¿Seguro que quieres resetear la lista de usuarios?")) {
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
        alert("Usuarios reseteados con éxito.");
        renderizarTabla();
    }
}

// Función para abrir el modal de edición con los datos del usuario seleccionado
function abrirModalEditar(id) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    // Llenar los campos del modal con los datos del usuario
    document.getElementById('edit-rut-modal').value = usuario.rut;
    document.getElementById('edit-nombre-modal').value = usuario.nombre;
    document.getElementById('edit-email-modal').value = usuario.email;

    const regionSelect = document.getElementById('edit-region-modal');
    regionSelect.value = usuario.region;

    // Disparar evento change para actualizar las comunas disponibles
    regionSelect.dispatchEvent(new Event('change'));

    // Usar setTimeout para asegurar que las comunas se hayan cargado antes de seleccionar
    setTimeout(() => {
        document.getElementById('edit-comuna-modal').value = usuario.comuna;
    }, 100);

    const tipoSelect = document.getElementById('edit-tipo-modal');
    tipoSelect.value = usuario.tipo;

    const form = document.getElementById('form-editar-usuario-modal');
    form.setAttribute('data-id', id);
    form.classList.remove('was-validated');

    // Mostrar el modal de edición
    const modalElement = document.getElementById('editarUsuarioModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}
