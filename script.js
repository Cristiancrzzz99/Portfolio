/**
 * ==============================================================================
 * PORTFOLIO PERSONAL - UNIDAD 6
 * Archivo: script.js
 * Tecnologías: JavaScript Vanilla (ES6+) - Sin librerías externas
 * 
 * Funcionalidades implementadas:
 * 1. Menú hamburguesa responsive para móviles y tablets.
 * 2. Cierre automático del menú al hacer clic en enlaces o fuera del menú.
 * 3. Detección y manejo del placeholder para la foto de perfil.
 * 4. Resaltado automático del enlace activo al hacer scroll.
 * 5. Ventana modal interactiva para ver los detalles de los proyectos de ejemplo.
 * 6. Validación completa del formulario de contacto y mensaje de confirmación.
 * ==============================================================================
 */

// Se ejecuta una vez que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MENÚ HAMBURGUESA RESPONSIVE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const enlacesNavegacion = document.querySelectorAll('.nav-enlace');

    if (menuToggle && navMenu) {
        // Alternar apertura y cierre del menú móvil al pulsar el botón
        menuToggle.addEventListener('click', () => {
            const estaAbierto = navMenu.classList.toggle('abierto');
            menuToggle.classList.toggle('activo');
            menuToggle.setAttribute('aria-expanded', estaAbierto);
        });

        // Cerrar el menú automáticamente al hacer clic en cualquiera de los enlaces
        enlacesNavegacion.forEach(enlace => {
            enlace.addEventListener('click', () => {
                if (navMenu.classList.contains('abierto')) {
                    navMenu.classList.remove('abierto');
                    menuToggle.classList.remove('activo');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Cerrar el menú si el usuario hace clic fuera de la barra de navegación
        document.addEventListener('click', (evento) => {
            if (!navMenu.contains(evento.target) && !menuToggle.contains(evento.target)) {
                if (navMenu.classList.contains('abierto')) {
                    navMenu.classList.remove('abierto');
                    menuToggle.classList.remove('activo');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }


    /* ==========================================================================
       2. MANEJO DE FOTO DE PERFIL Y PLACEHOLDER AUTOMÁTICO
       ========================================================================== */
    const fotoPerfil = document.getElementById('foto-perfil');
    const fotoPlaceholder = document.getElementById('foto-placeholder');

    if (fotoPerfil && fotoPlaceholder) {
        // Función para activar el placeholder visual
        function activarPlaceholder() {
            fotoPerfil.style.display = 'none';
            fotoPlaceholder.style.display = 'flex';
        }

        // Si la imagen falla al cargar (por ejemplo, si el archivo aún no existe en img/)
        fotoPerfil.addEventListener('error', activarPlaceholder);

        // Si la imagen carga correctamente
        fotoPerfil.addEventListener('load', () => {
            fotoPerfil.style.display = 'block';
            fotoPlaceholder.style.display = 'none';
        });

        // Comprobación inicial por si la imagen ya falló antes de asignar el listener
        if (!fotoPerfil.complete || fotoPerfil.naturalWidth === 0) {
            // Intentamos verificar si tiene ancho válido, si no, activamos placeholder preventivo
            setTimeout(() => {
                if (fotoPerfil.naturalWidth === 0) {
                    activarPlaceholder();
                }
            }, 100);
        }
    }


    /* ==========================================================================
       3. RESALTADO DEL ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE (SCROLLSPY)
       ========================================================================== */
    const secciones = document.querySelectorAll('section[id]');

    function actualizarEnlaceActivo() {
        const posicionScroll = window.scrollY + 120;

        secciones.forEach(seccion => {
            const topeSeccion = seccion.offsetTop;
            const alturaSeccion = seccion.offsetHeight;
            const idSeccion = seccion.getAttribute('id');

            if (posicionScroll >= topeSeccion && posicionScroll < topeSeccion + alturaSeccion) {
                enlacesNavegacion.forEach(enlace => {
                    enlace.classList.remove('activo');
                    if (enlace.getAttribute('href') === `#${idSeccion}`) {
                        enlace.classList.add('activo');
                    }
                });
            }
        });
    }

    // Escuchamos el evento scroll con optimización
    window.addEventListener('scroll', actualizarEnlaceActivo);


    /* ==========================================================================
       4. MODAL PARA DETALLES DE PROYECTOS FICTICIOS
       ========================================================================== */
    const modal = document.getElementById('modal-proyecto');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalTecnologias = document.getElementById('modal-tecnologias');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnEntendidoModal = document.getElementById('btn-entendido-modal');

    // Función global para abrir el modal con datos personalizados
    window.abrirModalProyecto = function(titulo, descripcion, tecnologias) {
        if (!modal) return;
        modalTitulo.textContent = titulo;
        modalDescripcion.textContent = descripcion;
        modalTecnologias.textContent = tecnologias;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    };

    // Función para cerrar el modal
    function cerrarModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaura el scroll
    }

    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnEntendidoModal) btnEntendidoModal.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic en el fondo oscuro exterior
    if (modal) {
        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) {
                cerrarModal();
            }
        });
    }

    // Cerrar con la tecla Escape (accesibilidad)
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modal && modal.style.display === 'flex') {
            cerrarModal();
        }
    });


    /* ==========================================================================
       5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
       ========================================================================== */
    const formulario = document.getElementById('formulario-contacto');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputMensaje = document.getElementById('mensaje');
    const mensajeExito = document.getElementById('mensaje-exito');
    const btnCerrarAlerta = document.getElementById('btn-cerrar-alerta');

    // Elementos donde se muestran los textos de error
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    // Cerrar el mensaje de éxito manualmente si el usuario lo desea
    if (btnCerrarAlerta && mensajeExito) {
        btnCerrarAlerta.addEventListener('click', () => {
            mensajeExito.style.display = 'none';
        });
    }

    // Expresión regular estándar para validar correos electrónicos
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Función auxiliar para mostrar un error en un campo
    function mostrarError(input, elementoError, mensaje) {
        input.classList.add('input-error');
        elementoError.textContent = mensaje;
    }

    // Función auxiliar para limpiar el error de un campo
    function limpiarError(input, elementoError) {
        input.classList.remove('input-error');
        elementoError.textContent = '';
    }

    // Limpieza de errores en tiempo real mientras el usuario escribe
    if (inputNombre) {
        inputNombre.addEventListener('input', () => limpiarError(inputNombre, errorNombre));
    }
    if (inputEmail) {
        inputEmail.addEventListener('input', () => limpiarError(inputEmail, errorEmail));
    }
    if (inputMensaje) {
        inputMensaje.addEventListener('input', () => limpiarError(inputMensaje, errorMensaje));
    }

    // Evento de envío (submit) del formulario
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            // Evitamos que la página se recargue (ya que no hay servidor backend)
            evento.preventDefault();

            let formularioValido = true;

            // 1. Validar Campo: Nombre
            const valorNombre = inputNombre.value.trim();
            if (valorNombre === '') {
                mostrarError(inputNombre, errorNombre, 'Por favor, ingresa tu nombre completo.');
                formularioValido = false;
            } else if (valorNombre.length < 3) {
                mostrarError(inputNombre, errorNombre, 'El nombre debe tener al menos 3 caracteres.');
                formularioValido = false;
            } else {
                limpiarError(inputNombre, errorNombre);
            }

            // 2. Validar Campo: Email
            const valorEmail = inputEmail.value.trim();
            if (valorEmail === '') {
                mostrarError(inputEmail, errorEmail, 'Por favor, ingresa tu correo electrónico.');
                formularioValido = false;
            } else if (!regexEmail.test(valorEmail)) {
                mostrarError(inputEmail, errorEmail, 'Ingresa un correo electrónico con formato válido (ej. usuario@correo.com).');
                formularioValido = false;
            } else {
                limpiarError(inputEmail, errorEmail);
            }

            // 3. Validar Campo: Mensaje
            const valorMensaje = inputMensaje.value.trim();
            if (valorMensaje === '') {
                mostrarError(inputMensaje, errorMensaje, 'Por favor, escribe un mensaje.');
                formularioValido = false;
            } else if (valorMensaje.length < 10) {
                mostrarError(inputMensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
                formularioValido = false;
            } else {
                limpiarError(inputMensaje, errorMensaje);
            }

            // Si todos los campos son válidos
            if (formularioValido) {
                // Mostrar notificación de éxito en la interfaz
                if (mensajeExito) {
                    mensajeExito.style.display = 'flex';
                    // Desplazamiento suave hacia el mensaje de éxito para que el usuario lo note
                    mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reiniciamos los campos del formulario
                formulario.reset();

                // Mensaje en consola útil para el profesor / revisión académica
                console.log('✅ Formulario validado con éxito.');
                console.log('Datos simulados:', {
                    nombre: valorNombre,
                    email: valorEmail,
                    mensaje: valorMensaje
                });
            }
        });
    }

});
