<script lang="ts">
    import { Progression, RomanNumeral } from "tonal";
    import { prettifyRoman, reverseRoman, parseChord } from '$src/lib/utils'
    export let key: string = "C";
    export let progression: string;
    export let mode: 'roman to chord' | 'chord to roman';
    export let progressionConverted: string = '';
    

    $: if (mode == 'roman to chord') {
        console.log('roman to chord')
        console.log('input:', progression)
        
        let progressionFormatted = progression.split(' ').map(r => reverseRoman(r))
        console.log('input:', progressionFormatted)
        let chords = Progression.fromRomanNumerals(key, progressionFormatted)

        let progressionParsed = chords.map(c => parseChord(c))
        progressionConverted = progressionParsed.join(' ')

        console.log('chords:', chords)
        console.log('output:', progressionConverted)
    } else if (mode == 'chord to roman') {
        console.log('chord to roman')
        console.log('input:', progression)

        let romans = Progression.toRomanNumerals(key, progression.split(' '))

        let progressionParsed = romans.map(c => prettifyRoman(c))
        
        progressionConverted = progressionParsed.join(' ')

        console.log('chords:', romans)
        console.log('output:', progressionConverted)
    } else {
        throw 'Type must be in `roman to chord` or `chord to roman`';
    }

    $: progressionConverted.split(' ').map(r => {
        let roman = RomanNumeral.get(r)
        console.log(roman)
    })
</script>

{#if progressionConverted != ""}
<div class="relative p-4">
    <!-- <p class="absolute top-1 right-1 text-sm">{mode == 'chord to roman' ? 'Romans' : 'Chords'}</p> -->
    <p class="text-3xl md:text-4xl font-sans text-[#7dd3fc] [word-spacing:40px] cursor-default">{progressionConverted}</p>
</div>
{/if}