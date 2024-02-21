document.addEventListener('DOMContentLoaded', function() {
    const endpoint = 'http://localhost:3000/weather';
    function fetchDataAndRenderCharts() {
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(dataArray => {
                const labels = dataArray.map(data => new Date(data.date).toLocaleString());
                const temperatureData = dataArray.map(data => data.temperature);
                const humidityData = dataArray.map(data => data.humidity);
                const lightData = dataArray.map(data => data.light);
                const pressureData = dataArray.map(data => data.pressure);

                renderChart('temperatureChart', 'Температура', '°C', labels, temperatureData);
                renderChart('humidityChart', 'Влажность', '%', labels, humidityData);
                renderChart('lightChart', 'Освещенность', 'Люкс', labels, lightData);
                renderChart('pressureChart', 'Давление', 'мм рт. ст.', labels, pressureData);
            })
            .catch(error => {
                console.error('Ошибка при выполнении запроса к API:', error);
            });
    }
    fetchDataAndRenderCharts();
    setInterval(fetchDataAndRenderCharts, 5000);
});

function renderChart(canvasId, label, unit, labels, dataValues) {
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
                borderColor: getRandomColor(),
                tension: 0.1
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
                }
            }
        }
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
