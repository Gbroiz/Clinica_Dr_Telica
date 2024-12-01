document.addEventListener('DOMContentLoaded', () => {
    const carritoLink = document.getElementById('carritoLink');
    const carritoSidebar = document.getElementById('carritoSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const cerrarSidebar = document.getElementById('cerrarSidebar');
    const carritoResumen = document.getElementById('carritoResumen');
    const subtotalCarrito = document.getElementById('subtotalCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    const cartBadge = document.querySelector('.badge');
    const serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];

    // Actualizar badge del carrito
    function actualizarBadgeCarrito() {
        if (cartBadge) {
            cartBadge.textContent = serviciosEnCarrito.length;
            cartBadge.classList.toggle('d-none', serviciosEnCarrito.length === 0);
        }
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

            // Agregar listeners para botones de eliminar
            document.querySelectorAll('.boton-eliminar').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const index = e.currentTarget.getAttribute('data-index');
                    eliminarServicio(index);
                });
            });
        }

        // Actualizar badge
        actualizarBadgeCarrito();
    }

    // Función para eliminar un servicio
    function eliminarServicio(index) {
        serviciosEnCarrito.splice(index, 1);
        localStorage.setItem('serviciosCarrito', JSON.stringify(serviciosEnCarrito));
        renderizarCarritoSidebar();
    }

    // Redirección al pagar
    document.getElementById('pagar-btn').addEventListener('click', () => {
        window.location.href = 'carrito.html';
    });

    // Renderizar inicialmente si hay servicios
    renderizarCarritoSidebar();
});