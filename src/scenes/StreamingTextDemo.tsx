import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BG,
	GLASS_BORDER,
	GLASS_SHADOW,
	BLUR_RADIUS,
	ACCENT_PEACH,
	TEXT_PRIMARY,
	TEXT_MUTED,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';
import {STREAMING_TEXT} from '../lib/content';

// Anchor formatting: bold the first ~40% of each word (min 1 char)
const anchorWord = (word: string): React.ReactNode => {
	const boldCount = Math.max(1, Math.ceil(word.length * 0.4));
	const bold = word.slice(0, boldCount);
	const rest = word.slice(boldCount);
	return (
		<span>
			<span style={{fontWeight: 700, color: TEXT_PRIMARY}}>{bold}</span>
			<span style={{fontWeight: 400, color: TEXT_MUTED}}>{rest}</span>
		</span>
	);
};

const AnchorText: React.FC<{text: string}> = ({text}) => {
	const words = text.split(' ');
	return (
		<>
			{words.map((word, i) => (
				<React.Fragment key={i}>
					{anchorWord(word)}
					{i < words.length - 1 ? ' ' : ''}
				</React.Fragment>
			))}
		</>
	);
};

export const StreamingTextDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	// Panel fades in during first 15 frames
	const panelProgress = spring({
		fps,
		frame,
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

	// Scroll starts at frame 15, runs to frame 155
	// Text estimated width: ~7800px for ~100 words at fontSize 36 + spacing
	const TEXT_ESTIMATED_WIDTH = 2000;
	const PANEL_WIDTH = width * 0.72;
	const scrollX = interpolate(frame, [15, 155], [PANEL_WIDTH * 0.5, -TEXT_ESTIMATED_WIDTH], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Label fades in above panel
	const labelOpacity = spring({
		fps,
		frame: Math.max(0, frame - 5),
		config: {mass: 0.8, damping: 14, stiffness: 70},
	});

	return (
		<AbsoluteFill
			style={{
				background: BG_GRADIENT,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 24,
			}}
		>
			{/* Label above panel */}
			<div
				style={{
					color: ACCENT_PEACH,
					fontSize: 20,
					fontWeight: 600,
					fontFamily: FONT_FAMILY,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					opacity: labelOpacity,
				}}
			>
				Anchor Reading Mode
			</div>

			{/* Scrolling text panel */}
			<div
				style={{
					width: PANEL_WIDTH,
					height: 120,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					overflow: 'hidden',
					opacity: panelOpacity,
					display: 'flex',
					alignItems: 'center',
					position: 'relative',
				}}
			>
				{/* Left fade mask */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: 80,
						height: '100%',
						background: `linear-gradient(to right, ${GLASS_BG}, transparent)`,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>
				{/* Right fade mask */}
				<div
					style={{
						position: 'absolute',
						right: 0,
						top: 0,
						width: 80,
						height: '100%',
						background: `linear-gradient(to left, ${GLASS_BG}, transparent)`,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>

				<div
					style={{
						transform: `translateX(${scrollX}px)`,
						whiteSpace: 'nowrap',
						fontFamily: FONT_FAMILY,
						fontSize: 36,
						letterSpacing: '0.01em',
						paddingLeft: 40,
					}}
				>
					<AnchorText text={STREAMING_TEXT} />
				</div>
			</div>

			{/* Speed indicator */}
			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					fontWeight: 400,
					letterSpacing: '0.04em',
					opacity: labelOpacity,
				}}
			>
				170 WPM · 24px · Lexend
			</div>
		</AbsoluteFill>
	);
};
