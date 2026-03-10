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

// Japanese: frames 0–44 (3 shots × 15 frames)
// Arabic: frames 45–89 (3 shots × 15 frames)
const SLIDES = [
	{src: 'japanese-01.png', label: '日本語 — Japanese', lang: 'LTR'},
	{src: 'japanese-02.png', label: '日本語 — Japanese', lang: 'LTR'},
	{src: 'japanese-03.png', label: '日本語 — Japanese', lang: 'LTR'},
	{src: 'arabic-01.png', label: 'العربية — Arabic', lang: 'RTL'},
	{src: 'arabic-02.png', label: 'العربية — Arabic', lang: 'RTL'},
	{src: 'arabic-03.png', label: 'العربية — Arabic', lang: 'RTL'},
];
const SLIDE_DURATION = 15; // 6 slides × 15 = 90 frames fits scene duration

export const InternationalDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const slideIndex = Math.min(SLIDES.length - 1, Math.floor(frame / SLIDE_DURATION));
	const slideFrame = frame % SLIDE_DURATION;
	const slide = SLIDES[slideIndex];

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

	// Badge showing LTR/RTL direction
	const isRTL = slide.lang === 'RTL';

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
				International Support
			</div>

			<div
				style={{
					position: 'relative',
					width: PHONE_W,
					height: PHONE_H * CROP_RATIO,
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						overflow: 'hidden',
						borderRadius: BORDER_RADIUS_CARD,
						border: GLASS_BORDER,
						boxShadow: GLASS_SHADOW,
						backdropFilter: BLUR_RADIUS,
						opacity: interpolate(imgProgress, [0, 1], [0, 1]),
					}}
				>
					<Img
						src={staticFile(`assets/${slide.src}`)}
						style={{width: '100%', objectFit: 'cover', objectPosition: 'top'}}
					/>
				</div>

				{/* Direction badge */}
				<div
					style={{
						position: 'absolute',
						top: 12,
						right: 12,
						background: isRTL ? 'rgba(255,203,164,0.2)' : 'rgba(164,203,255,0.2)',
						border: `1px solid ${isRTL ? 'rgba(255,203,164,0.5)' : 'rgba(164,203,255,0.5)'}`,
						borderRadius: 6,
						padding: '4px 10px',
						color: isRTL ? ACCENT_PEACH : 'rgba(164,203,255,0.9)',
						fontSize: 13,
						fontWeight: 600,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.08em',
						opacity: interpolate(imgProgress, [0, 1], [0, 1]),
					}}
				>
					{slide.lang}
				</div>
			</div>

			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 18,
					fontFamily: FONT_FAMILY,
					opacity: interpolate(imgProgress, [0, 1], [0, 1]),
				}}
			>
				{slide.label}
			</div>
		</AbsoluteFill>
	);
};
