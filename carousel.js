// Carrusel de habitaciones
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('habitaciones-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    // Datos de ejemplo para las habitaciones (luego se pueden cargar desde localStorage)
    const habitaciones = [
        {
            id: 1,
            nombre: "Suite Deluxe",
            imagen: "imagenes/habitaciones/suite-deluxe.jpg",
            descripcion: "Amplia suite con jacuzzi y vista panorámica",
            precio: 250000
        },
        {
            id: 2,
            nombre: "Habitación Doble",
            imagen: "imagenes/habitaciones/habitacion-doble.jpg",
            descripcion: "Cómoda habitación para 2 personas",
            precio: 180000
        },
        {
            id: 3,
            nombre: "Suite Familiar",
            imagen: "imagenes/habitaciones/suite-familiar.jpg",
            descripcion: "Perfecta para familias, con espacio amplio",
            precio: 300000
        },
        {
            id: 4,
            nombre: "Habitación Individual",
            imagen: "imagenes/habitaciones/individual.jpg",
            descripcion: "Acogedora habitación para viajeros solos",
            precio: 120000
        }
    ];

    // Cargar habitaciones en el carrusel
    function cargarHabitacionesCarousel() {
        carousel.innerHTML = '';
        habitaciones.forEach(habitacion => {
            const habitacionElement = document.createElement('div');
            habitacionElement.className = 'carousel-item';
            habitacionElement.innerHTML = `
                <img src="${habitacion.imagen}" alt="${habitacion.nombre}">
                <div class="carousel-item-content">
                    <h3>${habitacion.nombre}</h3>
                    <p>${habitacion.descripcion}</p>
                    <p class="precio">$${habitacion.precio.toLocaleString()}/noche</p>
                </div>
            `;
            carousel.appendChild(habitacionElement);
        });
    }

    // Navegación del carrusel
    function navegarCarousel(direccion) {
        const scrollAmount = 320; // Ancho aproximado de cada item + gap
        carousel.scrollBy({
            left: direccion * scrollAmount,
            behavior: 'smooth'
        });
    }

    // Event listeners
    prevBtn.addEventListener('click', () => navegarCarousel(-1));
    nextBtn.addEventListener('click', () => navegarCarousel(1));

    // Inicializar carrusel
    cargarHabitacionesCarousel();
});