async function cargarServicios() {
    try {
        const response = await fetch("json/servicios.json");
        const data = await response.json();
        const contenedor = document.querySelector(".contenedor");

        // Verificar si el contenedor existe
        if (!contenedor) {
            console.error("Contenedor no encontrado en el DOM");
            return;
        }

        let serviciosData = data.servicios;
        
        // Mostrar las categorías en el menú o de alguna manera
        mostrarCategorias(serviciosData);

        // Filtrar por la primera categoría, "Medicina General", para cargar los servicios
        filtrarServiciosPorCategoria("Medicina General", serviciosData, contenedor);

        // Asignar eventos a las categorías para filtrar servicios
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

// Mostrar las categorías en el contenedor adecuado
function mostrarCategorias(serviciosData) {
    const categorias = serviciosData.map(categoria => categoria.categoria);
    // Aquí se pueden agregar dinámicamente las categorías al HTML, dependiendo de cómo quieras mostrarlas
    // Ejemplo de cómo podrías agregarlas a un menú o barra de categorías
    categorias.forEach(categoria => {
        const categoriaElement = document.createElement('a');
        categoriaElement.href = '#';
        categoriaElement.innerHTML = `<h5>${categoria}</h5>`;
        // Añadir el elemento al contenedor de categorías (puedes tener un div específico en HTML)
        document.querySelector('.card-categorias').appendChild(categoriaElement);
    });
}

// Filtrar y mostrar los servicios según la categoría seleccionada
function filtrarServiciosPorCategoria(categoriaSeleccionada, serviciosData, contenedor) {
    // Limpiar el contenedor de servicios
    contenedor.innerHTML = '';

    // Buscar la categoría seleccionada y los servicios asociados
    const categoriaEncontrada = serviciosData.find(categoria =>
        categoria.categoria === categoriaSeleccionada
    );

    if (!categoriaEncontrada) {
        console.log("No se encontró la categoría:", categoriaSeleccionada);
        return;
    }

    // Mostrar los servicios de la categoría encontrada
    categoriaEncontrada.servicios.forEach(servicio => {
        const card = document.createElement("div");
        card.classList.add("card", "cardservicios", "col-12", "col-md-4", "col-lg-3"); // Añadido para hacer las cards responsivas
        card.style.width = "18rem";

        // Imagen de la tarjeta
        const img = document.createElement("img");
        img.src = servicio.imagenes[0];  // Usamos la primera imagen (en base64)
        img.classList.add("card-img-top");
        img.alt = servicio.nombre;
        card.appendChild(img);

        // Contenido de la tarjeta
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = servicio.nombre;  // Aseguramos que el título sea el nombre del servicio
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
        });

        buttonContainer.appendChild(verMasButton);
        cardBody.appendChild(buttonContainer);
        card.appendChild(cardBody);
        contenedor.appendChild(card);
    });
}

// Llamar a la función cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarServicios);