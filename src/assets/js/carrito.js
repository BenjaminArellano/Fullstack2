document.addEventListener("DOMContentLoaded", () => {
  const tablaCarrito = document.querySelector("#tablaCarrito tbody");
  const totalElemento = document.getElementById("total");
  const btnLimpiar = document.getElementById("btnLimpiar");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCarrito() {
    tablaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const fila = `
        <tr>
          <td>${producto.nombre}</td>
          <td>$${producto.precio.toLocaleString()} CLP</td>
          <td>${producto.cantidad}</td>
          <td>$${subtotal.toLocaleString()} CLP</td>
        </tr>
      `;
      tablaCarrito.innerHTML += fila;
    });

    totalElemento.textContent = `Total: $${total.toLocaleString()} CLP`;
  }

  renderCarrito();


  btnLimpiar.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    carrito = [];
    renderCarrito();
    alert("Se ha vaciado el carrito con exito");
  });


  btnCompra.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    carrito = [];
    renderCarrito();
    alert("Se ha comprado con exito");
  });
});
