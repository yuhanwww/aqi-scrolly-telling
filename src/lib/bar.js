import * as d3 from 'd3';

export function drawBar(node, { data, pollutants, color, tooltip, margin, width, height }) {
    const svg = d3.select(node)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom); 

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const years = [...new Set(data.map(d => d.year))].sort();

    const groupedByYearAndDriverPollutant = years.map(year => {
        const yearData = data.filter(d => d.year === year);
        const entry = { year };
        pollutants.forEach(p => {
            entry[p] = yearData.filter(d => d.driverPollutant === p).length;
        });
        return entry;
    });

    let currentOrder = [...pollutants];

    // Axes
    const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 365])
        .range([height, 0]);

    // Title
    svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Days Each Pollutant Dominated Atlanta's Air (2014–2023)");

    // Axes Name
    g.append("text")
        .attr("x", width + 20).attr("y", height + 5)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .text("Year");
    g.append("text")
        .attr("x", 0).attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .text("Count of Days");

    // Draw Bars based on current sorting    
    const barsGroup = g.append("g").attr("class", "bars-root");

    function drawBars(order) {
        const stack = d3.stack().keys(order);
        const series = stack(groupedByYearAndDriverPollutant);   
        
        // Bind data to layer
        const layers = barsGroup.selectAll("g.layer")
            .data(series, d => d.key);
        layers.exit().remove();

        const layersEnter = layers.enter()
            .append("g")
            .attr("class", "layer")
            .attr("fill", d => color(d.key));

        const layersMerge = layersEnter.merge(layers)
            .attr("fill", d => color(d.key));

        // Bind rect to layer
        layersMerge.each(function(layerData) {
            const rects = d3.select(this).selectAll("rect")
                .data(layerData, d => d.data.year);
            rects.exit().remove();

            // Draw rects
            rects.enter()
                .append("rect")
                .attr("x", d => x(d.data.year))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .on("mouseover", (event, d) => {
                    const pollutant = d3.select(event.target.parentNode).datum().key;
                    const count = d[1] - d[0];
                    const rect = event.target.getBoundingClientRect();
                    d3.select(event.target)
                        .transition().duration(100)
                        .attr("x", d => x(d.data.year) + x.bandwidth() * 0.05)
                        .attr("width", x.bandwidth() * 0.9);
                    tooltip
                        .style("opacity", 0.85)
                        .style("left", (rect.left + window.scrollX - rect.width / 3 * 2) + "px")
                        .style("top",  (rect.top  + window.scrollY + rect.height / 3) + "px")
                        .html(`Pollutant: ${pollutant}<br>Count: ${count} days`);
                })
                .on("mouseout", (event) => {
                    d3.select(event.target)
                        .transition().duration(100)
                        .attr("x", d => x(d.data.year))
                        .attr("width", x.bandwidth());
                    tooltip.style("opacity", 0);
                })
                .merge(rects)
                .transition().duration(500)
                .attr("x", d => x(d.data.year))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]));

            // Move existing rects
            rects.transition().duration(500)
                .attr("x", d => x(d.data.year))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]));
        });
    }

    // Legend 
    const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 5}, ${margin.top})`);

    legend.append("text")
        .attr("x", 20).attr("y", -8)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Driver Pollutant");

    // Prompt Interaction
    legend.append("text")
        .attr("x", 20).attr("y", pollutants.length * 20 + 14)
        .style("font-size", "10px")
        .style("fill", "#888")
        .append("tspan").attr("x", 20).attr("dy", 0).text("click on pollutant")
        .append("tspan").attr("x", 20).attr("dy", "1.2em").text("to bottom align it")
        .append("tspan").attr("x", 20).attr("dy", "1.2em").text("for comparison");

        function updateLegend(order) {
        legend.selectAll(".legend-item").remove();

        order.forEach((p, i) => {
            const item = legend.append("g")
                .attr("class", "legend-item")
                .attr("transform", `translate(0, ${i * 20})`)
                .style("cursor", "pointer");

            // Highlight bottomed item
            const isBottom = i === 0;

            item.append("rect")
                .attr("x", 20).attr("y", 0)
                .attr("width", 12).attr("height", 12)
                .attr("fill", color(p))
                .attr("stroke", isBottom ? "#0f0f0f" : "none")
                .attr("stroke-width", isBottom ? 1.5 : 0);

            item.append("text")
                .attr("x", 36).attr("y", 10)
                .style("font-size", "12px")
                .style("font-weight", isBottom ? "bold" : "normal")
                .text(p + (isBottom ? " ↓" : ""));

            item.on("click", () => {
                currentOrder = [p, ...order.filter(k => k !== p)];
                drawBars(currentOrder);
                updateLegend(currentOrder);
            });
        });
    }

    // Draw axes
    g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    g.append("g")
        .call(d3.axisLeft(y));

    drawBars(currentOrder);
    updateLegend(currentOrder);
}
