<script lang="ts">
    import { scaleLinear, scaleBand, scalePow } from 'd3-scale';
	import { line, curveBasis, curveNatural, curveStep, curveStepBefore, curveStepAfter } from 'd3-shape'
    import { extent } from 'd3-array'
    import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
    import { Interval, Note, Scale, Chord, RomanNumeral, note } from "tonal";
    import { prettifyRoman, chordsToRoman } from '$src/lib/utils';

	let coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.2,
			damping: 0.2
		}
	);

    let romanNumerals = ['bV', 'bII', 'bVI', 'bIII', 'bVII', 'IV', 'I', 'V', 'ii', 'vi', 'iii', 'viiio'];
    let numeralsInKey = ['IV', 'I', 'V', 'ii', 'vi', 'iii', 'viiio'];
    
    // export let chords: Array<string>;
    export let title: string = "";
    export let progression: string = ""; // In romans, pretty format: ii V7 I
    export let key: string = "";
    $: console.log("jjkjj", key)
    export let height: number, width: number, r: number = 15;
    export let chordColor: Map<string, string> = new Map(romanNumerals.map(d=>[d, numeralsInKey.includes(d) ? "#fbbf24" : "#475569"]))

    $: console.log('keyyyy:', key)
    let trajectory: Array<Roman> = [];
    $: trajectory = chordsToRoman(progression.split(' '), key)
    
    $: console.log('romans chords:', trajectory)
    
    export let widthFactor = 1.2;

    export let displayOnlyInTrajectory = false;
    export let displayConstructionPoint = false;

    export let backToInitial = true;

    export let font_size = {chords: 10, title: 12};

    $: if (displayOnlyInTrajectory) {

    }

    let chords = ['bV', 'bII', 'bVI', 'bIII', 'bVII', 'IV', 'I', 'V', 'II', 'VI', 'III', 'VIII'];

    $: trajectory.forEach( d => {
        // Upperize the roman numeral
        if (['b', '#'].includes(d.roman.charAt(0))) {
            d.romanUpper = d.roman.charAt(0) + d.roman.slice(1).toUpperCase()
        } else {
            d.romanUpper = d.roman.toUpperCase()
        }

        if (!d.chordQuality) {
            d.chordQuality = (d.roman.toLowerCase() == d.roman) ? 'm' : 'M'
        }
        d.direction = (d.chordQuality == 'm') ? -1 : 1
    })

    let initialLabel: string | undefined = undefined;
    $: initialLabel = trajectory[0] ? trajectory[0].roman : undefined;
	let constructionPoints: Array<[number, number]> = [];
	$: pathLength = trajectory.length
	let t = 0
	
	function updateConstructionPoints() {
		constructionPoints = [];
		
		trajectory.forEach((d,i) => {
			let { roman, romanUpper, direction } = d
			
			t = (i+1)/pathLength;
			//t=1
			// t = 1 => start, 0 => end
			
			let x0: number, x1: number, y0: number, y1: number;
			x0 = xScale(romanUpper) + xScale.bandwidth()/2
			y0 = yScale(0)
			
			let p0: [number, number] = [x0, yScale(0)]
			let next_pos, p1: [number, number]
			
			constructionPoints.push(p0)
			if ((i == trajectory.length - 1)) {
				next_pos = xScale(trajectory[0].romanUpper) + xScale.bandwidth()/2
				x1 = x0 + (next_pos-x0) / 2
				y1 = ((direction == -1) ? -(5*t) : (5*t)) * widthFactor
		
				p1 = [x1, yScale(y1)]
				constructionPoints.push(p1)
				constructionPoints.push([next_pos, yScale(0)]) // first point
				return
			}
		
			next_pos = xScale(trajectory[i+1].romanUpper) + xScale.bandwidth()/2
			x1 = x0 + (next_pos-x0) / 2 
			y1 = ((direction == -1) ? -(5*rScale(t)) : (5*rScale(t))) * widthFactor
	
			p1 = [x1, yScale(y1)]
			constructionPoints.push(p1)
		})

		path = lineGenerator(backToInitial ? constructionPoints.slice(0, -2) : constructionPoints);
	    endOfPath = lineGenerator(backToInitial ? constructionPoints.slice(-3) : constructionPoints.slice(-1))
	}

    // First and last chord to appear in the trajectory => position first chord at 0
    $: extents = extent(trajectory.map(d => chords.findIndex(ch => ch == d.romanUpper)))

    $: xScale = scaleBand()
            .domain(chords.slice(extents[0], extents[1]+1))
            .range([0, width])
        
    $: yScale = scaleLinear()
            .domain([0, 20])
            .range([height/2, 20])

	$: rScale = scalePow()
		.exponent(1/2)
		.domain([0, 1])
		.range([0, 1])

    // console.log('extents:', extents)

	// console.log('points:', chords.map(d => xScale(d)))
	// console.log('constructionPoints:', constructionPoints)
	
	let lineGenerator = line()
		.x((d: [number, number]) => d[0])
		.y((d: [number, number]) => d[1])
		.curve(curveNatural);


	// Generate the path for the line
    $: path = lineGenerator(backToInitial ? constructionPoints.slice(0, -2) : constructionPoints);
	$: endOfPath = lineGenerator(backToInitial ? constructionPoints.slice(-3) : constructionPoints.slice(-1))

    updateConstructionPoints()

    function progressionToTrajectory(progression: Array<Trajectory>) {
        progression.split(' ').map((d: string) => {
            if (d.slice(-1)[0] == 'm') {
                return {
                    roman: d,
                    direction: -1
                }
            } else {
                return {
                    roman: d,
                    direction: -1
                }
            }
        })
    }
    $: console.log('chordColor chords.svelte:', chordColor)
</script>

Circle of fifth: {progression}
{#each trajectory as roman}
    <p>{roman.chord} - {roman.chordQuality} - {roman.key} - {roman.quality} - {roman.roman} - {roman.romanUpper}</p>
{/each}

{#if trajectory[0].key}
<div>
    {trajectory[0].key}{trajectory[0].quality == 'm' ? trajectory[0].quality : ''}
</div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->


<svg {width} {height} 
    viewBox="0 0 {width} {height}"
    on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })}
    on:mouseout={(e) => coords.set({x: 0, y: 0})}>
	
    <text x={width/2} y={height - 10} font-size={font_size.title} text-anchor="middle" dominant-baseline="middle">{title}</text>

    <g transform="translate({-xScale(chords[extents[0]])})">
        <!-- the skeleton -->
        {#if trajectory.length > 0}
            <path d={path} stroke="black" stroke-width=3 fill="none" />
            {#if backToInitial}
            <path d={endOfPath} stroke="black"stroke-width=2 stroke-dasharray="2 2" fill="none" />
            {/if}

            {#if displayConstructionPoint}
                {#each constructionPoints as cp, i}
                    <circle r=2 cx={cp[0]} cy={cp[1]} fill="red" />
                {/each}
            {/if}
        {/if}

        <!-- The dots -->
        <g transform="translate({xScale.bandwidth()/2})">
            {#each chords as p, i}
            {#if (trajectory.findIndex(t => t.romanUpper == p) != -1)}
                <circle {r} cx={xScale(p) } cy={yScale(0)} fill={chordColor.get('V')} />
                <text x={xScale(p)} y={yScale(0)} 
                    font-size={font_size.chords}
                    text-anchor="middle" dominant-baseline="middle" fill="white">{p}</text>
            {/if}
            {/each}

            <circle r={r}
                cx={xScale(initialLabel)} cy={yScale(0)} 
                stroke="#ef4444" stroke-width=3 fill="none" />
        </g>
    </g>
</svg>