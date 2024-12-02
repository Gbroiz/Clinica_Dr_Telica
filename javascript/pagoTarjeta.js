function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Obtener los valores del formulario
    const customerName = document.getElementById('nombre').value.trim() || "Contado"; // Nombre del cliente (por defecto "Contado")
    const customerID = document.getElementById('cedula').value.trim(); // Cédula
    const customerEmail = document.getElementById('correo').value.trim(); // Correo electrónico
    const customerPhone = document.getElementById('telefono').value.trim(); // Teléfono

    // Generar la fecha y hora actual en el formato especificado
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que el mes tenga dos dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que el día tenga dos dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que la hora tenga dos dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que los segundos tengan dos dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que los milisegundos tengan tres dígitos

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Color azul
    doc.setFont("helvetica", "bold"); // Establecer fuente en negrita
    doc.text("Factura de Compra", 105, 20, null, null, 'center'); // Centrado horizontalmente
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFont("helvetica", "normal"); // Establecer fuente normal
    doc.setFontSize(12);

    // Agregar el número de factura
    doc.text(`Factura Número: ${invoiceNumber}`, 105, 30, null, null, 'center'); // Centrado horizontalmente

    // Nombre del cliente (si está vacío, mostrar "Contado")
    doc.text(`Nombre del Cliente: ${customerName}`, 14, 40); // Posición vertical después del número de factura
    doc.text(`Cédula: ${customerID}`, 14, 45); // Cédula
    doc.text(`Correo electrónico: ${customerEmail}`, 14, 50); // Correo
    doc.text(`Teléfono: ${customerPhone}`, 14, 55); // Teléfono

    let y = 60; // posición vertical inicial después de los datos del cliente
    let total = 0;

    // Definir el ancho de la tabla y la altura de las filas
    const tableWidth = 180;
    const rowHeight = 10;

    // Cabecera de la tabla
    doc.setFillColor(0, 123, 255); // Color azul
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo de la cabecera
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text("Producto", 15, y + 7);
    doc.text("Precio", 80, y + 7);
    doc.text("Cantidad", 120, y + 7);
    doc.text("Subtotal", 150, y + 7);
    doc.setTextColor(0, 0, 0); // Restablecer el color del texto a negro
    y += rowHeight;

    // Detalles de los productos (suponiendo que tienes un array 'cart' con los productos)
    const cart = [
        { name: 'Producto 1', price: 10.00, quantity: 2 },
        { name: 'Producto 2', price: 15.00, quantity: 1 }
    ]; // Puedes reemplazar este array con tus datos reales del carrito

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        doc.rect(14, y, tableWidth, rowHeight); // Bordes de la fila
        doc.text(item.name, 15, y + 7);
        doc.text(`$${item.price.toFixed(2)}`, 80, y + 7);
        doc.text(item.quantity.toString(), 120, y + 7);
        doc.text(`$${subtotal.toFixed(2)}`, 150, y + 7);
        y += rowHeight; // Incremento para la siguiente línea
        total += subtotal;
    });

    // Total
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo del total
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Total:", 15, y + 7);
    doc.text(`$${total.toFixed(2)}`, 150, y + 7);
    
    // Agregar número de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Establecer la página actual
        doc.text(`Página ${i} de ${pageCount}`, 190, 285, null, null, 'right'); // Añadir número de página
    }

    // Guardar el PDF
    doc.save('factura_compra.pdf');
}
// Cargar los años desde el actual (por ejemplo, hasta 10 años en el futuro)
const currentYear = new Date().getFullYear();
const yearSelect = document.querySelector('.year-input');

// Llenar las opciones del select con los años desde el actual hasta 10 años en el futuro
for (let i = 0; i <= 10; i++) {
    const yearOption = document.createElement('option');
    yearOption.value = currentYear + i;
    yearOption.textContent = currentYear + i;
    yearSelect.appendChild(yearOption);
}

// Función para formatear el número de tarjeta con espacios cada 4 dígitos
document.querySelector('.card-number-input').oninput = () => {
    let cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '').slice(0, 16);  // Solo permite hasta 16 dígitos
    document.querySelector('.card-number-input').value = cardNumber;  // Asegura que el valor solo contenga números
    document.querySelector('.card-number-box').innerText = cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');  // Mostrar número en la tarjeta
};

// Validación del número de tarjeta
document.querySelector('.card-number-input').addEventListener('input', function() {
    const cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '');

    // Verifica si el número de tarjeta es válido
    if (cardNumber.length < 13 || cardNumber.length > 16) {
        return; // Si el número de tarjeta no tiene entre 13 y 16 dígitos, no se realiza nada más
    }

    // Llamada al API de HandyAPI para verificar la tarjeta (Visa, MasterCard, etc.)
    fetch(`https://data.handyapi.com/bin/${cardNumber.substring(0, 6)}`)
    .then(response => response.json())
    .then(data => {
        if (data.Status === "SUCCESS") {
            if (data.Scheme === "VISA") {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/visa.png'; // Imagen de Visa
            } else if (data.Scheme === "MASTERCARD") {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/master.png'; // Imagen de MasterCard
            } else {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png'; // Imagen por defecto si no es Visa ni MasterCard
            }
        } else {
            document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png'; // Imagen por defecto si no se encuentra la tarjeta
        }
    })
    .catch(error => {
        console.error('Error de API:', error);
        document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png'; // Imagen por defecto si la API falla
    });
});

// Validación del titular de la tarjeta
document.querySelector('.card-holder-input').oninput = () => {
    document.querySelector('.card-holder-input').value = document.querySelector('.card-holder-input').value.replace(/[^a-zA-Z ]/g, ''); // Permite solo letras y espacios
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
};

// Validación de la fecha de expiración (solo números)
document.querySelector('.month-input').oninput = () => {
    document.querySelector('.month-input').value = document.querySelector('.month-input').value.replace(/\D/g, ''); // Elimina cualquier cosa que no sea número
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
};

document.querySelector('.year-input').oninput = () => {
    document.querySelector('.year-input').value = document.querySelector('.year-input').value.replace(/\D/g, ''); // Elimina cualquier cosa que no sea número
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
};

// Verificación de CVV (solo números)
document.querySelector('.cvv-input').oninput = () => {
    document.querySelector('.cvv-input').value = document.querySelector('.cvv-input').value.replace(/\D/g, ''); // Elimina cualquier cosa que no sea número
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
};

// Rotación de la tarjeta al pasar el mouse sobre el CVV
document.querySelector('.cvv-input').onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
};

document.querySelector('.cvv-input').onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
};

// Verificar que la tarjeta no esté vencida
document.querySelector('.submit-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '');
    const expMonth = document.querySelector('.month-input').value;
    const expYear = document.querySelector('.year-input').value;
    const cvv = document.querySelector('.cvv-input').value;

    // Verificación básica de tarjeta
    if (!cardNumber.match(/^\d{13,16}$/)) { // Asegura que el número de tarjeta tenga entre 13 y 16 dígitos
        Swal.fire({
            title: 'Error',
            text: 'Número de tarjeta inválido. Asegúrate de que tenga entre 13 y 16 dígitos.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
            }
        });
        return;
    }

    if (!expMonth || !expYear) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa una fecha de expiración válida.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
            }
        });
        return;
    }

    if (!cvv.match(/^\d{3,4}$/)) { // Validación para 3 o 4 dígitos en CVV
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un CVV válido.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
            }
        });
        return;
    }

    // Verificación de que la tarjeta no esté vencida
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Los meses en JS empiezan desde 0
    const currentYear = today.getFullYear();

    if (expYear < currentYear || (expYear == currentYear && expMonth < currentMonth)) {
        Swal.fire({
            title: 'Error',
            text: 'La tarjeta está vencida. Por favor, utiliza otra tarjeta.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
            }
        });
        return;
    }

    // Si todo es válido, simula un pago exitoso y redirige
    Swal.fire({
        title: 'Pago exitoso',
        text: 'Tu pago ha sido procesado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
        }
    }).then(() => {
        generatePDF();
        // Redirigir a la página de confirmación
        window.location.href = 'pagina_de_confirmacion.html'; // Redirige después de un pago exitoso
    });
    
});
