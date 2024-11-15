async function cargarServicios() {
    try {
        const response = await fetch("json/servicios.json");
        const data = await response.json();
        const contenedor = document.querySelector(".contenedor");

        data.servicios.forEach(categoria => {
            categoria.servicios.forEach(servicio => {
                const card = document.createElement("div");
                card.classList.add("card", "cardservicios");
                card.style.width = "18rem";

                // Imagen de la tarjeta
                const img = document.createElement("img");
                img.src = servicio.imagenes[0];
                img.classList.add("card-img-top");
                img.alt = servicio.nombre;
                card.appendChild(img);

                // Contenido de la tarjeta
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = servicio.nombre;
                cardBody.appendChild(title);

                const description = document.createElement("p");
                description.classList.add("card-text");
                description.textContent = servicio.descripcion;
                cardBody.appendChild(description);

                // Botones
                const buttonContainer = document.createElement("div");
                buttonContainer.classList.add("d-flex", "justify-content-end", "gap-2");

                const comprarButton = document.createElement("button");
                comprarButton.classList.add("btn", "btn-comprar");
                comprarButton.textContent = "Comprar";

                // Evento para mostrar el pop-up con SweetAlert2
                comprarButton.addEventListener("click", () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Servicio añadido a tu carrito!',
                        html: `
                            <p style="font-size: 18px; margin-top: 10px; color: #333;">${servicio.nombre} <span style="font-weight: bold; color: #264A80;">${servicio.precio}</span></p>
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
                            // Redirigir al carrito
                            window.location.href = '/cart';
                        }
                    });
                });

                buttonContainer.appendChild(comprarButton);

                const verMasButton = document.createElement("button");
                verMasButton.classList.add("btn", "btn-ver-mas");
                verMasButton.textContent = "Ver más";
                verMasButton.setAttribute("data-bs-toggle", "modal");
                verMasButton.setAttribute("data-bs-target", "#detalleModal");

                // Evento para abrir el modal y llenar la información
                verMasButton.addEventListener("click", () => {
                    // Llenar los datos del modal con la información del servicio
                    document.querySelector("#detalleModalLabel").textContent = servicio.nombre;
                    document.querySelector(".modal-precio").textContent = `Precio: ${servicio.precio}`;
                    document.querySelector(".modal-disponibilidad").innerHTML = `<strong>Disponibilidad:</strong> ${servicio.disponibilidad}`;
                    document.querySelector(".modal-descripcion").innerHTML = `<strong>Descripción:</strong> ${servicio.descripcion}`;
                    document.querySelector(".modal-tiempos").innerHTML = `<strong>Tiempos de atención:</strong> ${servicio.tiempoAtencion}`;
                    
                    // Crear lista de opciones de atención con estilo tradicional
                    const opcionesHtml = `
                        <strong>Opciones de atención:</strong>
                        <ul style="list-style-type: disc; padding-left: 2rem; margin-top: 0.5rem;">
                            ${servicio.opcionesAtencion.map(opcion => `<li>${opcion}</li>`).join('')}
                        </ul>
                    `;
                    document.querySelector(".modal-opciones").innerHTML = opcionesHtml;
                    
                    document.querySelector(".modal-garantia").innerHTML = `<strong>Garantía del servicio:</strong> ${servicio.garantia}`;

                    // Actualizar carrusel de imágenes
                    const carouselInner = document.querySelector(".carousel-inner");
                    carouselInner.innerHTML = "";
                    servicio.imagenes.forEach((imgSrc, index) => {
                        const carouselItem = document.createElement("div");
                        carouselItem.classList.add("carousel-item");
                        if (index === 0) carouselItem.classList.add("active");

                        const img = document.createElement("img");
                        img.src = imgSrc;
                        img.classList.add("d-block", "w-100");
                        img.alt = `Imagen ${index + 1}`;
                        carouselItem.appendChild(img);
                        carouselInner.appendChild(carouselItem);
                    });

                    // Asignar el evento al botón de "Comprar" dentro del modal
                    const modalComprarButton = document.querySelector(".modal .btn-comprar");
                    modalComprarButton.addEventListener("click", () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Servicio añadido a tu carrito!',
                            html: `
                                <p style="font-size: 18px; margin-top: 10px; color: #333;">${servicio.nombre} <span style="font-weight: bold; color: #264A80;">${servicio.precio}</span></p>
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
                                // Redirigir al carrito
                                window.location.href = '/cart';
                            }
                        });
                    });
                });

                buttonContainer.appendChild(verMasButton);
                cardBody.appendChild(buttonContainer);
                card.appendChild(cardBody);
                contenedor.appendChild(card);
            });
        });
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
    }
}

// Llamar a la función cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarServicios);
