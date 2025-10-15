class SistemaQuejas {
    constructor() {
        this.usuarioActual = null;
        this.quejas = [];
        this.reservas = [];
        this.quejaEnEdicion = null;
        this.init();
    }

    init() {
        this.verificarAutenticacion();
        this.cargarDatos();
        this.setupEventListeners();
        this.renderizarQuejas();
    }

    // ========== AUTENTICACIÓN ==========

    verificarAutenticacion() {
        const sesionGuardada = localStorage.getItem('sesionActivaHotel');
        
        if (!sesionGuardada) {
            alert('⚠️ Debes iniciar sesión para acceder a esta página');
            window.location.href = '../login/login.html';
            return;
        }

        try {
            const sesion = JSON.parse(sesionGuardada);
            const ahora = new Date();
            const expiracion = new Date(sesion.expira);

            if (ahora < expiracion) {
                this.usuarioActual = sesion.usuario;
                this.actualizarInterfazUsuario();
            } else {
                localStorage.removeItem('sesionActivaHotel');
                localStorage.removeItem('usuarioActivo');
                alert('⚠️ Tu sesión ha expirado');
                window.location.href = '../login/login.html';
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            window.location.href = '../login/login.html';
        }
    }

    actualizarInterfazUsuario() {
        document.getElementById('user-name').textContent = this.usuarioActual.nombre.split(' ')[0];
        document.getElementById('banner-user-name').textContent = this.usuarioActual.nombre;
    }

    // ========== CARGA DE DATOS ==========

    cargarDatos() {
        // Cargar quejas
        this.quejas = JSON.parse(localStorage.getItem('quejasHotel') || '[]');
        
        // Cargar reservas del usuario
        const todasReservas = JSON.parse(localStorage.getItem('reservasHotel') || '[]');
        this.reservas = todasReservas.filter(r => 
            r.usuarioId === this.usuarioActual.id && 
            r.estado === 'confirmada'
        );

        this.cargarReservasSelect();
        this.actualizarContadores();
    }

    cargarReservasSelect() {
        const select = document.getElementById('reserva-select');
        select.innerHTML = '<option value="">Seleccione una reserva</option>';

        if (this.reservas.length === 0) {
            select.innerHTML += '<option value="" disabled>No tienes reservas confirmadas</option>';
            return;
        }

        this.reservas.forEach(reserva => {
            const option = document.createElement('option');
            option.value = reserva.id;
            option.textContent = `${reserva.habitacion?.nombre || 'Habitación'} - ${this.formatearFecha(reserva.fechaInicio)} (${reserva.noches} noches)`;
            select.appendChild(option);
        });
    }

    actualizarContadores() {
        const misQuejas = this.quejas.filter(q => q.usuarioId === this.usuarioActual.id);
        const pendientes = misQuejas.filter(q => q.estado === 'pendiente').length;
        
        document.getElementById('quejas-count').textContent = pendientes;
    }

    // ========== EVENT LISTENERS ==========

    setupEventListeners() {
        // Toggle formulario
        document.getElementById('toggle-form-btn').addEventListener('click', () => {
            this.toggleFormulario();
        });

        document.getElementById('cancelar-btn').addEventListener('click', () => {
            this.toggleFormulario(false);
        });

        // Formulario de queja
        document.getElementById('quejas-form').addEventListener('submit', (e) => {
            this.radicarQueja(e);
        });

        // Contador de caracteres
        document.getElementById('descripcion-textarea').addEventListener('input', (e) => {
            document.getElementById('char-count').textContent = e.target.value.length;
        });

        // Filtros
        document.getElementById('estado-filter').addEventListener('change', () => {
            this.renderizarQuejas();
        });

        document.getElementById('tipo-filter').addEventListener('change', () => {
            this.renderizarQuejas();
        });

        // Cerrar sesión
        document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            this.cerrarSesion();
        });

        // Modales
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.cerrarModales());
        });

        document.getElementById('cerrar-detalle-btn').addEventListener('click', () => {
            this.cerrarModales();
        });

        document.getElementById('cancelar-eliminar-btn').addEventListener('click', () => {
            this.cerrarModales();
        });

        document.getElementById('confirmar-eliminar-btn').addEventListener('click', () => {
            this.confirmarEliminar();
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.cerrarModales();
            }
        });
    }

    toggleFormulario(mostrar = null) {
        const formContainer = document.getElementById('form-container');
        const toggleBtn = document.getElementById('toggle-form-btn');
        
        if (mostrar === null) {
            mostrar = formContainer.style.display === 'none';
        }

        if (mostrar) {
            formContainer.style.display = 'block';
            toggleBtn.textContent = '✕ Cancelar';
            formContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            formContainer.style.display = 'none';
            toggleBtn.textContent = '+ Nueva Queja/Reclamo';
            document.getElementById('quejas-form').reset();
            document.getElementById('char-count').textContent = '0';
        }
    }

    // ========== RADICAR QUEJA ==========

    async radicarQueja(e) {
        e.preventDefault();

        const reservaId = document.getElementById('reserva-select').value;
        const tipo = document.getElementById('tipo-select').value;
        const asunto = document.getElementById('asunto-input').value;
        const descripcion = document.getElementById('descripcion-textarea').value;

        // Validaciones
        if (!reservaId || !tipo || !asunto.trim() || !descripcion.trim()) {
            alert('❌ Por favor completa todos los campos');
            return;
        }

        if (descripcion.length < 20) {
            alert('❌ La descripción debe tener al menos 20 caracteres');
            return;
        }

        // Crear queja
        const queja = {
            id: 'Q' + Date.now(),
            usuarioId: this.usuarioActual.id,
            reservaId: reservaId,
            tipo: tipo,
            asunto: asunto,
            descripcion: descripcion,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            respuesta: null,
            fechaRespuesta: null
        };

        // Guardar
        this.quejas.push(queja);
        this.guardarQuejas();

        // Notificar
        alert('✅ Tu queja/reclamo ha sido radicado correctamente\n\nNúmero de ticket: ' + queja.id);

        // Limpiar y actualizar
        this.toggleFormulario(false);
        this.renderizarQuejas();
        this.actualizarContadores();
    }

    guardarQuejas() {
        localStorage.setItem('quejasHotel', JSON.stringify(this.quejas));
    }

    // ========== RENDERIZAR QUEJAS ==========

    renderizarQuejas() {
        const container = document.getElementById('quejas-lista');
        const sinQuejas = document.getElementById('sin-quejas');
        
        // Filtrar quejas del usuario
        let misQuejas = this.quejas.filter(q => q.usuarioId === this.usuarioActual.id);

        // Aplicar filtros
        const estadoFiltro = document.getElementById('estado-filter').value;
        const tipoFiltro = document.getElementById('tipo-filter').value;

        if (estadoFiltro !== 'todas') {
            misQuejas = misQuejas.filter(q => q.estado === estadoFiltro);
        }

        if (tipoFiltro !== 'todas') {
            misQuejas = misQuejas.filter(q => q.tipo === tipoFiltro);
        }

        // Ordenar por fecha (más recientes primero)
        misQuejas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Mostrar/ocultar
        if (misQuejas.length === 0) {
            container.style.display = 'none';
            sinQuejas.style.display = 'block';
            return;
        }

        container.style.display = 'flex';
        sinQuejas.style.display = 'none';

        // Renderizar
        container.innerHTML = '';
        misQuejas.forEach(queja => {
            const card = this.crearQuejaCard(queja);
            container.appendChild(card);
        });
    }

    crearQuejaCard(queja) {
        const div = document.createElement('div');
        div.className = `queja-card ${queja.estado}`;

        const reserva = this.reservas.find(r => r.id === queja.reservaId);

    }
}