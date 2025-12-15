"use client";

import {
	type MotionValue,
	motion,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const padding = 8;

export function AnimatedCounter({
	value,
	fontSize,
	className = "",
}: {
	value: number;
	fontSize?: number;
	className?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [measuredFontSize, setMeasuredFontSize] = useState<number | null>(null);

	useEffect(() => {
		if (!fontSize && containerRef.current) {
			const fs = parseFloat(
				getComputedStyle(containerRef.current).fontSize || "0",
			);
			if (fs > 0) setMeasuredFontSize(fs);
		}
	}, [fontSize]);

	const effectiveFontSize = fontSize ?? measuredFontSize ?? 24;
	const height = effectiveFontSize + padding;

	const digitsCount = useMemo(() => {
		const v = Math.max(0, Math.floor(value));
		return Math.max(1, String(v).length);
	}, [value]);

	const places = useMemo(() => {
		return Array.from(
			{ length: digitsCount },
			(_, i) => 10 ** (digitsCount - i - 1),
		);
	}, [digitsCount]);

	return (
		<div
			ref={containerRef}
			className={["flex space-x-0 overflow-hidden leading-none", className]
				.filter(Boolean)
				.join(" ")}
		>
			{places.map((place) => (
				<Digit key={place} place={place} value={value} height={height} />
			))}
		</div>
	);
}

function Digit({
	place,
	value,
	height,
}: {
	place: number;
	value: number;
	height: number;
}) {
	const valueRoundedToPlace = Math.floor(value / place);
	const animatedValue = useSpring(valueRoundedToPlace);

	useEffect(() => {
		animatedValue.set(valueRoundedToPlace);
	}, [animatedValue, valueRoundedToPlace]);

	return <DigitColumn height={height} animatedValue={animatedValue} />;
}

function DigitColumn({
	height,
	animatedValue,
}: {
	height: number;
	animatedValue: MotionValue;
}) {
	return (
		<div style={{ height }} className="relative w-[0.9ch] normal-nums">
			{[...Array(10).keys()].map((i) => (
				<NumberComp key={i} mv={animatedValue} number={i} height={height} />
			))}
		</div>
	);
}

function NumberComp({
	mv,
	number,
	height,
}: {
	mv: MotionValue;
	number: number;
	height: number;
}) {
	const y = useTransform(mv, (latest) => {
		const placeValue = latest % 10;
		const offset = (10 + number - placeValue) % 10;

		let memo = offset * height;

		if (offset > 5) {
			memo -= 10 * height;
		}

		return memo;
	});

	return (
		<motion.span
			style={{ y }}
			className="absolute inset-0 flex items-center justify-center"
		>
			{number}
		</motion.span>
	);
}
