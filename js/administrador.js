
function cargarVentas() {
    var ventas = [];

    try {
        ventas = JSON.parse(
            localStorage.getItem("ventasPasteleria") || "[]"
        );
    } catch (error) {
        console.error("No se pudieron leer las ventas:", error);
    }

    var totalVentas = document.getElementById("totalVentas");
    var totalDinero = document.getElementById("totalDinero");
    var tablaVentas = document.getElementById("tablaVentas");

    if (!totalVentas || !totalDinero || !tablaVentas) {
        console.error(
            "Revisa que existan los elementos totalVentas, totalDinero y tablaVentas en el HTML."
        );
        return;
    }

    totalVentas.textContent = ventas.length;

    var dinero = ventas.reduce(function(suma, venta) {
        return suma + Number(venta.total || 0);
    }, 0);

    totalDinero.textContent = "$" + dinero.toFixed(2);
    tablaVentas.innerHTML = "";

    if (ventas.length === 0) {
        var filaVacia = document.createElement("tr");
        var celdaVacia = document.createElement("td");

        celdaVacia.colSpan = 4;
        celdaVacia.textContent = "Todavía no hay pedidos registrados.";

        filaVacia.appendChild(celdaVacia);
        tablaVentas.appendChild(filaVacia);
        return;
    }

    ventas.forEach(function(venta) {
        var fila = document.createElement("tr");

        [
            venta.cliente,
            venta.cantidad,
            venta.correo,
            venta.tipo
        ].forEach(function(valor) {
            var celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        tablaVentas.appendChild(fila);
    });
}

cargarVentas();
