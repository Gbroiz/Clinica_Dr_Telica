
// Validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name);
}

function validateCedula(cedula) {
    const cedulaRegex = /^\d+$/;
    return cedulaRegex.test(cedula);
}

function validatePhone(phone) {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Real-time input validations
document.getElementById('nombre').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});

document.getElementById('cedula').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('telefono').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

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
    let cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '').slice(0, 16);
    document.querySelector('.card-number-input').value = cardNumber;
    document.querySelector('.card-number-box').innerText = cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Validación del número de tarjeta
document.querySelector('.card-number-input').addEventListener('input', function() {
    const cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '');

    if (cardNumber.length < 13 || cardNumber.length > 16) {
        return;
    }

    fetch(`https://data.handyapi.com/bin/${cardNumber.substring(0, 6)}`)
    .then(response => response.json())
    .then(data => {
        if (data.Status === "SUCCESS") {
            if (data.Scheme === "VISA") {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/visa.png';
            } else if (data.Scheme === "MASTERCARD") {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/master.png';
            } else {
                document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png';
            }
        } else {
            document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png';
        }
    })
    .catch(error => {
        console.error('Error de API:', error);
        document.querySelector('.tipo_tarjeta').src = 'img/Tarjeta/nothing.png';
    });
});

// Validación del titular de la tarjeta
document.querySelector('.card-holder-input').oninput = () => {
    document.querySelector('.card-holder-input').value = document.querySelector('.card-holder-input').value.replace(/[^a-zA-Z ]/g, '');
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
};

// Validación de la fecha de expiración (solo números)
document.querySelector('.month-input').oninput = () => {
    document.querySelector('.month-input').value = document.querySelector('.month-input').value.replace(/\D/g, '');
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
};

document.querySelector('.year-input').oninput = () => {
    document.querySelector('.year-input').value = document.querySelector('.year-input').value.replace(/\D/g, '');
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
};

// Verificación de CVV (solo números)
document.querySelector('.cvv-input').oninput = () => {
    document.querySelector('.cvv-input').value = document.querySelector('.cvv-input').value.replace(/\D/g, '');
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

// Función para formatear el precio con separadores de miles y símbolo de colones
function formatPrice(price) {
    return price.toLocaleString('es-CR');
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener los valores del formulario
    const customerName = document.getElementById('nombre').value.trim() || "Contado";
    const customerID = document.getElementById('cedula').value.trim();
    const customerEmail = document.getElementById('correo').value.trim();
    const customerPhone = document.getElementById('telefono').value.trim();

    // Generar el número de factura con fecha y hora
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const invoiceDate = `${day}/${month}/${year}`;
    const invoiceNumber = `${year}${month}${day}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

    // Encabezado con logo más grande y menos espacio
    const logo = "img/Logo Clínica Dr.Larry Télica.png"; // Ruta del logo
    doc.addImage(logo, "PNG", 80, 10, 50, 50); // Logo más grande y centrado

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // Título moderno (si se requiere añadir título)
    doc.setFontSize(12); // Texto de factura y fecha un poco más grande
    doc.setTextColor(50, 50, 50);

    // Ajustar posición de Factura y Fecha más cerca del logo
    doc.text(`Factura: ${invoiceNumber}`, 105, 65, null, null, "center"); // Subido a 65
    doc.text(`Fecha: ${invoiceDate}`, 105, 70, null, null, "center"); // Subido a 70

    // Título de sección "Datos del Paciente"
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80); // Un tono gris más oscuro

    // Datos del cliente
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Nombre completo: ${customerName}`, 10, 90);
    doc.text(`Cédula: ${customerID}`, 10, 95);
    doc.text(`Correo: ${customerEmail}`, 10, 100);
    doc.text(`Teléfono: ${customerPhone}`, 10, 105);

    // Tabla de servicios
    const startX = 10;
    let startY = 115;
    doc.setFillColor(80, 150, 200); // Azul claro para la cabecera
    doc.setTextColor(255, 255, 255); // Blanco para texto de cabecera
    doc.rect(startX, startY, 190, 10, "F");
    doc.text("Servicio", startX + 5, startY + 7);
    doc.text("Precio", startX + 165, startY + 7);

    // Contenido de la tabla
    startY += 10;
    let total = 0;
    const cart = JSON.parse(localStorage.getItem("serviciosCarrito")) || [];
    doc.setTextColor(50, 50, 50); // Gris oscuro para el contenido

    cart.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        doc.text(`${index + 1}. ${item.nombre}`, startX + 5, startY + 7);
        doc.text(`${itemTotal.toFixed(2)}`, startX + 175, startY + 7, null, null, "right");
        startY += 10;
    });

    // Total
    doc.setFillColor(211, 211, 211); // Gris claro
    doc.rect(startX, startY, 190, 10, "F");
    doc.setTextColor(50, 50, 50);
    doc.text("Total:", startX + 135, startY + 7, null, null, "right");
    doc.text(`${total.toFixed(2)}`, startX + 175, startY + 7, null, null, "right");

    // Guardar PDF
    doc.save("factura_clinica_DrTelica.pdf");
}


// Verificar que la tarjeta no esté vencida
document.querySelector('.submit-btn').addEventListener('click', function(event) {
    event.preventDefault();

    // Validación de información personal
    const name = document.getElementById('nombre').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const email = document.getElementById('correo').value.trim();
    const phone = document.getElementById('telefono').value.trim();

    // Validaciones de campos personales
    if (!name) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese su nombre.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!validateName(name)) {
        Swal.fire({
            title: 'Error',
            text: 'El nombre solo debe contener letras.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!cedula) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese su cédula.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!validateCedula(cedula)) {
        Swal.fire({
            title: 'Error',
            text: 'La cédula solo debe contener números.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!email) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese su correo electrónico.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!validateEmail(email)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico válido.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!phone) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese su número de teléfono.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!validatePhone(phone)) {
        Swal.fire({
            title: 'Error',
            text: 'El teléfono solo debe contener números.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    // Validación de detalles de tarjeta
    const cardNumber = document.querySelector('.card-number-input').value.replace(/\D/g, '');
    const expMonth = document.querySelector('.month-input').value;
    const expYear = document.querySelector('.year-input').value;
    const cvv = document.querySelector('.cvv-input').value;

    // Validaciones de tarjeta
    if (!cardNumber.match(/^\d{13,16}$/)) {
        Swal.fire({
            title: 'Error',
            text: 'Número de tarjeta inválido. Asegúrate de que tenga entre 13 y 16 dígitos.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
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
                confirmButton: 'swal2-confirm-btn'
            }
        });
        return;
    }

    if (!cvv.match(/^\d{3,4}$/)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un CVV válido.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-confirm-btn'
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
        confirmButtonText: 'Descargar factura',
        customClass: {
            confirmButton: 'swal2-confirm-btn' // Aplica la clase personalizada
        }
    }).then(() => {
        generatePDF();
        localStorage.clear();
        window.location.href = 'index.html'; // Redirige después de un pago exitoso
    });
    
});
