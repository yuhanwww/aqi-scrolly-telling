<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { base } from '$app/paths';


    const cities = [
        { id: 'atl', name: 'Atlanta'     },
        { id: 'bos', name: 'Boston'      },
        { id: 'jfk', name: 'New York'    },
        { id: 'lax', name: 'Los Angeles' },
        { id: 'sea', name: 'Seattle'     },
    ];

    const aqiColor = d3.scaleThreshold()
        .domain([50, 100, 150, 200, 300])
        .range(['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023']);

    const size     = 250;
    const cx       = size / 2;
    const cy       = size / 2;
    const innerR   = 50;
    const outerMax = 140; 
    const r = outerMax + 10;

    const parseDate = d3.timeParse('%m/%d/%Y');

    let containerNode;

    onMount(async () => {
        const allData = await Promise.all(
            cities.map(c =>
                d3.csv(`${base}/${c.id}.csv`, d => ({
                    date: parseDate(d.date),
                    aqi:  +d.aqi,
                })).then(rows => ({
                    city: c,
                    values: rows
                        .filter(d => d.date && d.date.getFullYear() === 2023)
                        .sort((a, b) => a.date - b.date)
                }))
            )
        );

        const globalMax = d3.max(allData.flatMap(d => d.values), d => d.aqi);

        allData.forEach(({ city, values }) => {
            const svg = d3.select(containerNode)
                .append('svg')
                .attr('width',  size)
                .attr('height', size);

            const g = svg.append('g')
                .attr('transform', `translate(${cx},${cy})`);

            // angle scale — one slice per day
            const angleScale = d3.scaleBand()
                .domain(values.map((_, i) => i))
                .range([0, 2 * Math.PI])
                .padding(0.01);

            // radius scale
            const rScale = d3.scaleLinear()
                .domain([0, globalMax])
                .range([innerR, outerMax]);

            // arc generator
            const arc = d3.arc()
                .innerRadius(innerR)
                .outerRadius(d => rScale(d.aqi))
                .startAngle((_, i) => angleScale(i))
                .endAngle((_, i) => angleScale(i) + angleScale.bandwidth());

            // draw arcs
            g.selectAll('path')
                .data(values)
                .enter()
                .append('path')
                .attr('d', (d, i) => arc(d, i))
                .attr('fill', d => aqiColor(d.aqi))
                .attr('opacity', 0.85);

            // season labels
            const seasons = [
                { label: 'Jan', angle: 0 },
                { label: 'Apr', angle: Math.PI / 2 },
                { label: 'Jul', angle: Math.PI },
                { label: 'Oct', angle: 3 * Math.PI / 2 },
            ];

            seasons.forEach(({ label, angle }) => {
                const r = innerR - 8;  // inside the circle
                const x = Math.sin(angle) * r;
                const y = -Math.cos(angle) * r;
                g.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('font-size', '8px')
                    .style('fill', '#aaa')
                    .text(label);
            });

            // city names
            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', -8)
                .style('font-size', '11px')
                .style('font-weight', 'bold')
                .style('fill', '#333')
                .text(city.name);
        });
    });
</script>

<div class="city-charts" bind:this={containerNode}></div>

<style>
    .city-charts {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        max-width: 900px;
        margin: 0 auto;
    }
</style>