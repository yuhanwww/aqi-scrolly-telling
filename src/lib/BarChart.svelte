<script>
    import { onMount } from 'svelte';
    import { drawBar } from '$lib/bar.js';
    import { loadData, pollutants, color, margin, width, height } from '$lib/data.js';
    import * as d3 from 'd3';

    let svgNode; // reference for <svg> DOM

    onMount(async () => {
        const { aqi } = await loadData();

        const tooltip = d3.select('#tooltip');

        drawBar(svgNode, { data:aqi, pollutants, color, tooltip, margin, width, height });
    });
</script>

<svg bind:this={svgNode}></svg> <!-- renders d3 svg DOM node -->