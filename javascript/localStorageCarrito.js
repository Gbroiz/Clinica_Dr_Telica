function guardarServicioEnCarrito(servicio) {
    let serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];
    
    const servicioExistente = serviciosEnCarrito.find(item => 
        item.nombre === servicio.nombre
    );

    if (servicioExistente) {
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad límite alcanzada',
            html: `
                <p style="font-size: 18px; margin-top: 10px; color: #333;">
                    El servicio "${servicio.nombre}" ya está en tu carrito
                </p>
            `,
            confirmButtonText: 'Continuar comprando',
            showCancelButton: true,
            cancelButtonText: 'Ir al carrito',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'swal2-continue-btn',
                cancelButton: 'swal2-cart-btn',
                popup: 'swal2-custom-popup'
            }
        }).then((result) => {
            if (result.isDismissed) {
                window.location.href = "carrito.html";
            }
        });
        return;
    }

    // Buscar la categoría del servicio
    const categoriaDelServicio = serviciosData.find(categoria => 
        categoria.servicios.some(s => s.nombre === servicio.nombre)
    )?.categoria || 'Error categoría';

    const nuevoServicio = {
        id: Date.now(),
        nombre: servicio.nombre,
        precio: parseInt(servicio.precio.replace(/[^\d]/g, '')),
        imagen: servicio.imagenes[0],
        cantidad: 1,
        disponibilidad: servicio.disponibilidad,
        descripcion: servicio.descripcion,
        categoria: categoriaDelServicio
    };

    serviciosEnCarrito.push(nuevoServicio);
    localStorage.setItem('serviciosCarrito', JSON.stringify(serviciosEnCarrito));
    actualizarContadorCarrito();

    const precioFormateado = new Intl.NumberFormat('es-CR', { //cambiar el formato del precio
        style: 'decimal',
        useGrouping: true,
    }).format(servicio.precio);

    Swal.fire({
        icon: 'success',
        title: 'Servicio añadido a tu carrito!',
        html: `
            <p style="font-size: 18px; margin-top: 10px; color: #333;">
                ${servicio.nombre} <span style="font-weight: bold; color: #264A80;">₡${precioFormateado}</span>
            </p>
        `,
        confirmButtonText: 'Continuar comprando',
        showCancelButton: true,
        cancelButtonText: 'Ir al carrito',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'swal2-continue-btn',
            cancelButton: 'swal2-cart-btn',
            popup: 'swal2-custom-popup'
        }
    }).then((result) => {
        if (result.isDismissed) {
            window.location.href = "carrito.html";
        }
    });
}

function actualizarContadorCarrito() {
    const serviciosEnCarrito = JSON.parse(localStorage.getItem('serviciosCarrito')) || [];
    const cantidadTotal = serviciosEnCarrito.length;
    
    // Seleccionar badges específicamente
    const badgeResponsive = document.querySelector('.d-lg-none .badge');
    const badgeDesktop = document.querySelector('.d-lg-flex .badge');

    // Actualizar badge en pantallas pequeñas
    if (badgeResponsive) {
        if (cantidadTotal > 0) {
            badgeResponsive.textContent = cantidadTotal;
            badgeResponsive.classList.remove('d-none');
        } else {
            badgeResponsive.classList.add('d-none');
        }
    }

    // Actualizar badge en pantallas grandes
    if (badgeDesktop) {
        if (cantidadTotal > 0) {
            badgeDesktop.textContent = cantidadTotal;
            badgeDesktop.classList.remove('d-none');
        } else {
            badgeDesktop.classList.add('d-none');
        }
    }
}

// Inicializar el contador cuando se carga la página
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// Agregar estilos personalizados para los botones del SweetAlert2
const style = document.createElement('style');
style.textContent = `
    .swal2-continue-btn {
        padding: 0.5rem 1rem;
        background-color: #264A80;
        color: white;
        border: none;
        border-radius: 0.25rem;
        margin: 0.5rem;
        cursor: pointer;
    }

    .swal2-cart-btn {
        padding: 0.5rem 1rem;
        background-color: #7798C2;
        color: white;
        border: none;
        border-radius: 0.25rem;
        margin: 0.5rem;
        cursor: pointer;
    }

    .swal2-custom-popup {
        border-radius: 1rem;
        padding: 2rem;
    }

    .swal2-continue-btn:hover, .swal2-cart-btn:hover {
        opacity: 0.9;
    }
`;
document.head.appendChild(style);