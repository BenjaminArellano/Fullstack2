const usuariosIniciales = [
    { id: 1, rut: "12345678-9", nombre: "Juan Pérez", email: "juan@duoc.cl", region: "Región Metropolitana", comuna: "Santiago", tipo: "alumno" },
    { id: 2, rut: "98765432-1", nombre: "María González", email: "maria@profesor.duoc.cl", region: "Región de Valparaíso", comuna: "Viña del Mar", tipo: "profesor" },
    { id: 3, rut: "11223344-5", nombre: "Carlos López", email: "carlos@gmail.com", region: "Región del Biobío", comuna: "Concepción", tipo: "alumno" },
    { id: 4, rut: "55667788-0", nombre: "Ana Rodríguez", email: "ana@duoc.cl", region: "Región Metropolitana", comuna: "Providencia", tipo: "alumno" },
    { id: 5, rut: "99887766-4", nombre: "Pedro Martínez", email: "pedro@profesor.duoc.cl", region: "Región de Los Lagos", comuna: "Puerto Montt", tipo: "profesor" }
];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function agregarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
}

function editarUsuario(id, datosActualizados) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice !== -1) {
        usuarios[indice] = { ...usuarios[indice], ...datosActualizados };
        guardarUsuarios(usuarios);
    }
}

function eliminarUsuario(id) {
    let usuarios = obtenerUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);
}

function generateUserId() {
    const usuarios = obtenerUsuarios();
    const maxId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0;
    return maxId + 1;
}

function validarRUT(rut) {

    rut = rut.toUpperCase();
    if (!/^\d{7,8}-?[\dK]$/.test(rut)) return false;

    if (rut.indexOf('-') === -1) {
        rut = rut.slice(0, -1) + '-' + rut.slice(-1);
    }
    const [numero, dv] = rut.split('-');
    let suma = 0;
    let multiplicador = 2;
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = suma % 11;
    const dvCalculado = 11 - resto === 11 ? '0' : 11 - resto === 10 ? 'K' : (11 - resto).toString();
    return dv === dvCalculado;
}

function validarEmailDominio(email) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
}

function poblarComunas(regionSelectId, comunaSelectId) {
    const regionSelect = document.getElementById(regionSelectId);
    const comunaSelect = document.getElementById(comunaSelectId);
    if (!regionSelect || !comunaSelect) return;

    regionSelect.addEventListener('change', function() {
        const region = this.value;
        comunaSelect.innerHTML = '<option value="" selected disabled>Seleccione una comuna</option>';
        if (regiones[region]) {
            regiones[region].forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });
}

let usuariosFiltrados = [];
let paginaActual = 1;
const itemsPorPagina = 5;

function renderizarTabla(usuarios = null) {
    const tabla = document.getElementById("tabla-usuarios");
    if (!tabla) return;
    tabla.innerHTML = "";

    const usuariosMostrar = usuarios || obtenerUsuarios();
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const usuariosPaginados = usuariosMostrar.slice(inicio, fin);

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
    renderizarTabla(usuariosFiltrados.length > 0 ? usuariosFiltrados : null);
}

function filtrarUsuarios(query) {
    const usuarios = obtenerUsuarios();
    usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
    paginaActual = 1;
    renderizarTabla(usuariosFiltrados);
}

function confirmarEliminar(id) {
    if (confirm("¿Desea eliminar este usuario?")) {
        eliminarUsuario(id);
        renderizarTabla();
    }
}

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
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById('usuarioAgregadoModal');
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
                usuariosFiltrados = [];
                paginaActual = 1;
                renderizarTabla();
            } else {
                filtrarUsuarios(query);
            }
        });
    }

    const form = document.getElementById('form-nuevo-usuario');
    if (form) {
        poblarComunas('region', 'comuna');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

    const formData = new FormData(this);
    let rut = formData.get('rut');
    const email = formData.get('email');


    if (rut.indexOf('-') === -1 && rut.length > 1) {
        rut = rut.slice(0, -1) + '-' + rut.slice(-1);
    }

    if (!validarRUT(rut)) {
        alert("RUT inválido. Debe ingresarse sin puntos y con guion, ej: 19011022-K");
        return;
    }

            if (!validarEmailDominio(email)) {
                alert("Email debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                return;
            }

            const usuario = {
                id: generateUserId(),
                rut: rut,
                nombre: formData.get('nombre'),
                email: email,
                region: formData.get('region'),
                comuna: formData.get('comuna'),
                tipo: formData.get('tipo')
            };

            agregarUsuario(usuario);
            setTimeout(() => {
                mostrarModalUsuarioAgregado();
            }, 100);
        });
    }

    const formEditar = document.getElementById('form-editar-usuario-modal');
    if (formEditar) {
        poblarComunas('edit-region-modal', 'edit-comuna-modal');
        formEditar.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            const id = parseInt(this.getAttribute('data-id'));
            const formData = new FormData(this);

            let rut = formData.get('rut');
            const email = formData.get('email');


            if (rut.indexOf('-') === -1 && rut.length > 1) {
                rut = rut.slice(0, -1) + '-' + rut.slice(-1);
            }

            if (!validarEmailDominio(email)) {
                alert("Email debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                return;
            }

            const datosActualizados = {
                rut: rut,
                nombre: formData.get('nombre'),
                email: email,
                region: formData.get('region'),
                comuna: formData.get('comuna'),
                tipo: formData.get('tipo')
            };

            editarUsuario(id, datosActualizados);
            alert("Usuario actualizado correctamente.");

            const modalElement = document.getElementById('editarUsuarioModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            renderizarTabla();
        });
    }
});

function resetearUsuarios() {
    if (confirm("¿Seguro que quieres resetear la lista de usuarios?")) {
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
        alert("Usuarios reseteados con éxito.");
        renderizarTabla();
    }
}

function abrirModalEditar(id) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    document.getElementById('edit-rut-modal').value = usuario.rut;
    document.getElementById('edit-nombre-modal').value = usuario.nombre;
    document.getElementById('edit-email-modal').value = usuario.email;

    const regionSelect = document.getElementById('edit-region-modal');
    regionSelect.value = usuario.region;

    regionSelect.dispatchEvent(new Event('change'));


    setTimeout(() => {
        document.getElementById('edit-comuna-modal').value = usuario.comuna;
    }, 100);

    const tipoSelect = document.getElementById('edit-tipo-modal');
    tipoSelect.value = usuario.tipo;

    const form = document.getElementById('form-editar-usuario-modal');
    form.setAttribute('data-id', id);
    form.classList.remove('was-validated');

    const modalElement = document.getElementById('editarUsuarioModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}
