document.addEventListener("DOMContentLoaded", init);

async function init() {

  await cargarAnuncios('/api/anuncios');

  const campoBusqueda = document.getElementById('campo-busqueda');
  campoBusqueda.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      const termino = campoBusqueda.value.trim();

      cargarAnuncios(`/api/anuncios/buscar?termino=${encodeURIComponent(termino)}`);
    }
  });


  const catMap = {
    "Computadoras y Laptop": 1, "Componentes": 2, "Periféricos": 3,
    "Celulares y Tablets": 4, "Redes y Conectividad": 5, "Servicios": 6
  };

 
  document.getElementById("btn-todos").addEventListener("click", () => {
  
    campoBusqueda.value = '';
    cargarAnuncios('/api/anuncios');
  });


  document.querySelectorAll(".filtros-categorias button").forEach(btn => {
    if (btn.id === "btn-todos") return;
    btn.addEventListener("click", () => {
      const catId = catMap[btn.textContent.trim()];
      if (catId !== undefined) {
        cargarAnuncios(`/api/anuncios?categoria=${catId}`);
      }
    });
  });
}

async function cargarAnuncios(url) {
  const contenedor = document.getElementById("contenedor-anuncios");
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      contenedor.innerHTML = "<p class=\"msg-error\">Error al cargar los anuncios</p>";
      return;
    }
    const anuncios = await res.json();
    renderList(anuncios);
  } catch (err) {
    contenedor.innerHTML = "<p class=\"msg-error\">Error al conectar con el servidor</p>";
    console.error(err);
  }
}

function renderList(anuncios) {
  const contenedor = document.getElementById("contenedor-anuncios");
  contenedor.innerHTML = "";

  if (anuncios.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron anuncios.</p>';
    return;
  }

  anuncios.forEach(anuncio => {
    const card = document.createElement("article");
    card.className = "anuncio";
    const imagen = anuncio.imagen_url || 'img/default.png';
    const estadoTexto = anuncio.estado ? "Activo" : "Inactivo";

    card.innerHTML = `
      <span class="estado">${estadoTexto}</span>
      <img src="${imagen}" alt="${anuncio.titulo}">
      <div class="detalle-anuncio">
        <h3>${anuncio.titulo}</h3>
        <p class="precio">Bs. ${parseFloat(anuncio.precio).toFixed(2)}</p>
        <p class="autor">Publicado por : ${anuncio.nombre_usuario}</p>
        <a href="detalle-anuncio.html?id=${anuncio.id}" class="ver-detalle">Ver detalle</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}