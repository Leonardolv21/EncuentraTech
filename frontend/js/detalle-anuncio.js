document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get("id");

  if (!anuncioId) {
    document.body.innerHTML = "<p>Error: ID de anuncio no especificado</p>";
    return;
  }

  try {
    const res = await fetch(`/api/anuncios/detalle/${anuncioId}`);
    const anuncio = await res.json();

    if (!res.ok) {
      document.body.innerHTML = `<p>Error: ${anuncio.mensaje || "No se pudo cargar el anuncio"}</p>`;
      return;
    }

    // Imagen principal
    const imagenPrincipal = document.getElementById("imagen-anuncio");
    imagenPrincipal.src = anuncio.imagenes?.[0] || "img/default.png";

    // Galería
    const galeria = document.getElementById("galeria-imagenes");
    if (Array.isArray(anuncio.imagenes)) {
      galeria.innerHTML = "";

      anuncio.imagenes.forEach((imgUrl, index) => {
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
    document.getElementById("titulo-anuncio").textContent = anuncio.titulo;
    document.getElementById("precio-anuncio").textContent = `Bs. ${anuncio.precio}`;
    document.getElementById("descripcion-anuncio").textContent = anuncio.descripcion;
    document.getElementById("nombre-vendedor").textContent = anuncio.nombre_usuario;
    document.getElementById("correo-vendedor").textContent = anuncio.correo;

    // Clic sobre imagen principal para verla grande
    imagenPrincipal.addEventListener("click", () => {
      const nuevaVentana = window.open(imagenPrincipal.src, "_blank");
      nuevaVentana.focus();
    });

  } catch (error) {
      document.body.innerHTML = `<p>Error al conectar con el servidor</p><pre>${error.message}</pre>`;

      console.error("ERROR:", error);
  }
});
