document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const anuncioId = params.get("id");
    const loggedInUserId = localStorage.getItem("usuario_id");

    if (!anuncioId) {
        document.body.innerHTML = "<p>Error: ID de anuncio no especificado</p>";
        return;
    }

    try {
        const res = await fetch(`/api/anuncios/detalle/${anuncioId}`);
        const anuncioData = await res.json();

        if (!res.ok) {
            document.body.innerHTML = `<p>Error: ${anuncioData.mensaje || "No se pudo cargar el anuncio"}</p>`;
            return;
        }

        renderizarDatosAnuncio(anuncioData);

        const ownerId = anuncioData.usuario_id;
        const esPropietario = loggedInUserId && parseInt(loggedInUserId, 10) === ownerId;

        if (esPropietario) {
            ocultarBotonesAccion();
        } else if (loggedInUserId) {
            configurarBotonesParaVisitante(anuncioData, loggedInUserId);
        } else {
            configurarBotonesParaNoLogueado();
        }

    } catch (error) {
        document.body.innerHTML = `<p>Error al conectar con el servidor</p><pre>${error.message}</pre>`;
        console.error("ERROR:", error);
    }
});

function renderizarDatosAnuncio(anuncioData) {
    const imagenPrincipal = document.getElementById("imagen-anuncio");
    imagenPrincipal.src = anuncioData.imagenes?.[0] || "img/default.png";
    const galeria = document.getElementById("galeria-imagenes");
    if (Array.isArray(anuncioData.imagenes)) {
        galeria.innerHTML = "";
        anuncioData.imagenes.forEach(imgUrl => {
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `Imagen de ${anuncioData.titulo}`;
            img.addEventListener("click", () => { imagenPrincipal.src = imgUrl; });
            galeria.appendChild(img);
        });
    }
    document.getElementById("titulo-anuncio").textContent = anuncioData.titulo;
    document.getElementById("precio-anuncio").textContent = `Bs. ${anuncioData.precio}`;
    document.getElementById("descripcion-anuncio").textContent = anuncioData.descripcion;
    document.getElementById("nombre-vendedor").textContent = anuncioData.nombre_usuario;
    document.getElementById("correo-vendedor").textContent = anuncioData.correo;
}

function ocultarBotonesAccion() {
    const btnGuardarAnuncio = document.getElementById("btn-guardar-anuncio");
    const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    if (btnGuardarAnuncio) btnGuardarAnuncio.style.display = 'none';
    if (btnEnviarMensaje) btnEnviarMensaje.style.display = 'none';
}

async function configurarBotonesParaVisitante(anuncioData, loggedInUserId) {
    const btnGuardarAnuncio = document.getElementById("btn-guardar-anuncio");
    const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    const anuncioId = anuncioData.id; 
    

    const verificarRes = await fetch(`/api/guardados/verificar/${loggedInUserId}/${anuncioId}`);
    const { estaGuardado } = await verificarRes.json();
    actualizarBotonGuardar(btnGuardarAnuncio, estaGuardado);

    btnGuardarAnuncio.addEventListener('click', async () => {
        const actualmenteGuardado = btnGuardarAnuncio.dataset.guardado === 'true';
        const url = '/api/guardados';
        const method = actualmenteGuardado ? 'DELETE' : 'POST';
        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: loggedInUserId, anuncio_id: anuncioId })
            });
            if (res.ok) {
                actualizarBotonGuardar(btnGuardarAnuncio, !actualmenteGuardado);
            } else {
                alert('No se pudo actualizar el anuncio.');
            }
        } catch (error) {
            console.error('Error al cambiar estado de guardado:', error);
            alert('No se pudo actualizar el anuncio.');
        }
    });

    if (btnEnviarMensaje) {
        btnEnviarMensaje.addEventListener('click', async () => {
            const anuncianteId = anuncioData.usuario_id;

            try {
                const response = await fetch("/api/conversaciones/buscar-o-crear", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        anuncio_id: anuncioId,
                        interesado_id: loggedInUserId,
                        anunciante_id: anuncianteId,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = `/chat-compras.html?conversacionId=${data.id}&anuncioId=${anuncioId}`;
                } else {
                    alert(`Error al iniciar el chat: ${data.mensaje}`);
                }
            } catch (error) {
                console.error("Error al crear la conversación:", error);
                alert("Error de conexión al intentar iniciar el chat.");
            }
        });
    }
}

function actualizarBotonGuardar(boton, guardado) {
    boton.dataset.guardado = guardado;
    if (guardado) {
        boton.textContent = 'Quitar de Guardados';
        boton.classList.add('guardado');
    } else {
        boton.textContent = 'Guardar Anuncio';
        boton.classList.remove('guardado');
    }
}

function configurarBotonesParaNoLogueado() {
    const btnGuardarAnuncio = document.getElementById("btn-guardar-anuncio");
    const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    const loginUrl = 'inicio-sesion.html';

    if (btnGuardarAnuncio) {
        btnGuardarAnuncio.addEventListener('click', () => {
            alert('Debes iniciar sesión para guardar un anuncio.');
            window.location.href = loginUrl;
        });
    }
    if (btnEnviarMensaje) {
        btnEnviarMensaje.addEventListener('click', () => {
            alert('Debes iniciar sesión para enviar un mensaje.');
            window.location.href = loginUrl;
        });
    }
}