async function cargarServicios() {
    try {
        const response = await fetch("json/servicios.json");
        const data = await response.json();
        const contenedor = document.querySelector(".contenedor");

        if (!contenedor) {
            console.error("Contenedor no encontrado en el DOM");
            return;
        }

        let serviciosData = data.servicios;
        mostrarServicios(serviciosData, contenedor);

        const categoriaCards = document.querySelectorAll('.card-categorias a');
        categoriaCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const categoriaSeleccionada = e.target.closest('a').querySelector('h5').textContent;
                filtrarServiciosPorCategoria(categoriaSeleccionada, serviciosData, contenedor);
            });
        });

    } catch (error) {
        console.error("Error al cargar los servicios:", error);
    }
}

function mostrarServicios(serviciosData, contenedor) {
    contenedor.innerHTML = '';

    serviciosData.forEach(categoria => {
        categoria.servicios.forEach(servicio => {
            const card = document.createElement("div");
            card.classList.add("card", "cardservicios", "col-12", "col-md-4", "col-lg-3");
            card.style.width = "18rem";

            const img = document.createElement("img");
            img.src = servicio.imagenes[0];
            img.classList.add("card-img-top");
            img.alt = servicio.nombre;
            card.appendChild(img);

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

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex", "justify-content-end", "gap-2", "card-buttons");

            const comprarButton = document.createElement("button");
            comprarButton.classList.add("btn", "btn-comprar");
            comprarButton.textContent = "Comprar";
            comprarButton.addEventListener("click", () => {
                guardarServicioEnCarrito(servicio);
            });
            buttonContainer.appendChild(comprarButton);

            const verMasButton = document.createElement("button");
            verMasButton.classList.add("btn", "btn-ver-mas");
            verMasButton.textContent = "Ver más";
            verMasButton.setAttribute("data-bs-toggle", "modal");
            verMasButton.setAttribute("data-bs-target", "#detalleModal");

            verMasButton.addEventListener("click", () => {
                document.querySelector("#detalleModalLabel").textContent = servicio.nombre;
                document.querySelector(".modal-precio").textContent = `Precio: ${servicio.precio}`;
                document.querySelector(".modal-disponibilidad").innerHTML = `<strong>Disponibilidad:</strong> ${servicio.disponibilidad}`;
                document.querySelector(".modal-descripcion").innerHTML = `<strong>Descripción:</strong> ${servicio.descripcion}`;
                document.querySelector(".modal-tiempos").innerHTML = `<strong>Tiempos de atención:</strong> ${servicio.tiempoAtencion}`;

                const opcionesHtml = `
                    <strong>Opciones de atención:</strong>
                    <ul style="list-style-type: disc; padding-left: 2rem; margin-top: 0.5rem;">
                        ${servicio.opcionesAtencion.map(opcion => `<li>${opcion}</li>`).join('')}
                    </ul>
                `;
                document.querySelector(".modal-opciones").innerHTML = opcionesHtml;
                document.querySelector(".modal-garantia").innerHTML = `<strong>Garantía del servicio:</strong> ${servicio.garantia}`;

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

                // Agregar evento al botón comprar del modal
                const modalComprarButton = document.querySelector('#detalleModal .btn-comprar');
                if (modalComprarButton) {
                    modalComprarButton.onclick = () => guardarServicioEnCarrito(servicio);
                }
            });

            buttonContainer.appendChild(verMasButton);
            cardBody.appendChild(buttonContainer);
            card.appendChild(cardBody);
            contenedor.appendChild(card);
        });
    });
}

function filtrarServiciosPorCategoria(categoriaSeleccionada, serviciosData, contenedor) {
    const serviciosFiltrados = serviciosData.reduce((result, categoria) => {
        if (categoria.categoria === categoriaSeleccionada) {
            result.push(...categoria.servicios);
        }
        return result;
    }, []);

    mostrarServicios([{categoria: categoriaSeleccionada, servicios: serviciosFiltrados}], contenedor);
}

document.addEventListener("DOMContentLoaded", cargarServicios);