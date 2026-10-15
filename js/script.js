
// FUNCIONES GENERALES DE LA PASTELERIA

// Mostrar mensajes en pantalla
function mostrarMensaje(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
        elemento.classList.add("visible");
    }
}

// Actualizar el año automáticamente
document.addEventListener("DOMContentLoaded", () => {
    const anio = document.getElementById("anio");

    if (anio) {
        anio.textContent = new Date().getFullYear();
    }
});

// Cerrar sesión de demostración
function cerrarSesion() {
    window.location.href = "../index.html";
}
