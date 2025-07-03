document.addEventListener('DOMContentLoaded', async () => {
    const loggedInUserId = localStorage.getItem("usuario_id");
    const container = document.getElementById('lista-anuncios-guardados');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    if (!loggedInUserId) {
        container.innerHTML = '<p>Debes <a href="inicio-sesion.html">iniciar sesión</a> para ver tus anuncios guardados.</p>';
        return;
    }
    try {
        const response = await fetch(`/api/guardados/${loggedInUserId}`);
        const anuncios = await response.json();

        if (!response.ok) {
            container.innerHTML = `<p>Error al cargar los anuncios: ${anuncios.mensaje}</p>`;
            return;
        }

        if (anuncios.length === 0) {
            mensajeVacio.style.display = 'block';
        } else {
            container.innerHTML = ''; 
            anuncios.forEach(anuncio => {
                const anuncioCardHTML = `
                    <div class="anuncio-card-guardado">
                        <img class="anuncio-imagen" src="${anuncio.imagen_url || 'img/default.png'}" alt="Imagen de ${anuncio.titulo}">
                        <div class="anuncio-contenido">
                            <div class="anuncio-info">
                                <span class="anuncio-estado">${anuncio.estado ? 'Activo' : 'Inactivo'}</span>
                                <h3 class="anuncio-titulo">${anuncio.titulo}</h3>
                                <p class="anuncio-precio">Bs. ${anuncio.precio}</p>
                                <p class="anuncio-vendedor">Publicado por: ${anuncio.nombre_usuario}</p>
                            </div>
                            <div class="anuncio-acciones">
                                <a href="detalle-anuncio.html?id=${anuncio.id}" class="btn-detalle">Ver Detalle</a>
                                <button class="btn-quitar" data-anuncio-id="${anuncio.id}" title="Quitar de guardados">
                                    Quitar Anuncio
                                </button>
                            </div>
                        </div>
                    </div>
                `;
             
                container.insertAdjacentHTML('beforeend', anuncioCardHTML);
            });

        
            document.querySelectorAll('.btn-quitar').forEach(button => {
                const cardParaEliminar = button.closest('.anuncio-card-guardado');

                button.addEventListener('click', async (e) => {
                    const anuncio_id = e.currentTarget.dataset.anuncioId;
                    const confirmacion = confirm('¿Estás seguro de que quieres quitar este anuncio de tus guardados?');

                    if (confirmacion) {
                        try {
                            const res = await fetch('/api/guardados', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ usuario_id: loggedInUserId, anuncio_id: anuncio_id })
                            });

                            if (!res.ok) {
                                throw new Error('El servidor rechazó la solicitud.');
                            }

                            if (cardParaEliminar) {
                                cardParaEliminar.remove();
                            } else {
                        
                                window.location.reload();
                            }

                            if (container.children.length === 0) {
                                mensajeVacio.style.display = 'block';
                            }
                        } catch (error) {
                            console.error('Error al quitar el anuncio:', error);
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        container.innerHTML = '<p>No se pudo conectar con el servidor para cargar tus anuncios.</p>';
    }
});