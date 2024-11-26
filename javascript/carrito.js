document.addEventListener('DOMContentLoaded', () => {
    const contenedorServicios = document.querySelector('.tarjeta-servicio'); // Contenedor de servicios
    const resumenTotal = document.querySelector('.resumen-carrito .precio-servicio'); // Elemento de total
    const resumenSubtotal = document.querySelector('.resumen-carrito .linea-resumen .texto-negrita'); // Elemento de subtotal
    const resumenCarrito = document.querySelector('.col-lg-4'); // Contenedor de resumen del carrito
    const serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || []; // Recuperar servicios del localStorage

    // Función para renderizar el carrito
    function renderizarCarrito() {
        contenedorServicios.innerHTML = '<h5 class="mb-4">Servicios seleccionados</h5><hr class="separador-perm">';

        if (serviciosEnCarrito.length === 0) {
            contenedorServicios.innerHTML += '<p>Tu carrito está vacío. Agrega servicios para continuar.</p>';
        } else {
            let subtotal = 0;

            serviciosEnCarrito.forEach((servicio, index) => {
                subtotal += servicio.precio; // Sumar precio al subtotal

                const servicioHTML = `
                    <div class="borde-inferior espaciado-vertical">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <!-- Mostrar la categoría correctamente -->
                                <span class="etiqueta-categoria">${servicio.categoria || 'Categoría no disponible'}</span>
                                <h6 class="titulo-servicio">${servicio.nombre}</h6>
                                <p class="descripcion-servicio">${servicio.descripcion}</p>
                                <button class="boton-eliminar" data-index="${index}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                            <div class="texto-end">
                                <span class="precio-servicio">₡${servicio.precio.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                `;

                contenedorServicios.innerHTML += servicioHTML;
            });
        }

        // Calcular el subtotal
        const subtotal = serviciosEnCarrito.reduce((acc, servicio) => acc + servicio.precio, 0);

        // Actualizar el resumen
        actualizarResumen(subtotal);
    }

    // Función para actualizar el resumen del pedido
    function actualizarResumen(subtotal) {
        // Mostrar el subtotal y total en la columna de resumen
        resumenSubtotal.textContent = `₡${subtotal.toLocaleString()}`;  // Formatear subtotal con comas
        resumenTotal.textContent = `₡${subtotal.toLocaleString()}`;  // Total es igual al subtotal en este caso

        // Generar el HTML del resumen del pedido (siempre se muestra)
        resumenCarrito.innerHTML = `
            <div class="resumen-carrito">
                <h5>Resumen del pedido</h5>
                <hr class="separador-perm">
                <div class="linea-resumen">
                    <span class="texto-muted">Subtotal</span>
                    <span class="texto-negrita">₡${subtotal.toLocaleString() || '0'}</span>
                </div>
                
                <hr>
                
                <div class="linea-resumen">
                    <span class="texto-negrita">Total</span>
                    <span class="precio-servicio">₡${subtotal.toLocaleString() || '0'}</span>
                </div>
                
                <button class="boton-pagar mt-4">
                    Proceder al pago
                </button>
            </div>
        `;
    }

    // Función para eliminar un servicio
    function eliminarServicio(index) {
        serviciosEnCarrito.splice(index, 1); // Eliminar el servicio por su índice
        localStorage.setItem('serviciosCarrito', JSON.stringify(serviciosEnCarrito)); // Guardar cambios en localStorage
        renderizarCarrito();  // Volver a renderizar el carrito
        actualizarContadorCarrito(); // Actualizar el contador del carrito
    }

    // Evento para controlar los botones dinámicos
    contenedorServicios.addEventListener('click', (event) => {
        const btn = event.target.closest('button');
        if (!btn) return;

        const index = btn.getAttribute('data-index');
        if (btn.classList.contains('boton-eliminar')) {
            eliminarServicio(index);  // Eliminar servicio si se hace clic en el botón de eliminar
        }
    });

    // Renderizar el carrito al cargar la página
    renderizarCarrito();
});