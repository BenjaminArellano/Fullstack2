document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Validar sesión antes de agregar al carrito
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Debe iniciar sesión para agregar productos al carrito.");
        window.location.href = "../tienda/Login.html";
        return;
      }

      const payload = JSON.parse(atob(token));
      if (Date.now() > payload.exp) {
        localStorage.removeItem("token");
        alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "../tienda/Login.html";
        return;
      }

      // Si la sesión es válida, proceder con agregar al carrito
      const nombre = boton.getAttribute("data-nombre");
      const precio = parseInt(boton.getAttribute("data-precio"));

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      const productoExistente = carrito.find((item) => item.nombre === nombre);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));

      alert(`${nombre} agregado al carrito`);
    });
  });
});
