<script>
    import { onMount } from 'svelte';
    import { drawLine } from '$lib/line.js';
    import { loadData, margin, width, height } from '$lib/data.js';
    import * as d3 from 'd3';

    let svgNode;

    onMount(async () => {
        const { aqi } = await loadData();
        drawLine(svgNode, { data: aqi, margin, width, height });
    });
</script>

<svg bind:this={svgNode}></svg>