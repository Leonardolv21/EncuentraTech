document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const anuncio_id = params.get("id");
    const loggedInUserId = localStorage.getItem("usuario_id");

    if (!anuncio_id) {
        document.body.innerHTML = "<p>Error: ID de anuncio no especificado</p>";
        return;
    }

    try {
        const res = await fetch(`/api/anuncios/detalle/${anuncio_id}`);
        const anuncioData = await res.json();

        if (!res.ok) {
            document.body.innerHTML = `<p>Error: ${anuncioData.mensaje || "No se pudo cargar el anuncio"}</p>`;
            return;
        }

        // Cargar datos del anuncio (sin cambios)
        renderizarDatosAnuncio(anuncioData);

        // Lógica de visualización de botones
        const ownerId = anuncioData.usuario_id;
        const esPropietario = loggedInUserId && parseInt(loggedInUserId, 10) === ownerId;

        if (esPropietario) {
            ocultarBotonesAccion();
        } else if (loggedInUserId) {
            // Si es un visitante logueado, configurar botones de acción
            configurarBotonesParaVisitante(anuncio_id, loggedInUserId);
        } else {
            // Si es un visitante no logueado, los botones pueden llevar a iniciar sesión
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

async function configurarBotonesParaVisitante(anuncio_id, loggedInUserId) {
    const btnGuardarAnuncio = document.getElementById("btn-guardar-anuncio");
    
    // 1. Verificar si el anuncio ya está guardado
    const verificarRes = await fetch(`/api/guardados/verificar/${loggedInUserId}/${anuncio_id}`);
    const { estaGuardado } = await verificarRes.json();

    actualizarBotonGuardar(btnGuardarAnuncio, estaGuardado);

    // 2. Añadir el Event Listener al botón
    btnGuardarAnuncio.addEventListener('click', async () => {
        const actualmenteGuardado = btnGuardarAnuncio.dataset.guardado === 'true';
        const url = '/api/guardados';
        const method = actualmenteGuardado ? 'DELETE' : 'POST'; 
        console.log('loggedInUserId:', loggedInUserId);
        console.log('anuncio_id:', anuncio_id); // Asegúrate de que 'anuncioId' esté definido en este scope
        // ---------------------------------------
        try {
                     // --- AÑADE ESTAS LÍNEAS PARA DEPURAR ---

            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: loggedInUserId, anuncio_id: anuncio_id })
            });
            actualizarBotonGuardar(btnGuardarAnuncio, !actualmenteGuardado);
        } catch (error) {
            console.log('Error al cambiar estado de guardado:', error);
            alert('No se pudo actualizar el anuncio.');
        }
    });

    // Lógica del botón de mensaje (ya la tenías)
    const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    if(btnEnviarMensaje) {
        btnEnviarMensaje.addEventListener('click', () => { /* tu lógica de chat */ window.location.href = '...'})
    }
}

function actualizarBotonGuardar(boton, guardado) {
    boton.dataset.guardado = guardado;
    if (guardado) {
        boton.textContent = 'Quitar de Guardados';
        boton.classList.add('guardado'); // Añade una clase para posible estilo CSS
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