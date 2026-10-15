var url = "https://script.google.com/macros/s/AKfycbwtld-cH7wdVbi1WdBARp7x7rwC0tasX6wD8d4zm_QlMaLJ3FkGFTjjQPQ1nq2BcKq2HQ/exec";
var urlVentas = "https://script.google.com/macros/s/AKfycbzRU9oR7lrsNW_LsXddTU9yzNyPHHxEfti1EmYwlqF39n4bz8zOZ1fCyR2-nUEkJbZOQg/exec";
var productos =[];
var carrito = [];
// Nombres de las imágenes guardadas en la carpeta IMG
var imagenesProductos = {
    "tiramisu": "tiramisu.jpg",
    "carlota de limon": "Carlota de limón en vasitos.jpg",
    "gelatina de mosaico": "gelatinademosaico.jpg",
    "arroz con leche": "arrozconleche.jpg",
    "flan napolitano": "flanapolitano.jpg",
    "pay de manzana": "paydemanzana.jpg",
    "pay de limon": "paydelimon.jpg",
    "dona de fresa": "donadefresa.jpg",
    "dona glaseada": "donaglaseada.jpg",
    "dona de chocolate": "donadechocolate.jpg",
    "cupcake de fresa": "cupcakedefresa.jpg",
    "cupcake de chocolate": "cupcakedechocolate.jpg",
    "cupcake de vainilla": "cupcakevainilla.jpg",
    "brownie con nuez": "brownienuez.jpg",
    "brownie de chocolate": "browniechocolate.jpg",
    "cheesecake de chocolate": "cheessecakechocolate.jpg",
    "cheesecake de fresa": "cheesecakefresa.jpg",
    "rebanada de pastel de fresa": "rebanadadefresa.jpg",
    "rebanada de pastel de chocolate": "rebanadadechocolate.jpg",
    "rebanada de pastel de zanahoria": "pasteldezanahoria.jpg"
};

// Elementos de la página
var contenedorProductos = document.getElementById("listaProductos");
var tablaCarrito = document.getElementById("tablaCarrito");
var totalCarrito = document.getElementById("totalCarrito");
var formulario = document.getElementById("formPedido");
var mensajePedido = document.getElementById("mensajePedido");

var campoPrecioCliente = document.getElementById("filtroPrecioCliente");
var botonFiltrarPrecioCliente = document.getElementById("btnFiltrarPrecioCliente");
var botonMostrarDisponibles = document.getElementById("btnMostrarDisponibles");
var botonMostrarCatalogo = document.getElementById("btnMostrarCatalogo");

// Normalizar nombres para reconocer acentos y espacios
function normalizarNombre(nombre) {
    return String(nombre || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ");
}

// Obtener la ruta de la imagen desde la carpeta IMG
function obtenerImagen(nombre) {
    var nombreNormalizado = normalizarNombre(nombre);
    var archivo = imagenesProductos[nombreNormalizado];

    if (!archivo) {
        console.warn("No hay imagen asignada para:", nombre);
        return null;
    }

    return "../IMG/" + archivo;
}

// Cargar productos desde Google Sheets
fetch(url)
    .then(function(respuesta) {
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }
        return respuesta.json();
    })
    .then(function(datos) {
        productos = datos;
        mostrarProductos(productos);
    })
    .catch(function(error) {
        console.error("Error al cargar productos:", error);
        contenedorProductos.textContent =
            "No se pudieron cargar los productos. Intenta actualizar la página.";
    });

// Mostrar productos en el catálogo
function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        contenedorProductos.textContent =
            "No hay pasteles que coincidan con el filtro.";
        return;
    }

    lista.forEach(function(producto) {
        var indiceOriginal = productos.indexOf(producto);
        var nombre = producto[0];
        var stock = Number(producto[1]);
        var precio = Number(producto[2]);

        var tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        // Imagen del producto
        var rutaImagen = obtenerImagen(nombre);

        if (rutaImagen) {
            var imagen = document.createElement("img");
            imagen.src = rutaImagen;
            imagen.alt = nombre;
            imagen.className = "imagen-producto";
            imagen.loading = "lazy";

            imagen.onerror = function() {
                console.warn("No se encontró la imagen:", rutaImagen);
                imagen.style.display = "none";
            };

            tarjeta.appendChild(imagen);
        }

        // Nombre del producto
        var titulo = document.createElement("h3");
        titulo.textContent = nombre;
        tarjeta.appendChild(titulo);

        // Precio
        var precioTexto = document.createElement("p");
        precioTexto.className = "precio-producto";
        precioTexto.textContent = "$" + precio.toFixed(2);
        tarjeta.appendChild(precioTexto);

        // Disponibilidad
        var disponibilidad = document.createElement("p");
        disponibilidad.className = "disponibilidad-producto";
        disponibilidad.textContent =
            stock > 0 ? "Disponible" : "Agotado";
        tarjeta.appendChild(disponibilidad);

        // Botón para agregar al carrito
        if (stock > 0) {
            var boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = "Agregar al carrito";

            boton.addEventListener("click", function() {
                agregarAlCarrito(indiceOriginal);
            });

            tarjeta.appendChild(boton);
        }

        contenedorProductos.appendChild(tarjeta);
    });
}

// Agregar productos al carrito
function agregarAlCarrito(indice) {
    var producto = productos[indice];
    var nombre = producto[0];
    var stock = Number(producto[1]);
    var precio = Number(producto[2]);

    var existente = carrito.find(function(item) {
        return item.nombre === nombre;
    });

    if (existente) {
        if (existente.cantidad >= stock) {
            alert("No hay más existencias disponibles.");
            return;
        }

        existente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            stock: stock
        });
    }

    mostrarCarrito();
}

// Cambiar cantidad de productos en el carrito
function cambiarCantidad(indice, cambio) {
    var item = carrito[indice];

    if (cambio > 0 && item.cantidad >= item.stock) {
        alert("No hay más existencias disponibles.");
        return;
    }

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    mostrarCarrito();
}

// Mostrar el carrito y calcular el total
function mostrarCarrito() {
    tablaCarrito.innerHTML = "";
    var total = 0;

    if (carrito.length === 0) {
        var filaVacia = document.createElement("tr");
        var celdaVacia = document.createElement("td");

        celdaVacia.colSpan = 5;
        celdaVacia.textContent = "Tu carrito está vacío.";

        filaVacia.appendChild(celdaVacia);
        tablaCarrito.appendChild(filaVacia);
    }

    carrito.forEach(function(item, indice) {
        var subtotal = item.precio * item.cantidad;
        total += subtotal;

        var fila = document.createElement("tr");

        [
            item.nombre,
            "$" + item.precio.toFixed(2),
            item.cantidad,
            "$" + subtotal.toFixed(2)
        ].forEach(function(valor) {
            var celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        var acciones = document.createElement("td");

        var quitar = document.createElement("button");
        quitar.type = "button";
        quitar.textContent = "−";
        quitar.addEventListener("click", function() {
            cambiarCantidad(indice, -1);
        });

        var agregar = document.createElement("button");
        agregar.type = "button";
        agregar.textContent = "+";
        agregar.addEventListener("click", function() {
            cambiarCantidad(indice, 1);
        });

        acciones.appendChild(quitar);
        acciones.appendChild(agregar);
        fila.appendChild(acciones);
        tablaCarrito.appendChild(fila);
    });

    totalCarrito.textContent = "$" + total.toFixed(2);
}

// Registrar pedidos
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (carrito.length === 0) {
        mensajePedido.textContent =
            "Agrega al menos un pastel antes de registrar el pedido.";
        return;
    }

    var nombre = document.getElementById("nombreCliente").value.trim();
    var correo = document.getElementById("correoCliente").value.trim();
    var observaciones =
        document.getElementById("observaciones").value.trim();

    if (!nombre || !correo) {
        mensajePedido.textContent =
            "Completa tu nombre y correo electrónico.";
        return;
    }

    var ventas = [];

    try {
        ventas = JSON.parse(
            localStorage.getItem("ventasPasteleria") || "[]"
        );
    } catch (error) {
        mensajePedido.textContent =
            "No se pudieron leer los pedidos guardados.";
        return;
    }

    var pedido = {
        id: Date.now(),
        cliente: nombre,
        correo: correo,
        cantidad: carrito.reduce(function(suma, item) {
            return suma + item.cantidad;
        }, 0),
        tipo: carrito.map(function(item) {
            return item.nombre + " x" + item.cantidad;
        }).join(", "),
        productos: carrito.map(function(item) {
            return {
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                subtotal: item.precio * item.cantidad
            };
        }),
        total: carrito.reduce(function(suma, item) {
            return suma + item.precio * item.cantidad;
        }, 0),
        observaciones: observaciones,
        fecha: new Date().toLocaleString("es-MX"),
        estado: "Pendiente"
    };

   
ventas.push(pedido);

try {
    localStorage.setItem(
        "ventasPasteleria",
        JSON.stringify(ventas)
    );
} catch (error) {
    mensajePedido.textContent =
        "No se pudo guardar el pedido en este navegador.";
    return;
}

fetch(urlVentas, {
    method: "POST",
    body: JSON.stringify(pedido)
})
.then(function(respuesta) {
    console.log("Respuesta del envío:", respuesta);
})
.catch(function(error) {
    console.error("Error al enviar la venta:", error);
});



    mensajePedido.textContent =
        "¡Pedido registrado correctamente! Total: $" +
        pedido.total.toFixed(2);

    mensajePedido.style.display = "block";
    mensajePedido.style.color = "#287a3d";
    mensajePedido.style.fontWeight = "bold";

    formulario.reset();
    carrito = [];
    mostrarCarrito();
});

// Filtrar por precio máximo
if (botonFiltrarPrecioCliente) {
    botonFiltrarPrecioCliente.addEventListener("click", function() {
        var valor = campoPrecioCliente.value;

        if (valor.trim() === "" || Number(valor) < 0) {
            alert("Escribe un precio máximo válido.");
            return;
        }

        var filtrados = productos.filter(function(producto) {
            return Number(producto[2]) <= Number(valor);
        });

        mostrarProductos(filtrados);
    });
}

// Mostrar productos disponibles
if (botonMostrarDisponibles) {
    botonMostrarDisponibles.addEventListener("click", function() {
        var disponibles = productos.filter(function(producto) {
            return Number(producto[1]) > 0;
        });

        mostrarProductos(disponibles);
    });
}
// Mostrar todos los productos
if (botonMostrarCatalogo) {
    botonMostrarCatalogo.addEventListener("click", function() {
        mostrarProductos(productos);
    });
}
