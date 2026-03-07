import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BG,
	GLASS_BORDER,
	ACCENT_PEACH,
	TEXT_PRIMARY,
	TEXT_MUTED,
	GLOW_PEACH_STRONG,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slight bounce spring for drama (mass 1.0, damping 8, stiffness 90)
	const cardProgress = spring({
		fps,
		frame,
		config: {mass: 1.0, damping: 8, stiffness: 90},
	});

	const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
	const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);

	// Subtitle appears slightly after the card
	const subtitleProgress = spring({
		fps,
		frame: Math.max(0, frame - 4),
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

	// Glow pulses gently
	const glowIntensity = interpolate(frame, [0, 30], [0.3, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
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
					width: 700,
					height: 320,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: `${GLOW_PEACH_STRONG.replace('0.55', String(glowIntensity))}`,
					borderRadius: BORDER_RADIUS_CARD,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 20,
					opacity: cardOpacity,
					transform: `scale(${cardScale})`,
				}}
			>
				<div
					style={{
						color: ACCENT_PEACH,
						fontSize: 56,
						fontWeight: 700,
						fontFamily: FONT_FAMILY,
						letterSpacing: '-0.02em',
						textShadow: `0 0 40px rgba(255,203,164,0.5)`,
					}}
				>
					Stream Reader
				</div>

				<div
					style={{
						width: 240,
						height: 1,
						background: `linear-gradient(to right, transparent, rgba(255,203,164,0.4), transparent)`,
						opacity: subtitleOpacity,
					}}
				/>

				<div
					style={{
						color: TEXT_MUTED,
						fontSize: 22,
						fontWeight: 400,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.04em',
						opacity: subtitleOpacity,
					}}
				>
					Available on the App Store
				</div>

				<div
					style={{
						color: TEXT_PRIMARY,
						fontSize: 14,
						fontWeight: 400,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						opacity: subtitleOpacity * 0.6,
					}}
				>
					Read smarter · Focus deeper
				</div>
			</div>
		</AbsoluteFill>
	);
};
