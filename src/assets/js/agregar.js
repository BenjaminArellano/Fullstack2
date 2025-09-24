document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
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
