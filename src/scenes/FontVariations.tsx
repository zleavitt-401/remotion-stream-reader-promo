import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BORDER,
	GLASS_SHADOW,
	BLUR_RADIUS,
	ACCENT_PEACH,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

const CROP_RATIO = 0.62;
const PHONE_H = 540;
const PHONE_W = PHONE_H * (390 / 844);

// Show font picker first (~30 frames), then cycle through font screenshots
const PICKER_FRAMES = 30;
const FONT_SCREENSHOTS = [
	{src: 'font-picker.png', label: 'Choose your font'},
	{src: 'font-georgia.png', label: 'Georgia'},
	{src: 'anchor-on-lexend.png', label: 'Lexend'},
];

export const FontVariations: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Which slide are we on?
	const SLIDE_DURATION = 30;
	const slideIndex = Math.min(
		FONT_SCREENSHOTS.length - 1,
		Math.floor(Math.max(0, frame - PICKER_FRAMES) / SLIDE_DURATION)
	);

	const slideFrame = Math.max(0, frame - PICKER_FRAMES) % SLIDE_DURATION;

	const imgProgress = spring({
		fps,
		frame: slideIndex === 0 && frame < PICKER_FRAMES ? frame : slideFrame,
		config: {mass: 0.8, damping: 14, stiffness: 90},
	});
	const imgOpacity = interpolate(imgProgress, [0, 1], [0, 1]);

	const labelProgress = spring({
		fps,
		frame: Math.max(0, frame - 5),
		config: {mass: 0.7, damping: 14, stiffness: 80},
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
				Font Styles
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
					opacity: imgOpacity,
				}}
			>
				<Img
					src={staticFile(`assets/${FONT_SCREENSHOTS[slideIndex].src}`)}
					style={{width: '100%', objectFit: 'cover', objectPosition: 'top'}}
				/>
			</div>

			<div
				style={{
					color: 'rgba(255,255,255,0.7)',
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					opacity: interpolate(labelProgress, [0, 1], [0, 1]),
				}}
			>
				{FONT_SCREENSHOTS[slideIndex].label}
			</div>
		</AbsoluteFill>
	);
};
