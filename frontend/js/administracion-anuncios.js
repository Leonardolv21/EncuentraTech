document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-anuncio");
  const btnCrear = document.getElementById("btn-crear");
  const btnCancelar = document.getElementById("btn-cancelar");
  const form = document.getElementById("form-anuncio");
  const errorGeneral = document.getElementById("error-general");
  const contenedor = document.getElementById("lista-anuncios");
  const selectCategoria = document.getElementById("categoria");
  const inputImagenes = document.getElementById("imagenes");

  let editando = false;
  let anuncioEditandoId = null;
  let imagenesEliminadas = [];

  async function cargarCategorias() {
    try {
      const res = await fetch('/api/categorias');
      const categorias = await res.json();

      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  btnCrear.addEventListener("click", () => {
    editando = false;
    anuncioEditandoId = null;
    imagenesEliminadas = [];
    modal.style.display = "flex";
    limpiarErrores();
    form.reset();
    document.getElementById("form-anuncio").querySelector("#btn-publicar").textContent = "Publicar";
    document.getElementById("imagenes-actuales")?.remove();
  });

  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    limpiarErrores();
    document.getElementById("imagenes-actuales")?.remove();
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
    const imagenes = inputImagenes.files;
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

    if (!usuario_id) {
      errorGeneral.innerHTML = "Debe iniciar sesión para publicar un anuncio";
      hayError = true;
    }

    if (!editando && (!imagenes || imagenes.length === 0)) {
      document.getElementById("error-imagenes").innerHTML = "Debe seleccionar al menos una imagen";
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

      if (editando) {
         console.log('Se eliminarán estas URLs:', imagenesEliminadas);
          formData.append("imagenes_eliminar", JSON.stringify(imagenesEliminadas));
        const res = await fetch(`/api/anuncios/${anuncioEditandoId}`, {
          method: "PUT",
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          errorGeneral.style.color = "green";
          errorGeneral.innerHTML = "Anuncio actualizado con éxito";
          form.reset();
          modal.style.display = "none";
          cargarMisAnuncios();
        } else {
          errorGeneral.innerHTML = data.mensaje || "Error al actualizar anuncio";
        }
      } else {
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
      }
    } catch (err) {
      errorGeneral.innerHTML = "Error al conectar con el servidor";
    }
  });

  async function cargarMisAnuncios() {
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
      console.log("No hay usuario logueado");
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
            Bs. ${Number(anuncio.precio).toFixed(2)}
          </div>
          <div>
            <span class="badge ${estado}">${textoEstado}</span>
            <button class="btn-accion btn-toggle">${anuncio.estado ? "Deshabilitar" : "Habilitar"}</button>
            <button class="btn-accion btn-editar" data-id="${anuncio.id}">Editar</button>
            <button class="btn-accion btn-eliminar">Eliminar</button>
          </div>
        `;
         card.querySelector('.btn-eliminar').addEventListener('click', async () => {
          try {
          const res = await fetch(`/api/anuncios/${anuncio.id}`, { method: 'DELETE' });

            if (res.ok) {
              // Eliminamos la tarjeta del DOM al instante
              card.remove();
            } else {
              // Si hay error, lo mostramos inline con msg-error
              let aviso = card.querySelector('.msg-error-delete');
              if (!aviso) {
                aviso = document.createElement('span');
                aviso.className = 'msg-error msg-error-delete';
                aviso.style.display = 'block';
                aviso.style.marginTop = '0.5rem';
                card.appendChild(aviso);
              }
              const { mensaje } = await res.json();
              aviso.textContent = mensaje || 'No se pudo eliminar';
            }
          } catch {
            let aviso = card.querySelector('.msg-error-delete');
            if (!aviso) {
              aviso = document.createElement('span');
              aviso.className = 'msg-error msg-error-delete';
              aviso.style.display = 'block';
              aviso.style.marginTop = '0.5rem';
              card.appendChild(aviso);
            }
            aviso.textContent = 'Error de conexión';
          }
        });



            // dentro de renderCard o justo después de crear card.innerHTML:
        card.querySelector('.btn-toggle').addEventListener('click', async () => {
        const res = await fetch(`/api/anuncios/${anuncio.id}/estado`, { method: 'PATCH' });
          if (res.ok) {
            cargarMisAnuncios();  // recarga sólo activos
          } else {
           alert('Error al cambiar estado');
            }
            });

        card.querySelector(".btn-editar").addEventListener("click", async () => {
          editando = true;
          anuncioEditandoId = anuncio.id;
          imagenesEliminadas = [];

          // 1) Elimino cualquier previas imágenes-actuales que queden del último edit
          document.getElementById("imagenes-actuales")?.remove();

          // 2) Cargo los datos del anuncio
          const res = await fetch(`/api/anuncios/detalle/${anuncio.id}`);
          const data = await res.json();

          if (!res.ok) return alert("Error al cargar anuncio para editar");

          document.getElementById("titulo").value = data.titulo;
          document.getElementById("descripcion").value = data.descripcion;
          document.getElementById("precio").value = data.precio;
          document.getElementById("categoria").value = data.categoria_id;

          const contenedorImagenes = document.createElement("div");
          contenedorImagenes.id = "imagenes-actuales";
          contenedorImagenes.innerHTML = `<h4>Imágenes actuales:</h4>`;

          data.imagenes.forEach((url, index) => {
            const divImg = document.createElement("div");
            divImg.style.display = "inline-block";
            divImg.style.marginRight = "10px";

            const img = document.createElement("img");
            img.src = url;
            img.alt = `Imagen ${index + 1}`;
            img.style.width = "80px";

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "X";
            btnEliminar.style.marginLeft = "5px";
            btnEliminar.addEventListener("click", () => {
              imagenesEliminadas.push(url);
              divImg.remove();
            });

            divImg.appendChild(img);
            divImg.appendChild(btnEliminar);
            contenedorImagenes.appendChild(divImg);
          });

          form.insertBefore(contenedorImagenes, inputImagenes);

          document.getElementById("btn-publicar").textContent = "Actualizar";
          modal.style.display = "flex";
        });

        contenedor.appendChild(card);
      });
    } catch (err) {
      console.log("ERROR:", err);
      errorGeneral.innerHTML = "Error al obtener los anuncios";
    }
  }

  cargarCategorias(); 
  cargarMisAnuncios();
});
