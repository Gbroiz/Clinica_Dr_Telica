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