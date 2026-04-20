<script>
    const pollutants = [
        { id: 'PM2.5', full: 'Particulate Matter 2.5', color: '#e07b54', svg: '/visuals/pm2.5.svg' },
        { id: 'PM10',  full: 'Particulate Matter 10',  color: '#e0a854', svg: '/visuals/pm10.svg'  },
        { id: 'O3',    full: 'Ozone',                  color: '#a8c94f', svg: '/visuals/o3.svg'    },
        { id: 'NO2',   full: 'Nitrogen Dioxide',       color: '#4fa8c9', svg: '/visuals/no2.svg'   },
        { id: 'CO',    full: 'Carbon Monoxide',        color: '#7b7b7b', svg: '/visuals/co.svg'    },
        { id: 'SO2',   full: 'Sulfur Dioxide',         color: '#c94f8a', svg: '/visuals/so2.svg'   },
    ];

    const aqiCategories = [
        { label: 'Good',                  range: '0–50',    color: '#00e400' },
        { label: 'Moderate',              range: '51–100',  color: '#ffff00' },
        { label: 'Unhealthy (Sensitive)', range: '101–150', color: '#ff7e00' },
        { label: 'Unhealthy',             range: '151–200', color: '#ff0000' },
        { label: 'Very Unhealthy',        range: '201–300', color: '#8f3f97' },
        { label: 'Hazardous',             range: '301+',    color: '#7e0023' },
    ];

    const exampleValues = [
        { id: 'PM2.5', value: 88,  color: '#e07b54' },
        { id: 'PM10',  value: 42,  color: '#e0a854' },
        { id: 'O3',    value: 112, color: '#a8c94f' },
        { id: 'NO2',   value: 35,  color: '#4fa8c9' },
        { id: 'CO',    value: 20,  color: '#7b7b7b' },
        { id: 'SO2',   value: 15,  color: '#c94f8a' },
    ];
    const maxValue = Math.max(...exampleValues.map(d => d.value));
    const BAR_SCALE   = 150;
</script>

<div class="sticky-writing">
    <div class="writing">
        <h1>What's AQI?</h1>
    </div>
</div>
<div class="sticky-writing">
    <div class="writing">
        <p>AQI, the Air Quality Index, is used to represent the Air Quality of the day.</p>
    </div>
</div>
<div class="sticky-writing">
    <div class="writing">
        <b>6 invisible pollutants are polluting our air.</b>
    </div>
</div>

<div class="sticky-writing">
    <div class="pollutant-grid">
        {#each pollutants as p}
            <div class="pollutant-card">
                <img src={p.svg} alt={p.id} width="80" height="80" />
                <div class="pollutant-id" style="color:{p.color}">{p.id}</div>
                <div class="full-name">{p.full}</div>
            </div>
        {/each}
    </div>
</div>

<div class="sticky-writing">
    <div class="writing">
        <h2>Each pollutant gets an AQI score.</h2>
        <p>Concentrations are converted to a 0–500 scale.</p>
    </div>
</div>
<div class="sticky-writing">
    <img src="/visuals/aqi-scale.jpg" alt="AQI Scale" class="aqi-scale-img" />
</div>
<div class="sticky-writing">
    <div class="writing">
        <h2>The daily AQI = the WORST pollutant</h2>
        <p>Every day, the AQI is decided by the <strong>maximum</strong> of 6 pollutants:<br>
        the one that dominates is called the <em>driver pollutant</em>.</p>
    </div>
</div>

<!-- vis explanation part -->
<div class="sticky-writing">
    <div class="pollutant-grid">
        {#each exampleValues as d}
            <div class="pollutant-card">
                <div class="aqi-value" class:is-max={d.value === maxValue}>
                    value: {d.value}
                </div>
                <img src="/visuals/{d.id === 'PM2.5' ? 'pm2.5' : d.id === 'PM10' ? 'pm10' : d.id.toLowerCase()}.svg"
                    alt={d.id} width="80" height="80" />
                <div class="pollutant-id" style="color:{d.color}">{d.id}</div>
            </div>
        {/each}
    </div>
</div>
<div class="sticky-writing">
    <div class="pollutant-grid">
        {#each exampleValues as d}
            <div class="pollutant-card">
                <div class="aqi-value" class:is-max={d.value === maxValue}>
                    value: {d.value}
                </div>
                <div class="bar-vertical-track">
                    <div
                        class="bar-vertical-fill"
                        class:is-max={d.value === maxValue}
                        style="height: {d.value / BAR_SCALE * 100}%; background: {d.color}"
                    ></div>
                </div>
                <div class="pollutant-id" style="color:{d.color}">{d.id}</div>
            </div>
        {/each}
    </div>
</div>
<div class="sticky-writing">
    <div class="pollutant-grid">
        {#each exampleValues as d}
            <div class="pollutant-card">
                <div class="aqi-value" class:is-max={d.value === maxValue}>
                        value: {d.value}
                </div>
                <div class="bar-vertical-track" class:is-max-track={d.value === maxValue}>
                    <div
                        class="bar-vertical-fill"
                        class:is-max={d.value === maxValue}
                        style="height: {d.value / BAR_SCALE * 100}%; background: {d.color}"
                    ></div>
                </div>
                <div class="pollutant-id" style="color:{d.color}">{d.id}</div>
                {#if d.value === maxValue}
                    <div class="driver-label">Daily AQI↑<br/>Driver Pollutant</div>
                {:else}
                    <div class="driver-label-placeholder"></div>
                {/if}
            </div>
        {/each}
    </div>
</div>


<style>
    .writing {
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.8;
        font-size: 1.1rem;
    }

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

    .aqi-scale-img {
        max-width: 800px;
        width: 100%;
    }

    .pollutant-grid {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        justify-content: center;
        max-width: 800px;
    }

    .pollutant-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        width: 100px;
    }

    .pollutant-id {
        font-weight: bold;
        font-size: 0.9rem;
    }

    .full-name {
        font-size: 0.72rem;
        color: #555;
        text-align: center;
    }

    .aqi-value {
        font-size: 0.85rem;
        color: #555;
    }

    .aqi-value.is-max {
        font-weight: bold;
        color: #222;
    }

    .bar-vertical-track {
        width: 40px;
        height: 80px;
        border-radius: 4px;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
    }

    .bar-vertical-fill {
        width: 100%;
        border-radius: 4px;
        opacity: 0.75;
        transition: height 1s ease;
    }

    .driver-label {
        font-size: 0.7rem;
        font-weight: bold;
        text-align: center;
        line-height: 1.3;
    }

    .is-max-track {
        outline: 2.5px dashed #afafaf;
        border-radius: 4px;
    }
</style>