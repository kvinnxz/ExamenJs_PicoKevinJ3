// ======= Datos de ejemplo de habitaciones =======
let habitaciones = [
  {
    id: "hab01",
    nombre: "Suite Deluxe",
    camas: 2,
    maxPersonas: 4,
    servicios: ["Internet", "Minibar", "Jacuzzi"],
    precioNoche: 250
  },
  {
    id: "hab02",
    nombre: "Habitación Standard",
    camas: 1,
    maxPersonas: 2,
    servicios: ["Internet", "Minibar"],
    precioNoche: 120
  },
  {
    id: "hab03",
    nombre: "Suite Familiar",
    camas: 3,
    maxPersonas: 6,
    servicios: ["Internet", "Minibar", "Jacuzzi"],
    precioNoche: 300
  }
];

// Guardar habitaciones en localStorage si no existen
if (!localStorage.getItem("habitaciones")) {
  localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
}

// ======= Función para obtener reservas de LocalStorage =======
function obtenerReservas() {
  return JSON.parse(localStorage.getItem("reservas")) || [];
}

// ======= Función para guardar reservas =======
function guardarReservas(reservas) {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

// ======= Verificar si el usuario está logueado =======
function usuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

// ======= Verificar disponibilidad =======
function estaDisponible(habitacionId, checkin, checkout) {
  const reservas = obtenerReservas();
  const checkInDate = new Date(checkin);
  const checkOutDate = new Date(checkout);

  return !reservas.some(res => {
    if (res.habitacionId !== habitacionId) return false;
    const resCheckIn = new Date(res.checkin);
    const resCheckOut = new Date(res.checkout);
    // Si hay solapamiento de fechas
    return checkInDate < resCheckOut && checkOutDate > resCheckIn;
  });
}

// ======= Mostrar habitaciones disponibles =======
function mostrarHabitacionesDisponibles(checkin, checkout, personas) {
  const contenedor = document.getElementById("habitaciones-disponibles");
  contenedor.innerHTML = ""; // limpiar
  const habs = JSON.parse(localStorage.getItem("habitaciones")) || [];

  habs.forEach(hab => {
    if (hab.maxPersonas >= personas && estaDisponible(hab.id, checkin, checkout)) {
      const div = document.createElement("div");
      div.classList.add("habitacion-card");
      div.innerHTML = `
        <h3>${hab.nombre}</h3>
        <p>Camas: ${hab.camas} | Max Personas: ${hab.maxPersonas}</p>
        <p>Servicios: ${hab.servicios.join(", ")}</p>
        <p>Precio por noche: $${hab.precioNoche}</p>
        <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
      `;
      contenedor.appendChild(div);
    }
  });

  // Si no hay disponibles
  if (!contenedor.hasChildNodes()) {
    contenedor.innerHTML = "<p>No hay habitaciones disponibles para esas fechas.</p>";
  }

  // Asignar evento a botones reservar
  document.querySelectorAll(".btn-reservar").forEach(btn => {
    btn.addEventListener("click", () => {
      reservarHabitacion(btn.dataset.id, checkin, checkout, personas);
    });
  });
}

// ======= Función para reservar =======
function reservarHabitacion(habitacionId, checkin, checkout, personas) {
  const user = usuarioLogueado();
  if (!user) {
    alert("Debes iniciar sesión para reservar.");
    return;
  }

  if (!estaDisponible(habitacionId, checkin, checkout)) {
    alert("Lo sentimos, la habitación ya no está disponible.");
    return;
  }

  const reservas = obtenerReservas();
  reservas.push({
    usuarioId: user.id,
    habitacionId,
    checkin,
    checkout,
    personas
  });

  guardarReservas(reservas);
  alert("Reserva realizada con éxito!");
  mostrarHabitacionesDisponibles(checkin, checkout, personas);
}

// ======= Manejar formulario =======
document.getElementById("reserva-form").addEventListener("submit", e => {
  e.preventDefault();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const personas = parseInt(document.getElementById("personas").value, 10);

  if (new Date(checkin) >= new Date(checkout)) {
    alert("La fecha de salida debe ser posterior a la de llegada.");
    return;
  }

  mostrarHabitacionesDisponibles(checkin, checkout, personas);
});

// ======= Función para mostrar reservas del usuario y cancelarlas =======
function mostrarReservasUsuario() {
  const user = usuarioLogueado();
  if (!user) return;

  const reservas = obtenerReservas().filter(r => r.usuarioId === user.id);
  const contenedor = document.getElementById("habitaciones-disponibles");
  contenedor.innerHTML = "<h3>Mis Reservas:</h3>";

  reservas.forEach(res => {
    const habs = JSON.parse(localStorage.getItem("habitaciones")) || [];
    const hab = habs.find(h => h.id === res.habitacionId);

    const div = document.createElement("div");
    div.classList.add("habitacion-card");
    div.innerHTML = `
      <h3>${hab.nombre}</h3>
      <p>Checkin: ${res.checkin} | Checkout: ${res.checkout}</p>
      <p>Personas: ${res.personas}</p>
      <button class="btn-cancelar" data-checkin="${res.checkin}" data-checkout="${res.checkout}" data-id="${res.habitacionId}">Cancelar Reserva</button>
    `;
    contenedor.appendChild(div);
  });

  // Botones de cancelación
  document.querySelectorAll(".btn-cancelar").forEach(btn => {
    btn.addEventListener("click", () => {
      cancelarReserva(user.id, btn.dataset.id, btn.dataset.checkin, btn.dataset.checkout);
    });
  });
}

// ======= Cancelar reserva =======
function cancelarReserva(usuarioId, habitacionId, checkin, checkout) {
  let reservas = obtenerReservas();
  reservas = reservas.filter(r => {
    return !(r.usuarioId === usuarioId && r.habitacionId === habitacionId && r.checkin === checkin && r.checkout === checkout);
  });
  guardarReservas(reservas);
  alert("Reserva cancelada correctamente.");
  mostrarReservasUsuario();
}

// ======= Inicialización =======
// Si el usuario está logueado, mostrar sus reservas
if (usuarioLogueado()) {
  mostrarReservasUsuario();
}