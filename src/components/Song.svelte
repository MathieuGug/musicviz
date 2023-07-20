<script lang="ts">
    import { range } from 'd3-array'
    import { scaleBand } from 'd3-scale'
    import Chords from './CircleOfFifth.svelte';
    import { Chord, Key, Scale, Progression, RomanNumeral } from 'tonal';
    import { prettifyRoman, chordsToRoman } from '$src/lib/utils'

    import { onMount } from 'svelte';
    // import Progression from './Progression.svelte';

    export let song: Song;

    export let width = 800;
    export let height = 400;
    
    export let mode: 'idle' | 'highlight' | 'lockPatterns' = 'idle';

    let sections: Array<Section> = [];
    $: sections = song.sections.map( (s, i) => {

            let chordsTransf = s.chords.replaceAll('/', '')
            chordsTransf = chordsTransf.replace(/\s\s+/g, ' '); // trimming white space
            let chords = chordsTransf.split(/\s(?![^(]*\))/) // merge chords in parentheses
            let chordsWithMeasure: Array<[string, number]> = chords.map( (c, j) => [c, j + i*song.measuresBySection] )

            return {
                section: s.section,
                chords: s.chords,
                chordsSeq: chordsWithMeasure
            }
        })

    $: measureMap = new Map(sections.flatMap( (s, i) => s.chordsSeq.map(d => [d[1], d[0]]) ))

    let patterns: Array<Pattern> = []
    $: patterns = song.patterns.map((p: InputPattern) => {

        
            let t = p.t.slice(1).split('-')
            let start: number, end: number;

            let patternQuality = 'M';

            let key = p.key || song.key;

            if (key.slice(-1) == 'm') {
                patternQuality = 'm'
                key = key.slice(0, -1)
            }

            start = +t[0] - 1
            end = +t[1] - 1|| start

            let chords: Array<string> = [];
            console.log('-----------')
            for(let i = start; i <= end; i++) {
                let measure = measureMap.get(i)
                console.log(measure)
                if (measure != '%') {
                    chords.push(String(measure))
                } else {
                    chords.push(String(measureMap.get(i-1)))
                }
            }

            let romans = Progression.toRomanNumerals(key, chords)
            
            return {
                label: p.label,
                name: p.name,
                type: p.type,
                key,
                t: p.t,
                chords,
                romans,
                trajectory: chordsToRoman(chords, key),
                start,
                end,
                quality: p.quality || patternQuality,
                width: end - start,
                y: Math.floor(start / song.measuresBySection),
                x: start % song.measuresBySection,
            }
        })

    $: console.log(measureMap)
    $: console.log('patterns:', patterns)
    // scales -> subdivided vertically in the number of sections

    let xScale = scaleBand()
        .domain(range(song.measuresBySection))
        .range([0, width])

    let yScale = scaleBand()
        .domain(range(song.sections.length))
        .range([0, height])
    

    $: console.log('chords in sections:', patterns.map(p => p.label))
    $: console.log('sections:', sections.map(d => d.chords))
    $: console.log('measureMap:', measureMap)
    $: console.log('patterns:', patterns)
    
    let margins = {left: 10, right: 10};

    let tooltipVisible = false;
    let tooltipHeight = 150;
    let highlightedPattern: Pattern | null  = null;

    let tooltip: {x: number, y: number, label?: string, length?: number, progression?: string[], chords: string[], trajectory: Trajectory} = {x: 0, y: 0}

    function highlightPattern(event, pattern: Pattern) {
        tooltipVisible = true

        console.log('patterns:', pattern)
        let chordsSeq: string[] = []
        for(let i = pattern.start; i <= pattern.end; i++) {
            let measure;
            if (measureMap.get(i) == '%') {
                measure = measureMap.get(i-1)
            } else {
                measure = measureMap.get(i)
            }
            chordsSeq.push(String(measure))
        }

        console.log("patterns chords seq", chordsSeq)

        console.log(pattern.chords)
        console.log(pattern.label)

        // Either the key in specified for the pattern, or we assume the song key
        console.log('patternKeeey:', pattern.key)

        
        // let romans = chordsToRoman(chordsSeq, )
        let key: string = pattern.key || song.key;
        if (key.slice(-1) == 'm') {
            key = key.slice(0, -1)
        }
        
        let romans = Progression.toRomanNumerals(key, chordsSeq)
        console.log('key:', key)
        
        // let romans = Progression.toRomanNumerals('C', chordsSeq)
        // romans.forEach( d => {
        //     d.roman = (['Minor', 'Diminished'].includes(d.quality) ? d.roman : d.roman.toUpperCase()) 
        // })

        console.log('romans in pattern 2:', romans)
        tooltip.progression = romans
        tooltip.label = romans.map(d => {
            return prettifyRoman(d)
        }).join(' ')

        let chords = Progression.fromRomanNumerals(key, romans)
        tooltip.chords = chords
        tooltip.trajectory = chordsToRoman(chords, key)

        tooltip.length = pattern.end - pattern.start + 1
        tooltip.x = pattern.x
        tooltip.y = pattern.y
        console.log('tooltip:', tooltip)
        // tooltipVisible = true
    }

	let romanNumerals = ['bV', 'bII', 'bVI', 'bIII', 'bVII', 'IV', 'I', 'V', 'ii', 'vi', 'iii', 'viiio'];
	let numeralsInKey = ['IV', 'I', 'V', 'ii', 'vi', 'iii', 'viiio'];
    let chordColor = new Map(romanNumerals.map(d=>[d, numeralsInKey.includes(d) ? "#fbbf24" : "#475569"]))

</script>

<div class="p-2">
    <div class="absolute grid p-2 gap-2">

        {#each sections as section, i}
            <!-- <div class="row-span-1 text-center border-r border-slate-500">{section.section}</div> -->
            <!-- Chords -->
            {#each section.chordsSeq as [chord, _], j}
            {@const y = Math.floor(i / song.measuresBySection)}
            {@const x = j % song.measuresBySection}
            <div class="absolute text-sm" style="top: {yScale(i)}px; left: {xScale(x)}px;">
                {chord}
            </div>
            {/each}
        {/each}
    </div>
    <!-- <div class="w-screen h-80 grid p-2 gap-2"
        style="grid-template-columns: repeat({song.measuresBySection + 1}, minmax(0, 1fr)); 
            grid-template-rows: repeat({song.sections.length}, minmax(0, 1fr));">

        {#each song.sections as section}

            <div class="row-span-1 text-center border-r border-slate-500">{section.section}</div>
            {#each section.chordsSeq as chord, i}
            {@const y = Math.floor(i / song.measuresBySection)}
            {@const x = i % song.measuresBySection}
            <div class="">{chord}</div>
            <div class="absolute" style="top: {yScale(y)}px; left: {xScale(x)}px;">
                {chord}
            </div>
            {/each}
            
        {/each}
    </div> -->

    <div class="absolute mt-8" >
        {#if tooltipVisible}
        <div class="absolute rounded-2xl pointer-events-none flex flex-col justify-center  w-auto h-auto  z-10" 
            style="top: {yScale(tooltip.y) - tooltipHeight/2 + 5}px; 
                left: {xScale(tooltip.x)}px; 
                height: {tooltipHeight}px; width: {tooltipHeight}px;">
            <Chords
                width={xScale.bandwidth() * tooltip.length} height={100} r={10}
                chordColor={chordColor}
                trajectory={tooltip.trajectory}
                title={tooltip.label}
                widthFactor={3}
                backToInitial={true}
                font_size={{title: 16, chords: 14}}
                displayConstructionPoint={true}
            />
        </div>
    {/if}

        {#each patterns.filter(p => p.type == "chords") as pattern, idx}

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div class="absolute break-words text-xs h-16 border-slate-600 border p-2 
                
                {pattern.quality == 'm' ? 'bg-red-200' : 'bg-blue-200'}" 
            on:mousemove={(e) => highlightPattern(e, pattern)}
            on:keydown={(e) => 1}
            on:mouseout={(e) => tooltipVisible = false}
            style="
                top: {yScale(pattern.y)}px; left: {xScale(pattern.x) + margins.left}px; 
                width: {xScale.bandwidth() * (pattern.end - pattern.start + 1) - margins.left - margins.right}px;
                height: {0.5*yScale.bandwidth()}px;">
            {pattern.label}

            <div class="absolute rounded-2xl pointer-events-none flex flex-col justify-center  w-auto h-auto  z-10" 
            style="top: {yScale(pattern.y)}px; 
                left: {xScale(pattern.x)}px; 
                height: {tooltipHeight}px; width: {tooltipHeight}px;">
                <!-- <Chords
                    width={xScale.bandwidth() * (pattern.end - pattern.start +1)} height={100} r={10}
                    chordColor={chordColor}
                    trajectory={pattern.romans}
                    title={tooltip.label}
                    widthFactor={3}
                    backToInitial={true}
                    font_size={{title: 16, chords: 14}}
                    displayConstructionPoint={true}
            /> -->
            </div>
        </div>
        {/each}
    </div>

    <!-- Patterns -->
    <!-- {#each song.patterns.filter(p => p.type == "chords") as pattern}
        <div style="grid-column: span {pattern.end - pattern.start + 1} / span {pattern.end - pattern.start + 1};">
            {pattern.label} {pattern.end - pattern.start}
        </div>
    {/each} -->


</div>