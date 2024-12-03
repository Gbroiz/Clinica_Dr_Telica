document.addEventListener('DOMContentLoaded', () => {
    const carritoLink = document.getElementById('carritoLink');
    const carritoSidebar = document.getElementById('carritoSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const cerrarSidebar = document.getElementById('cerrarSidebar');
    const carritoResumen = document.getElementById('carritoResumen');
    const subtotalCarrito = document.getElementById('subtotalCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    const cartBadge = document.querySelector('.badge');
    
    // Obtener los datos del carrito desde localStorage
    let serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];

    // Función para actualizar el badge del carrito
    function actualizarBadgeCarrito() {
        const cantidadTotal = serviciosEnCarrito.length;

        // Actualizar badge en pantallas pequeñas
        const badgeResponsive = document.querySelector('.d-lg-none .badge');
        if (badgeResponsive) {
            if (cantidadTotal > 0) {
                badgeResponsive.textContent = cantidadTotal;
                badgeResponsive.classList.remove('d-none');
            } else {
                badgeResponsive.classList.add('d-none');
            }
        }

        // Actualizar badge en pantallas grandes
        const badgeDesktop = document.querySelector('.d-lg-flex .badge');
        if (badgeDesktop) {
            if (cantidadTotal > 0) {
                badgeDesktop.textContent = cantidadTotal;
                badgeDesktop.classList.remove('d-none');
            } else {
                badgeDesktop.classList.add('d-none');
            }
        }
    }

    // Función para renderizar el resumen del carrito
    function renderizarCarritoSidebar() {
        carritoResumen.innerHTML = ''; // Limpiar contenido previo

        if (serviciosEnCarrito.length === 0) {
            carritoResumen.innerHTML = `
                <div class="carrito-vacio">
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            subtotalCarrito.textContent = '₡0';
            totalCarrito.textContent = '₡0';
        } else {
            let subtotal = 0;

            serviciosEnCarrito.forEach((servicio, index) => {
                subtotal += servicio.precio;

                const servicioHTML = `
                    <div class="linea-servicio">
                        <div class="linea-servicio-detalles">
                            <span class="categoria-servicio">${servicio.categoria || 'Categoría no disponible'}</span>
                            <strong class="nombre-servicio">${servicio.nombre}</strong>
                            <p class="descripcion-servicio">${servicio.descripcion}</p>
                        </div>
                        <div class="acciones-servicio">
                            <span class="precio-servicio">₡${servicio.precio.toLocaleString()}</span>
                            <button class="boton-eliminar" data-index="${index}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
                carritoResumen.innerHTML += servicioHTML;
            });

            subtotalCarrito.textContent = `₡${subtotal.toLocaleString()}`;
            totalCarrito.textContent = `₡${subtotal.toLocaleString()}`;

            // Agregar listeners para los botones de eliminar
            document.querySelectorAll('.boton-eliminar').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const index = e.currentTarget.getAttribute('data-index');
                    eliminarServicio(index);
                });
            });
        }

        // Actualizar el badge
        actualizarBadgeCarrito();
    }

    // Función para eliminar un servicio del carrito
    function eliminarServicio(index) {
        serviciosEnCarrito.splice(index, 1); // Eliminar servicio
        localStorage.setItem('serviciosCarrito', JSON.stringify(serviciosEnCarrito)); // Actualizar localStorage
        renderizarCarritoSidebar(); // Re-renderizar carrito
    }

    // Toggle Sidebar
    function toggleSidebar() {
        carritoSidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show');
        renderizarCarritoSidebar();
    }

    // Abrir sidebar
    carritoLink.addEventListener('click', toggleSidebar);

    // Cerrar sidebar
    cerrarSidebar.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Redirección al pagar
    document.getElementById('pagar-btn').addEventListener('click', () => {
        window.location.href = 'carrito.html';
    });

    // Renderizar el carrito inicialmente (al cargar la página)
    renderizarCarritoSidebar();

    // Si hay algún servicio agregado, volver a renderizar el carrito
    window.addEventListener('storage', () => {
        serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];
        renderizarCarritoSidebar(); // Re-renderizar carrito en caso de cambios
    });

    document.addEventListener('carritoActualizado', () => {
        serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];
        renderizarCarritoSidebar();
    });
});
