// Función para cargar datos desde el archivo JSON
async function loadJSON() {
    const response = await fetch('json/satisfaccion.json');
    const data = await response.json();
    return data;
}

// Función para crear el gráfico usando Chart.js
async function createSatisfaccionChart() {
    const jsonData = await loadJSON();
    
    const ctx = document.getElementById('satisfaccionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', //pie
        data: {
            labels: jsonData.labels,
            datasets: [{
                label: 'Nivel de Satisfacción (%)',
                data: jsonData.data,
                backgroundColor: [
                    'rgba(12, 23, 40, 0.6)',
                    'rgba(38, 74, 128, 0.6)',
                    'rgba(119, 152, 194, 0.6)'
                ],
                borderColor: [
                    'rgba(12, 23, 40, 0.6)',
                    'rgba(38, 74, 128, 0.6)',
                    'rgba(119, 152, 194, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Hacerlo responsivo
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100 // Establece el máximo en 100 para la escala de satisfacción.
                }
            },
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 0 // Esto oculta el cuadro de color
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Llamar a la función para crear el gráfico
createSatisfaccionChart();