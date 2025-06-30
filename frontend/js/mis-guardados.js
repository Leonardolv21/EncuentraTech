// js/mis-guardados.js

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
            container.innerHTML = ''; // Limpiar cualquier contenido previo
            anuncios.forEach(anuncio => {
                const anuncioCard = `
                    <div class="anuncio-card">
                        <img src="${anuncio.imagen_url || 'img/default.png'}" alt="Imagen de ${anuncio.titulo}">
                        <div class="anuncio-info">
                            <span class="estado ${anuncio.estado ? 'activo' : 'inactivo'}">${anuncio.estado ? 'Activo' : 'Inactivo'}</span>
                            <h3>${anuncio.titulo}</h3>
                            <p class="precio">Bs. ${anuncio.precio}</p>
                            <p class="publicado-por">Publicado por: ${anuncio.nombre_usuario}</p>
                            <a href="detalle-anuncio.html?id=${anuncio.id}" class="ver-detalle">Ver detalle</a>
                        </div>
                    </div>
                `;
                container.innerHTML += anuncioCard;
            });
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        container.innerHTML = '<p>No se pudo conectar con el servidor para cargar tus anuncios.</p>';
    }
});