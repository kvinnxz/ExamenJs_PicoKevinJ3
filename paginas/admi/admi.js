// LOGIN ADMIN
const loginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const loginAdmin = document.getElementById('loginAdmin');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;

  if (user === 'admin' && pass === '1234') {
    localStorage.setItem('adminLogged', 'true');
    loginAdmin.style.display = 'none';
    adminPanel.style.display = 'block';
    loadRooms();
    loadReservas();
  } else {
    loginError.textContent = 'Credenciales incorrectas';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminLogged');
  adminPanel.style.display = 'none';
  loginAdmin.style.display = 'block';
});

// GESTIÓN HABITACIONES
const roomForm = document.getElementById('roomForm');
const roomsList = document.getElementById('roomsList');

roomForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const room = {
    id: Date.now(),
    name: document.getElementById('roomName').value,
    beds: document.getElementById('roomBeds').value,
    maxPeople: document.getElementById('roomMaxPeople').value,
    price: document.getElementById('roomPrice').value,
    image: document.getElementById('roomImage').value,
    services: Array.from(document.querySelectorAll('.services input:checked')).map(s => s.value),
  };

  let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  rooms.push(room);
  localStorage.setItem('rooms', JSON.stringify(rooms));
  roomForm.reset();
  loadRooms();
});

function loadRooms() {
  roomsList.innerHTML = '';
  const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  rooms.forEach(room => {
    const div = document.createElement('div');
    div.classList.add('room-item');
    div.innerHTML = `
      <strong>${room.name}</strong><br>
      Camas: ${room.beds} | Personas máx: ${room.maxPeople} | Precio: $${room.price}<br>
      Servicios: ${room.services.join(', ')}<br>
      <img src="${room.image}" alt="Imagen de ${room.name}">
      <div class="room-actions">
        <button onclick="deleteRoom(${room.id})">Eliminar</button>
      </div>
    `;
    roomsList.appendChild(div);
  });
}

function deleteRoom(id) {
  let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  rooms = rooms.filter(r => r.id !== id);
  localStorage.setItem('rooms', JSON.stringify(rooms));
  loadRooms();
}

// GESTIÓN RESERVAS
const reservasList = document.getElementById('reservasList');

function loadReservas() {
  reservasList.innerHTML = '';
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  reservas.forEach(res => {
    const div = document.createElement('div');
    div.classList.add('reserva-item');
    div.innerHTML = `
      <strong>${res.usuario}</strong><br>
      Habitación: ${res.habitacion} | Fechas: ${res.fechaInicio} - ${res.fechaFin}<br>
      Personas: ${res.personas} | Total: $${res.total}<br>
      <div class="reserva-actions">
        <button onclick="cancelReserva(${res.id})">Cancelar</button>
      </div>
    `;
    reservasList.appendChild(div);
  });
}

function cancelReserva(id) {
  let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  reservas = reservas.filter(r => r.id !== id);
  localStorage.setItem('reservas', JSON.stringify(reservas));
  loadReservas();
}

// Mantener sesión si recarga
if (localStorage.getItem('adminLogged') === 'true') {
  loginAdmin.style.display = 'none';
  adminPanel.style.display = 'block';
  loadRooms();
  loadReservas();
}
