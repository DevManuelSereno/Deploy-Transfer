"use client";

import { useCallback, useState } from "react";

interface UseSliderInputProps {
	minValue: number;
	maxValue: number;
	initialValue: [number, number];
	onFilterChange?: (values: [number, number]) => void;
}

export function useSliderInput({
	minValue,
	maxValue,
	initialValue,
	onFilterChange,
}: UseSliderInputProps) {
	const [sliderValues, setSliderValues] =
		useState<[number, number]>(initialValue);
	const [inputValues, setInputValues] =
		useState<[number, number]>(initialValue);

	// Handle slider changes and sync with input values
	const handleSliderChange = useCallback((values: [number, number]) => {
		setSliderValues(values);
		setInputValues(values);
	}, []);

	const handleInputChange = useCallback(
		(value: number, index: 0 | 1) => {
			if (!Number.isNaN(value)) {
				const updatedInputs = [...inputValues] as [number, number];
				updatedInputs[index] = value;

				// Validate the value immediately
				const validatedValue =
					index === 0
						? Math.max(minValue, Math.min(value, inputValues[1]))
						: Math.min(maxValue, Math.max(value, inputValues[0]));

				updatedInputs[index] = validatedValue;

				setInputValues(updatedInputs);
				setSliderValues(updatedInputs);

				// Trigger filter change immediately
				onFilterChange?.(updatedInputs);
			}
		},
		[inputValues, minValue, maxValue, onFilterChange],
	);

	// Validate and update slider values when input loses focus or user presses Enter
	const validateAndUpdateValue = useCallback(
		(value: number, index: 0 | 1) => {
			const updatedSlider = [...sliderValues] as [number, number];

			if (index === 0) {
				// Min value
				updatedSlider[0] = Math.max(minValue, Math.min(value, sliderValues[1]));
			} else {
				// Max value
				updatedSlider[1] = Math.min(maxValue, Math.max(value, sliderValues[0]));
			}

			setSliderValues(updatedSlider);
			setInputValues(updatedSlider);
		},
		[sliderValues, minValue, maxValue],
	);

	return {
		setSliderValues,
		setInputValues,
		sliderValues,
		inputValues,
		handleSliderChange,
		handleInputChange,
		validateAndUpdateValue,
	};
}
