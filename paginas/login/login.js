// Login de usuario y redirección a reservas
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    alert("Usuario o contraseña incorrectos.");
    return;
  }

  // Guardar usuario activo
  localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

  alert(`¡Bienvenido, ${usuario.nombre}!`);
  window.location.href = "../reservas.html"; // Redirige automáticamente a reservas
});