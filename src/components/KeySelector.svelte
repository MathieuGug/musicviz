<script lang="ts">

    import { createEventDispatcher } from "svelte";
    import { tweened, spring } from "svelte/motion";
    import { scaleBand } from "d3-scale";

    export let key: string;

    export let width: number, height: number;
    export let radius = 30;
    export let margins = {left: 20, top: 20, bottom: 100};

    let scales = ['F#', 'C#', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B'];

    let dispatch = createEventDispatcher();
    
    $: yScale = scaleBand()
        .domain(scales)
        .range([margins.top, height - margins.bottom])

    function updateKey(scale: string) {
        // key = scale
        dispatch('update', {key})
        // dispatch
    }

    let strokeHighlight = spring(0)

    let scaleHighlighted = ''

    function highlightScale(scale: string) {
        mode = 'highlighted'
        dispatch('highlight', {key: scale})
        scaleHighlighted = scale;
        strokeHighlight.set(10)
    }

    function reset() {
        dispatch('reset')
        mode = 'idle'
        scaleHighlighted = ''
        strokeHighlight.set(0)
    }

    let mode: 'idle' | 'highlighted' = 'idle';
    $: console.log('ça a changé', key)
</script>


<div class="flex flex-row gap-2 flex-wrap justify-center" >
    {#each scales as scale, i (scale)}
    {@const selectedKey = key == scale}
    {@const highlightedKey = scaleHighlighted == scale}
    {@const fontSize = selectedKey ? 22 : (highlightedKey ? 18 : 14)}
    {@const stroke = selectedKey ? 20 : (highlightedKey ? $strokeHighlight : 0)}
    {@const bgColor = highlightedKey ? '#701a75' : (selectedKey ? "rgb(219 39 119)" : "")}
    {@const textColor = (highlightedKey || selectedKey) ? '#e2e8f0' :'#0c4a6e'}

    <div class="transition-all rounded-full w-14 h-14 flex flex-row justify-center items-center align-middle  bg-sky-400"
        style="background-color: {bgColor}; border-color: {bgColor}; color: {textColor}; font-size: {fontSize}px;"
        on:mousemove={() => highlightScale(scale)}
        on:mouseout={() => reset()}
        on:click={() => updateKey(scale)}>
        <p class="text-center" ></p>
        {scale}
    </div>
    {/each}
</div>
<!-- 
<svg width=100% height=100% viewBox="0 0 100% 100%">
    {#each scales as scale, i (scale)}
    {@const selectedKey = key == scale}
    {@const highlightedKey = scaleHighlighted == scale}
    {@const stroke = selectedKey ? 20 : (highlightedKey ? $strokeHighlight : 0)}
    {@const strokeColor = highlightedKey ? '#701a75' : (selectedKey ? "rgb(219 39 119)" : "")}

    <g class="cursor-pointer" 
        transform="translate({radius}, {yScale(scale) + yScale.bandwidth() / 2})"
        on:mousemove={() => highlightScale(scale)}
        on:mouseout={() => reset()}
        on:click={() => updateKey(scale)}
        on:focus={() => 1+1}>

        <circle class="transition-all" fill="#0891b2" r={radius} 
            stroke={strokeColor} stroke-width={stroke} />
        <text class="font-serif font-bold" fill="#cffafe" text-anchor="middle" dominant-baseline="middle">{scale}</text>
    </g>
    {/each}
</svg> -->