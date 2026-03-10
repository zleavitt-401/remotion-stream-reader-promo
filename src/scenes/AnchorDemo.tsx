import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {spring, interpolate} from 'remotion';
import {
	BG_GRADIENT,
	GLASS_BORDER,
	GLASS_SHADOW,
	BLUR_RADIUS,
	ACCENT_PEACH,
	TEXT_PRIMARY,
	TEXT_MUTED,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

// Crop height: show streaming text area + controls, hide bottom text input
const CROP_RATIO = 0.62;
const PHONE_DISPLAY_HEIGHT = 560;
const PHONE_DISPLAY_WIDTH = PHONE_DISPLAY_HEIGHT * (390 / 844);

const PhoneFrame: React.FC<{src: string; opacity: number; x: number}> = ({src, opacity, x}) => (
	<div
		style={{
			width: PHONE_DISPLAY_WIDTH,
			height: PHONE_DISPLAY_HEIGHT * CROP_RATIO,
			overflow: 'hidden',
			borderRadius: BORDER_RADIUS_CARD,
			border: GLASS_BORDER,
			boxShadow: GLASS_SHADOW,
			opacity,
			transform: `translateX(${x}px)`,
			position: 'absolute',
		}}
	>
		<Img
			src={staticFile(`assets/${src}`)}
			style={{
				width: '100%',
				objectFit: 'cover',
				objectPosition: 'top',
			}}
		/>
	</div>
);

export const AnchorDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// OFF panel fades in first
	const offProgress = spring({fps, frame, config: {mass: 0.8, damping: 12, stiffness: 80}});
	const offOpacity = interpolate(offProgress, [0, 1], [0, 1]);
	const offX = interpolate(offProgress, [0, 1], [-60, -PHONE_DISPLAY_WIDTH * 0.6]);

	// ON panel appears at frame 25
	const onProgress = spring({
		fps,
		frame: Math.max(0, frame - 25),
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const onOpacity = interpolate(onProgress, [0, 1], [0, 1]);
	const onX = interpolate(onProgress, [0, 1], [60, PHONE_DISPLAY_WIDTH * 0.6]);

	// Labels
	const labelOff = interpolate(offProgress, [0, 1], [0, 1]);
	const labelOn = interpolate(onProgress, [0, 1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				background: BG_GRADIENT,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 32,
				backdropFilter: BLUR_RADIUS,
			}}
		>
			{/* Title */}
			<div
				style={{
					color: ACCENT_PEACH,
					fontSize: 20,
					fontWeight: 600,
					fontFamily: FONT_FAMILY,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					opacity: offOpacity,
				}}
			>
				Anchor Reading Mode
			</div>

			{/* Two phone frames side by side */}
			<div
				style={{
					position: 'relative',
					width: PHONE_DISPLAY_WIDTH * 2 + 80,
					height: PHONE_DISPLAY_HEIGHT * CROP_RATIO,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<PhoneFrame src="anchor-off.png" opacity={offOpacity} x={offX} />
				<PhoneFrame src="anchor-on-lexend.png" opacity={onOpacity} x={onX} />
			</div>

			{/* Labels */}
			<div
				style={{
					display: 'flex',
					gap: PHONE_DISPLAY_WIDTH + 40,
					fontFamily: FONT_FAMILY,
				}}
			>
				<div style={{color: TEXT_MUTED, fontSize: 18, opacity: labelOff, textAlign: 'center'}}>
					Standard
				</div>
				<div style={{color: TEXT_PRIMARY, fontSize: 18, fontWeight: 600, opacity: labelOn, textAlign: 'center'}}>
					Anchor ON
				</div>
			</div>
		</AbsoluteFill>
	);
};
