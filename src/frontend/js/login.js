document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputCorreo = document.getElementById("correo");
    const inputContrasena = document.getElementById("contrasena");

    const msgErrorCorreo = document.getElementById("error-correo");
    const msgErrorContrasena = document.getElementById("error-contrasena");
    const msgErrorGeneral = document.getElementById("error-general");

    msgErrorCorreo.innerHTML = "";
    msgErrorContrasena.innerHTML = "";
    msgErrorGeneral.innerHTML = "";

    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value.trim();

    let hayError = false;

    if (correo === "") {
      msgErrorCorreo.innerHTML = "Debe ingresar su correo electrónico";
      hayError = true;
    } else if (!esEmailValido(correo)) {
      msgErrorCorreo.innerHTML = "Correo inválido";
      hayError = true;
    }

    if (contrasena === "") {
      msgErrorContrasena.innerHTML = "Debe ingresar su contraseña";
      hayError = true;
    }

    if (hayError) return;

    try {
      const respuesta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const respuestaJson = await respuesta.json();

    if (respuesta.ok) {
        localStorage.setItem("usuario_id", respuestaJson.usuario.id);

      msgErrorGeneral.innerHTML = "Inicio de sesión exitoso. Redirigiendo...";
      setTimeout(() => {
      window.location.href = "index.html";
     }, 1000);
      }else {
        msgErrorGeneral.innerHTML = respuestaJson.mensaje || "Credenciales incorrectas";
      }
    } catch (err) {
      msgErrorGeneral.innerHTML = "Error al conectar con el servidor";
    }
  });

  function esEmailValido(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
});
