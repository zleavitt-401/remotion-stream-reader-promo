import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BG,
	GLASS_BORDER,
	GLASS_SHADOW,
	BLUR_RADIUS,
	ACCENT_PEACH,
	TEXT_MUTED,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

export const TextInputDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in via spring over first ~20 frames
	const fadeIn = spring({
		fps,
		frame,
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const fadeInOpacity = interpolate(fadeIn, [0, 1], [0, 1]);

	// Fade out in last 20 frames (frames 55–75)
	const fadeOutOpacity = interpolate(frame, [55, 75], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const opacity = Math.min(fadeInOpacity, fadeOutOpacity);

	// Subtle scale on entry
	const scale = interpolate(fadeIn, [0, 1], [0.95, 1]);

	// Label fades in with card
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
			{/* Label */}
			<div
				style={{
					color: ACCENT_PEACH,
					fontSize: 20,
					fontWeight: 600,
					fontFamily: FONT_FAMILY,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					opacity: Math.min(labelOpacity, fadeOutOpacity),
				}}
			>
				Paste Any Text
			</div>

			{/* Screenshot card */}
			<div
				style={{
					width: 360,
					height: 620,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					overflow: 'hidden',
					opacity,
					transform: `scale(${scale})`,
				}}
			>
				<Img
					src={staticFile('assets/text-input.png')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: 'block',
					}}
				/>
			</div>

			{/* Subtitle */}
			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					fontWeight: 400,
					letterSpacing: '0.04em',
					opacity: Math.min(labelOpacity, fadeOutOpacity),
				}}
			>
				Articles, books, notes — anything
			</div>
		</AbsoluteFill>
	);
};
