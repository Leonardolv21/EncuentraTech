const loggedInUserId = localStorage.getItem("usuario_id");

const cargarAnunciosVendedor = async () => {
  if (!loggedInUserId) {
    alert("Error: No se pudo obtener el ID del usuario logueado. Asegúrate de que el usuario haya iniciado sesión y su ID esté guardado.");
    return;
  }
  try {
    const resAnuncios = await fetch(`/api/conversaciones/anuncios-vendedor/${loggedInUserId}`);
    const anuncios = await resAnuncios.json();

    if (resAnuncios.ok) {
      const anunciosListContainer = document.getElementById("anuncios-list-container");
      anunciosListContainer.innerHTML = "";

      if (anuncios.length === 0) {
        anunciosListContainer.innerHTML = "<p>No tienes anuncios con conversaciones aún.</p>";
      } else {
        anuncios.forEach(anuncio => {
          const anuncioItem = document.createElement("div");
          anuncioItem.classList.add("chat-item"); 
          anuncioItem.onclick = () => abrirInteresados(anuncio.anuncio_id, anuncio.anuncio_titulo);

          const img = document.createElement("img");
          img.src = anuncio.anuncio_imagen || "img/default.png";
          img.alt = anuncio.anuncio_titulo;

          const anuncioInfo = document.createElement("div");
          anuncioInfo.classList.add("chat-info");

          const h3 = document.createElement("h3");
          h3.textContent = anuncio.anuncio_titulo;

          const pConversaciones = document.createElement("p");
          pConversaciones.textContent = `Conversaciones: ${anuncio.total_conversaciones}`;

          anuncioInfo.appendChild(h3);
          anuncioInfo.appendChild(pConversaciones);

          anuncioItem.appendChild(img);
          anuncioItem.appendChild(anuncioInfo);

          anunciosListContainer.appendChild(anuncioItem);
        });
      }
    } else {
      console.error("Error al cargar anuncios del vendedor:", anuncios.mensaje);
    }
  } catch (error) {
    console.error("Error al cargar anuncios del vendedor:", error);
  }
};


const cargarInteresadosPorAnuncio = async (anuncioId) => {
  if (!loggedInUserId) {
    alert("Error: No se pudo obtener el ID del usuario logueado. Asegúrate de que el usuario haya iniciado sesión y su ID esté guardado.");
    return;
  }
  try {
    const resInteresados = await fetch(`/api/conversaciones/interesados-por-anuncio/${anuncioId}/${loggedInUserId}`);
    const interesados = await resInteresados.json();

    if (resInteresados.ok) {
      const interesadosListContainer = document.getElementById("interesados-list-container");
      interesadosListContainer.innerHTML = "";

      if (interesados.length === 0) {
        interesadosListContainer.innerHTML = "<p>No hay interesados para este anuncio aún.</p>";
      } else {
        interesados.forEach(interesado => {
          const interesadoItem = document.createElement("div");
          interesadoItem.classList.add("chat-item"); 
          interesadoItem.onclick = () => abrirChat(interesado.conversacion_id, anuncioId);

          const interesadoInfo = document.createElement("div");
          interesadoInfo.classList.add("chat-info");

          const h3 = document.createElement("h3");
          h3.textContent = interesado.nombre_interesado;

          const pMensaje = document.createElement("p");
          pMensaje.classList.add("mensaje");
          pMensaje.textContent = interesado.ultimo_mensaje_contenido || "No hay mensajes aún.";

          interesadoInfo.appendChild(h3);
          interesadoInfo.appendChild(pMensaje);

          interesadoItem.appendChild(interesadoInfo);

          interesadosListContainer.appendChild(interesadoItem);
        });
      }
    } else {
      console.error("Error al cargar interesados:", interesados.mensaje);
    }
  } catch (error) {
    console.error("Error al cargar interesados:", error);
  }
};

const cargarMensajes = async (conversacionId) => {
  if (!loggedInUserId) {
    alert("Error: No se pudo obtener el ID del usuario logueado. Asegúrate de que el usuario haya iniciado sesión y su ID esté guardado.");
    return;
  }
  try {
    const resMensajes = await fetch(`/api/mensajes?conversacion=${conversacionId}`);
    const mensajes = await resMensajes.json();

    if (resMensajes.ok) {
      const chatContenido = document.getElementById("chat-contenido");
      if (chatContenido) {
        chatContenido.innerHTML = "";

        mensajes.forEach(mensaje => {
          const mensajeDiv = document.createElement("div");
          const esMiMensaje = mensaje.emisor_id == loggedInUserId;
          mensajeDiv.classList.add(esMiMensaje ? "mensaje-comprador" : "mensaje-vendedor");

          const p = document.createElement("p");
          p.textContent = mensaje.contenido;

          const spanHora = document.createElement("span");
          spanHora.classList.add("hora");
          const fecha = new Date(mensaje.fecha_hora);
          spanHora.textContent = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          mensajeDiv.appendChild(p);
          mensajeDiv.appendChild(spanHora);
          chatContenido.appendChild(mensajeDiv);
        });
        chatContenido.scrollTop = chatContenido.scrollHeight;
      }
    } else {
      console.error("Error al cargar mensajes:", mensajes.mensaje);
    }
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  
  const params = new URLSearchParams(window.location.search);
  const conversacionIdParam = params.get("conversacionId");
  const anuncioIdParam = params.get("anuncioId");

  if (conversacionIdParam && anuncioIdParam) {
 
    document.getElementById("anuncios-list").style.display = "none";
    document.getElementById("interesados-list").style.display = "none";
    document.getElementById("chat-window").style.display = "block";


    try {
      const resAnuncio = await fetch(`/api/anuncios/detalle/${anuncioIdParam}`);
      const anuncio = await resAnuncio.json();

      if (resAnuncio.ok) {
        const chatAnuncioTitulo = document.getElementById("chat-anuncio-titulo");
        if (chatAnuncioTitulo) chatAnuncioTitulo.textContent = anuncio.titulo;

        const chatAnuncioImagen = document.getElementById("chat-anuncio-imagen");
        if (chatAnuncioImagen) chatAnuncioImagen.src = anuncio.imagenes?.[0] || "img/default.png";
      } else {
        console.error("Error al cargar detalles del anuncio:", anuncio.mensaje);
      }

      const resConversacion = await fetch(`/api/conversaciones/${conversacionIdParam}`);
      const conversacion = await resConversacion.json();

      if (resConversacion.ok) {
        let nombreOtroParticipante = "";
   
        nombreOtroParticipante = conversacion.nombre_interesado;
        const nombreOtroParticipanteElement = document.getElementById("nombre-otro-participante");
        if (nombreOtroParticipanteElement) nombreOtroParticipanteElement.textContent = nombreOtroParticipante;
      } else {
        console.error("Error al cargar detalles de la conversación:", conversacion.mensaje);
      }

      await cargarMensajes(conversacionIdParam);

     
      const formChat = document.getElementById("form-enviar-mensaje");
      if (formChat) {
        formChat.addEventListener("submit", async (event) => {
          event.preventDefault();

          const inputMensaje = document.getElementById("input-mensaje");
          const contenido = inputMensaje.value.trim();

          if (contenido) {
            try {
              const response = await fetch("/api/mensajes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  conversacion_id: conversacionIdParam,
                  emisor_id: loggedInUserId,
                  contenido: contenido,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                inputMensaje.value = "";
                await cargarMensajes(conversacionIdParam);
              } else {
                alert(`Error al enviar mensaje: ${data.mensaje}`);
              }
            } catch (error) {
              console.error("Error al enviar mensaje:", error);
              alert("Error de conexión al intentar enviar el mensaje.");
            }
          }
        });
      }

    } catch (error) {
      console.error("Error al cargar la conversación o el anuncio:", error);
    }

  } else {
    cargarAnunciosVendedor();
  }

});

function abrirInteresados(anuncioId, anuncioTitulo) {
  localStorage.setItem('currentAnuncioIdVentas', anuncioId);
  localStorage.setItem('currentAnuncioTituloVentas', anuncioTitulo);
  document.getElementById("anuncios-list").style.display = "none";
  document.getElementById("interesados-list").style.display = "flex";
  document.getElementById("titulo-anuncio-interesados").textContent = anuncioTitulo;
  const currentAnuncioId = localStorage.getItem('currentAnuncioIdVentas');
  cargarInteresadosPorAnuncio(currentAnuncioId);
}

function abrirChat(conversacionId, anuncioId) {
  window.location.href = `/chat-ventas.html?conversacionId=${conversacionId}&anuncioId=${anuncioId}`;
}

function volverAnuncios() {
  document.getElementById("interesados-list").style.display = "none";
  document.getElementById("anuncios-list").style.display = "block";
  cargarAnunciosVendedor();
}

function volverInteresados() {
  document.getElementById("chat-window").style.display = "none";
  document.getElementById("interesados-list").style.display = "flex";
  
  const currentAnuncioTitulo = localStorage.getItem('currentAnuncioTituloVentas');
  document.getElementById("titulo-anuncio-interesados").textContent = currentAnuncioTitulo;

  const currentAnuncioId = localStorage.getItem('currentAnuncioIdVentas');
  cargarInteresadosPorAnuncio(currentAnuncioId);
}



