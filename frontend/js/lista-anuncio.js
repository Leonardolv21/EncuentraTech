document.addEventListener("DOMContentLoaded", init);

let todosAnuncios = [];

async function init() {
  const contenedor = document.getElementById("contenedor-anuncios");
  try {
    const res = await fetch("/api/anuncios", { cache: "no-store" });
    if (!res.ok && res.status !== 304) {
      contenedor.innerHTML = "<p class=\"msg-error\">Error al cargar los anuncios</p>";
      return;
    }
    todosAnuncios = await res.json();
    renderList(todosAnuncios);

    // Mapeo de nombre de botón a categoria_id
    const catMap = {
      "Computadoras y Laptop": 1,
      "Componentes": 2,
      "Periféricos": 3,
      "Celulares y Tablets": 4,
      "Redes y Conectividad": 5,
      "Servicios": 6
    };

    // Listener para botón “Todos”
    const btnTodos = document.getElementById("btn-todos");
    if (btnTodos) {
      btnTodos.addEventListener("click", () => renderList(todosAnuncios));
    }

    // Listeners para categorías
    document.querySelectorAll(".filtros-categorias button").forEach(btn => {
      if (btn.id === "btn-todos") return;
      btn.addEventListener("click", () => {
        const nombre = btn.textContent.trim();
        const catId = catMap[nombre];
        if (catId !== undefined) {
          renderList(todosAnuncios.filter(a => a.categoria_id === catId));
        }
      });
    });
  } catch (err) {
    contenedor.innerHTML = "<p class=\"msg-error\">Error al conectar con el servidor</p>";
    console.error(err);
  }
}

function renderList(anuncios) {
  const contenedor = document.getElementById("contenedor-anuncios");
  contenedor.innerHTML = "";

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
        <button><a href="detalle-anuncio.html?id=${anuncio.id}">Ver detalle</a></button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}
