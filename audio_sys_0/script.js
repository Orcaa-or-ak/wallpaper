

//Lively magic
var cpuCounter = 0;
var gpuCounter = 0;
var netDownCounter = 0;
var netUpCounter = 0;
var memTotal = 1;
var memFree = 0;
var cpuName = "";
var gpuName = "";
var memoryName = "";
var netCardName = "";
var isChartInit = false;

var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(0, 192, 0)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    lightGrey: 'rgb(105, 105, 105)',
    black: 'rgb(0, 0, 0)', 
    white: 'rgb(255, 255, 255)'
};
var color = Chart.helpers.color;

//global chart defaults
Chart.defaults.global.legend.display = false;
Chart.defaults.global.responsive = true;
Chart.defaults.global.elements.pointRadius = 0;
Chart.defaults.global.tooltips.enabled = false;

var cpuChartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: color(chartColors.white).alpha(0).rgbString(),
            borderColor: chartColors.white,
            fill: false,
            lineTension: 0,
            borderDash: [0, 0],
            pointRadius: 0,
            data: []
        }],
    },
    options: {   
        maintainAspectRatio: false,   
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Processor',     
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 1000,
                    onRefresh: onRefresh
                },
                gridLines: { color: "#797a79" },
                ticks: {
                    display: true, 
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: '%'
                },
                gridLines: { color: "#797a79" },
                ticks: {
                    beginAtZero: true,
                    max : 100
                }
            }]
        },
    }
};

var gpuChartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Dataset 1 (linear interpolation)',
            backgroundColor: color(chartColors.white).alpha(0).rgbString(),
            borderColor: chartColors.white,
            fill: false,
            lineTension: 0,
            borderDash: [0, 0],
            pointRadius: 0,
            data: []
        }]
    },
    options: {   
        maintainAspectRatio: false,          
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Graphics',
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 1000,
                    onRefresh: onRefresh
                },
                gridLines: { color: "#797a79" },
                ticks: {
                    display: true, 
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: '%'
                },
                gridLines: { color: "#797a79" },
                 ticks: {
                    beginAtZero: true,
                    max : 100
            }
            }]
        },
    }
};

var ramChartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Dataset 1 (linear interpolation)',
            backgroundColor: color(chartColors.white).alpha(0).rgbString(),
            borderColor: chartColors.white,
            fill: false,
            lineTension: 0,
            borderDash: [0, 0],
            pointRadius: 0,
            data: []
        }]
    },
    options: {
        maintainAspectRatio: false,           
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: memoryName,
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 1000,
                    onRefresh: onRefresh
                },
                gridLines: { color: "#797a79" },
                ticks: {
                    display: true, 
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: '%'
                },
                gridLines: { color: "#797a79" },
                 ticks: {
                    beginAtZero: true,
                    max : 100,
            }
            }]
        },
    }
};

function onRefresh(chart) 
{
    var data = [];
    switch(chart)
    {
        case cpuChart:
            data[0] = cpuCounter;
            break;
        case gpuChart:
            data[0] = gpuCounter;
            break;
        case ramChart:
            data[0] = (memTotal - memFree)*100/memTotal;
            break;  
    }

    var i = 0;
    chart.config.data.datasets.forEach(
        function(dataset) {
        dataset.data.push({
            x: Date.now(),
            y: data[i],
        });
        i++;
    });
}

var cpuChart, gpuChart, ramChart;
function initChart() 
{
    cpuChartConfig.options.title.text = cpuName;
    gpuChartConfig.options.title.text = gpuName;
    ramChartConfig.options.title.text = memoryName;

    var ctxCpu = document.getElementById('cpuChart').getContext('2d');
    cpuChart = new Chart(ctxCpu, cpuChartConfig);

    var ctxGpu = document.getElementById('gpuChart').getContext('2d');
    gpuChart = new Chart(ctxGpu, gpuChartConfig);

    var ctxRam = document.getElementById('ramChart').getContext('2d');
    ramChart = new Chart(ctxRam, ramChartConfig);
};

function livelySystemInformation(data)
{
    var obj = JSON.parse(data);

    //hw name
    cpuName = obj.NameCpu;
    gpuName = obj.NameGpu;
    memoryName = "Memory (" + obj.TotalRam/1024 + " GB)";

    //chart data.
    cpuCounter = obj.CurrentCpu;
    gpuCounter = obj.CurrentGpu3D;
    memFree = obj.CurrentRamAvail;
    memTotal = obj.TotalRam;

    if(!isChartInit)
    {
        isChartInit = true;
        initChart();
    }
}

//test
//initChart();