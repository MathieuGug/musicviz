<script lang="ts">
    import { Interval, Note, Scale, Key, Chord, Progression, RomanNumeral, note } from "tonal";
    import Chords from "./CircleOfFifth.svelte";
    import { scale } from "svelte/transition";
    import { fade } from "svelte/transition";

    // A sequence of chords as:
    // - roman numerals
    // - chords

    type Roman = {
        roman: string,
        romanUpper?: string, // biii => bIII
        chord?: string,
        chordQuality?: string,
        alteration?: string | null,
        progressionQuality?: string,
        progressionKey?: string,
        progressionScale?: string
    }

    type Chord = {
        chord: string,
        name: string,
        quality?: string,
        alteration?: string
    }

    type Key = {
        key: string,
        scale: string,
        quality: string,
    }

    export let key: string = "C";
    export let progression: string;
    export let mode: 'roman to chord' | 'chord to roman';
    export let progressionConverted: string;

    export let devMode: 'dev' | 'prod' | 'debug' = 'debug';

    $: if (mode == 'roman to chord') {
        progressionConverted = convertRomansToChords(progression, key)
    } else if (mode == 'chord to roman') {
        progressionConverted = convertChordsToRomans(progression, key)
    } else {
        throw 'Type must be in `roman to chord` or `chord to roman`';
    }

    function romanToChord(roman: string | Roman, key: string) {
        // romanToChord('I', 'C'), or romanToChord({'roman': 'I'}, C) => C
        // romanToChord('i', 'C') => Cm
        // romanToChord('Imaj7', 'C') => Cmaj7

        let romanParsed: Roman;

        if (typeof roman === 'string') {
            romanParsed = parseRoman(roman)
        } else {
            romanParsed = roman
        }

        let progressionQuality: 'm' | 'maj';
        let progressionKey: string;

        romanParsed.progressionKey = key
        romanParsed.progressionQuality = parseKey(key).quality
        romanParsed.progressionScale = parseKey(key).scale
        
        let chord: string = '';

        // Identify the chord

        // Minor key (harmonic)
        if (romanParsed.progressionQuality == 'm') {
            let minorKeyHarmonic = Key.minorKey(romanParsed.progressionKey).harmonic // scale Cm
            // key.grades = ['I', 'II', 'bIII', ...] for harmonic minor
            let romanIdx = minorKeyHarmonic.grades.findIndex(d => d == romanParsed.romanUpper) 

             // Case 1: the numeral is in the key
            if (romanIdx != -1) { // the roman is in the scale
                chord = minorKeyHarmonic.scale[romanIdx]
            } 
            // Case 2: the numeral is not in the key
            else { // means the alteration leaves you out of key
                
            }
        } 
        else {
            let majorKey = Key.majorKey(romanParsed.progressionKey)
            let romanIdx = majorKey.grades.findIndex(d => d == romanParsed.romanUpper)

            console.log('idx:', romanIdx)
            if (romanIdx != -1) {
                chord =  majorKey.scale[romanIdx] + romanParsed.alteration + romanParsed.chordQuality
            } else { // Out of key -> leave the alteration out
                romanIdx = majorKey.grades.findIndex(d => d == romanParsed.romanUpper?.slice(1))
                if (romanIdx != -1) {
                    chord =  majorKey.scale[romanIdx] + romanParsed.alteration + romanParsed.chordQuality
                }
            }
        }

        chord = replaceUselessAlteration(chord)
        let chordParsed = parseChord(chord)

        if (devMode == 'debug') {
            console.log(`   Call to romanToChord`)
            console.log(`   CONVERTING ROMAN ${roman} TO CHORD ${chord}:`)
            console.log(`   Chord: ${chordParsed}`)
        }

        return chordParsed;
    }

    function chordToRoman(chord: string | Chord, key: string) {
        
        let romanParsed: Roman;
        let chordParsed: Chord;
        let keyParsed: Key = parseKey(key)

        if (typeof chord === 'string') {
            chordParsed = parseChord(chord)
        } else {
            chordParsed = chord
        }

        // If in parentheses, we run the recursion, e.g.,  (Gm G7)
        // let in_parentheses = parseTextWithinParentheses(c)
        
        // if (in_parentheses.length > 0) {
        //     let result = in_parentheses.map(d => convertChordToRoman([d], key = keyParsed.key))
        //     return result
        // }

        // let chord;
        // if (in_parentheses.length == 1) {
        //     chord = Chord.get(in_parentheses[0])
        // } else {
        //     chord = Chord.get(c)
        // }

        let grades = [];
        let romanIdx = -1;

        // 
        // Whether the key is minor or minor
        //
        let outOfKey = false;
        let finaleAlteration: string = '';

        if (keyParsed.quality == 'm') { // minor key for the pattern
            // let minorKey = key.slice(0, -1)
            let minorKeyHarmonic = Key.minorKey(keyParsed.key).harmonic
            grades = [...minorKeyHarmonic.grades]
            romanIdx = minorKeyHarmonic.scale.findIndex(d => d == chordParsed.chord)
            if (romanIdx == -1) {
                romanIdx = minorKeyHarmonic.scale.findIndex(d => d == chordParsed.name.slice(0, -1) )
            } 
        } else {
            console.log('majorKey patternKey:', Key.majorKey(keyParsed.key))
            let majorKey = Key.majorKey(keyParsed.key)
            grades = [...majorKey.grades]
            romanIdx = majorKey.scale.findIndex(d => d == chordParsed.name)

            if (devMode == 'debug') {
                console.log(`      majorKey.scale: ${majorKey.scale}`)
                console.log(`      chord: ${chordParsed.name}`)
                console.log(`      grades: ${grades}`)
                console.log(`      romanId: ${romanIdx}`)
            }

            if (romanIdx == -1) { 
                // Soit l'accord a une altération -> on retire l'altération de l'accord et on cherche dans la gamme
                // Soit l'accord n'a pas d'altération -> on retire les altérations de la gamme
                console.log('slice:', chordParsed.name.slice(0, -1))
                romanIdx = majorKey.scale.findIndex(d => d == chordParsed.name.slice(0, -1) ) // On retire l'alteration de l'accord
                let addAlterationOnRoman = true // Bb -> B -> VII -> bVII
                
                finaleAlteration = chordParsed.alteration || '';

                if (romanIdx == -1) {
                    romanIdx = majorKey.scale.findIndex(d => d.slice(0, -1) == chordParsed.name ) // On retire l'alteration de la gamme

                    if (romanIdx == -1) {
                        return {
                            name: chordParsed.name,
                            chord: chordParsed,
                            roman: null,
                            key: keyParsed
                        }
                    }

                    let romanAlteration = majorKey.scale[romanIdx].slice(-1)
                    if (romanAlteration == 'b') {
                        finaleAlteration = '#'
                    } else {
                        finaleAlteration = 'b'
                    }
                }
                outOfKey = true
            } 

            if (devMode == 'debug') {
                console.log(`      chord without alteration: ${chordParsed.name.slice(0, -1)}`)
                console.log(`      major without alteration: ${majorKey.scale.map(d => d.slice(0, -1) )}`)
                console.log(`      romanId: ${romanIdx}`)
            }

        }
        

        // Pas d'alteration si l'accord est dans la game à la base
        let roman: string;
        roman = finaleAlteration + (chordParsed.quality == 'm' ? grades[romanIdx].toLowerCase() : grades[romanIdx])

        romanParsed = parseRoman(roman)

        if (devMode == 'debug') {
            console.log(`   Call to chordToRoman`)
            console.log(`   CONVERTING CHORD ${chord} TO ROMAN ${roman}:`)
            console.log(`   Roman: ${JSON.stringify(romanParsed)}`)
            console.log(`   Chord: ${chord}`)
        }

        return {
            name: chordParsed.name,
            chord: chordParsed,
            roman: romanParsed,
            key: keyParsed,
        }
    }

    export function convertChordsToRomans(chords: string, key: string) {
        if (devMode == 'debug') {
            console.log(`CALL convertChordsToRomans: ${chords}`)
        }
        if (chords.length == 0) {
            return ''
        }

        let progressionChords = chords.split(' ')

        let romans: Array<
            {name: string, chord: Chord, roman: Roman, key: Key}
            > = progressionChords.map( (c: string) =>  chordToRoman(c, key) )

        if (devMode == 'debug') {
            console.log(`CONVERTING CHORD ${chords} TO ROMAN:`)
            console.log(`${romans.map(d => d.roman.roman).join(' ')}:`)
        }
        return romans
                .filter(d => d.chord.name)
                .map(d => d.roman.roman)
                .join(' ')
    }

    export function convertRomansToChords(romans: string, key: string) {
        if (devMode == 'debug') {
            console.log(`CALL convertRomansToChords: ${romans}`)
        }

        if (romans.length == 0) {
            return ''
        }
        
        let progressionRomans = romans.split(' ')
        let chords: Array<Chord> = progressionRomans.map( romanChord => romanToChord(romanChord, key) )
        
        if (devMode == 'debug') {
            console.log(`CONVERTING ROMANS: ${romans} TO CHORDS:`)
            console.log(` ${chords.map(d => d.chord).join(' ')}`)
        }
        return chords.filter(d => d.chord).map(d => d.chord).join(' ')
    }


    function parseTextWithinParentheses(inputString: string) {
        const regex = /\((.*?)\)/g;
        const matches = inputString.match(regex);
        const result = matches
            ? matches.map(match => match.slice(1, -1).split(" ")).flat()
            : [];
        return result;
    }

    function parseRoman(roman: string) {
        // parseRoman('bi') => {roman: 'bi', romanUpper: 'I', alteration: 'b', chordQuality: 'm'}

        let romanParsed: Roman; // result

        let romanUpper: string;
        let chordQuality: 'm' | 'maj' = 'maj';
        
        let grade: string = roman;
        let alteration: string = '';

        // Alteration if the first character is either 'b' or '#'
        if (['b', '#'].includes(roman.slice(0, 1))) {
            alteration = roman.slice(0, 1)
            grade = roman.slice(1)
        }
        romanUpper = (alteration || '') + grade.toUpperCase()

        // Minor if the numeral is lowercase
        if (grade.toLowerCase() == grade) { // minor
            chordQuality = 'm'
        }

        romanParsed = {
            roman,
            romanUpper,
            alteration,
            chordQuality
        }

        return romanParsed;
    }

    function parseChord(chord: string) {
        let chordTonal = Chord.get(chord)
        console.log(chord, Chord.get(chord))

        let alteration = ['b', '#'].includes(chordTonal.tonic?.slice(-1) || '') ? chordTonal.tonic?.slice(-1) : ''

        let chordParsed: Chord = {
            chord,
            name: chordTonal.tonic || '',
            quality: ['Minor', 'Diminished'].includes(chordTonal.quality) ? 'm' : 'maj',
            alteration: alteration || ''
        }

        console.log(chord, chordParsed)
        return chordParsed
    }

    function parseKey(key: string) {
        // parseKey('Cm') => {key: 'Cm', scale: 'C', quality: 'm'}
        
        let scale: string = key;
        let quality: 'm' | 'maj' = 'maj';

        if (key.slice(-1) == 'm') {
            quality = 'm';
            scale = key.slice(-1)
        }

        return {
            key: scale,
            scale,
            quality,
        }
    }

    function replaceUselessAlteration(chord: string) {
        let chordClean = chord.replaceAll('#b', '')
        chordClean = chordClean.replaceAll('#b', '')
        return chordClean
    }
</script>

{#if progressionConverted != ""}
<div class="relative p-4 rounded-xl ">
    <!-- <p class="absolute top-1 right-1 text-sm">{mode == 'chord to roman' ? 'Romans' : 'Chords'}</p> -->
    <p class="text-3xl md:text-4xl font-sans text-[#7dd3fc] [word-spacing:40px] cursor-default">{progressionConverted}</p>
</div>
{/if}