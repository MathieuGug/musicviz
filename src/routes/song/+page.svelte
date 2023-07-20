<script lang="ts">

	import { range } from 'd3-array'
	import { scaleBand } from 'd3-scale';
	import { myData } from './data'
	import Chords from '$src/components/CircleOfFifth.svelte';
	import Song from '$src/components/Song.svelte';
    import { RomanNumeral } from 'tonal';
    import Progression from '$src/components/Progression.svelte';
    import KeySelector from '$src/components/KeySelector.svelte';

    let width = 800,
        height = 400;

    let autumnLeaves = myData[0]
	console.log(autumnLeaves)

</script>

<div class="flex flex-col w-screen">
    <div class="" style="left: {width/8}px;">
        <Song song={autumnLeaves} width={width} height={height}/>
    </div>
</div>