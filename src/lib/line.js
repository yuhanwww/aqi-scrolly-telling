import * as d3 from 'd3';

export function drawLine(node, { data, margin }) {
    const COLS = 2;
    const CELL_WIDTH = 400;
    const CELL_HEIGHT = 80;
    const CELL_PAD = { top: 30, right: 20, bottom: 40, left: 50 };

    const allYears = [...new Set(data.map(d => d.year))].sort();
    const ROWS = Math.ceil(allYears.length / COLS);

    const totalW = COLS * (CELL_WIDTH + CELL_PAD.left + CELL_PAD.right) + margin.left + margin.right;
    const totalH = ROWS * (CELL_HEIGHT + CELL_PAD.top + CELL_PAD.bottom) + margin.top + margin.bottom;

    const globalMax = d3.max(data, d => d.aqi);

    const svg = d3.select(node)
        .attr("width", totalW)
        .attr("height", totalH);

    // Title
    svg.append("text")
        .attr("x", totalW / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Yearly AQI Trend (2014–2025)");

    allYears.forEach((year, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        const offsetX = margin.left + col * (CELL_WIDTH + CELL_PAD.left + CELL_PAD.right) + CELL_PAD.left;
        const offsetY = margin.top + row * (CELL_HEIGHT + CELL_PAD.top + CELL_PAD.bottom) + CELL_PAD.top;

        const g = svg.append("g").attr("transform", `translate(${offsetX},${offsetY})`);

        const x = d3.scaleTime()
            .domain([new Date(2014, 0, 1), new Date(2014, 11, 31)])
            .range([0, CELL_WIDTH]);

        const y = d3.scaleLinear()
            .domain([0, globalMax])
            .range([CELL_HEIGHT, 0]);

        const line = d3.line()
            .defined(d => d.aqi != null)
            .x(d => x(new Date(2014, d.date.getMonth(), d.date.getDate())))
            .y(d => y(d.aqi));

        // Year label
        g.append("text")
            .attr("x", 160)
            .attr("y", 5)
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("fill", "#1f5a68")
            .text(year);

        const tickLabels = { 1: "Winter", 4: "Spring", 7: "Summer", 10: "Fall" };
        const tickDates = [1, 4, 7, 10].map(m => new Date(2014, m, 1));
        const xAxis = g.append("g")
            .attr("transform", `translate(0,${CELL_HEIGHT})`)
            .call(
                d3.axisBottom(x)
                    .tickValues(tickDates)
                    .tickFormat(d => tickLabels[d.getMonth()])
                    .tickSize(3)
            );
        xAxis.select(".domain").remove();

        const yAxis = g.append("g")
            .call(
                d3.axisLeft(y)
                    .ticks(2)
                    .tickSize(3)
            );
        yAxis.select(".domain").remove();
        yAxis.selectAll("text").style("font-size", "9px");

        // Horizontal gridlines
        g.append("g")
            .attr("class", "grid")
            .call(
                d3.axisLeft(y)
                    .ticks(2)
                    .tickSize(-CELL_WIDTH)
                    .tickFormat("")
            )
            .call(gg => gg.select(".domain").remove())
            .call(gg => gg.selectAll("line")
                .style("stroke", "#e0e0e0")
                .style("stroke-dasharray", "3,3"));

        // Line
        const values = data
            .filter(d => d.year === year)
            .sort((a, b) => a.date - b.date);

        g.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", "#35bad8")
            .attr("stroke-width", 1.2)
            .attr("opacity", 0.85)
            .attr("d", line);
    });
}