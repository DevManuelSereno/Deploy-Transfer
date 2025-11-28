"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormBooleanButtonProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"onChange" | "value"
	> {
	value: boolean;
	onChange: (value: boolean) => void;
}

export const FormBooleanButton = React.forwardRef<
	HTMLButtonElement,
	FormBooleanButtonProps
>(({ value, onChange, className, disabled, ...props }, ref) => {
	return (
		<Button
			ref={ref}
			type="button"
			onClick={() => !disabled && onChange(!value)}
			disabled={disabled}
			variant="ghost"
			className={cn(
				"h-9 px-3 min-w-14 border border-input text-xs font-medium transition-all",
				!value &&
					"bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
				value &&
					"bg-primary text-primary-foreground hover:bg-primary/90 border-primary",

				className,
			)}
			{...props}
		>
			<div className="flex items-center justify-center gap-1.5">
				{value && (
					<Check
						className="h-3.5 w-3.5 animate-in fade-in zoom-in duration-200"
						strokeWidth={3}
					/>
				)}
				<span>{value ? "Sim" : "Não"}</span>
			</div>
		</Button>
	);
});

FormBooleanButton.displayName = "FormBooleanButton";
