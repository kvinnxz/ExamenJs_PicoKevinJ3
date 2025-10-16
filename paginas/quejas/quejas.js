class SistemaQuejas {
    constructor() {
        this.usuarioActual = null;
        this.quejas = [];
        this.reservas = [];
        this.quejaParaEliminar = null;
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

    cerrarSesion() {
        localStorage.removeItem('sesionActivaHotel');
        localStorage.removeItem('usuarioActivo');
        window.location.href = '../login/login.html';
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
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            usuarioNombre: this.usuarioActual.nombre,
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

        div.innerHTML = `
            <div class="queja-header">
                <div class="queja-titulo">
                    <h3>${queja.asunto}</h3>
                    <div class="queja-meta">
                        <span>📅 ${this.formatearFecha(queja.fecha)}</span>
                        <span>🏨 ${reserva?.habitacion?.nombre || 'Reserva no encontrada'}</span>
                        <span>📋 ${queja.id}</span>
                    </div>
                </div>
                <div class="queja-actions">
                    <span class="tipo-badge">${queja.tipo}</span>
                    <span class="estado-badge ${queja.estado}">
                        ${queja.estado === 'pendiente' ? '⏳ Pendiente' : 
                          queja.estado === 'resuelto' ? '✅ Resuelto' : '❌ Rechazado'}
                    </span>
                    <button class="btn btn-primary" onclick="sistemaQuejas.verDetalle('${queja.id}')">
                        Ver Detalle
                    </button>
                    ${queja.estado === 'pendiente' ? 
                        `<button class="btn btn-danger" onclick="sistemaQuejas.eliminarQueja('${queja.id}')">
                            Eliminar
                        </button>` : ''}
                </div>
            </div>

            <div class="queja-descripcion">
                ${queja.descripcion}
            </div>

            ${queja.respuesta ? `
                <div class="queja-respuesta">
                    <h4>📬 Respuesta del Hotel (${this.formatearFecha(queja.fechaRespuesta)})</h4>
                    <p>${queja.respuesta}</p>
                </div>
            ` : ''}
        `;

        return div;
    }

    // ========== VER DETALLE ==========

    verDetalle(quejaId) {
        const queja = this.quejas.find(q => q.id === quejaId);
        if (!queja) return;

        const reserva = this.reservas.find(r => r.id === queja.reservaId);
        const detalleBody = document.getElementById('detalle-body');

        detalleBody.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Información de la Queja</h4>
                <div style="display: grid; gap: 0.8rem;">
                    <div><strong>Número de Ticket:</strong> ${queja.id}</div>
                    <div><strong>Tipo:</strong> <span class="tipo-badge">${queja.tipo}</span></div>
                    <div><strong>Estado:</strong> <span class="estado-badge ${queja.estado}">
                        ${queja.estado === 'pendiente' ? '⏳ Pendiente' : 
                          queja.estado === 'resuelto' ? '✅ Resuelto' : '❌ Rechazado'}
                    </span></div>
                    <div><strong>Fecha de Radicación:</strong> ${this.formatearFechaCompleta(queja.fecha)}</div>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Reserva Asociada</h4>
                <div style="display: grid; gap: 0.8rem;">
                    <div><strong>Habitación:</strong> ${reserva?.habitacion?.nombre || 'No disponible'}</div>
                    <div><strong>Fecha de Estadía:</strong> ${this.formatearFecha(reserva?.fechaInicio)} - ${this.formatearFecha(reserva?.fechaFin)}</div>
                    <div><strong>Noches:</strong> ${reserva?.noches || 0}</div>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Asunto</h4>
                <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">${queja.asunto}</p>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Descripción</h4>
                <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px; line-height: 1.6;">${queja.descripcion}</p>
            </div>

            ${queja.respuesta ? `
                <div style="border-top: 2px solid #3498db; padding-top: 1.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #3498db; margin-bottom: 0.5rem;">
                        📬 Respuesta del Hotel
                    </h4>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
                        Fecha de respuesta: ${this.formatearFechaCompleta(queja.fechaRespuesta)}
                    </p>
                    <p style="background: #e3f2fd; padding: 1rem; border-radius: 8px; line-height: 1.6; border-left: 3px solid #3498db;">
                        ${queja.respuesta}
                    </p>
                </div>
            ` : `
                <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; border-left: 3px solid #f39c12;">
                    <p style="margin: 0; color: #856404;">
                        ⏳ Esta queja aún no ha sido respondida. Te notificaremos cuando recibas una respuesta.
                    </p>
                </div>
            `}
        `;

        document.getElementById('modal-detalle').style.display = 'block';
    }

    // ========== ELIMINAR QUEJA ==========

    eliminarQueja(quejaId) {
        this.quejaParaEliminar = quejaId;
        document.getElementById('modal-eliminar').style.display = 'block';
    }

    confirmarEliminar() {
        if (!this.quejaParaEliminar) return;

        const index = this.quejas.findIndex(q => q.id === this.quejaParaEliminar);
        
        if (index !== -1) {
            this.quejas.splice(index, 1);
            this.guardarQuejas();
            this.renderizarQuejas();
            this.actualizarContadores();
            alert('✅ Queja eliminada correctamente');
        }

        this.quejaParaEliminar = null;
        this.cerrarModales();
    }

    // ========== UTILIDADES ==========

    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatearFechaCompleta(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    cerrarModales() {
        document.getElementById('modal-detalle').style.display = 'none';
        document.getElementById('modal-eliminar').style.display = 'none';
    }
}

// Inicializar
let sistemaQuejas;
document.addEventListener('DOMContentLoaded', () => {
    sistemaQuejas = new SistemaQuejas();
});