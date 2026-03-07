import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {AppIntro} from './scenes/AppIntro';
import {StreamingTextDemo} from './scenes/StreamingTextDemo';
import {FormatVariations} from './scenes/FormatVariations';
import {TextInputDemo} from './scenes/TextInputDemo';
import {EndCard} from './scenes/EndCard';

// Timing: 5 scenes × adjusted durations = 510 total frames
// 4 transitions × 15 frames = 60 frames subtracted by TransitionSeries
// Net: 510 - 60 = 450 frames = 15s ✓
export const Main: React.FC = () => {
	const transition = {
		timing: linearTiming({durationInFrames: 15}),
		presentation: slide(),
	};

	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={75}>
				<AppIntro />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />
			<TransitionSeries.Sequence durationInFrames={165}>
				<StreamingTextDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />
			<TransitionSeries.Sequence durationInFrames={165}>
				<FormatVariations />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />
			<TransitionSeries.Sequence durationInFrames={75}>
				<TextInputDemo />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition {...transition} />
			<TransitionSeries.Sequence durationInFrames={30}>
				<EndCard />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
