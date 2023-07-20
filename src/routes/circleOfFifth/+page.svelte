<script lang="ts">
    import CircleOfFifth from "$src/components/CircleOfFifth.svelte";
    import KeySelector from "$src/components/KeySelector.svelte";
    
    let progression: string = ''; // roman numerals
    let key: string = 'D';

    let keyTemp = '';
    let radius = 20;

    $: console.log('hmmmm:', key)
</script>


<input type="text" bind:value={progression} />
<!-- <KeySelector key={key} width={300} height={100} {radius} 
        on:update={(event) => {
            key = event.detail.key
            keyTemp = key
        }} on:highlight={(event) => {
            if (keyTemp == '') {
                keyTemp = key
            }
            key = event.detail.key // Feedback
        }} on:reset={() => {
            key = keyTemp
            keyTemp = key
        }}/> -->

<CircleOfFifth
    width={200} height={100} r={10}
    title={progression}
    key={key}
    progression={progression}
    widthFactor={3}
    backToInitial={true}
    font_size={{title: 16, chords: 14}}
    displayConstructionPoint={true}
/>