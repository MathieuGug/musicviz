<script lang="ts">
    import { Interval, Note, Scale, Key, Chord, Progression, RomanNumeral, note } from "tonal";
    import { prettifyRoman, parseChord } from '$src/lib/utils'
    export let key: string = "C";
    export let progression: string;
    export let mode: 'roman to chord' | 'chord to roman';
    export let progressionConverted: string = '';
    

    $: if (mode == 'roman to chord') {
        let chords = Progression.fromRomanNumerals(key, progression.split(' '))
        let progressionParsed = chords.map(c => parseChord(c))

        console.log('chooords:', chords)
        progressionConverted = progressionParsed.join(' ')
    } else if (mode == 'chord to roman') {
        let romans = Progression.toRomanNumerals(key, progression.split(' '))
        let progressionParsed = romans.map(c => prettifyRoman(c))
        
        console.log('romaaans:', romans)
        progressionConverted = progressionParsed.join(' ')
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