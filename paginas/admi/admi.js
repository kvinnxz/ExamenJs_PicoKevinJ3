class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.habitaciones = [];
        this.reservas = [];
        this.init();
    }

    init() {
        this.checkAuth();
    }

    checkAuth() {
        const adminSession = localStorage.getItem('adminSession');
        
        if (adminSession) {
            this.currentUser = JSON.parse(adminSession);
            this.showAdminPanel();
        } else {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.getElementById('login-admin').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
        
        document.getElementById('admin-login-form').addEventListener('submit', (e) => this.login(e));
    }

    login(e) {
        e.preventDefault();
        
        const username = document.getElementById('admin-user').value;
        const password = document.getElementById('admin-pass').value;

        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username: 'admin', nombre: 'Administrador' };
            localStorage.setItem('adminSession', JSON.stringify(this.currentUser));
            this.showAdminPanel();
        } else {
            alert('❌ Credenciales incorrectas');
        }
    }

    showAdminPanel() {
        document.getElementById('login-admin').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        
        this.loadData();
        this.setupEventListeners();
        this.renderStats();
        this.renderRooms();
        this.renderBookings();
    }

    loadData() {
        this.habitaciones = JSON.parse(localStorage.getItem('habitacionesHotel') || '[]');
        this.reservas = JSON.parse(localStorage.getItem('reservasHotel') || '[]');
    }

    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Habitaciones
        document.getElementById('add-room-btn').addEventListener('click', () => this.openRoomModal());
        document.getElementById('room-form').addEventListener('submit', (e) => this.saveRoom(e));

        // Reservas
        document.getElementById('booking-filter').addEventListener('change', () => this.renderBookings());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    // ========== STATS ==========
    renderStats() {
        const totalRooms = this.habitaciones.length;
        const activeBookings = this.reservas.filter(r => r.estado === 'confirmada').length;
        const todayIncome = this.reservas
            .filter(r => r.estado === 'confirmada' && this.isToday(r.fechaReserva))
            .reduce((sum, r) => sum + (r.precioTotal || 0), 0);
        const occupancyRate = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;

        document.getElementById('total-rooms').textContent = totalRooms;
        document.getElementById('active-bookings').textContent = activeBookings;
        document.getElementById('today-income').textContent = `$${todayIncome.toLocaleString()}`;
        document.getElementById('occupancy-rate').textContent = `${occupancyRate}%`;
    }

    isToday(dateString) {
        const today = new Date().toDateString();
        return new Date(dateString).toDateString() === today;
    }

    // ========== TABS ==========
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    // ========== HABITACIONES ==========
    renderRooms() {
        const container = document.getElementById('rooms-list');
        container.innerHTML = '';

        this.habitaciones.forEach(room => {
            const roomCard = this.createRoomCard(room);
            container.appendChild(roomCard);
        });
    }

    createRoomCard(room) {
        const div = document.createElement('div');
        div.className = 'room-card';
        div.innerHTML = `
            <div class="card-header">
                <div>
                    <strong>${room.nombre}</strong>
                    <div style="color: #666; font-size: 0.9rem;">${room.tipo} · $${room.precio?.toLocaleString()}/noche</div>
                </div>
                <div class="card-actions">
                    <button class="btn-primary" onclick="adminPanel.editRoom(${room.id})">Editar</button>
                    <button class="btn-danger" onclick="adminPanel.deleteRoom(${room.id})">Eliminar</button>
                </div>
            </div>
            <div class="card-details">
                <div>👥 ${room.personas} personas</div>
                <div>🛏️ ${room.camas} camas</div>
                <div>📏 ${room.metros}m²</div>
                <div>${room.disponible ? '✅ Disponible' : '❌ No disponible'}</div>
            </div>
        `;
        return div;
    }

    openRoomModal(room = null) {
        const modal = document.getElementById('room-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('room-form');

        if (room) {
            title.textContent = 'Editar Habitación';
            this.fillRoomForm(room);
        } else {
            title.textContent = 'Nueva Habitación';
            form.reset();
            document.getElementById('room-id').value = '';
        }

        modal.style.display = 'block';
    }

    fillRoomForm(room) {
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-name').value = room.nombre;
        document.getElementById('room-type').value = room.tipo;
        document.getElementById('room-price').value = room.precio;
        document.getElementById('room-capacity').value = room.personas;
        document.getElementById('room-beds').value = room.camas;
        document.getElementById('room-desc').value = room.descripcion || '';
    }

    saveRoom(e) {
        e.preventDefault();
        
        const roomId = document.getElementById('room-id').value;
        const roomData = {
            id: roomId || Date.now(),
            nombre: document.getElementById('room-name').value,
            tipo: document.getElementById('room-type').value,
            precio: parseInt(document.getElementById('room-price').value),
            personas: parseInt(document.getElementById('room-capacity').value),
            camas: parseInt(document.getElementById('room-beds').value),
            descripcion: document.getElementById('room-desc').value,
            metros: 25,
            disponible: true,
            servicios: ['wifi', 'tv', 'ac'],
            imagen: '../../imagenes/habitaciones/default.jpg'
        };

        if (roomId) {
            const index = this.habitaciones.findIndex(r => r.id == roomId);
            this.habitaciones[index] = { ...this.habitaciones[index], ...roomData };
        } else {
            this.habitaciones.push(roomData);
        }

        this.saveRooms();
        this.renderRooms();
        this.renderStats();
        this.closeModal();
    }

    editRoom(roomId) {
        const room = this.habitaciones.find(r => r.id === roomId);
        if (room) this.openRoomModal(room);
    }

    deleteRoom(roomId) {
        if (!confirm('¿Eliminar esta habitación?')) return;
        
        this.habitaciones = this.habitaciones.filter(r => r.id !== roomId);
        this.saveRooms();
        this.renderRooms();
        this.renderStats();
    }

    saveRooms() {
        localStorage.setItem('habitacionesHotel', JSON.stringify(this.habitaciones));
    }

    // ========== RESERVAS ==========
    renderBookings() {
        const container = document.getElementById('bookings-list');
        const filter = document.getElementById('booking-filter').value;
        
        container.innerHTML = '';

        let bookingsToShow = this.reservas;
        if (filter !== 'todas') {
            bookingsToShow = this.reservas.filter(b => b.estado === filter);
        }

        bookingsToShow.forEach(booking => {
            const bookingCard = this.createBookingCard(booking);
            container.appendChild(bookingCard);
        });
    }

    createBookingCard(booking) {
        const div = document.createElement('div');
        div.className = `booking-card ${booking.estado}`;
        
        const habitacion = this.habitaciones.find(r => r.id === booking.habitacionId) || {};
        
        div.innerHTML = `
            <div class="card-header">
                <div>
                    <strong>${habitacion.nombre || 'Habitación #' + booking.habitacionId}</strong>
                    <div style="color: #666; font-size: 0.9rem;">
                        ${this.formatDate(booking.fechaInicio)} → ${this.formatDate(booking.fechaFin)}
                    </div>
                </div>
                <div class="card-actions">
                    <span style="background: ${this.getStatusColor(booking.estado)}; 
                                 color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem;">
                        ${booking.estado}
                    </span>
                    ${booking.estado === 'confirmada' ? 
                        `<button class="btn-danger" onclick="adminPanel.cancelBooking('${booking.id}')">Cancelar</button>` : 
                        ''
                    }
                </div>
            </div>
            <div class="card-details">
                <div>👤 Usuario: ${booking.usuarioId}</div>
                <div>⏱️ ${booking.noches} noches</div>
                <div>💰 $${(booking.precioTotal || 0).toLocaleString()}</div>
                <div>📅 ${this.formatDate(booking.fechaReserva)}</div>
            </div>
        `;
        return div;
    }

    cancelBooking(bookingId) {
        if (!confirm('¿Cancelar esta reserva?')) return;
        
        const booking = this.reservas.find(b => b.id === bookingId);
        if (booking) {
            booking.estado = 'cancelada';
            localStorage.setItem('reservasHotel', JSON.stringify(this.reservas));
            this.renderBookings();
            this.renderStats();
        }
    }

    // ========== UTILITIES ==========
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    getStatusColor(status) {
        const colors = {
            confirmada: '#27ae60',
            cancelada: '#e74c3c',
            pendiente: '#f39c12'
        };
        return colors[status] || '#95a5a6';
    }

    closeModal() {
        document.getElementById('room-modal').style.display = 'none';
    }

    logout() {
        localStorage.removeItem('adminSession');
        window.location.reload();
    }
}

// Inicializar
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});