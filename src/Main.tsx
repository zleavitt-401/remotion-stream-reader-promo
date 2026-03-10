import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AppIntro} from './scenes/AppIntro';
import {StreamingTextDemo} from './scenes/StreamingTextDemo';
import {AnchorDemo} from './scenes/AnchorDemo';
import {FontVariations} from './scenes/FontVariations';
import {SizeVariations} from './scenes/SizeVariations';
import {ColorVariations} from './scenes/ColorVariations';
import {ThemeVariations} from './scenes/ThemeVariations';
import {WpmDemo} from './scenes/WpmDemo';
import {InternationalDemo} from './scenes/InternationalDemo';
import {TextAreaDemo} from './scenes/TextAreaDemo';
import {EndCard} from './scenes/EndCard';

// Timing: 11 scenes, scene durations sum to 860 frames
// 10 transitions × 20 frames = 200 frames subtracted by TransitionSeries
// Net: 860 - 200 = 660 frames = 22s ✓
export const Main: React.FC = () => {
	const transition = {
		timing: linearTiming({durationInFrames: 20}),
		presentation: fade(),
	};

	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={60}>
				<AppIntro />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={120}>
				<StreamingTextDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={90}>
				<AnchorDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={90}>
				<FontVariations />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={60}>
				<SizeVariations />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={90}>
				<ColorVariations />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={75}>
				<ThemeVariations />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={60}>
				<WpmDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={105}>
				<InternationalDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={75}>
				<TextAreaDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />

			<TransitionSeries.Sequence durationInFrames={60}>
				<EndCard />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
