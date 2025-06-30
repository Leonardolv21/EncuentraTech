document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputContrasena = document.getElementById("contrasena");

    const msgErrorNombre = document.getElementById("error-nombre");
    const msgErrorCorreo = document.getElementById("error-correo");
    const msgErrorContrasena = document.getElementById("error-contrasena");

    msgErrorNombre.innerHTML = "";
    msgErrorCorreo.innerHTML = "";
    msgErrorContrasena.innerHTML = "";

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value.trim();

    let hayError = false;

    if (nombre === "") {
      msgErrorNombre.innerHTML = "Debe ingresar su nombre completo";
      hayError = true;
    }

    if (correo === "") {
      msgErrorCorreo.innerHTML = "Debe ingresar su correo electrónico";
      hayError = true;
    } else if (!esEmailValido(correo)) {
      msgErrorCorreo.innerHTML = "Correo inválido";
      hayError = true;
    }

    if (contrasena.length < 6) {
      msgErrorContrasena.innerHTML = "La contraseña debe tener al menos 6 caracteres";
      hayError = true;
    }

    if (hayError) return;

    try {
      const respuesta = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      const respuestaJson = await respuesta.json();

      if (respuesta.ok) {
        alert("Registro exitoso");
        window.location.href = "inicio-sesion.html";
        

      } else {
        msgErrorCorreo.innerHTML = respuestaJson.mensaje || "Error al registrar";
      }
    } catch (err) {
      msgErrorCorreo.innerHTML = "Error al conectar con el servidor";
    }
  });

  function esEmailValido(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
});
