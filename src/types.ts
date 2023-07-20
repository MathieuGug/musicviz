type InputPattern = {
    type: 'chords' | 'key_change',
    t: string, // mx-y
    key?: string,
    title: string
}
type Pattern = {
    type: string, t: string, 
    start: number, end: number, 
    width: number, 
    x: number, y: number, 
    quality: 'm' | 'M',
    key?: string,
    chords?: Array<string>, 
    romans: Array<string>,
    label: string, 
    name: string
};
type Section = {section: string, chords: string, chordsSeq?: Array<[string, number]>}
type Song = {
    title: string, 
    key: string, 
    measuresBySection: number,
    sections: Array<Section>, 
    patterns: Array<Pattern>
    }
type Roman = {
    roman: string,
    romanUpper?: string,
    quality?: string,
    chordQuality?: string,
    key?: string,
    chord?: string,
    direction?: -1 | 1
}
type RomanProgression = Array<Roman>