document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-anuncio");
  const btnCrear = document.getElementById("btn-crear");
  const btnCancelar = document.getElementById("btn-cancelar");
  const form = document.getElementById("form-anuncio");
  const errorGeneral = document.getElementById("error-general");
  const contenedor = document.getElementById("lista-anuncios");

  btnCrear.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    limpiarErrores();
  });

  function limpiarErrores() {
    document.getElementById("error-titulo").innerHTML = "";
    document.getElementById("error-descripcion").innerHTML = "";
    document.getElementById("error-precio").innerHTML = "";
    document.getElementById("error-categoria").innerHTML = "";
    document.getElementById("error-imagenes").innerHTML = "";
    errorGeneral.innerHTML = "";
    errorGeneral.style.color = "red";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarErrores();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria_id = parseInt(document.getElementById("categoria").value);
    const imagenes = document.getElementById("imagenes").files;
    const usuario_id = localStorage.getItem("usuario_id");

    let hayError = false;

    if (!titulo) {
      document.getElementById("error-titulo").innerHTML = "Debe ingresar el título";
      hayError = true;
    }

    if (!descripcion) {
      document.getElementById("error-descripcion").innerHTML = "Debe ingresar la descripción";
      hayError = true;
    }

    if (isNaN(precio) || precio <= 0) {
      document.getElementById("error-precio").innerHTML = "Ingrese un precio válido";
      hayError = true;
    }

    if (isNaN(categoria_id)) {
      document.getElementById("error-categoria").innerHTML = "Seleccione una categoría";
      hayError = true;
    }

    if (!imagenes || imagenes.length === 0) {
      document.getElementById("error-imagenes").innerHTML = "Debe seleccionar al menos una imagen";
      hayError = true;
    }

    if (!usuario_id) {
      errorGeneral.innerHTML = "Debe iniciar sesión para publicar un anuncio";
      hayError = true;
    }

    if (hayError) return;

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("categoria_id", categoria_id);
      formData.append("usuario_id", usuario_id);

      for (const img of imagenes) {
        formData.append("imagenes", img);
      }

      const res = await fetch("/api/anuncios", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        errorGeneral.style.color = "green";
        errorGeneral.innerHTML = "Anuncio publicado con éxito";
        form.reset();
        modal.style.display = "none";
        cargarMisAnuncios();
      } else {
        errorGeneral.innerHTML = data.mensaje || "Error al registrar anuncio";
      }
    } catch (err) {
      errorGeneral.innerHTML = "Error al conectar con el servidor";
    }
  });

  async function cargarMisAnuncios() {
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
      errorGeneral.innerHTML = "Debe iniciar sesión para ver sus anuncios";
      return;
    }

    try {
      const res = await fetch(`/api/anuncios/${usuario_id}`);
      const anuncios = await res.json();

      if (!res.ok) {
        errorGeneral.innerHTML = anuncios.mensaje || "Error al cargar los anuncios";
        return;
      }

      contenedor.innerHTML = "";

      anuncios.forEach(anuncio => {
        const card = document.createElement("div");
        card.className = "card-anuncio";

        const estado = anuncio.estado ? "habilitado" : "deshabilitado";
        const textoEstado = anuncio.estado ? "Habilitado" : "Deshabilitado";

        card.innerHTML = `
          <img src="${anuncio.imagen_url || 'img/default.png'}" alt="Imagen" width="80">
          <div class="card-info">
            <strong>${anuncio.titulo}</strong><br>
            Bs. ${anuncio.precio.toFixed(2)}
          </div>
          <div>
            <span class="badge ${estado}">${textoEstado}</span>
            <button class="btn-accion btn-toggle">${anuncio.estado ? "Deshabilitar" : "Habilitar"}</button>
            <button class="btn-accion btn-editar">Editar</button>
            <button class="btn-accion btn-eliminar">Eliminar</button>
          </div>
        `;
        contenedor.appendChild(card);
      });
    } catch (err) {
      errorGeneral.innerHTML = "Error al obtener los anuncios";
    }
  }

  cargarMisAnuncios();
});
