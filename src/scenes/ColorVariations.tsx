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

const COLORS = [
	{src: 'color-picker.png', label: 'Choose your color scheme'},
	{src: 'color-monochrome.png', label: 'Monochrome'},
	{src: 'color-pastel.png', label: 'Pastel'},
	{src: 'color-solarized.png', label: 'Solarized'},
	{src: 'color-rainbow.png', label: 'Rainbow'},
];
const PICKER_FRAMES = 25;
const SLIDE_DURATION = 13; // 4 color slides after picker × 13 ≈ 52 + 25 picker = 77, fits 90 frames

export const ColorVariations: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const afterPicker = Math.max(0, frame - PICKER_FRAMES);
	const slideIndex = Math.min(COLORS.length - 1, 1 + Math.floor(afterPicker / SLIDE_DURATION));
	const activeIndex = frame < PICKER_FRAMES ? 0 : slideIndex;
	const activeFrame = frame < PICKER_FRAMES ? frame : afterPicker % SLIDE_DURATION;

	const imgProgress = spring({
		fps,
		frame: activeIndex === 0 ? frame : activeFrame,
		config: {mass: 0.8, damping: 14, stiffness: 90},
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
				Color Schemes
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
					src={staticFile(`assets/${COLORS[activeIndex].src}`)}
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
				{COLORS[activeIndex].label}
			</div>
		</AbsoluteFill>
	);
};
