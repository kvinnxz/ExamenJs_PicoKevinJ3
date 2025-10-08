// Selección de elementos
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simular almacenamiento en LocalStorage
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  messages.push({
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('contactMessages', JSON.stringify(messages));

  // Mostrar mensaje de éxito
  contactMessage.textContent = 'Mensaje enviado con éxito. ¡Gracias por contactarnos!';
  contactMessage.style.color = 'green';
  contactMessage.classList.add('show');

  // Limpiar formulario
  contactForm.reset();

  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    contactMessage.classList.remove('show');
    contactMessage.textContent = '';
  }, 3000);
});