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

    document.getElementById("imagen-anuncio").src = anuncio.imagen_url || "img/default.png";
    document.getElementById("titulo-anuncio").textContent = anuncio.titulo;
    document.getElementById("precio-anuncio").textContent = `Bs. ${anuncio.precio}`;
    document.getElementById("descripcion-anuncio").textContent = anuncio.descripcion;
    document.getElementById("nombre-vendedor").textContent = anuncio.nombre_usuario;
    document.getElementById("correo-vendedor").textContent = anuncio.correo;
  } catch (error) {
    document.body.innerHTML = "<p>Error al conectar con el servidor</p>";
  }
});
