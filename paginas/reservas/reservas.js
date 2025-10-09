// Habitaciones disponibles (datos de ejemplo)
const habitaciones = [
  {
    id: 'HAB1',
    nombre: 'Habitación Estándar',
    camas: 2,
    maxPersonas: 3,
    precioNoche: 150000,
    servicios: ['Internet', 'Minibar'],
  },
  {
    id: 'HAB2',
    nombre: 'Suite Familiar',
    camas: 3,
    maxPersonas: 5,
    precioNoche: 250000,
    servicios: ['Internet', 'Jacuzzi', 'Minibar'],
  },
  {
    id: 'HAB3',
    nombre: 'Suite Lujo',
    camas: 1,
    maxPersonas: 2,
    precioNoche: 300000,
    servicios: ['Jacuzzi', 'Internet', 'Minibar'],
  }
];

// Verificar login
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');

if (usuarioActual) {
  loginLink.classList.add('hidden');
  logoutLink.classList.remove('hidden');
  logoutLink.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual');
    location.reload();
  });
}

// Búsqueda de disponibilidad
const form = document.getElementById('search-form');
const roomsContainer = document.getElementById('rooms-container');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);
  const personas = parseInt(document.getElementById('personas').value);

  if (checkout <= checkin) {
    alert('La fecha de salida debe ser posterior a la de entrada.');
    return;
  }

  const noches = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

  const disponibles = habitaciones.filter(h => h.maxPersonas >= personas);

  roomsContainer.innerHTML = '';

  disponibles.forEach(h => {
    const total = h.precioNoche * noches;
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
      <h3>${h.nombre}</h3>
      <p>${h.camas} camas • Máx. ${h.maxPersonas} personas</p>
      <ul>
        ${h.servicios.map(s => `<li>${s}</li>`).join('')}
      </ul>
      <p class="price">Total: $${total.toLocaleString()}</p>
      <button class="reserve-btn" data-id="${h.id}" data-total="${total}" data-checkin="${checkin.toISOString()}" data-checkout="${checkout.toISOString()}">Reservar</button>
    `;
    roomsContainer.appendChild(card);
  });

  document.querySelectorAll('.reserve-btn').forEach(btn => {
    btn.addEventListener('click', reservarHabitacion);
  });
});

// Reservar habitación
function reservarHabitacion(e) {
  if (!usuarioActual) {
    alert('Debes iniciar sesión para reservar.');
    window.location.href = 'login.html';
    return;
  }

  const btn = e.target;
  const habitacionId = btn.dataset.id;
  const total = parseInt(btn.dataset.total);
  const checkin = new Date(btn.dataset.checkin);
  const checkout = new Date(btn.dataset.checkout);

  let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

  const existeSolape = reservas.some(r => {
    return r.habitacionId === habitacionId &&
      ((checkin >= new Date(r.fechaInicio) && checkin < new Date(r.fechaFin)) ||
       (checkout > new Date(r.fechaInicio) && checkout <= new Date(r.fechaFin)));
  });

  if (existeSolape) {
    alert('Esta habitación ya fue reservada en ese rango de fechas.');
    return;
  }

  const nuevaReserva = {
    usuarioId: usuarioActual.identificacion,
    habitacionId,
    fechaInicio: checkin.toISOString(),
    fechaFin: checkout.toISOString(),
    total
  };

  reservas.push(nuevaReserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));
  alert('Reserva realizada con éxito.');
}