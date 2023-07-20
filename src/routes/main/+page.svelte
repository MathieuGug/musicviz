<script lang="ts">

	import { range } from 'd3-array'
	import { scaleBand } from 'd3-scale';
	import { myData } from './data'
	import { listOfPatterns } from './patterns'
	import Chords from '$src/components/CircleOfFifth.svelte';
	import Song from '$src/components/Song.svelte';
    import { RomanNumeral } from 'tonal';
    import Progression from '$src/components/Progression.svelte';
    import KeySelector from '$src/components/KeySelector.svelte';

	let width: number = 850, 
		height: number = 300;

	let patternHeight = 200;

	type Roman = {
        roman: string,
        romanUpper?: string,
        chordQuality?: 'm' | 'maj',
        patternQuality?: 'm' | 'maj',
        key?: string,
        patternKey?: string,
        chord?: string,
    }

	let romanScale = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

	let autumnLeaves = myData[0]
	console.log(autumnLeaves)

	type Pattern = {
		name?: string,
		progression: string,
		romans?: string,
		key?: string,
		chords?: string
	}

	let patterns: Array<Pattern>;

	patterns = listOfPatterns.map(p => {
		let pattern: Pattern = {
			name: p.name,
			progression: p.progression,
		}

		console.log('progression:', p.progression)
		let romans = p.progression.split(' ').map( d => {
			let alteration: string = '';
			let roman: string = '';
			let quality = 'maj';

			if ( ['b', '#'].includes(d.slice(0, 1)) ) { // une altération
				alteration = d.slice(0, 1)
				if ( ['b', '#'].includes(d.slice(1,2)) ) { // 2 altérations -> on simplifie
					roman = d.slice(2)
					let romanNum = romanScale.findIndex(d => d == roman)
					roman = romanScale[(alteration == 'b' ? -1 : 1) + romanNum]
					alteration = ''
				} else {
					roman = d.slice(1)
				}
			} else {
				roman = d
			}

			if (roman.toLowerCase() == roman) {
				if (roman.slice(-1) == 'o') {
					quality = 'dim'
					roman = roman.slice(0,-1)
				} else {
					quality = 'm'
				}
				roman = roman.toUpperCase() + quality
			}

			console.log('roman:', roman, RomanNumeral.get(roman))

			return roman
		})

		console.log('romans:', romans)
		pattern.romans = romans.join(' ')
		
		return pattern
	})

	console.log(myData)
	// The I is always centered
	let romanNumerals = ['bV', 'bII', 'bVI', 'bIII', 'bVII', 'IV', 'I', 'V', 'II', 'VI', 'III', 'VIII'];

	let chords = ['Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
	
	let numeralsInKey = ['IV', 'I', 'V', 'II', 'VI', 'III', 'VIII'];
	let chordColor = new Map(romanNumerals.map(d=>[d, numeralsInKey.includes(d) ? "#fbbf24" : "#475569"]))
	console.log('chordColor:', chordColor)
	let patternId = 1
	// let pattern = patterns[patternId]
	
	let margins = {left: 20, right: 20, top: 20, bottom: 20};

	let nSections = 4,
		timeSignature = 4
	
	let updatePattern = true;
	let key: string = 'C';
	let keyTemp = '';
	let visible = true;
	let popUpWidth = 300
	let radius = 30;
</script>

<div class="flex flex-col gap-2 w-screen h-screen">
	<div class="h-18 w-full p-2 flex flex-row gap-2">
		<!-- <label for="pattern">
			Pattern
			<select bind:value={trajectoryId} on:change={(e) => updatePattern = true}>
				{#each patterns as trajectory, trajectoryId}
					<option value={trajectoryId}>{trajectory.label}</option>
				{/each}
			</select>
		</label> -->
		<label for="sections">
			Sections
			<input id="sections" type="text" bind:value={nSections} />
		</label>
	
		<label for="timeSignature">
			Time Signature:
			<input id="timeSignature" type="text" bind:value={timeSignature} />
		</label>
	
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

		<label for="timeSignature">
			Key:
			<select bind:value={key}>
				{#each chords as chord}
				<option value={chord}>{chord}</option>
				{/each}
			</select>
		</label>

	</div>

	<div class="h-1/2 w-screen flex flex-row gap-2">
		<div class="h-full w-1/2 border border-slate-400 flex flex-row flex-wrap gap-2 item-center justify-center p-2 overflow-y-auto">
	
			{#each patterns as pattern, i}
				<!-- <Chords width={170} height={100}
					chordColor={chordColor}
					progression={pattern.progression}
					title={traj.name}
					widthFactor={5}
					backToInitial={true}
					font_size={{title: 12, chords: 12}}

					/> -->
					{#if pattern.romans}
					<div class="border border-slate-200 rounded-md">
						{pattern.progression}
						<Progression key={key} progression={pattern.romans} mode="roman to chord" />
					</div>
					{/if}
			{/each}
		</div>
	
		<div class="h-full w-full border border-slate-400 p-2">
			<div>
				<p>
				I may want to refer to I vi ii V: <span class="inline-block relative align-middle">
					<!-- the path -->
					<!-- <Chords 
							width={150} height={80} r={10}
							chordColor={chordColor}
							trajectory={patterns[2].trajectory}
							title={patterns[2].name}
							widthFactor={8}
							backToInitial={true}
							font_size={{title: 16, chords: 14}}
							/> -->
				</span>
				
				This pattern is quite common in music, from rock to pop.
				</p>
	
			</div>
		</div>
	</div>
</div>
	


