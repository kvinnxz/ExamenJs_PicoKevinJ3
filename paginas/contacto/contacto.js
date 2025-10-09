// contacto.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    // Establecer la fecha mínima para los campos de fecha (hoy)
    const today = new Date().toISOString().split('T')[0];
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener los valores del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleString()
        };

        // Validar campos
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showMessage('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Por favor, ingresa un email válido.', 'error');
            return;
        }

        // Guardar en localStorage
        saveContactMessage(formData);

        // Mostrar mensaje de éxito
        showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');

        // Limpiar formulario
        contactForm.reset();
    });

    function saveContactMessage(message) {
        // Obtener mensajes existentes o inicializar array vacío
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Agregar nuevo mensaje
        messages.push(message);
        
        // Guardar en localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        console.log('Mensaje guardado:', message);
    }

    function showMessage(text, type) {
        contactMessage.textContent = text;
        contactMessage.className = 'message show';
        
        if (type === 'success') {
            contactMessage.style.backgroundColor = '#d4edda';
            contactMessage.style.color = '#155724';
            contactMessage.style.border = '1px solid #c3e6cb';
        } else {
            contactMessage.style.backgroundColor = '#f8d7da';
            contactMessage.style.color = '#721c24';
            contactMessage.style.border = '1px solid #f5c6cb';
        }

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            contactMessage.classList.remove('show');
        }, 5000);
    }

    // Cargar mensajes existentes (para debugging)
    function loadContactMessages() {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        console.log('Mensajes de contacto guardados:', messages);
    }

    loadContactMessages();
});