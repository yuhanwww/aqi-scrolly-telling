const margin = { top: 60, right: 120, bottom: 70, left: 70 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const tooltip = d3.select("#tooltip");
const pollutants = ["CO", "NO2", "O3", "PM2.5", "PM10", "SO2"]; // hard code pollutants bc not all gonna be driver pollutants
const color = d3.scaleOrdinal()
    .domain(pollutants)
    .range(d3.schemeObservable10);

const aqiColor = d3.scaleThreshold()// AQI color scale
    .domain([50, 100, 150, 200, 300])
    .range(["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#8f3f97", "#7e0023"]);

const aqiCategories = [
    { label: "Good",                             color: "#00e400" },
    { label: "Moderate",                         color: "#ffff00" },
    { label: "Unhealthy (SG)",                   color: "#ff7e00" },
    { label: "Unhealthy",                        color: "#ff0000" },
    { label: "Very Unhealthy",                   color: "#8f3f97" },
    { label: "Hazardous",                        color: "#7e0023" },
    ];

function loadData() {
    const aqi = d3.csv("atl_2014-2023.csv", d => ({
        date:            d3.timeParse("%m/%d/%Y")(d.date),
        year:            new Date(d3.timeParse("%m/%d/%Y")(d.date)).getFullYear(),
        aqi:             +d.aqi,
        driverPollutant: d.driverPollutant,
        CO:              +d.CO || null,
        SO2:             +d.SO2 || null,
        NO2:             +d.NO2 || null,
        O3:              +d.O3 || null,
        PM10:            +d.PM10 || null,
        PM25:            +d["PM2.5"] || null, 
    }));

    const weather = d3.csv("atl_weather_20to22.csv", d => ({
        date:     d3.timeParse("%m/%d/%Y")(d.Date),
        year:     new Date(d3.timeParse("%m/%d/%Y")(d.Date)).getFullYear(),
        weather:  d.Weather,
        tempMean: (+d.TempMax + +d.TempMin) / 2,
    }));

    return Promise.all([aqi, weather]);
}

loadData().then(([aqiData, weatherData]) => {
    barChart(aqiData);
    scatterPlot(aqiData, weatherData);
    lineChart(aqiData);
    calendarChart(aqiData);
});