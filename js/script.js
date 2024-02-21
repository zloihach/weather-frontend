document.addEventListener('DOMContentLoaded', function() {
    const endpoint = 'http://localhost:3000/weather';
    fetchDataAndRenderCharts(endpoint);
    setInterval(() => {
        fetchDataAndRenderCharts(endpoint);
    }, 5000);
});

function fetchDataAndRenderCharts(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(dataArray => {
            const labels = dataArray.map(data => new Date(data.date).toLocaleString());
            const temperatureData = dataArray.map(data => data.temperature);
            const humidityData = dataArray.map(data => data.humidity);
            const lightData = dataArray.map(data => data.light);
            const pressureData = dataArray.map(data => data.pressure);

            renderChart('temperatureChart', 'Температура', '°C', labels, temperatureData, 'rgb(255, 99, 132)', [5, 5]);
            renderChart('humidityChart', 'Влажность', '%', labels, humidityData, 'rgb(54, 162, 235)');
            renderChart('lightChart', 'Освещенность', 'Люкс', labels, lightData, 'rgb(255, 206, 86)', [10, 5]);
            renderChart('pressureChart', 'Давление', 'мм рт. ст.', labels, pressureData, 'rgb(75, 192, 192)');
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса к API:', error);
        });
}

function renderChart(canvasId, label, unit, labels, dataValues, color, borderDash = []) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window.myCharts === undefined) {
        window.myCharts = {};
    }
    if (window.myCharts[canvasId] !== undefined) {
        window.myCharts[canvasId].destroy();
    }
    window.myCharts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                fill: false,
                borderColor: color,
                tension: 0.1,
                borderDash: borderDash,
                borderWidth: 2,
                pointBackgroundColor: color,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: unit
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Время'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            layout: {
                padding: {
                    top: 30,
                    right: 20,
                    bottom: 0,
                    left: 0
                }
            }
        }
    });
}
