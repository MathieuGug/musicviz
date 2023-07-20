<script lang="ts">
    import { flip } from "svelte/animate";
    import Progression from "$src/components/Progression.svelte";
    import Chords from "$src/components/CircleOfFifth.svelte";
    import { fly } from "svelte/transition";
    import { scaleBand } from "d3-scale";
    import KeySelector from "$src/components/KeySelector.svelte";

    let progressionRomans: string = "";
    let progressionChords: string = "";
    let progressionConverted: string;

    let mode: 'select key' | 'chord to roman' | 'roman to chord' = 'chord to roman';
    let visible = false;
    let key = 'C'

    let margins = {right: 20, left: 20, top: 20, bottom: 100};
    let height: number;
    let popUpWidth: number;


    $: if (['chord to roman', 'roman to chord'].includes(mode)) {
        console.log('test')
        visible = false
    } else {
        visible = true
    }

    let radius = 32
    let keyTemp: string = ''; // copy of active key to show consequences of highlight. When highlight done, back to keyTemp.
</script>

<svelte:head>
    <title>Chords progression converter</title>
</svelte:head>

<div class="absolute z-100 w-3/5 h-auto transition-all duration-700 delay-200" 
    style="right: {margins.right}px; top: {margins.top}px; visibility: {visible ? 'visible' : 'hidden'}; opacity: {visible ? '100%' : '0%'};"
    bind:clientHeight={height} bind:clientWidth={popUpWidth}>
    <KeySelector key={key} width={popUpWidth} height={height} {radius} 
        on:update={(event) => {
            key = event.detail.key
            keyTemp = key
            console.log('keyyyyy:', key)
            console.log('key updated yeah', event)
            visible = false
        }} on:highlight={(event) => {
            console.log('key highlighted yeah', event.detail)
            if (keyTemp == '') {
                keyTemp = key
            }
            key = event.detail.key // Feedback
        }} on:reset={() => {
            console.log('reset')
            key = keyTemp
            keyTemp = key
        }}/>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="absolute cursor-pointer flex flex-col items-center align-middle text-center justify-center z-100  rounded-full left-[130px] shadow-xl bg-pink-600 top-4"
    style="width: {2*radius}px; height: {2*radius}px;"
    on:mousedown={() => visible = !(visible)}>
    <p class="absolute text-slate-100 font-serif font-bold transition-all duration-500"
        style="opacity: {!visible ? 100 : 0}; left: {!visible ? '-60px' : '0px'};">Key:</p>
    <p class="text-2xl italic font-serif text-slate-100">{key}</p>
</div>

<div class="w-screen h-screen flex flex-col items-center gap-2 bg-[#0c4a6e] -z-10">
    <div class="flex flex-col w-full h-full gap-2 items-center m-4 p-12 justify-center">
        <div class="h-1/4 w-full">
            <input type="text" 
                class="text-3xl md:text-7xl font-semibold font-mono bg-[#9d174d]
                    text-center text-[#500724] items-center rounded-3xl shadow-2xl
                    w-full h-full p-1
                    placeholder:text-[#fce7f3] " 
                placeholder={"Chords"}
                bind:value={progressionChords} on:focus={() => {
                    mode = 'chord to roman'
                    visible = false
                }} />
        </div>
        <div class="relative h-1/3 flex flex-col text-center gap-2 justify-between ">
            {#if mode == 'chord to roman'}
            <div class="min-h-[100px] overflow-y-auto">
                <Progression 
                    bind:progressionConverted={progressionRomans}
                    progression={progressionChords}
                    {key}
                    mode={'chord to roman'} />
            </div>
        
            <div class="min-h-[100px] overflow-y-auto">
                <Progression 
                    progressionConverted={progressionChords}
                    progression={progressionRomans}
                    {key}
                    mode={'roman to chord'} />
            </div>
            {:else if mode == 'roman to chord'}
            <div class="min-h-[100px] overflow-y-auto">
                <Progression 
                    progressionConverted={progressionRomans}
                    progression={progressionChords}
                    {key}
                    mode={'chord to roman'} />
            </div>
            
            <div class="min-h-[100px] overflow-y-auto">
                <Progression 
                    bind:progressionConverted={progressionChords}
                    progression={progressionRomans}
                    {key}
                    mode={'roman to chord'} />
            </div>
            {/if}
            
        </div>


        <div class="h-1/4  w-full">
            
            <input type="text" 
                class="w-full text-center items-center text-[#31903B]
                    text-3xl md:text-7xl font-semibold font-serif
                    h-full p-1 rounded-3xl shadow-2xl
                    bg-[#022c22]
                    placeholder:text-[#dcfce7]" 
                placeholder={"Romans"}
                bind:value={progressionRomans} 
                on:focus={() => {
                    mode = 'roman to chord'
                    visible = false
                }} />
        </div>
    </div>
</div>