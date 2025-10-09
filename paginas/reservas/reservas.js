class SistemaReservas {
    constructor() {
        this.habitaciones = [];
        this.usuarioActual = null;
        this.reservaTemporal = null;
        this.init();
    }

    init() {
        this.cargarDatos();
        this.setupEventListeners();
        this.verificarAutenticacion();
        this.configurarFechas();
    }

    cargarDatos() {
        // Cargar habitaciones desde localStorage o crear ejemplos
        this.cargarHabitaciones();
        
        // Cargar usuario actual
        this.usuarioActual = this.obtenerUsuarioActual();
        
        // Actualizar interfaz según autenticación
        this.actualizarInterfazUsuario();
    }

    cargarHabitaciones() {
        const habitacionesGuardadas = localStorage.getItem('habitacionesHotel');
        
        if (habitacionesGuardadas) {
            this.habitaciones = JSON.parse(habitacionesGuardadas);
        } else {
            this.crearHabitacionesEjemplo();
        }
    }

    crearHabitacionesEjemplo() {
        // Usar las mismas habitaciones que en la página de habitaciones
        this.habitaciones = [
            {
                id: 1, tipo: "individual", nombre: "Habitación Individual Estándar", 
                precio: 120000, personas: 1, camas: 1, metros: 25, disponible: true, 
                servicios: ["wifi", "tv", "ac"], 
                imagen: "../../imagenes/habitaciones/individual-estandar.jpg",
                descripcion: "Cómoda habitación individual perfecta para viajeros solos."
            },
            {
                id: 2, tipo: "doble", nombre: "Habitación Doble Estándar", 
                precio: 180000, personas: 2, camas: 1, metros: 35, disponible: true, 
                servicios: ["wifi", "tv", "ac", "minibar"], 
                imagen: "../../imagenes/habitaciones/doble-estandar.jpg",
                descripcion: "Acogedora habitación doble con cama king size."
            },
            {
                id: 3, tipo: "suite", nombre: "Suite Junior", 
                precio: 300000, personas: 2, camas: 1, metros: 50, disponible: true, 
                servicios: ["wifi", "tv", "ac", "minibar", "vista", "terraza"], 
                imagen: "../../imagenes/habitaciones/suite-junior.jpg",
                descripcion: "Elegante suite con área de estar separada."
            }
        ];
        
        localStorage.setItem('habitacionesHotel', JSON.stringify(this.habitaciones));
    }

    setupEventListeners() {
        // Formulario de búsqueda
        document.getElementById('buscar-form').addEventListener('submit', (e) => this.buscarHabitaciones(e));
        
        // Botón limpiar
        document.getElementById('btn-limpiar').addEventListener('click', () => this.limpiarBusqueda());
        
        // Modales
        this.setupModales();
        
        // Navegación de usuario
        this.setupNavegacionUsuario();
        
        // Cambios en fechas
        document.getElementById('fecha-inicio').addEventListener('change', () => this.actualizarFechaFin());
    }

    setupModales() {
        // Modal de reserva
        const modalReserva = document.getElementById('modal-reserva');
        const modalLogin = document.getElementById('modal-login');
        
        // Cerrar modales
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.cerrarModales());
        });
        
        document.getElementById('btn-cancelar-reserva').addEventListener('click', () => this.cerrarModales());
        document.getElementById('btn-confirmar-reserva').addEventListener('click', () => this.confirmarReserva());
        
        // Cerrar modal haciendo click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modalReserva) this.cerrarModales();
            if (e.target === modalLogin) this.cerrarModales();
        });
    }

    setupNavegacionUsuario() {
        // Ver reservas
        document.getElementById('ver-reservas').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarMisReservas();
        });
        
        // Cerrar sesión
        document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            this.cerrarSesion();
        });
    }

    configurarFechas() {
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha-inicio').min = hoy;
        document.getElementById('fecha-fin').min = hoy;
    }

    actualizarFechaFin() {
        const fechaInicio = document.getElementById('fecha-inicio').value;
        if (fechaInicio) {
            document.getElementById('fecha-fin').min = fechaInicio;
            
            // Si fecha-fin es anterior a fecha-inicio, resetear
            const fechaFin = document.getElementById('fecha-fin').value;
            if (fechaFin && fechaFin < fechaInicio) {
                document.getElementById('fecha-fin').value = '';
            }
        }
    }

    // ========== AUTENTICACIÓN ==========

    obtenerUsuarioActual() {
        const sesionGuardada = localStorage.getItem('sesionActivaHotel');
        
        if (!sesionGuardada) return null;

        try {
            const sesion = JSON.parse(sesionGuardada);
            const ahora = new Date();
            const expiracion = new Date(sesion.expira);

            if (ahora < expiracion) {
                return sesion.usuario;
            } else {
                // Sesión expirada
                localStorage.removeItem('sesionActivaHotel');
                localStorage.removeItem('usuarioActivo');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    }

    verificarAutenticacion() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.actualizarInterfazUsuario();
    }

    actualizarInterfazUsuario() {
        const navLogin = document.getElementById('nav-login');
        const navRegistro = document.getElementById('nav-registro');
        const navUsuario = document.getElementById('nav-usuario');
        const userBanner = document.getElementById('user-banner');
        const userName = document.getElementById('user-name');
        const bannerUserName = document.getElementById('banner-user-name');
        const reservasCount = document.getElementById('reservas-count');

        if (this.usuarioActual) {
            // Usuario logueado
            navLogin.style.display = 'none';
            navRegistro.style.display = 'none';
            navUsuario.style.display = 'block';
            userBanner.style.display = 'block';

            userName.textContent = this.usuarioActual.nombre.split(' ')[0];
            bannerUserName.textContent = this.usuarioActual.nombre;

            // Actualizar contador de reservas
            const reservasUsuario = this.obtenerReservasUsuario();
            reservasCount.textContent = reservasUsuario.length;

        } else {
            // Usuario no logueado
            navLogin.style.display = 'block';
            navRegistro.style.display = 'block';
            navUsuario.style.display = 'none';
            userBanner.style.display = 'none';
        }
    }

    cerrarSesion() {
        localStorage.removeItem('sesionActivaHotel');
        localStorage.removeItem('usuarioActivo');
        this.usuarioActual = null;
        this.actualizarInterfazUsuario();
        
        // Recargar para limpiar cualquier estado
        window.location.reload();
    }

    // ========== BÚSQUEDA Y DISPONIBILIDAD ==========

    async buscarHabitaciones(e) {
        e.preventDefault();

        const fechaInicio = document.getElementById('fecha-inicio').value;
        const fechaFin = document.getElementById('fecha-fin').value;
        const personas = parseInt(document.getElementById('personas').value);

        // Validaciones básicas
        if (!this.validarFechas(fechaInicio, fechaFin)) return;
        if (!personas) {
            this.mostrarError('Selecciona el número de personas');
            return;
        }

        // Mostrar loading
        this.mostrarLoading(true);

        try {
            // Simular delay de búsqueda
            await new Promise(resolve => setTimeout(resolve, 1000));

            const habitacionesDisponibles = this.filtrarHabitacionesDisponibles(fechaInicio, fechaFin, personas);
            this.mostrarResultadosBusqueda(habitacionesDisponibles, fechaInicio, fechaFin, personas);
            
        } catch (error) {
            this.mostrarError('Error al buscar habitaciones: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    validarFechas(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            this.mostrarError('Selecciona ambas fechas');
            return false;
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (inicio < hoy) {
            this.mostrarError('La fecha de inicio no puede ser anterior a hoy');
            return false;
        }

        if (fin <= inicio) {
            this.mostrarError('La fecha de salida debe ser posterior a la de llegada');
            return false;
        }

        // Máximo 30 días de estancia
        const diffTime = fin - inicio;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 30) {
            this.mostrarError('La estancia máxima permitida es de 30 días');
            return false;
        }

        return true;
    }

    filtrarHabitacionesDisponibles(fechaInicio, fechaFin, personas) {
        // Obtener reservas existentes
        const reservas = this.obtenerTodasLasReservas();
        
        return this.habitaciones.filter(habitacion => {
            // Filtrar por capacidad
            if (habitacion.personas < personas) return false;
            
            // Filtrar por disponibilidad en fechas
            const tieneConflicto = reservas.some(reserva => {
                if (reserva.habitacionId !== habitacion.id) return false;
                if (reserva.estado === 'cancelada') return false;
                
                // Verificar solapamiento de fechas
                const inicioReserva = new Date(reserva.fechaInicio);
                const finReserva = new Date(reserva.fechaFin);
                const inicioBusqueda = new Date(fechaInicio);
                const finBusqueda = new Date(fechaFin);
                
                return (inicioBusqueda < finReserva && finBusqueda > inicioReserva);
            });
            
            return !tieneConflicto && habitacion.disponible;
        });
    }

    calcularNoches(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diffTime = fin - inicio;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calcularPrecioTotal(precioNoche, noches) {
        return precioNoche * noches;
    }

    mostrarResultadosBusqueda(habitaciones, fechaInicio, fechaFin, personas) {
        const container = document.getElementById('available-rooms');
        const noResultados = document.getElementById('no-habitaciones');
        const resumen = document.getElementById('resumen-busqueda');
        
        // Limpiar resultados anteriores
        container.innerHTML = '';
        
        // Mostrar/Ocultar según resultados
        if (habitaciones.length === 0) {
            container.style.display = 'none';
            noResultados.style.display = 'block';
            resumen.style.display = 'none';
            return;
        }
        
        container.style.display = 'grid';
        noResultados.style.display = 'none';
        
        // Calcular información de la búsqueda
        const noches = this.calcularNoches(fechaInicio, fechaFin);
        
        // Mostrar resumen
        this.mostrarResumenBusqueda(fechaInicio, fechaFin, personas, noches, habitaciones.length);
        resumen.style.display = 'block';
        
        // Mostrar habitaciones
        habitaciones.forEach(habitacion => {
            const precioTotal = this.calcularPrecioTotal(habitacion.precio, noches);
            const habitacionElement = this.crearElementoHabitacion(habitacion, precioTotal, noches, fechaInicio, fechaFin);
            container.appendChild(habitacionElement);
        });
    }

    mostrarResumenBusqueda(fechaInicio, fechaFin, personas, noches, totalHabitaciones) {
        document.getElementById('resumen-fechas').textContent = 
            `${this.formatearFecha(fechaInicio)} - ${this.formatearFecha(fechaFin)}`;
        document.getElementById('resumen-personas').textContent = `${personas} persona${personas !== 1 ? 's' : ''}`;
        document.getElementById('resumen-noches').textContent = `${noches} noche${noches !== 1 ? 's' : ''}`;
        document.getElementById('resumen-habitaciones').textContent = totalHabitaciones;
    }

    crearElementoHabitacion(habitacion, precioTotal, noches, fechaInicio, fechaFin) {
        const div = document.createElement('div');
        div.className = 'room-card';
        
        div.innerHTML = `
            <img src="${habitacion.imagen}" alt="${habitacion.nombre}" onerror="this.src='../../imagenes/habitaciones/default.jpg'">
            <div class="room-card-content">
                <div class="room-header">
                    <span class="room-type">${habitacion.tipo}</span>
                    <span class="room-price">$${habitacion.precio.toLocaleString()}/noche</span>
                </div>
                
                <h3 class="room-name">${habitacion.nombre}</h3>
                <p class="room-description">${habitacion.descripcion}</p>
                
                <div class="room-details">
                    <div class="detail-item">
                        <span>👥</span>
                        <span>${habitacion.personas} Personas</span>
                    </div>
                    <div class="detail-item">
                        <span>🛏️</span>
                        <span>${habitacion.camas} Cama${habitacion.camas !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span>📏</span>
                        <span>${habitacion.metros}m²</span>
                    </div>
                </div>
                
                <div class="room-services">
                    ${habitacion.servicios.map(servicio => 
                        `<span class="service-tag">${servicio}</span>`
                    ).join('')}
                </div>
                
                <div class="room-footer">
                    <div class="total-price">
                        Total: $${precioTotal.toLocaleString()}
                        <small>(${noches} noche${noches !== 1 ? 's' : ''})</small>
                    </div>
                    <button class="btn-reservar" data-id="${habitacion.id}">
                        Reservar Ahora
                    </button>
                </div>
            </div>
        `;
        
        // Agregar evento al botón de reservar
        const btnReservar = div.querySelector('.btn-reservar');
        btnReservar.addEventListener('click', () => {
            this.prepararReserva(habitacion, fechaInicio, fechaFin, noches, precioTotal);
        });
        
        return div;
    }

    // ========== RESERVAS ==========

    prepararReserva(habitacion, fechaInicio, fechaFin, noches, precioTotal) {
        if (!this.usuarioActual) {
            this.mostrarModalLogin();
            return;
        }
        
        this.reservaTemporal = {
            habitacion: habitacion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            noches: noches,
            precioTotal: precioTotal,
            fechaReserva: new Date().toISOString()
        };
        
        this.mostrarModalReserva();
    }

    mostrarModalReserva() {
        const modal = document.getElementById('modal-reserva');
        const detalles = document.getElementById('reserva-detalles');
        
        detalles.innerHTML = `
            <div class="reserva-confirmacion">
                <div class="confirmacion-header">
                    <h4>${this.reservaTemporal.habitacion.nombre}</h4>
                    <span class="room-type">${this.reservaTemporal.habitacion.tipo}</span>
                </div>
                
                <div class="confirmacion-detalles">
                    <div class="detalle-fila">
                        <span>👤 Huésped:</span>
                        <strong>${this.usuarioActual.nombre}</strong>
                    </div>
                    <div class="detalle-fila">
                        <span>📅 Fechas:</span>
                        <strong>${this.formatearFecha(this.reservaTemporal.fechaInicio)} - ${this.formatearFecha(this.reservaTemporal.fechaFin)}</strong>
                    </div>
                    <div class="detalle-fila">
                        <span>⏱️ Estancia:</span>
                        <strong>${this.reservaTemporal.noches} noche${this.reservaTemporal.noches !== 1 ? 's' : ''}</strong>
                    </div>
                    <div class="detalle-fila">
                        <span>👥 Personas:</span>
                        <strong>Máx. ${this.reservaTemporal.habitacion.personas}</strong>
                    </div>
                    <div class="detalle-fila">
                        <span>💰 Precio por noche:</span>
                        <strong>$${this.reservaTemporal.habitacion.precio.toLocaleString()}</strong>
                    </div>
                </div>
                
                <div class="confirmacion-total">
                    <div class="total-fila">
                        <span>Subtotal ({this.reservaTemporal.noches} noches):</span>
                        <span>$${(this.reservaTemporal.habitacion.precio * this.reservaTemporal.noches).toLocaleString()}</span>
                    </div>
                    <div class="total-fila">
                        <span>Impuestos (19%):</span>
                        <span>$${Math.round(this.reservaTemporal.precioTotal * 0.19).toLocaleString()}</span>
                    </div>
                    <div class="total-fila total">
                        <strong>Total a pagar:</strong>
                        <strong>$${Math.round(this.reservaTemporal.precioTotal * 1.19).toLocaleString()}</strong>
                    </div>
                </div>
                
                <div class="confirmacion-info">
                    <p>📞 Te contactaremos para confirmar los detalles de pago.</p>
                    <p>❌ Cancelación gratuita hasta 48 horas antes del check-in.</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    confirmarReserva() {
        if (!this.reservaTemporal || !this.usuarioActual) {
            this.mostrarError('Error al procesar la reserva');
            return;
        }

        try {
            const reserva = {
                id: 'R' + Date.now(),
                usuarioId: this.usuarioActual.id,
                habitacionId: this.reservaTemporal.habitacion.id,
                fechaInicio: this.reservaTemporal.fechaInicio,
                fechaFin: this.reservaTemporal.fechaFin,
                noches: this.reservaTemporal.noches,
                precioNoche: this.reservaTemporal.habitacion.precio,
                precioTotal: Math.round(this.reservaTemporal.precioTotal * 1.19), // Con impuestos
                fechaReserva: new Date().toISOString(),
                estado: 'confirmada',
                habitacion: this.reservaTemporal.habitacion
            };

            this.guardarReserva(reserva);
            this.mostrarExito('¡Reserva confirmada! Te hemos enviado un email con los detalles.');
            this.cerrarModales();
            
            // Actualizar interfaz
            this.actualizarInterfazUsuario();
            this.mostrarMisReservas();

        } catch (error) {
            this.mostrarError('Error al confirmar la reserva: ' + error.message);
        }
    }

    guardarReserva(reserva) {
        const reservas = this.obtenerTodasLasReservas();
        reservas.push(reserva);
        localStorage.setItem('reservasHotel', JSON.stringify(reservas));
    }

    obtenerTodasLasReservas() {
        return JSON.parse(localStorage.getItem('reservasHotel') || '[]');
    }

    obtenerReservasUsuario() {
        if (!this.usuarioActual) return [];
        
        const todasReservas = this.obtenerTodasLasReservas();
        return todasReservas.filter(reserva => 
            reserva.usuarioId === this.usuarioActual.id && reserva.estado === 'confirmada'
        );
    }

    // ========== GESTIÓN DE RESERVAS ==========

    mostrarMisReservas() {
        const seccion = document.getElementById('mis-reservas-section');
        const lista = document.getElementById('lista-reservas');
        
        const reservasUsuario = this.obtenerReservasUsuario();
        
        if (reservasUsuario.length === 0) {
            lista.innerHTML = `
                <div class="no-resultados">
                    <div class="no-resultados-icon">📭</div>
                    <h3>No tienes reservas activas</h3>
                    <p>Realiza tu primera reserva para verla aquí.</p>
                </div>
            `;
        } else {
            lista.innerHTML = reservasUsuario.map(reserva => `
                <div class="reserva-card">
                    <div class="reserva-header">
                        <div class="reserva-habitacion">${reserva.habitacion.nombre}</div>
                        <span class="reserva-estado estado-${reserva.estado}">${reserva.estado}</span>
                    </div>
                    
                    <div class="reserva-detalles">
                        <div class="reserva-detalle">
                            <span class="reserva-label">Check-in</span>
                            <span class="reserva-valor">${this.formatearFecha(reserva.fechaInicio)}</span>
                        </div>
                        <div class="reserva-detalle">
                            <span class="reserva-label">Check-out</span>
                            <span class="reserva-valor">${this.formatearFecha(reserva.fechaFin)}</span>
                        </div>
                        <div class="reserva-detalle">
                            <span class="reserva-label">Noches</span>
                            <span class="reserva-valor">${reserva.noches}</span>
                        </div>
                        <div class="reserva-detalle">
                            <span class="reserva-label">Total</span>
                            <span class="reserva-valor">$${reserva.precioTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="reserva-actions">
                        <button class="btn-cancelar" onclick="sistemaReservas.cancelarReserva('${reserva.id}')">
                            Cancelar Reserva
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        seccion.style.display = 'block';
        seccion.scrollIntoView({ behavior: 'smooth' });
    }

    cancelarReserva(reservaId) {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            const reservas = this.obtenerTodasLasReservas();
            const reservaIndex = reservas.findIndex(r => r.id === reservaId);
            
            if (reservaIndex !== -1) {
                reservas[reservaIndex].estado = 'cancelada';
                localStorage.setItem('reservasHotel', JSON.stringify(reservas));
                
                this.mostrarExito('Reserva cancelada correctamente');
                this.mostrarMisReservas();
                this.actualizarInterfazUsuario();
            }
        } catch (error) {
            this.mostrarError('Error al cancelar la reserva: ' + error.message);
        }
    }

    // ========== UTILIDADES ==========

    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('loading-habitaciones');
        const roomsGrid = document.getElementById('available-rooms');
        
        if (mostrar) {
            loading.style.display = 'block';
            roomsGrid.style.display = 'none';
        } else {
            loading.style.display = 'none';
            roomsGrid.style.display = 'grid';
        }
    }

    mostrarModalLogin() {
        document.getElementById('modal-login').style.display = 'block';
    }

    cerrarModales() {
        document.getElementById('modal-reserva').style.display = 'none';
        document.getElementById('modal-login').style.display = 'none';
    }

    limpiarBusqueda() {
        document.getElementById('buscar-form').reset();
        document.getElementById('available-rooms').innerHTML = '';
        document.getElementById('no-habitaciones').style.display = 'none';
        document.getElementById('resumen-busqueda').style.display = 'none';
        this.configurarFechas();
    }

    mostrarError(mensaje) {
        // En un entorno real, usarías un toast o alerta más elegante
        alert('❌ ' + mensaje);
    }

    mostrarExito(mensaje) {
        alert('✅ ' + mensaje);
    }
}

// Inicializar el sistema cuando el DOM esté listo
let sistemaReservas;

document.addEventListener('DOMContentLoaded', () => {
    sistemaReservas = new SistemaReservas();
});