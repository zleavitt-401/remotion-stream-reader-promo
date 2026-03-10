import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BORDER,
	GLASS_SHADOW,
	BLUR_RADIUS,
	ACCENT_PEACH,
	TEXT_MUTED,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

// Show the full text area — no crop needed here, that's the point
const PHONE_H = 580;
const PHONE_W = PHONE_H * (390 / 844);

export const TextAreaDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const cardProgress = spring({
		fps,
		frame,
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
	const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

	const labelProgress = spring({
		fps,
		frame: Math.max(0, frame - 8),
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
				gap: 28,
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
					opacity: interpolate(labelProgress, [0, 1], [0, 1]),
				}}
			>
				Paste or type any text
			</div>

			<div
				style={{
					width: PHONE_W,
					height: PHONE_H,
					overflow: 'hidden',
					borderRadius: BORDER_RADIUS_CARD,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					opacity: cardOpacity,
					transform: `translateY(${cardY}px)`,
				}}
			>
				<Img
					src={staticFile('assets/text-area-dark.png')}
					style={{width: '100%', objectFit: 'cover', objectPosition: 'bottom'}}
				/>
			</div>

			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					opacity: interpolate(labelProgress, [0, 1], [0, 1]),
				}}
			>
				Books, articles, documents — anything
			</div>
		</AbsoluteFill>
	);
};
