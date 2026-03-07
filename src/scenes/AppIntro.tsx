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
	GLOW_PEACH,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

export const AppIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const cardProgress = spring({
		fps,
		frame,
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});

	const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
	const cardScale = interpolate(cardProgress, [0, 1], [0.85, 1]);

	const glowOpacity = interpolate(frame, [20, 75], [0.3, 1.0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const subtitleOpacity = spring({
		fps,
		frame: Math.max(0, frame - 10),
		config: {mass: 0.8, damping: 14, stiffness: 70},
	});

	return (
		<AbsoluteFill
			style={{
				background: BG_GRADIENT,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					width: 600,
					height: 300,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: `${GLASS_SHADOW}, 0 0 60px rgba(255,203,164,${glowOpacity * 0.4})`,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 16,
					opacity: cardOpacity,
					transform: `scale(${cardScale})`,
				}}
			>
				<div
					style={{
						color: ACCENT_PEACH,
						fontSize: 52,
						fontWeight: 700,
						fontFamily: FONT_FAMILY,
						letterSpacing: '-0.02em',
						textShadow: `0 0 30px rgba(255,203,164,${glowOpacity * 0.6})`,
					}}
				>
					Stream Reader
				</div>
				<div
					style={{
						color: TEXT_PRIMARY,
						fontSize: 22,
						fontWeight: 400,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.02em',
						opacity: subtitleOpacity,
					}}
				>
					Read smarter. Focus deeper.
				</div>
			</div>
		</AbsoluteFill>
	);
};
