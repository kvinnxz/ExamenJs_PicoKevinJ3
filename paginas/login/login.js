// ============================
// Selección de elementos
// ============================
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const messageDiv = document.getElementById('message');

// ============================
// Mostrar formulario de registro con animación
// ============================
showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  messageDiv.textContent = '';
});

// Volver al login con animación
showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  messageDiv.textContent = '';
});

// ============================
// Funciones de LocalStorage
// ============================
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
}

// ============================
// Registro de usuario
// ============================
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = {
    idNumber: document.getElementById('idNumber').value,
    fullName: document.getElementById('fullName').value,
    nationality: document.getElementById('nationality').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('regEmail').value,
    password: document.getElementById('regPassword').value
  };

  const users = getUsers();
  if (users.some(u => u.email === user.email)) {
    showMessage('Este email ya está registrado.', 'error');
    return;
  }

  saveUser(user);
  registerForm.reset();
  showMessage('Registro exitoso. Ahora inicia sesión.', 'success');
});

// ============================
// Login de usuario
// ============================
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    showMessage('Login exitoso. Redirigiendo...', 'success');
    setTimeout(() => {
      window.location.href = '../reservas.html'; // Redirige a la página de reservas
    }, 1000);
  } else {
    showMessage('Email o contraseña incorrectos.', 'error');
  }
});

// ============================
// Función para mostrar mensajes animados
// ============================
function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.classList.add('show');
  if (type === 'success') messageDiv.style.color = 'green';
  if (type === 'error') messageDiv.style.color = 'red';

  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}