import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Button } from "./button";
import { Input } from "./input";

export type NumberInputProps = Omit<
	NumericFormatProps,
	"value" | "onValueChange"
> & {
	stepper?: number;
	thousandSeparator?: string;
	placeholder?: string;
	defaultValue?: number;
	min?: number;
	max?: number;
	value?: number; // Controlled value
	suffix?: string;
	prefix?: string;
	/** callback used by some integrations (kept for compatibility) */
	onValueChange?: (value: number | undefined) => void;
	/** callback used by React Hook Form Controller (field.onChange) */
	onChange?: (value: number | undefined) => void;
	fixedDecimalScale?: boolean;
	decimalScale?: number;
};

export const InputNumber = forwardRef<HTMLInputElement, NumberInputProps>(
	(
		{
			stepper,
			thousandSeparator,
			placeholder,
			defaultValue,
			min = -Infinity,
			max = Infinity,
			onValueChange,
			onChange, // note: Controller provides field.onChange here
			fixedDecimalScale = false,
			decimalScale = 0,
			suffix,
			prefix,
			value: controlledValue,
			...props
		},
		ref,
	) => {
		// Keep numeric state internally but always notify external handlers
		const [value, setValue] = useState<number | undefined>(
			controlledValue ?? defaultValue,
		);

		// Sync controlled value -> internal
		useEffect(() => {
			if (controlledValue !== undefined) {
				setValue(controlledValue);
			}
		}, [controlledValue]);

		// Helper to notify both callbacks
		const notifyValueChange = useCallback(
			(newValue: number | undefined) => {
				// update internal state (if uncontrolled)
				if (controlledValue === undefined) {
					setValue(newValue);
				}
				// call both callbacks if provided
				onValueChange?.(newValue);
				onChange?.(newValue);
			},
			[controlledValue, onValueChange, onChange],
		);

		const handleIncrement = useCallback(() => {
			const next =
				value === undefined
					? (stepper ?? 1)
					: Math.min(value + (stepper ?? 1), max);
			notifyValueChange(next);
		}, [value, stepper, max, notifyValueChange]);

		const handleDecrement = useCallback(() => {
			const next =
				value === undefined
					? -(stepper ?? 1)
					: Math.max(value - (stepper ?? 1), min);
			notifyValueChange(next);
		}, [value, stepper, min, notifyValueChange]);

		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				// guard ref type
				const inputEl = (ref as React.RefObject<HTMLInputElement>).current;
				if (!inputEl) return;
				if (document.activeElement === inputEl) {
					if (e.key === "ArrowUp") {
						e.preventDefault();
						handleIncrement();
					} else if (e.key === "ArrowDown") {
						e.preventDefault();
						handleDecrement();
					}
				}
			};

			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [handleIncrement, handleDecrement, ref]);

		const handleChange = (values: {
			value: string;
			floatValue: number | undefined;
		}) => {
			const newValue =
				values.floatValue === undefined ? undefined : values.floatValue;
			// update state and notify RHF (and any other handler)
			notifyValueChange(newValue);
		};

		const handleBlur = () => {
			if (value !== undefined) {
				if (value < min) {
					notifyValueChange(min);
					const el = (ref as React.RefObject<HTMLInputElement>).current;
					if (el) el.value = String(min);
				} else if (value > max) {
					notifyValueChange(max);
					const el = (ref as React.RefObject<HTMLInputElement>).current;
					if (el) el.value = String(max);
				}
			}
			// also forward possible onBlur passed via props
			if (props.onBlur) props.onBlur(new Event("blur") as unknown as any);
		};

		return (
			<div className="flex items-center">
				<NumericFormat
					value={value}
					onValueChange={handleChange}
					thousandSeparator={thousandSeparator}
					decimalScale={decimalScale}
					fixedDecimalScale={fixedDecimalScale}
					allowNegative={min < 0}
					valueIsNumericString={false}
					onBlur={handleBlur}
					max={max}
					min={min}
					suffix={suffix}
					prefix={prefix}
					customInput={Input}
					placeholder={placeholder}
					className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative"
					getInputRef={ref}
					{...props}
				/>

				<div className="flex flex-col">
					<Button
						aria-label="Increase value"
						className="px-2 h-4 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px] focus-visible:relative"
						variant="outline"
						onClick={handleIncrement}
						type="button"
						disabled={value === max}
					>
						<ChevronUp size={15} />
					</Button>
					<Button
						aria-label="Decrease value"
						className="px-2 h-4 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px] focus-visible:relative"
						variant="outline"
						onClick={handleDecrement}
						type="button"
						disabled={value === min}
					>
						<ChevronDown size={15} />
					</Button>
				</div>
			</div>
		);
	},
);

InputNumber.displayName = "NumberInput";
