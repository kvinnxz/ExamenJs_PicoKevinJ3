// Cargar habitaciones de ejemplo en LocalStorage (solo la primera vez)
if (!localStorage.getItem('habitaciones')) {
  const habitaciones = [
    {
      id: 1,
      nombre: "Suite Deluxe",
      camas: 2,
      maxPersonas: 4,
      precioNoche: 250000,
      servicios: ["Internet", "Jacuzzi", "Minibar"],
      imagen: "../../imagenes/habitaciones/suite-deluxe.jpg"
    },
    {
      id: 2,
      nombre: "Habitación Doble",
      camas: 2,
      maxPersonas: 2,
      precioNoche: 180000,
      servicios: ["Internet", "TV"],
      imagen: "../../imagenes/habitaciones/habitacion-doble.jpg"
    }
  ];
  localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
}

// Escuchar el formulario de búsqueda
const form = document.getElementById('buscar-form');
const container = document.getElementById('available-rooms');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fechaInicio = document.getElementById('fecha-inicio').value;
  const fechaFin = document.getElementById('fecha-fin').value;
  const personas = parseInt(document.getElementById('personas').value);

  const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];
  const disponibles = habitaciones.filter(h => h.maxPersonas >= personas);

  mostrarHabitacionesDisponibles(disponibles, fechaInicio, fechaFin);
});

function mostrarHabitacionesDisponibles(habitaciones, inicio, fin) {
  container.innerHTML = '';

  if (habitaciones.length === 0) {
    container.innerHTML = '<p>No hay habitaciones disponibles para las fechas seleccionadas.</p>';
    return;
  }

  habitaciones.forEach(hab => {
    const card = document.createElement('div');
    card.classList.add('room-card');

    card.innerHTML = `
      <img src="${hab.imagen}" alt="${hab.nombre}">
      <h3>${hab.nombre}</h3>
      <p><strong>Camas:</strong> ${hab.camas}</p>
      <p><strong>Máx. personas:</strong> ${hab.maxPersonas}</p>
      <p><strong>Precio noche:</strong> $${hab.precioNoche.toLocaleString()}</p>
      <p><strong>Servicios:</strong> ${hab.servicios.join(', ')}</p>
      <button class="reservar-btn" data-id="${hab.id}">Reservar</button>
    `;

    const btn = card.querySelector('.reservar-btn');
    btn.addEventListener('click', () => reservarHabitacion(hab, inicio, fin));

    container.appendChild(card);
  });
}

function reservarHabitacion(habitacion, inicio, fin) {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) {
    alert('Debes iniciar sesión para hacer una reserva.');
    window.location.href = '../login/login.html';
    return;
  }

  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  reservas.push({
    usuarioId: usuario.id,
    habitacionId: habitacion.id,
    fechaInicio: inicio,
    fechaFin: fin
  });
  localStorage.setItem('reservas', JSON.stringify(reservas));
  alert(`Reserva realizada para ${habitacion.nombre} del ${inicio} al ${fin}`);
}
