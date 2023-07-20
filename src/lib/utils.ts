
import { RomanNumeral, Chord, Key } from "tonal";

export function prettifyRoman(r: string): string {
    // r: roman in tonal.js format: I, IIm7, IIIo, IMaj7, III+...
    // output: Im -> i, IIIo -> iiio; VIm7 -> vi7
    let roman = RomanNumeral.get(r)
    let name: string = roman.name || '';

    if (['o', 'm', 'm7'].includes(roman.chordType)) {
        name = name.toLowerCase()
        if (roman.chordType == 'm') {
            name = name.slice(0,-1)
        } else if (roman.chordType == 'm7') {
            name = name.slice(0, -2) + 'm'
        }
    }

    return name
}

export function parseChord(c: string) {
    
    return c
}

function parseTextWithinParentheses(inputString: string): string[] {
    // Cm Dm (A Bb) -> Cm Dm A Bb
    const regex = /\((.*?)\)/g;
    const matches = inputString.match(regex);
    const result = matches
        ? matches.map(match => match.slice(1, -1).split(" ")).flat()
        : [];
    return result;
}

function romanUpperCase(roman: string) {
    if (roman === undefined) {
        return ""
    }
    console.log('roman:', roman)
    let romanUpper
    if (['b', '#'].includes(roman.charAt(0))) {
        romanUpper = roman.charAt(0) + roman.slice(1).toUpperCase()
    } else {
        romanUpper = roman.toUpperCase()
    }

    return romanUpper
}

export function chordToRoman(chord: string, key: string = 'C'): Roman {
    let patternKey: string, patternQuality : string;

    console.log('ahhhhh', key)
    patternQuality = key.slice(-1) == 'm' ? 'm' : ''
    patternKey = key.slice(-1) == 'm' ? key.slice(0, -1) : key

    let in_parentheses = parseTextWithinParentheses(chord)

        console.log('parentheses:', in_parentheses)
        if (in_parentheses.length > 0) {
            let recursion = in_parentheses.map(d => chordsToRoman([d], patternKey + patternQuality))
            console.log('recursion:', recursion)
        }

        let chordAug;
        if (in_parentheses.length == 1) {
            chordAug = Chord.get(in_parentheses[0])
        } else {
            chordAug = Chord.get(chord)
        }

        let { quality, name } = chordAug

        let chordQuality: string;
        if (['Diminished', 'Minor'].includes(quality)) {
            chordQuality = 'm'
        } else {
            chordQuality = 'M'
        }
        let romans = [];
        let romanIdx = -1;

        if (patternQuality == 'm') { // minor key for the pattern
            // let minorKey = key.slice(0, -1)
            let minorKeyHarmonic = Key.minorKey(patternKey).harmonic
            console.log('name:', chord)
            romans = [...minorKeyHarmonic.grades]
            romanIdx = minorKeyHarmonic.scale.findIndex(d => d == name.split(' ')[0])
            console.log('scale min:', minorKeyHarmonic.scale)
            console.log('scale min G:', Key.minorKey('G'))
        } else {
            
            console.log('scale:', Key.majorKey(patternKey))
            let majorKey = Key.majorKey(patternKey)
            romans = [...majorKey.grades]
            romanIdx = majorKey.scale.findIndex(d => d == name.split(' ')[0])
            console.log('scale:', majorKey.scale)
        }
        
        console.log(name)
        console.log(romans)
        console.log(romanIdx)
        // todo : romanUpper
        
        return {
            chord,
            roman: romans[romanIdx],
            romanUpper: romanUpperCase(romans[romanIdx]),
            quality: patternQuality,
            chordQuality,
            key: patternKey
        }
}

export function chordsToRoman(chords: Array<string>, key: string = 'C'): Array<Roman> {
    // (["Dm", "G7", "Cmaj7"], "C") => [{chord: Dm, roman: II, romanUpper: II, quality: m, chordQuality: m, key: C}]
    let chordsExtended = chords.map( chord => chordToRoman(chord, key) )
    return chordsExtended
}