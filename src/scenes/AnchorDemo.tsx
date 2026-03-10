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

const PANEL_WIDTH = 960;
const FONT_SIZE = 34;
// Use first ~12 words for a clean single-line display
const SAMPLE = STREAMING_TEXT.split(' ').slice(0, 12).join(' ');

const TextPanel: React.FC<{
	label: string;
	anchor: boolean;
	opacity: number;
	y: number;
}> = ({label, anchor, opacity, y}) => {
	const words = SAMPLE.split(' ');
	return (
		<div style={{opacity, transform: `translateY(${y}px)`}}>
			{/* Label */}
			<div
				style={{
					color: anchor ? ACCENT_PEACH : TEXT_MUTED,
					fontSize: 16,
					fontWeight: 600,
					fontFamily: FONT_FAMILY,
					letterSpacing: '0.10em',
					textTransform: 'uppercase',
					marginBottom: 10,
					paddingLeft: 4,
				}}
			>
				{label}
			</div>

			{/* Text panel */}
			<div
				style={{
					width: PANEL_WIDTH,
					height: 80,
					backgroundColor: GLASS_BG,
					border: anchor ? `1px solid rgba(255,203,164,0.35)` : GLASS_BORDER,
					boxShadow: anchor
						? '0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(255,203,164,0.15)'
						: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					overflow: 'hidden',
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
						width: 60,
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
						width: 60,
						height: '100%',
						background: `linear-gradient(to left, ${GLASS_BG}, transparent)`,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>

				<div
					style={{
						whiteSpace: 'nowrap',
						fontFamily: FONT_FAMILY,
						fontSize: FONT_SIZE,
						letterSpacing: '0.01em',
						paddingLeft: 32,
					}}
				>
					{anchor ? (
						<>
							{words.map((word, i) => (
								<React.Fragment key={i}>
									{anchorWord(word)}
									{i < words.length - 1 ? ' ' : ''}
								</React.Fragment>
							))}
						</>
					) : (
						<span style={{fontWeight: 400, color: TEXT_PRIMARY}}>{SAMPLE}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export const AnchorDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const topProgress = spring({fps, frame, config: {mass: 0.8, damping: 12, stiffness: 80}});
	const topOpacity = interpolate(topProgress, [0, 1], [0, 1]);
	const topY = interpolate(topProgress, [0, 1], [20, 0]);

	const botProgress = spring({
		fps,
		frame: Math.max(0, frame - 20),
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const botOpacity = interpolate(botProgress, [0, 1], [0, 1]);
	const botY = interpolate(botProgress, [0, 1], [20, 0]);

	const titleProgress = spring({fps, frame, config: {mass: 0.8, damping: 14, stiffness: 70}});

	return (
		<AbsoluteFill
			style={{
				background: BG_GRADIENT,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 40,
			}}
		>
			<div
				style={{
					color: ACCENT_PEACH,
					fontSize: 20,
					fontWeight: 600,
					fontFamily: FONT_FAMILY,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					opacity: interpolate(titleProgress, [0, 1], [0, 1]),
				}}
			>
				Anchor Reading Mode
			</div>

			<div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
				<TextPanel label="Standard" anchor={false} opacity={topOpacity} y={topY} />
				<TextPanel label="Anchor ON" anchor={true} opacity={botOpacity} y={botY} />
			</div>
		</AbsoluteFill>
	);
};
