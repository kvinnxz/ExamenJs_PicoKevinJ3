class SistemaLogin {
    constructor() {
        this.form = document.getElementById('login-form');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.verificarSesionActiva();
    }

    setupEventListeners() {
        // Submit del formulario
        this.form.addEventListener('submit', (e) => this.iniciarSesion(e));

        // Usuarios de demo
        this.setupDemoUsers();

        // Validación en tiempo real
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Validación de email
        document.getElementById('email').addEventListener('input', (e) => {
            this.validarEmail(e.target.value);
        });

        // Validación de contraseña
        document.getElementById('password').addEventListener('input', (e) => {
            this.validarPassword(e.target.value);
        });
    }

    setupDemoUsers() {
        const demoUsers = document.querySelectorAll('.demo-user');
        
        demoUsers.forEach(user => {
            user.addEventListener('click', () => {
                const email = user.getAttribute('data-email');
                const password = user.getAttribute('data-password');
                
                document.getElementById('email').value = email;
                document.getElementById('password').value = password;
                
                // Validar los campos automáticamente
                this.validarEmail(email);
                this.validarPassword(password);
                
                // Mostrar mensaje de que se llenaron los campos
                this.mostrarMensajeTemporal('Campos de demo cargados. Haz clic en "Iniciar Sesión"', 'info');
            });
        });
    }

    // ========== VALIDACIONES ==========

    validarEmail(email) {
        const errorElement = document.getElementById('error-email');
        const inputElement = document.getElementById('email');

        if (!email.trim()) {
            this.mostrarError(errorElement, 'El email es obligatorio', inputElement);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.mostrarError(errorElement, 'Ingrese un email válido', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    validarPassword(password) {
        const errorElement = document.getElementById('error-password');
        const inputElement = document.getElementById('password');

        if (!password) {
            this.mostrarError(errorElement, 'La contraseña es obligatoria', inputElement);
            return false;
        }

        if (password.length < 1) {
            this.mostrarError(errorElement, 'La contraseña es obligatoria', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    // ========== UTILIDADES ==========

    mostrarError(errorElement, mensaje, inputElement = null) {
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
        
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.classList.remove('success');
        }
    }

    limpiarError(errorElement, inputElement = null) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        
        if (inputElement) {
            inputElement.classList.remove('error');
            inputElement.classList.add('success');
        }
    }

    mostrarLoading(mostrar = true) {
        const btnLogin = document.getElementById('btn-login');
        const btnText = btnLogin.querySelector('.btn-text');
        const btnLoading = btnLogin.querySelector('.btn-loading');

        if (mostrar) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            btnLogin.disabled = true;
        } else {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            btnLogin.disabled = false;
        }
    }

    mostrarMensajeTemporal(mensaje, tipo = 'info') {
        // Crear elemento de mensaje temporal
        const mensajeElement = document.createElement('div');
        mensajeElement.className = `mensaje-temporal mensaje-${tipo}`;
        mensajeElement.textContent = mensaje;
        mensajeElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'error' ? '#e74c3c' : tipo === 'success' ? '#27ae60' : '#f39c12'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
        `;

        document.body.appendChild(mensajeElement);

        // Remover después de 3 segundos
        setTimeout(() => {
            mensajeElement.remove();
        }, 3000);
    }

    // ========== AUTENTICACIÓN ==========

    async iniciarSesion(e) {
        e.preventDefault();

        // Validar campos
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (!this.validarEmail(email) || !this.validarPassword(password)) {
            this.mostrarMensajeTemporal('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Mostrar loading
        this.mostrarLoading(true);

        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Autenticar usuario
            const usuario = this.autenticarUsuario(email, password);

            if (usuario) {
                // Iniciar sesión
                this.iniciarSesionUsuario(usuario, remember);
                this.mostrarMensajeBienvenida(usuario);
            } else {
                throw new Error('Credenciales incorrectas');
            }

        } catch (error) {
            this.mostrarMensajeTemporal(error.message, 'error');
        } finally {
            this.mostrarLoading(false);
        }
    }

    autenticarUsuario(email, password) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosHotel') || '[]');
        
        // Buscar usuario por email
        const usuario = usuarios.find(u => u.email === email.toLowerCase());
        
        if (!usuario) {
            throw new Error('No existe una cuenta con este email');
        }

        if (!usuario.activo) {
            throw new Error('Esta cuenta está desactivada');
        }

        // Verificar contraseña (encriptada básicamente)
        const passwordEncriptado = btoa(password);
        if (usuario.password !== passwordEncriptado) {
            throw new Error('Contraseña incorrecta');
        }

        return usuario;
    }

    iniciarSesionUsuario(usuario, remember = false) {
    // Crear sesión
    const sesion = {
        usuario: { // Guardamos todo el usuario, no solo algunos campos
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            nacionalidad: usuario.nacionalidad,
            rol: usuario.rol 
        },
        timestamp: new Date().toISOString(),
        expira: remember ? this.calcularExpiracion(30) : this.calcularExpiracion(1)
    };

    // Guardar sesión
    localStorage.setItem('sesionActivaHotel', JSON.stringify(sesion));
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

    console.log('Sesión iniciada:', sesion);
  }

    calcularExpiracion(dias) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + dias);
        return fecha.toISOString();
    }

    verificarSesionActiva() {
        const sesionGuardada = localStorage.getItem('sesionActivaHotel');
        
        if (sesionGuardada) {
            const sesion = JSON.parse(sesionGuardada);
            const ahora = new Date();
            const expiracion = new Date(sesion.expira);

            if (ahora < expiracion) {
                // Sesión aún válida, mostrar mensaje de bienvenida
                this.mostrarMensajeBienvenida(sesion.usuario);
            } else {
                // Sesión expirada, cerrar sesión
                this.cerrarSesion();
            }
        }
    }

    mostrarMensajeBienvenida(usuario) {
        const formulario = document.getElementById('login-form');
        const mensajeBienvenida = document.getElementById('welcome-message');
        const welcomeUser = document.getElementById('welcome-user');

        // Actualizar mensaje personalizado
        welcomeUser.textContent = `Hola ${usuario.nombre}, has iniciado sesión correctamente.`;

        // Ocultar formulario y mostrar mensaje de bienvenida
        formulario.style.display = 'none';
        mensajeBienvenida.style.display = 'block';

        // Ocultar usuarios demo si están visibles
        const demoUsers = document.querySelector('.demo-users');
        if (demoUsers) {
            demoUsers.style.display = 'none';
        }
    }

    cerrarSesion() {
        localStorage.removeItem('sesionActivaHotel');
        localStorage.removeItem('usuarioActivo');
        
        // Recargar página para mostrar formulario de login
        window.location.reload();
    }

    // Método para verificar si hay sesión activa (útil para otras páginas)
    static verificarAutenticacion() {
        const sesionGuardada = localStorage.getItem('sesionActivaHotel');
        
        if (!sesionGuardada) {
            return false;
        }

        const sesion = JSON.parse(sesionGuardada);
        const ahora = new Date();
        const expiracion = new Date(sesion.expira);

        return ahora < expiracion;
    }

    // Método para obtener usuario actual (útil para otras páginas)
    static obtenerUsuarioActual() {
        const sesionGuardada = localStorage.getItem('sesionActivaHotel');
        
        if (!sesionGuardada) {
            return null;
        }

        const sesion = JSON.parse(sesionGuardada);
        const ahora = new Date();
        const expiracion = new Date(sesion.expira);

        if (ahora < expiracion) {
            return sesion.usuario;
        } else {
            // Sesión expirada, limpiar
            localStorage.removeItem('sesionActivaHotel');
            localStorage.removeItem('usuarioActivo');
            return null;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SistemaLogin();
});