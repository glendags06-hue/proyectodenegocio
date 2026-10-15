console.log("Inventario.js se está ejecutando");

var urlInventario = "https://script.google.com/macros/s/AKfycbwtld-cH7wdVbi1WdBARp7x7rwC0tasX6wD8d4zm_QlMaLJ3FkGFTjjQPQ1nq2BcKq2HQ/exec";

var tablaInventario = document.getElementById("tablaInventario");
var mensajeInventario = document.getElementById("mensajeInventario");
var productosInventario = [];

function mostrarInventario(lista) {
    tablaInventario.innerHTML = "";

    if (!lista || lista.length === 0) {
        tablaInventario.innerHTML =
            '<tr><td colspan="4">No hay productos registrados.</td></tr>';
        return;
    }

    lista.forEach(function(producto) {
        var fila = document.createElement("tr");

        var nombre = producto[0];
        var stock = Number(producto[1]);
        var precio = Number(producto[2]);

        var celdaNombre = document.createElement("td");
        celdaNombre.textContent = nombre;

        var celdaStock = document.createElement("td");
        celdaStock.textContent = producto[1];

        var celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = "$" + precio.toFixed(2);

        var celdaEstado = document.createElement("td");

        if (stock <= 0) {
            celdaEstado.textContent = "Agotado";
        } else if (stock <= 10) {
            celdaEstado.textContent = "Stock bajo";
        } else {
            celdaEstado.textContent = "Disponible";
        }

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaStock);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaEstado);

        tablaInventario.appendChild(fila);
    });
}

fetch(urlInventario)
    .then(function(respuesta) {
        console.log("Respuesta recibida de Google Sheets:", respuesta.status);

        if (!respuesta.ok) {
            throw new Error("La consulta respondió con un error HTTP.");
        }

        return respuesta.json();
    })
    .then(function(datos) {
        console.log("Datos recibidos:", datos);

        if (!Array.isArray(datos)) {
            throw new Error("Los datos recibidos no son una lista de productos.");
        }

        productosInventario = datos;
        mostrarInventario(productosInventario);

        mensajeInventario.textContent =
            "Inventario cargado correctamente.";
    })
    .catch(function(error) {
        console.error("Error al cargar el inventario:", error);

        mensajeInventario.textContent =
            "No se pudo cargar el inventario. Revisa la consola del navegador.";

        tablaInventario.innerHTML =
            '<tr><td colspan="4">No se pudieron cargar los productos.</td></tr>';
    });

var botonTodo = document.getElementById("btnMostrarTodo");
var botonBajoStock = document.getElementById("btnBajoStock");

if (botonTodo) {
    botonTodo.addEventListener("click", function() {
        mostrarInventario(productosInventario);
    });
}

if (botonBajoStock) {
    botonBajoStock.addEventListener("click", function() {
        var productosFiltrados = productosInventario.filter(function(producto) {
            return Number(producto[1]) <= 10;
        });

        mostrarInventario(productosFiltrados);
    });
    
var botonFiltrarPrecio = document.getElementById("btnFiltrarPrecio");
var campoPrecio = document.getElementById("filtroPrecio");

if (botonFiltrarPrecio && campoPrecio) {
    botonFiltrarPrecio.addEventListener("click", function() {
        var precioMaximo = campoPrecio.value;

        if (precioMaximo.trim() === "" || Number(precioMaximo) < 0) {
            mensajeInventario.textContent =
                "Escribe un precio máximo válido.";
            return;
        }

        var productosFiltrados = productosInventario.filter(function(producto) {
            return Number(producto[2]) <= Number(precioMaximo);
        });

        mostrarInventario(productosFiltrados);

        mensajeInventario.textContent =
            "Productos con precio de hasta $" +
            Number(precioMaximo).toFixed(2) + ".";
    });
}

}
