import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import {interpolate} from 'remotion';
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

// Screenshot filenames — gracefully handles fewer than 8 files
const ALL_SCREENSHOTS = [
	'screenshot-01.png',
	'screenshot-02.png',
	'screenshot-03.png',
	'screenshot-04.png',
	'screenshot-05.png',
	'screenshot-06.png',
	'screenshot-07.png',
	'screenshot-08.png',
];

const FRAME_WIDTH = 460;
const FRAME_HEIGHT = 560;
const TRANSITION_FRAMES = 15;

export const FormatVariations: React.FC = () => {
	const frame = useCurrentFrame();
	const screenshots = ALL_SCREENSHOTS;

	if (screenshots.length === 0) {
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
						width: FRAME_WIDTH,
						height: FRAME_HEIGHT,
						backgroundColor: GLASS_BG,
						border: GLASS_BORDER,
						boxShadow: GLASS_SHADOW,
						borderRadius: BORDER_RADIUS_CARD,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: TEXT_MUTED,
						fontFamily: FONT_FAMILY,
						fontSize: 18,
						fontWeight: 400,
						letterSpacing: '0.04em',
					}}
				>
					Screenshots will appear here
				</div>
			</AbsoluteFill>
		);
	}

	// Timing: 165 total frames, hold ~10 frames at start + 10 at end
	// Each image gets equal hold time, 15 frame slide transitions between
	const totalTransitions = screenshots.length - 1;
	const holdableFrames = 155 - totalTransitions * TRANSITION_FRAMES;
	const holdPerImage = Math.max(8, Math.floor(holdableFrames / screenshots.length));

	// Compute which image is showing and transition progress
	const cycleLength = holdPerImage + TRANSITION_FRAMES;
	const adjustedFrame = Math.max(0, frame - 5); // 5 frame delay at start

	const cycleIndex = Math.floor(adjustedFrame / cycleLength);
	const currentIndex = Math.min(cycleIndex, screenshots.length - 1);
	const nextIndex = Math.min(currentIndex + 1, screenshots.length - 1);
	const frameInCycle = adjustedFrame - cycleIndex * cycleLength;
	const isTransitioning = frameInCycle >= holdPerImage && currentIndex < screenshots.length - 1;
	const transitionFrame = frameInCycle - holdPerImage;

	const currentSlide = isTransitioning
		? interpolate(transitionFrame, [0, TRANSITION_FRAMES], [0, -FRAME_WIDTH], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	const nextSlide = isTransitioning
		? interpolate(transitionFrame, [0, TRANSITION_FRAMES], [FRAME_WIDTH, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: FRAME_WIDTH;

	// Label fades
	const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const labels = [
		'Monochrome · Dark',
		'Pastel · Dark',
		'Light Theme',
		'Noto Sans · Landscape',
		'Controls Hidden',
		'Solarized · Light',
		'Warm Theme · Landscape',
		'Sepia · IBM Plex Mono',
	];

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
			{/* Section label */}
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
				Fully Customizable
			</div>

			{/* Glass frame containing sliding screenshots */}
			<div
				style={{
					width: FRAME_WIDTH,
					height: FRAME_HEIGHT,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				{/* Current image */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						transform: `translateX(${currentSlide}px)`,
					}}
				>
					<Img
						src={staticFile(`assets/${screenshots[currentIndex]}`)}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				</div>

				{/* Next image (slides in from right) */}
				{isTransitioning && nextIndex !== currentIndex && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							transform: `translateX(${nextSlide}px)`,
						}}
					>
						<Img
							src={staticFile(`assets/${screenshots[nextIndex]}`)}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								display: 'block',
							}}
						/>
					</div>
				)}
			</div>

			{/* Current screenshot label */}
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
				{labels[currentIndex] ?? ''}
			</div>
		</AbsoluteFill>
	);
};
