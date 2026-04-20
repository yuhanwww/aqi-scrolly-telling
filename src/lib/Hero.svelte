<script>
    import { onMount } from 'svelte';
    let mounted = $state(false); 
    onMount(() => mounted = true);
</script>

<section class:mounted>
    <h1>Seeing Air Quality</h1>
    <p>visualizing invisible pollutants in the air</p>
    <div class="scroll-hint">↓ Scroll to explore</div>
</section>

<style>
    section {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 1s ease, transform 1s ease;
    }
    section.mounted {
        opacity: 1;
        transform: translateY(0);
    }
    h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    p {
        font-size: 1.2rem;
        color: #666;
    }
    .scroll-hint {
        margin-top: 2rem;
        color: #999;
        animation: bounce 1.5s infinite;
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(8px); }
    }
</style>