<script>
    import AQIExplainer  from '$lib/AQIExplainer.svelte';
    import Hero          from '$lib/Hero.svelte';
    import BarChart      from '$lib/BarChart.svelte';
    import LineChart     from '$lib/LineChart.svelte';
    import CityChart     from '$lib/CityChart.svelte';
</script>

<div id="tooltip"></div>

<Hero />

<AQIExplainer />

<div class="sticky-writing" style="z-index: 2">
    <div class="writing">
        <p>Recap: There are 6 major pollutants: CO, O3, NO2, PM2.5, PM10, SO2.<br>
        The Daily AQI is the <strong>MAXIMUM</strong> across all 6 — the driver pollutant.</p>
        <p>Let's investigate — what pollutants are polluting Atlanta's air?</p>
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 3">
    <div class="chart-wrap">
        <BarChart />
    </div>
</div>

<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 4">
    <div class="writing">
        <p>O3 and PM2.5 are major driver pollutants in Atlanta.<br>
        (scroll up to re-check!)</p>
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 5">
    <div class="writing">
        <p>What about seasonal trend?<br>
        Have you ever felt the air fresher during winter or summer? <br>
        Maybe worse during pollen season?</p>
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 6">
    <div class="chart-wrap">
        <LineChart />
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 7">
    <div class="writing">
        <p>Summer has worse AQI than winter!</p>
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 8">
    <div class="writing">
        <p>And Final Thing:<br>
            Which city has a better AQI?<br>
            And where should I go?
        </p>
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 9">
    <div class="chart-wrap">
        <CityChart />
    </div>
</div>
<div class="spacer"></div>

<div class="sticky-writing" style="z-index: 10">
    <div class="writing">
        <p>You see some cities have crazy spikes while some are more chill.<br>
            But does that necessarily mean that city is better?<br>
            What if that city's major driver pollutant is the one you are specifically sensitive to?<br>
            Is it a consistent pattern or temporal trend?<br>
            Interact with our kiosk or read our data comics for more use cases. :))
        </p>
    </div>
</div>

<style>
    .sticky-writing {
        position: sticky;
        top: 15vh;
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        z-index: 1;
    }

    .chart-wrap {
        display: flex;
        justify-content: center;
        width: 100%;
        max-height: 60vh;
        overflow-y: auto;
    }

    .writing {
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.8;
        font-size: 1.1rem;
    }

    .spacer {
        height: 60vh;
    }

    #tooltip {
        position: fixed;
        pointer-events: none;
        background: rgba(0,0,0,0.75);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.85rem;
        opacity: 0;
    }
</style>