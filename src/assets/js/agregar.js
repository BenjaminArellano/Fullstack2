// Archivo: ../assets/js/agregar.js

document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.getAttribute("data-nombre");
      const precio = parseInt(boton.getAttribute("data-precio"));

      // Recuperamos el carrito del localStorage o lo creamos vacío
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      // Buscamos si el producto ya está en el carrito
      const productoExistente = carrito.find((item) => item.nombre === nombre);
      if (productoExistente) {
        // Si ya existe, solo aumentamos cantidad
        productoExistente.cantidad++;
      } else {
        // Si no existe, lo agregamos
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      // Guardamos carrito actualizado en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));

      alert(`${nombre} agregado al carrito`);
    });
  });
});
