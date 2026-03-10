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
	TEXT_MUTED,
	BORDER_RADIUS_CARD,
	FONT_FAMILY,
} from '../lib/tokens';

const JAPANESE =
	'素早い茶色のキツネは怠け者の犬を飛び越える。これは、アンカーリーディング形式に対応したストリームリーダーアプリです。どんな言語でも快適に読めます。';
const ARABIC =
	'يقفز الثعلب البني السريع فوق الكلب الكسول. هذا قارئ نصوص متدفق مزود بخاصية القراءة المرتكزة التي تساعدك على القراءة بشكل أسرع.';

// Scene is 105 frames: Japanese 0–51, Arabic 52–104
const JP_END = 52;

const PANEL_WIDTH_RATIO = 0.72;
const TEXT_TRAVEL = 3200;

const ScrollPanel: React.FC<{
	text: string;
	rtl: boolean;
	frame: number;
	startFrame: number;
	endFrame: number;
	label: string;
	lang: string;
	panelWidth: number;
}> = ({text, rtl, frame, startFrame, endFrame, label, lang, panelWidth}) => {
	const {fps} = useVideoConfig();

	const localFrame = Math.max(0, frame - startFrame);
	const duration = endFrame - startFrame;

	const panelProgress = spring({
		fps,
		frame: localFrame,
		config: {mass: 0.8, damping: 12, stiffness: 80},
	});
	const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

	// Scroll: LTR starts right, moves left. RTL starts left, moves right.
	const scrollStart = rtl ? -TEXT_TRAVEL : panelWidth * 0.5;
	const scrollEnd = rtl ? panelWidth * 0.5 : -TEXT_TRAVEL;
	const scrollX = interpolate(frame, [startFrame + 5, endFrame], [scrollStart, scrollEnd], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const labelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 16,
				opacity: frame >= startFrame && frame <= endFrame + 5 ? 1 : 0,
			}}
		>
			{/* Language label + badge */}
			<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: labelOpacity}}>
				<div
					style={{
						color: ACCENT_PEACH,
						fontSize: 20,
						fontWeight: 600,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.10em',
						textTransform: 'uppercase',
					}}
				>
					{label}
				</div>
				<div
					style={{
						background: rtl ? 'rgba(255,203,164,0.15)' : 'rgba(164,203,255,0.15)',
						border: `1px solid ${rtl ? 'rgba(255,203,164,0.4)' : 'rgba(164,203,255,0.4)'}`,
						borderRadius: 6,
						padding: '3px 10px',
						color: rtl ? ACCENT_PEACH : 'rgba(164,203,255,0.9)',
						fontSize: 13,
						fontWeight: 600,
						fontFamily: FONT_FAMILY,
						letterSpacing: '0.08em',
					}}
				>
					{lang}
				</div>
			</div>

			{/* Scrolling panel */}
			<div
				style={{
					width: panelWidth,
					height: 90,
					backgroundColor: GLASS_BG,
					border: GLASS_BORDER,
					boxShadow: GLASS_SHADOW,
					backdropFilter: BLUR_RADIUS,
					WebkitBackdropFilter: BLUR_RADIUS,
					borderRadius: BORDER_RADIUS_CARD,
					overflow: 'hidden',
					opacity: panelOpacity,
					display: 'flex',
					alignItems: 'center',
					position: 'relative',
				}}
			>
				{/* Left fade */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: 80,
						height: '100%',
						background: `linear-gradient(to right, ${GLASS_BG}, transparent)`,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>
				{/* Right fade */}
				<div
					style={{
						position: 'absolute',
						right: 0,
						top: 0,
						width: 80,
						height: '100%',
						background: `linear-gradient(to left, ${GLASS_BG}, transparent)`,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>
				<div
					style={{
						transform: `translateX(${scrollX}px)`,
						whiteSpace: 'nowrap',
						fontFamily: FONT_FAMILY,
						fontSize: 36,
						letterSpacing: '0.02em',
						paddingLeft: 40,
						color: 'rgba(255,255,255,0.92)',
						direction: rtl ? 'rtl' : 'ltr',
					}}
				>
					{text}
				</div>
			</div>

			<div
				style={{
					color: TEXT_MUTED,
					fontSize: 15,
					fontFamily: FONT_FAMILY,
					opacity: labelOpacity,
				}}
			>
				{rtl ? 'Right-to-left · Anchor Reading' : 'Left-to-right · Anchor Reading'}
			</div>
		</div>
	);
};

export const InternationalDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const panelWidth = width * PANEL_WIDTH_RATIO;

	const titleProgress = spring({
		fps: 30,
		frame,
		config: {mass: 0.8, damping: 14, stiffness: 70},
	});

	const showJapanese = frame < JP_END + 10;
	const showArabic = frame >= JP_END - 5;

	return (
		<AbsoluteFill
			style={{
				background: BG_GRADIENT,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 48,
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
					opacity: interpolate(titleProgress, [0, 1], [0, 1]),
				}}
			>
				International Support
			</div>

			{showJapanese && (
				<ScrollPanel
					text={JAPANESE}
					rtl={false}
					frame={frame}
					startFrame={0}
					endFrame={JP_END}
					label="日本語"
					lang="LTR"
					panelWidth={panelWidth}
				/>
			)}

			{showArabic && (
				<ScrollPanel
					text={ARABIC}
					rtl={true}
					frame={frame}
					startFrame={JP_END}
					endFrame={105}
					label="العربية"
					lang="RTL"
					panelWidth={panelWidth}
				/>
			)}
		</AbsoluteFill>
	);
};
