// Selección de elementos
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Mostrar formulario de registro
showRegisterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
});

// Mostrar formulario de login
showLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// Registro de usuario con validaciones
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const id = document.getElementById('reg-id').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const nationality = document.getElementById('reg-nationality').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  // Validar email
  if(!email.includes('@')){
    alert('El correo debe contener @');
    return;
  }

  // Validar teléfono solo números
  if(!/^\d+$/.test(phone)){
    alert('El teléfono solo puede contener números');
    return;
  }

  // Verificar si el email ya existe
  const exists = users.some(user => user.email === email);
  if(exists){
    alert('Este usuario ya está registrado');
    return;
  }

  const newUser = { id, name, nationality, email, phone, password };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registro exitoso. Ahora inicia sesión.');

  // Mostrar login
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
  registerForm.reset();
});

// Login de usuario
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    alert(`Bienvenido ${user.name}`);
    // Guardar sesión activa
    localStorage.setItem('activeUser', JSON.stringify(user));
    // Redirigir a página de reservas
    window.location.href = 'reservas.html';
  } else {
    alert('Email o contraseña incorrectos');
  }
});