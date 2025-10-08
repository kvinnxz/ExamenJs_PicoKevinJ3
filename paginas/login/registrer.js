// Registro de usuario y almacenamiento en LocalStorage
document.getElementById("register-form").addEventListener("submit", e => {
    e.preventDefault();
  
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const nacionalidad = document.getElementById("nacionalidad").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const password = document.getElementById("password").value;
  
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
    // Validación: usuario o email ya registrado
    if (usuarios.some(u => u.id === id || u.email === email)) {
      alert("Este usuario ya está registrado.");
      return;
    }
  
    // Guardar usuario
    usuarios.push({ id, nombre, nacionalidad, email, telefono, password, rol: "cliente" });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
    alert("Registro exitoso. Serás redirigido al login.");
    window.location.href = "login.html"; // Redirige al login
  });