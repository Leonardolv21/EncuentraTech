document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get("id");

  if (!anuncioId) {
    document.body.innerHTML = "<p>Error: ID de anuncio no especificado</p>";
    return;
  }

  let anuncioData = null; // Variable para almacenar los datos del anuncio

  try {
    const res = await fetch(`/api/anuncios/detalle/${anuncioId}`);
    anuncioData = await res.json();

    if (!res.ok) {
      document.body.innerHTML = `<p>Error: ${anuncioData.mensaje || "No se pudo cargar el anuncio"}</p>`;
      return;
    }

    // Imagen principal
    const imagenPrincipal = document.getElementById("imagen-anuncio");
    imagenPrincipal.src = anuncioData.imagenes?.[0] || "img/default.png";

    // Galería
    const galeria = document.getElementById("galeria-imagenes");
    if (Array.isArray(anuncioData.imagenes)) {
      galeria.innerHTML = "";

      anuncioData.imagenes.forEach((imgUrl, index) => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `Imagen ${index + 1}`;

        // Al hacer clic en la miniatura => se cambia la imagen principal
        img.addEventListener("click", () => {
          imagenPrincipal.src = imgUrl;
        });

        galeria.appendChild(img);
      });
    }

    // Otros datos
    document.getElementById("titulo-anuncio").textContent = anuncioData.titulo;
    document.getElementById("precio-anuncio").textContent = `Bs. ${anuncioData.precio}`;
    document.getElementById("descripcion-anuncio").textContent = anuncioData.descripcion;
    document.getElementById("nombre-vendedor").textContent = anuncioData.nombre_usuario;
    document.getElementById("correo-vendedor").textContent = anuncioData.correo;

    // Clic sobre imagen principal para verla grande
    imagenPrincipal.addEventListener("click", () => {
      const nuevaVentana = window.open(imagenPrincipal.src, "_blank");
      nuevaVentana.focus();
    });

    // Lógica para el botón \'Enviar Mensaje\'
    const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    if (btnEnviarMensaje) {
      btnEnviarMensaje.addEventListener("click", async () => {
        // Obtener el ID del usuario logueado desde localStorage
        const interesadoId = localStorage.getItem("usuario_id"); // CAMBIO AQUÍ: de "userId" a "usuario_id"

        if (!interesadoId) {
          alert("Error: No se pudo obtener el ID del usuario logueado desde localStorage. Asegúrate de que el usuario haya iniciado sesión y su ID esté guardado.");
          return;
        }

        const anuncianteId = anuncioData.usuario_id; // Asumiendo que el anuncioData incluye el usuario_id del anunciante

        if (!anuncianteId) {
          alert("Error: No se pudo obtener el ID del anunciante.");
          return;
        }

        try {
          const response = await fetch("/api/conversaciones/buscar-o-crear", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              anuncio_id: anuncioId,
              interesado_id: interesadoId,
              anunciante_id: anuncianteId,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            window.location.href = `/chat-compras.html?conversacionId=${data.id}&anuncioId=${anuncioId}`; // Redirigir a chat-compras
          } else {
            alert(`Error al buscar o crear conversación: ${data.mensaje}`);
          }
        } catch (error) {
          console.error("Error al enviar mensaje:", error);
          alert("Error de conexión al intentar iniciar el chat.");
        }
      });
    }

  } catch (error) {
      document.body.innerHTML = `<p>Error al conectar con el servidor</p><pre>${error.message}</pre>`;

      console.error("ERROR:", error);
  }
});

