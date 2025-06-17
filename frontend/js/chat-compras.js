function abrirChat(id) {
  document.getElementById("chat-list").style.display = "none";
  document.getElementById("chat-window").style.display = "block";
}

function volverLista() {
  document.getElementById("chat-window").style.display = "none";
  document.getElementById("chat-list").style.display = "flex";
}
