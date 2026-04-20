import * as d3 from 'd3';

const parseDate = d3.timeParse("%m/%d/%Y");

export async function loadData() {
    const aqi = await d3.csv('/atl.csv', d => ({
        date:            parseDate(d.date),
        year:            new Date(parseDate(d.date)).getFullYear(),
        aqi:             +d.aqi,
        driverPollutant: d.driverPollutant,
        CO:              +d.CO   || null,
        SO2:             +d.SO2  || null,
        NO2:             +d.NO2  || null,
        O3:              +d.O3   || null,
        PM10:            +d.PM10 || null,
        PM25:            +d["PM2.5"] || null,
    }));

    return { aqi };
}

export const pollutants = ["CO", "NO2", "O3", "PM2.5", "PM10", "SO2"];

export const color = d3.scaleOrdinal()
    .domain(pollutants)
    .range(d3.schemeObservable10);

export const aqiColor = d3.scaleThreshold()
    .domain([50, 100, 150, 200, 300])
    .range(["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#8f3f97", "#7e0023"]);

export const aqiCategories = [
    { label: "Good",           color: "#00e400" },
    { label: "Moderate",       color: "#ffff00" },
    { label: "Unhealthy (SG)", color: "#ff7e00" },
    { label: "Unhealthy",      color: "#ff0000" },
    { label: "Very Unhealthy", color: "#8f3f97" },
    { label: "Hazardous",      color: "#7e0023" },
];

export const margin = { top: 60, right: 120, bottom: 70, left: 70 };
export const width  = 600 - margin.left - margin.right;
export const height = 400 - margin.top  - margin.bottom;