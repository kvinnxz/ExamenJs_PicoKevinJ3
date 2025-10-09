// Web Component para las tarjetas de habitación
class HabitacionCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['habitacion'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'habitacion' && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const habitacion = JSON.parse(this.getAttribute('habitacion') || '{}');
        
        this.shadowRoot.innerHTML = `
            <style>
                .habitacion-card {
                    background: #fff;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    border: 1px solid #eee;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .habitacion-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                }

                .habitacion-imagen {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                }

                .habitacion-info {
                    padding: 1.5rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .habitacion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 1rem;
                }

                .habitacion-tipo {
                    font-size: 0.9rem;
                    color: #f39c12;
                    text-transform: uppercase;
                    font-weight: bold;
                    letter-spacing: 1px;
                }

                .habitacion-precio {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2c3e50;
                }

                .habitacion-nombre {
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: #2c3e50;
                }

                .habitacion-descripcion {
                    color: #555;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    flex-grow: 1;
                }

                .habitacion-detalles {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    padding: 1rem 0;
                    border-top: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                }

                .detalle-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: #555;
                }

                .habitacion-servicios {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .servicio-tag {
                    background: #f8f9fa;
                    color: #2c3e50;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    border: 1px solid #e9ecef;
                }

                .habitacion-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                }

                .habitacion-disponibilidad .disponible {
                    color: #27ae60;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .habitacion-disponibilidad .no-disponible {
                    color: #e74c3c;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                .btn-reservar {
                    background-color: #27ae60;
                    color: white;
                    padding: 0.7rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-reservar:hover {
                    background-color: #219653;
                }

                .btn-reservar:disabled {
                    background-color: #bdc3c7;
                    cursor: not-allowed;
                }
            </style>

            <div class="habitacion-card">
                <img src="${habitacion.imagen}" alt="${habitacion.nombre}" class="habitacion-imagen">
                <div class="habitacion-info">
                    <div class="habitacion-header">
                        <span class="habitacion-tipo">${habitacion.tipo}</span>
                        <span class="habitacion-precio">$${habitacion.precio.toLocaleString()}/noche</span>
                    </div>
                    
                    <h3 class="habitacion-nombre">${habitacion.nombre}</h3>
                    <p class="habitacion-descripcion">${habitacion.descripcion}</p>
                    
                    <div class="habitacion-detalles">
                        <div class="detalle-item">
                            <span>👥</span>
                            <span>${habitacion.personas} Personas</span>
                        </div>
                        <div class="detalle-item">
                            <span>🛏️</span>
                            <span>${habitacion.camas} Camas</span>
                        </div>
                        <div class="detalle-item">
                            <span>📏</span>
                            <span>${habitacion.metros}m²</span>
                        </div>
                    </div>
                    
                    <div class="habitacion-servicios">
                        ${habitacion.servicios.map(servicio => 
                            `<span class="servicio-tag">${servicio}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="habitacion-footer">
                        <div class="habitacion-disponibilidad">
                            <span class="${habitacion.disponible ? 'disponible' : 'no-disponible'}">
                                ${habitacion.disponible ? '✅ Disponible' : '❌ No Disponible'}
                            </span>
                        </div>
                        ${habitacion.disponible ? 
                            `<a href="../reservas/reservas.html?habitacion=${habitacion.id}" class="btn-reservar">Reservar Ahora</a>` :
                            `<button class="btn-reservar" disabled>No Disponible</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }
}

// Registrar el Web Component
customElements.define('habitacion-card', HabitacionCard);

// Datos de las 20 habitaciones
class SistemaHabitaciones {
    constructor() {
        this.habitaciones = [];
        this.habitacionesFiltradas = [];
        this.init();
    }

    init() {
        this.cargarHabitaciones();
        this.setupEventListeners();
        this.mostrarHabitaciones();
        this.actualizarContador();
    }

    cargarHabitaciones() {
        const habitacionesGuardadas = localStorage.getItem('habitacionesHotel');
        
        if (habitacionesGuardadas) {
            this.habitaciones = JSON.parse(habitacionesGuardadas);
        } else {
            this.crearHabitacionesEjemplo();
            this.guardarHabitaciones();
        }
        
        this.habitacionesFiltradas = [...this.habitaciones];
    }

    crearHabitacionesEjemplo() {
        const habitacionesData = [
            // Individuales
            { id: 1, tipo: "individual", nombre: "Habitación Individual Estándar", precio: 120000, personas: 1, camas: 1, metros: 25, disponible: true, servicios: ["wifi", "tv", "ac"], imagen: "/imagenes/habitaciones/individual-estandar.jpg", descripcion: "Cómoda habitación individual perfecta para viajeros solos." },
            { id: 2, tipo: "individual", nombre: "Habitación Individual Superior", precio: 150000, personas: 1, camas: 1, metros: 30, disponible: true, servicios: ["wifi", "tv", "ac", "vista"], imagen: "imagenes/habitaciones/individual-superior.jpg", descripcion: "Amplia habitación individual con vista exterior." },
            
            // Dobles
            { id: 3, tipo: "doble", nombre: "Habitación Doble Estándar", precio: 180000, personas: 2, camas: 1, metros: 35, disponible: true, servicios: ["wifi", "tv", "ac", "minibar"], imagen: "/imagenes/habitaciones/doble-estandar.jpg", descripcion: "Acogedora habitación doble con cama king size." },
            { id: 4, tipo: "doble", nombre: "Habitación Doble Superior", precio: 220000, personas: 2, camas: 1, metros: 40, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista"], imagen: "/imagenes/habitaciones/doble-superior.jpg", descripcion: "Amplia habitación doble con vista panorámica." },
            { id: 5, tipo: "doble", nombre: "Habitación Doble Deluxe", precio: 250000, personas: 2, camas: 1, metros: 45, disponible: false, servicios: ["wifi", "tv", "ac", "minibar", "vista", "jacuzzi"], imagen: "/imagenes/habitaciones/doble-deluxe.jpg", descripcion: "Lujosa habitación doble con jacuzzi privado." },
            
            // Suites
            { id: 6, tipo: "suite", nombre: "Suite Junior", precio: 300000, personas: 2, camas: 1, metros: 50, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista", "terraza"], imagen: "/imagenes/habitaciones/suite-junior.jpg", descripcion: "Elegante suite con área de estar separada." },
            { id: 7, tipo: "suite", nombre: "Suite Ejecutiva", precio: 380000, personas: 2, camas: 1, metros: 60, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista", "jacuzzi", "terraza"], imagen: "/imagenes/habitaciones/suite-ejecutiva.jpg", descripcion: "Suite ejecutiva con oficina y jacuzzi." },
            { id: 8, tipo: "suite", nombre: "Suite Presidencial", precio: 500000, personas: 2, camas: 1, metros: 80, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista", "jacuzzi", "terraza"], imagen: "/imagenes/habitaciones/suite-presidencial.jpg", descripcion: "La suite más exclusiva del hotel con todos los lujos." },
            
            // Familiares
            { id: 9, tipo: "familiar", nombre: "Habitación Familiar Estándar", precio: 280000, personas: 4, camas: 2, metros: 45, disponible: true, servicios: ["wifi", "tv", "ac", "minibar"], imagen: "../../imagenes/habitaciones/familiar-estandar.jpg", descripcion: "Espaciosa habitación familiar perfecta para 4 personas." },
            { id: 10, tipo: "familiar", nombre: "Habitación Familiar Superior", precio: 320000, personas: 4, camas: 2, metros: 55, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista"], imagen: "../../imagenes/habitaciones/familiar-superior.jpg", descripcion: "Amplia habitación familiar con zona de juegos." },
            { id: 11, tipo: "familiar", nombre: "Suite Familiar", precio: 400000, personas: 4, camas: 2, metros: 65, disponible: false, servicios: ["wifi", "tv", "ac", "minibar", "vista", "terraza"], imagen: "../../imagenes/habitaciones/suite-familiar.jpg", descripcion: "Lujosa suite familiar con dos habitaciones separadas." },
            
            // Ejecutivas
            { id: 12, tipo: "ejecutiva", nombre: "Habitación Ejecutiva", precio: 260000, personas: 2, camas: 1, metros: 40, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "escritorio"], imagen: "../../imagenes/habitaciones/ejecutiva-estandar.jpg", descripcion: "Habitación diseñada para viajeros de negocios." },
            { id: 13, tipo: "ejecutiva", nombre: "Suite Ejecutiva Deluxe", precio: 350000, personas: 2, camas: 1, metros: 55, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "escritorio", "vista"], imagen: "../../imagenes/habitaciones/ejecutiva-deluxe.jpg", descripcion: "Suite ejecutiva con sala de reuniones privada." },
            
            // Más habitaciones para completar 20
            { id: 14, tipo: "individual", nombre: "Habitación Individual Económica", precio: 80000, personas: 1, camas: 1, metros: 20, disponible: true, servicios: ["wifi", "tv"], imagen: "../../imagenes/habitaciones/individual-economica.jpg", descripcion: "Habitación funcional y económica para estancias cortas." },
            { id: 15, tipo: "doble", nombre: "Habitación Doble Vista Jardín", precio: 200000, personas: 2, camas: 1, metros: 38, disponible: true, servicios: ["wifi", "tv", "ac", "vista"], imagen: "../../imagenes/habitaciones/doble-jardin.jpg", descripcion: "Habitación doble con vista al jardín del hotel." },
            { id: 16, tipo: "suite", nombre: "Suite Nupcial", precio: 450000, personas: 2, camas: 1, metros: 70, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista", "jacuzzi", "terraza", "flores"], imagen: "../../imagenes/habitaciones/suite-nupcial.jpg", descripcion: "Romántica suite perfecta para lunas de miel." },
            { id: 17, tipo: "familiar", nombre: "Habitación Familiar Conectada", precio: 360000, personas: 6, camas: 3, metros: 70, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "conectada"], imagen: "../../imagenes/habitaciones/familiar-conectada.jpg", descripcion: "Dos habitaciones familiares conectadas para grupos grandes." },
            { id: 18, tipo: "ejecutiva", nombre: "Suite Ejecutiva Corner", precio: 420000, personas: 2, camas: 1, metros: 60, disponible: false, servicios: ["wifi", "tv", "ac", "minibar", "escritorio", "vista", "terraza"], imagen: "../../imagenes/habitaciones/ejecutiva-corner.jpg", descripcion: "Suite ejecutiva esquina con vistas panorámicas." },
            { id: 19, tipo: "doble", nombre: "Habitación Doble Accesible", precio: 190000, personas: 2, camas: 1, metros: 42, disponible: true, servicios: ["wifi", "tv", "ac", "accesible"], imagen: "../../imagenes/habitaciones/doble-accesible.jpg", descripcion: "Habitación doble adaptada para personas con movilidad reducida." },
            { id: 20, tipo: "suite", nombre: "Suite Royal", precio: 600000, personas: 3, camas: 2, metros: 90, disponible: true, servicios: ["wifi", "tv", "ac", "minibar", "vista", "jacuzzi", "terraza", "botella"], imagen: "../../imagenes/habitaciones/suite-royal.jpg", descripcion: "La suite más exclusiva con servicio de mayordomo incluido." }
        ];

        this.habitaciones = habitacionesData;
    }

    guardarHabitaciones() {
        localStorage.setItem('habitacionesHotel', JSON.stringify(this.habitaciones));
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('aplicar-filtros').addEventListener('click', () => this.aplicarFiltros());
        document.getElementById('limpiar-filtros').addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('reset-filtros').addEventListener('click', () => this.limpiarFiltros());

        // Slider de precio
        const precioSlider = document.getElementById('precio-filtro');
        const precioValue = document.getElementById('precio-value');
        
        precioSlider.addEventListener('input', () => {
            precioValue.textContent = `$${parseInt(precioSlider.value).toLocaleString()}`;
        });

        // Aplicar filtros al cambiar selects
        document.getElementById('tipo-filtro').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('servicios-filtro').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('personas-filtro').addEventListener('change', () => this.aplicarFiltros());
    }

    aplicarFiltros() {
        const tipo = document.getElementById('tipo-filtro').value;
        const precioMax = parseInt(document.getElementById('precio-filtro').value);
        const servicio = document.getElementById('servicios-filtro').value;
        const personas = parseInt(document.getElementById('personas-filtro').value);

        this.habitacionesFiltradas = this.habitaciones.filter(habitacion => {
            // Filtro por tipo
            if (tipo !== 'todas' && habitacion.tipo !== tipo) {
                return false;
            }

            // Filtro por precio
            if (habitacion.precio > precioMax) {
                return false;
            }

            // Filtro por servicio
            if (servicio !== 'todos' && !habitacion.servicios.includes(servicio)) {
                return false;
            }

            // Filtro por personas
            if (personas > 0 && habitacion.personas < personas) {
                return false;
            }

            return true;
        });

        this.mostrarHabitaciones();
        this.actualizarContador();
    }

    limpiarFiltros() {
        document.getElementById('tipo-filtro').value = 'todas';
        document.getElementById('precio-filtro').value = '500000';
        document.getElementById('precio-value').textContent = '$500,000';
        document.getElementById('servicios-filtro').value = 'todos';
        document.getElementById('personas-filtro').value = '0';
        
        this.habitacionesFiltradas = [...this.habitaciones];
        this.mostrarHabitaciones();
        this.actualizarContador();
    }

    mostrarHabitaciones() {
        const container = document.getElementById('habitaciones-container');
        const sinResultados = document.getElementById('sin-resultados');

        container.innerHTML = '';

        if (this.habitacionesFiltradas.length === 0) {
            container.style.display = 'none';
            sinResultados.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        sinResultados.style.display = 'none';

        this.habitacionesFiltradas.forEach(habitacion => {
            const card = document.createElement('habitacion-card');
            card.setAttribute('habitacion', JSON.stringify(habitacion));
            container.appendChild(card);
        });
    }

    actualizarContador() {
        const contador = document.getElementById('contador-resultados');
        const total = this.habitacionesFiltradas.length;
        
        contador.innerHTML = `Mostrando <span>${total}</span> habitación${total !== 1 ? 'es' : ''} disponible${total !== 1 ? 's' : ''}`;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SistemaHabitaciones();
});