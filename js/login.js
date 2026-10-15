
document.addEventListener("DOMContentLoaded", function () {
    var formulario = document.getElementById("formLogin");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var usuario = document.getElementById("usuario").value.trim().toLowerCase();
        var contrasena = document.getElementById("contrasena").value;

        if (usuario === "administrador" && contrasena === "admin123") {
            window.location.href = "./administrador/index.html";
        } else if (usuario === "almacenista" && contrasena === "almacen123") {
            window.location.href = "./almacenista/index.html";
        } else if (usuario === "cliente" && contrasena === "cliente123") {
            window.location.href = "./cliente/index.html";
        } else {
            document.getElementById("mensajeLogin").textContent =
                "Usuario o contraseña incorrectos.";
        }
    });
});
