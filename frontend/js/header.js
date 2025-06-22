// js/header.js

// Función que retorna el HTML del header según el estado de sesión
function obtenerHeaderHTML(usuario) {
  if (usuario) {
    return `
    <header class="header">
      <div class="centrar-logo">
        <h1 class="logo"><a href="index.html">EncuentraTech</a></h1>
      </div>
      <nav class="menu">
        <label for="menu-switch" class="menu-mobile-label">
          <i class="fa-solid fa-bars"></i>
          Menu
        </label>
        <input id="menu-switch" type="checkbox">
        <ul>
          <li><a href="lista-anuncio.html">Anuncios</a></li>
          <li><a href="administracion-anuncios.html">Publicar Anuncio</a></li>
          <li class="submenu-toggle">
            <input type="checkbox" id="submenu-switch" hidden>
            <label for="submenu-switch" class="submenu-label">Mensajes <i class="fa-solid fa-chevron-down"></i></label>
            <div class="submenu">
              <a href="chat-compras.html">Mis Compras</a>
              <a href="chat-ventas.html">Mis Ventas</a>
            </div>
          </li>
          <li><a href="#" id="cerrar-sesion">Cerrar sesión</a></li>
        </ul>
      </nav>
    </header>`;
  } else {
    return `
    <header class="header">
      <div class="centrar-logo">
        <h1 class="logo"><a href="index.html">EncuentraTech</a></h1>
      </div>
      <nav class="menu">
        <label for="menu-switch" class="menu-mobile-label">
          <i class="fa-solid fa-bars"></i>
          Menu
        </label>
        <input id="menu-switch" type="checkbox">
        <ul>
          <li><a href="lista-anuncio.html">Anuncios</a></li>
          <li><a href="registro.html">Registrarse</a></li>
          <li><a href="inicio-sesion.html">Iniciar Sesión</a></li>
        </ul>
      </nav>
    </header>`;
  }
}

// Renderiza el header en el div con id "header-container"
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");

  const usuario_id = localStorage.getItem("usuario_id");
  const nombre = localStorage.getItem("nombre");

  const headerHTML = obtenerHeaderHTML(usuario_id);
  headerContainer.innerHTML = headerHTML;

  // Asignar funcionalidad a "Cerrar sesión"
  const cerrarSesionBtn = document.getElementById("cerrar-sesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
});
