class SistemaRegistro {
    constructor() {
        this.form = document.getElementById('registro-form');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordValidation();
    }

    setupEventListeners() {
        // Submit del formulario
        this.form.addEventListener('submit', (e) => this.registrarUsuario(e));

        // Botón limpiar formulario
        document.getElementById('btn-limpiar').addEventListener('click', () => this.limpiarFormulario());

        // Validación en tiempo real
        this.setupRealTimeValidation();

        // Redirección manual desde mensaje de éxito
        document.querySelector('.mensaje-exito a').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../login/login.html';
        });
    }

    setupRealTimeValidation() {
        // Validación de identificación
        document.getElementById('identificacion').addEventListener('input', (e) => {
            this.validarIdentificacion(e.target.value);
        });

        // Validación de nombre
        document.getElementById('nombre-completo').addEventListener('input', (e) => {
            this.validarNombre(e.target.value);
        });

        // Validación de email
        document.getElementById('email').addEventListener('input', (e) => {
            this.validarEmail(e.target.value);
        });

        // Validación de teléfono
        document.getElementById('telefono').addEventListener('input', (e) => {
            this.validarTelefono(e.target.value);
        });

        // Validación de contraseña
        document.getElementById('password').addEventListener('input', (e) => {
            this.validarPassword(e.target.value);
            this.validarConfirmacionPassword();
        });

        // Validación de confirmación de contraseña
        document.getElementById('confirm-password').addEventListener('input', (e) => {
            this.validarConfirmacionPassword();
        });

        // Validación de nacionalidad
        document.getElementById('nacionalidad').addEventListener('change', (e) => {
            this.validarNacionalidad(e.target.value);
        });
    }

    setupPasswordValidation() {
        const passwordInput = document.getElementById('password');
        
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            
            // Longitud mínima
            this.marcarRequisito('req-length', password.length >= 8);
            
            // Letra mayúscula
            this.marcarRequisito('req-uppercase', /[A-Z]/.test(password));
            
            // Letra minúscula
            this.marcarRequisito('req-lowercase', /[a-z]/.test(password));
            
            // Número
            this.marcarRequisito('req-number', /[0-9]/.test(password));
            
            // Carácter especial
            this.marcarRequisito('req-special', /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));
        });
    }

    marcarRequisito(elementId, cumple) {
        const element = document.getElementById(elementId);
        if (cumple) {
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    }

    // ========== VALIDACIONES ==========

    validarIdentificacion(identificacion) {
        const errorElement = document.getElementById('error-identificacion');
        const inputElement = document.getElementById('identificacion');

        if (!identificacion.trim()) {
            this.mostrarError(errorElement, 'La identificación es obligatoria', inputElement);
            return false;
        }

        if (!/^\d+$/.test(identificacion)) {
            this.mostrarError(errorElement, 'La identificación debe contener solo números', inputElement);
            return false;
        }

        if (identificacion.length < 6) {
            this.mostrarError(errorElement, 'La identificación debe tener al menos 6 dígitos', inputElement);
            return false;
        }

        // Verificar si la identificación ya existe
        if (this.identificacionExiste(identificacion)) {
            this.mostrarError(errorElement, 'Esta identificación ya está registrada', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    validarNombre(nombre) {
        const errorElement = document.getElementById('error-nombre');
        const inputElement = document.getElementById('nombre-completo');

        if (!nombre.trim()) {
            this.mostrarError(errorElement, 'El nombre completo es obligatorio', inputElement);
            return false;
        }

        if (nombre.length < 5) {
            this.mostrarError(errorElement, 'El nombre debe tener al menos 5 caracteres', inputElement);
            return false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            this.mostrarError(errorElement, 'El nombre solo puede contener letras y espacios', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

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

        // Verificar si el email ya existe
        if (this.emailExiste(email)) {
            this.mostrarError(errorElement, 'Este email ya está registrado', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    validarTelefono(telefono) {
        const errorElement = document.getElementById('error-telefono');
        const inputElement = document.getElementById('telefono');

        if (!telefono.trim()) {
            this.mostrarError(errorElement, 'El teléfono es obligatorio', inputElement);
            return false;
        }

        // Limpiar espacios y caracteres especiales para validación
        const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[+\-()]/g, '');
        
        if (!/^\d+$/.test(telefonoLimpio)) {
            this.mostrarError(errorElement, 'El teléfono debe contener solo números', inputElement);
            return false;
        }

        if (telefonoLimpio.length < 10) {
            this.mostrarError(errorElement, 'El teléfono debe tener al menos 10 dígitos', inputElement);
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

        if (password.length < 8) {
            this.mostrarError(errorElement, 'La contraseña debe tener al menos 8 caracteres', inputElement);
            return false;
        }

        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);
        const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial) {
            this.mostrarError(errorElement, 'La contraseña no cumple con todos los requisitos', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    validarConfirmacionPassword() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorElement = document.getElementById('error-confirm-password');
        const inputElement = document.getElementById('confirm-password');

        if (!confirmPassword) {
            this.mostrarError(errorElement, 'Confirme su contraseña', inputElement);
            return false;
        }

        if (password !== confirmPassword) {
            this.mostrarError(errorElement, 'Las contraseñas no coinciden', inputElement);
            return false;
        }

        this.limpiarError(errorElement, inputElement);
        return true;
    }

    validarNacionalidad(nacionalidad) {
        const errorElement = document.getElementById('error-nacionalidad');
        const inputElement = document.getElementById('nacionalidad');

        if (!nacionalidad) {
            this.mostrarError(errorElement, 'Seleccione su nacionalidad', inputElement);
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

    identificacionExiste(identificacion) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosHotel') || '[]');
        return usuarios.some(usuario => usuario.identificacion === identificacion);
    }

    emailExiste(email) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosHotel') || '[]');
        return usuarios.some(usuario => usuario.email === email.toLowerCase());
    }

    // ========== REGISTRO ==========

    async registrarUsuario(e) {
        e.preventDefault();

        // Validar todos los campos
        const esValido = this.validarFormularioCompleto();

        if (!esValido) {
            this.mostrarMensajeError('Por favor, corrija los errores en el formulario');
            return;
        }

        // Obtener datos del formulario
        const usuario = this.obtenerDatosFormulario();

        try {
            // Guardar usuario
            this.guardarUsuario(usuario);
            
            // Mostrar mensaje de éxito
            this.mostrarMensajeExito();
            
            // Limpiar formulario
            this.limpiarFormulario();
            
            // Redirección automática
            this.iniciarRedireccion();
            
        } catch (error) {
            this.mostrarMensajeError('Error al registrar usuario: ' + error.message);
        }
    }

    validarFormularioCompleto() {
        const identificacion = document.getElementById('identificacion').value;
        const nombre = document.getElementById('nombre-completo').value;
        const nacionalidad = document.getElementById('nacionalidad').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        return (
            this.validarIdentificacion(identificacion) &&
            this.validarNombre(nombre) &&
            this.validarNacionalidad(nacionalidad) &&
            this.validarEmail(email) &&
            this.validarTelefono(telefono) &&
            this.validarPassword(password) &&
            this.validarConfirmacionPassword() 
        );
    }

    obtenerDatosFormulario() {
    return {
        id: Date.now().toString(),
        identificacion: document.getElementById('identificacion').value,
        nombre: document.getElementById('nombre-completo').value,
        nacionalidad: document.getElementById('nacionalidad').value,
        email: document.getElementById('email').value.toLowerCase(),
        telefono: document.getElementById('telefono').value,
        password: this.encriptarPassword(document.getElementById('password').value),
        fechaRegistro: new Date().toISOString(),
        activo: true,
        rol: 'usuario' // Por defecto, todos los usuarios son 'usuario'
    };
}

    encriptarPassword(password) {
        // En un entorno real, aquí se usaría una librería de encriptación
        // Por simplicidad, usamos btoa (no seguro para producción)
        return btoa(password);
    }

    guardarUsuario(usuario) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosHotel') || '[]');
        
        // Verificar duplicados (por si acaso)
        const existe = usuarios.some(u => 
            u.identificacion === usuario.identificacion || u.email === usuario.email
        );
        
        if (existe) {
            throw new Error('El usuario ya existe');
        }
        
        usuarios.push(usuario);
        localStorage.setItem('usuariosHotel', JSON.stringify(usuarios));
        
        console.log('Usuario registrado:', usuario);
    }

    mostrarMensajeExito() {
        const formulario = document.getElementById('registro-form');
        const mensajeExito = document.getElementById('mensaje-exito');
        
        formulario.style.display = 'none';
        mensajeExito.style.display = 'block';
    }

    mostrarMensajeError(mensaje) {
        // Podrías implementar un toast o alerta más elegante
        alert(mensaje);
    }

    limpiarFormulario() {
        this.form.reset();
        
        // Limpiar todas las clases de error/success
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Limpiar mensajes de error
        const errores = this.form.querySelectorAll('.error-message');
        errores.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Resetear requisitos de contraseña
        const requisitos = document.querySelectorAll('.password-requirements li');
        requisitos.forEach(req => {
            req.classList.remove('valid', 'invalid');
        });
        
        // Mostrar formulario nuevamente si estaba oculto
        this.form.style.display = 'block';
        document.getElementById('mensaje-exito').style.display = 'none';
    }

    iniciarRedireccion() {
        let segundos = 5;
        const contador = document.getElementById('contador-redireccion');
        
        const intervalo = setInterval(() => {
            segundos--;
            contador.textContent = segundos;
            
            if (segundos <= 0) {
                clearInterval(intervalo);
                window.location.href = '../login/login.html';
            }
        }, 1000);
    }
} 
    

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SistemaRegistro();
});