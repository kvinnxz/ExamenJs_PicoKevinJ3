# 🏨 Hotel el Rincón del Carmen

Sistema de gestión hotelera completo desarrollado con JavaScript vanilla, HTML5 y CSS3. Proyecto full-stack que incluye gestión de reservas, habitaciones, usuarios y panel administrativo.


## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Autor](#autor)


## 🎯 Descripción

**Hotel el Rincón del Carmen** es un sistema web completo para la gestión de un hotel. Permite a los usuarios explorar habitaciones, realizar reservas, gestionar su cuenta y a los administradores controlar todo el sistema desde un panel centralizado.

El proyecto está desarrollado completamente en JavaScript vanilla (sin frameworks), utilizando localStorage para la persistencia de datos y Web Components para componentes reutilizables.

## ✨ Características

### Para Usuarios
- 🔐 Sistema de registro y autenticación
- 🏠 Catálogo de habitaciones con filtros avanzados
- 📅 Sistema de reservas en tiempo real
- 👤 Perfil de usuario personalizado
- 📧 Formulario de contacto
- 📱 Diseño 100% responsive

### Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- 🛏️ Gestión completa de habitaciones (CRUD)
- 📋 Gestión de reservas y usuarios
- 💰 Control de ingresos y ocupación
- 🔒 Panel de administración protegido

### Características Técnicas
- ✅ Web Components personalizados
- 💾 Persistencia con localStorage
- 🎨 Validación de formularios en tiempo real
- 🔄 Sistema de sesiones con expiración
- 📱 Mobile-first responsive design

## 🛠️ Tecnologías

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript  
  - Web Components 

- **Almacenamiento:**
  - LocalStorage 
  
- **Herramientas:**
  - Git & GitHub
  - Visual Studio Code

## 📁 Estructura del Proyecto

```
Proyecto_HotelJS/
├── index.html                 # Página principal
├── main.css                   # Estilos principales
├── main.js                    # JavaScript principal
├── carousel.js                # Carrusel de habitaciones
├── responsive.css             # Estilos responsive
│
├── imagenes/                  # Recursos visuales
│   ├── logo.png
│   ├── hero-video.mp4
│   ├── habitaciones/
│   ├── areas/
│   └── contacto/
│
└── paginas/                   # Páginas del sitio
    ├── habitaciones/          # Catálogo de habitaciones
    │   ├── habitaciones.html
    │   ├── habitaciones.css
    │   └── habitaciones.js    # Web Components
    │
    ├── reservas/              # Sistema de reservas
    │   ├── reservas.html
    │   ├── reservas.css
    │   └── reservas.js        # Lógica de reservas
    │
    ├── registro/              # Registro de usuarios
    │   ├── registro.html
    │   ├── registro.css
    │   └── registro.js        # Validaciones
    │
    ├── login/                 # Inicio de sesión
    │   ├── login.html
    │   ├── login.css
    │   └── login.js           # Autenticación
    │
    ├── contacto/              # Formulario de contacto
    │   ├── contacto.html
    │   ├── contacto.css
    │   └── contacto.js
    │
    └── admi/                  # Panel administrativo
        ├── admi.html
        ├── admi.css
        └── admi.js            # Gestión administrativa
```

## 🚀 Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor local (opcional: Live Server, XAMPP, etc.)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/kvinnxz/Proyecto_HotelJS.git
   cd Proyecto_HotelJS
   ```

2. **Abrir el proyecto**
   
   Opción A - Con Live Server (VSCode):
   - Instala la extensión "Live Server"
   - Click derecho en `index.html`
   - Selecciona "Open with Live Server"

   Opción B - Directamente en el navegador:
   - Abre `index.html` con tu navegador
   - Algunas funcionalidades pueden requerir un servidor local

3. **¡Listo!** El sistema está funcionando

## 💻 Uso

### Como Usuario

1. **Registrarse**
   - Ir a "Registro" en el menú
   - Completar el formulario con tus datos
   - El sistema validará todos los campos en tiempo real

2. **Iniciar Sesión**
   - Ir a "Login" en el menú
   - Usar las credenciales registradas

3. **Hacer una Reserva**
   - Explorar habitaciones desde "Habitaciones"
   - Usar filtros para encontrar la habitación ideal
   - Click en "Reservar Ahora"
   - Completar formulario de reserva

### Como Administrador

1. **Acceder al Panel**
   - Ir a `/paginas/admi/admi.html`
   - Credenciales por defecto:
     - Usuario: `admin`
     - Contraseña: `admin123`

2. **Gestionar Habitaciones**
   - Crear, editar o eliminar habitaciones
   - Establecer precios y disponibilidad
   - Agregar servicios y descripciones

3. **Gestionar Reservas**
   - Ver todas las reservas del sistema
   - Filtrar por estado (confirmada, cancelada)
   - Cancelar reservas si es necesario

## 🎨 Funcionalidades

### Sistema de Habitaciones
- 20 habitaciones precargadas
- 5 categorías: Individual, Doble, Suite, Familiar, Ejecutiva
- Filtros por: tipo, precio, servicios, capacidad
- Web Component personalizado para tarjetas de habitación
- Imágenes de alta calidad y descripciones detalladas

### Sistema de Reservas
- Validación de disponibilidad en tiempo real
- Cálculo automático de precios por noche
- Verificación de conflictos de fechas
- Límite de estancia máxima (30 días)
- Confirmación automática y notificaciones

### Sistema de Usuarios
- Validación de formularios con feedback visual
- Verificación de email único
- Encriptación básica de contraseñas
- Sistema de sesiones con expiración
- Perfiles de usuario personalizables

### Panel Administrativo
- Dashboard con 4 métricas clave
- Vista en tiempo real de ocupación
- Gestión completa de habitaciones


## 👨‍💻 Autor

**Kevin**  
Desarrollado como proyecto de práctica en JavaScript vanilla

- GitHub: [@kvinnxz](https://github.com/kvinnxz)

## 🙏 Agradecimientos
- Iconos de emojis nativos
- Inspiración en sistemas de gestión hotelera modernos

⭐ Si te gustó este proyecto, no olvides darle una estrella en GitHub!

**Desarrollado con ❤️ por Kevin**