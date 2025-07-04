document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const conversacionId = params.get("conversacionId");
  const anuncioId = params.get("anuncioId");


  const loggedInUserId = localStorage.getItem("usuario_id");

  if (!loggedInUserId) {
    alert("Error: No se pudo obtener el ID del usuario logueado. Asegúrate de que el usuario haya iniciado sesión y su ID esté guardado.");
    return;
  }

  if (conversacionId && anuncioId) {

    document.getElementById("chat-list").style.display = "none";
    document.getElementById("chat-window").style.display = "block";


    const cargarMensajes = async () => {
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

    try {
   
      const resAnuncio = await fetch(`/api/anuncios/detalle/${anuncioId}`);
      const anuncio = await resAnuncio.json();

      if (resAnuncio.ok) {
        const chatAnuncioTitulo = document.getElementById("chat-anuncio-titulo");
        if (chatAnuncioTitulo) chatAnuncioTitulo.textContent = anuncio.titulo;

        const chatAnuncioImagen = document.getElementById("chat-anuncio-imagen");
        if (chatAnuncioImagen) chatAnuncioImagen.src = anuncio.imagenes?.[0] || "img/default.png";
      } else {
        console.error("Error al cargar detalles del anuncio:", anuncio.mensaje);
      }

      
      const resConversacion = await fetch(`/api/conversaciones/${conversacionId}`);
      const conversacion = await resConversacion.json();

      if (resConversacion.ok) {
        let nombreOtroParticipante = "";
        if (conversacion.interesado_id == loggedInUserId) {
          nombreOtroParticipante = conversacion.nombre_anunciante;
        } else if (conversacion.anunciante_id == loggedInUserId) {
          nombreOtroParticipante = conversacion.nombre_interesado;
        }
        const nombreOtroParticipanteElement = document.getElementById("nombre-otro-participante");
        if (nombreOtroParticipanteElement) nombreOtroParticipanteElement.textContent = nombreOtroParticipante;
      } else {
        console.error("Error al cargar detalles de la conversación:", conversacion.mensaje);
      }

      await cargarMensajes();


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
                  conversacion_id: conversacionId,
                  emisor_id: loggedInUserId,
                  contenido: contenido,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                inputMensaje.value = ""; 
                await cargarMensajes(); 
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

    document.getElementById("chat-window").style.display = "none";
    document.getElementById("chat-list").style.display = "flex";

    try {
      const resConversacionesUsuario = await fetch(`/api/conversaciones/compras-usuario/${loggedInUserId}`);
      const conversacionesUsuario = await resConversacionesUsuario.json();

      if (resConversacionesUsuario.ok) {
        const chatListContainer = document.getElementById("chat-list-container");
        if (chatListContainer) {
          chatListContainer.innerHTML = ""; 

          if (conversacionesUsuario.length === 0) {
            chatListContainer.innerHTML = "<p>No tienes conversaciones aún.</p>";
          } else {
            conversacionesUsuario.forEach(conv => {
              const chatItem = document.createElement("div");
              chatItem.classList.add("chat-item");
              chatItem.onclick = () => abrirChat(conv.conversacion_id, conv.anuncio_id);

              const img = document.createElement("img");
              img.src = conv.anuncio_imagen || "img/default.png";
              img.alt = conv.anuncio_titulo;

              const chatInfo = document.createElement("div");
              chatInfo.classList.add("chat-info");

              const h3 = document.createElement("h3");
              h3.textContent = conv.anuncio_titulo;

              const pVendedor = document.createElement("p");
              pVendedor.classList.add("vendedor");

              const otroParticipanteNombre = conv.nombre_anunciante;
              pVendedor.textContent = `Con: ${otroParticipanteNombre}`;

              const pMensaje = document.createElement("p");
              pMensaje.classList.add("mensaje");
              pMensaje.textContent = conv.ultimo_mensaje_contenido || "No hay mensajes aún.";

              chatInfo.appendChild(h3);
              chatInfo.appendChild(pVendedor);
              chatInfo.appendChild(pMensaje);

              chatItem.appendChild(img);
              chatItem.appendChild(chatInfo);

              chatListContainer.appendChild(chatItem);
            });
          }
        }
      } else {
        console.error("Error al cargar la lista de conversaciones:", conversacionesUsuario.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar la lista de conversaciones:", error);
    }
  }
});

function abrirChat(conversacionId, anuncioId) {
  window.location.href = `/chat-compras.html?conversacionId=${conversacionId}&anuncioId=${anuncioId}`;
}

function volverLista() {
  window.location.href = `/chat-compras.html`;
}


