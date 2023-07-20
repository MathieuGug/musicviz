export const myData = [
	{
		title: 'Autumn Leaves',
		key: 'Gm',
		measuresBySection: 8,
		sections: [
			{
				section: 'A',
				chords: 'Cm F7 Bb+ Eb+ / Ao D7 Gm G7',
			},
			{
				section: 'A',
				chords: 'Cm F7 Bb+ Eb+ / Ao D7 Gm G7',
			},
			{
				section: 'B',
				chords: 'Ao D7 Gm % / Cm F7 Bb+ Eb+',
			},
			{
				section: 'C',
				chords: 'Ao D7 (Gm F#o) (Fm Bb7) / Eb7 D7 Gm (G7)',
			},
		],
		patterns: [
				{
					type: 'chords',
					t: 'm1-4',
					key: 'Bb',
					label: 'overrun',
				},
				{
					type: 'key_change',
					t: 'm4',
					label: 'sidewinder'
				},
				{
					type: 'chords',
					t: 'm5-7',
					label: 'minor_cadence',
				},
				{
					type: 'key_change',
					t: 'm7',
					label: 'bootstrap'
				},
				{
					type: 'chords',
					t: 'm8',
					label: 'tension_launcher',
				},
				{
					type: 'chords',
					t: 'm9-12',
					key: 'Bb',
					label: 'overrun',
				},
				{
					type: 'key_change',
					t: 'm12',
					label: 'sidewinder'
				},
				{
					type: 'chords',
					t: 'm13-16',
					label: 'minor_cadence',
				},
				{
					type: 'key_change',
					t: 'm16',
					label: 'homer'
				},
				{
					type: 'chords',
					t: 'm17-20',
					label: 'minor_cadence',
				},
				{
					type: 'key_change',
					t: 'm20',
					label: 'highjump'
				},
				{
					type: 'chords',
					t: 'm21-24',
					key: 'Bb',
					label: 'overrun',
				},
				{
					type: 'key_change',
					t: 'm24',
					label: 'sidewinder'
				},
				{
					type: 'chords',
					t: 'm25-26',
					label: 'launcher',
				},
				// {
				// 	type: 'chords',
				// 	t: 'm27-28',
				// 	key: 'Bb',
				// 	label: 'cycle_of_fourths',
				// },
				{
					type: 'chords',
					t: 'm29-31',
					label: 'nowhere_cadence',
				},
				{
					type: 'key_change',
					t: 'm31',
					label: 'bootstrap'
				},
				{
					type: 'chords',
					t: 'm32',
					label: 'tension_launcher',
				}
			]
	}
]