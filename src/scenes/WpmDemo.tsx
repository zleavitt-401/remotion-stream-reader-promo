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

const CROP_RATIO = 0.62;
const PHONE_H = 540;
const PHONE_W = PHONE_H * (390 / 844);

const SPEEDS = [
	{src: 'wpm-slow.png', label: '85 WPM — Slow & steady'},
	{src: 'wpm-medium.png', label: '170 WPM — Comfortable'},
	{src: 'wpm-fast.png', label: '370 WPM — Speed reading'},
	{src: 'wpm-fastest.png', label: '425 WPM — Expert mode'},
];
const SLIDE_DURATION = 15; // 4 speeds × 15 = 60 frames fits scene duration

export const WpmDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const slideIndex = Math.min(SPEEDS.length - 1, Math.floor(frame / SLIDE_DURATION));
	const slideFrame = frame % SLIDE_DURATION;

	const imgProgress = spring({
		fps,
		frame: slideIndex === 0 ? frame : slideFrame,
		config: {mass: 0.8, damping: 14, stiffness: 100},
	});

	const headerProgress = spring({
		fps,
		frame,
		config: {mass: 0.8, damping: 14, stiffness: 80},
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
					opacity: interpolate(headerProgress, [0, 1], [0, 1]),
				}}
			>
				Reading Speed
			</div>

			<div
				style={{
					width: PHONE_W,
					height: PHONE_H * CROP_RATIO,
					overflow: 'hidden',
					borderRadius: BORDER_RADIUS_CARD,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					opacity: interpolate(imgProgress, [0, 1], [0, 1]),
				}}
			>
				<Img
					src={staticFile(`assets/${SPEEDS[slideIndex].src}`)}
					style={{width: '100%', objectFit: 'cover', objectPosition: 'top'}}
				/>
			</div>

			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					opacity: interpolate(imgProgress, [0, 1], [0, 1]),
				}}
			>
				{SPEEDS[slideIndex].label}
			</div>
		</AbsoluteFill>
	);
};
