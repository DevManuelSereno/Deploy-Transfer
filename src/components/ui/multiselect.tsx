"use client";

import { type Command as CommandPrimitive, useCommandState } from "cmdk";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

export interface Option {
	value: string;
	label: string;
	disable?: boolean;
	/** fixed option that can't be removed. */
	fixed?: boolean;
	/** Group the options by providing key. */
	[key: string]: string | boolean | undefined;
}
interface GroupOption {
	[key: string]: Option[];
}

export interface MultipleSelectorProps {
	value?: Option[];
	defaultOptions?: Option[];
	/** manually controlled options */
	options?: Option[];
	placeholder?: string;
	/** Loading component. */
	loadingIndicator?: React.ReactNode;
	/** Empty component. */
	emptyIndicator?: React.ReactNode;
	/** Debounce time for async search. Only work with `onSearch`. */
	delay?: number;
	/**
	 * Only work with `onSearch` prop. Trigger search when `onFocus`.
	 * For example, when user click on the input, it will trigger the search to get initial options.
	 **/
	triggerSearchOnFocus?: boolean;
	/** async search */
	onSearch?: (value: string) => Promise<Option[]>;
	/**
	 * sync search. This search will not showing loadingIndicator.
	 * The rest props are the same as async search.
	 * i.e.: creatable, groupBy, delay.
	 **/
	onSearchSync?: (value: string) => Option[];
	onChange?: (options: Option[]) => void;
	/** Limit the maximum number of selected options. */
	maxSelected?: number;
	/** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
	onMaxSelected?: (maxLimit: number) => void;
	/** Hide the placeholder when there are options selected. */
	hidePlaceholderWhenSelected?: boolean;
	disabled?: boolean;
	/** Group the options base on provided key. */
	groupBy?: string;
	className?: string;
	badgeClassName?: string;
	/**
	 * First item selected is a default behavior by cmdk. That is why the default is true.
	 * This is a workaround solution by add a dummy item.
	 *
	 * @reference: https://github.com/pacocoursey/cmdk/issues/171
	 */
	selectFirstItem?: boolean;
	/** Allow user to create option when there is no option matched. */
	creatable?: boolean;
	/** Props of `Command` */
	commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
	/** Props of `CommandInput` */
	inputProps?: Omit<
		React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
		"value" | "disabled"
	>;
	buttonProps?: React.ComponentPropsWithoutRef<"button">;
	/** hide the clear all button. */
	hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
	selectedValue: Option[];
	input: HTMLInputElement;
	focus: () => void;
	reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
	if (options.length === 0) {
		return {};
	}
	if (!groupBy) {
		return {
			"": options,
		};
	}

	const groupOption: GroupOption = {};
	options.forEach((option) => {
		const key = (option[groupBy] as string) || "";
		if (!groupOption[key]) {
			groupOption[key] = [];
		}
		groupOption[key].push(option);
	});
	return groupOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
	for (const [, value] of Object.entries(groupOption)) {
		if (
			value.some((option) => targetOption.find((p) => p.value === option.value))
		) {
			return true;
		}
	}
	return false;
}

const CommandEmpty = ({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
	const render = useCommandState((state) => state.filtered.count === 0);

	if (!render) return null;

	return (
		<div
			className={cn("px-2 py-4 text-center text-sm", className)}
			cmdk-empty=""
			role="presentation"
			{...props}
		/>
	);
};

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = ({
	value,
	onChange,
	placeholder,
	defaultOptions: arrayDefaultOptions = [],
	options: arrayOptions,
	delay,
	onSearch,
	onSearchSync,
	loadingIndicator,
	emptyIndicator,
	maxSelected = Number.MAX_SAFE_INTEGER,
	onMaxSelected,
	disabled,
	groupBy,
	className,
	badgeClassName,
	selectFirstItem = true,
	creatable = false,
	triggerSearchOnFocus = false,
	commandProps,
	inputProps,
	hideClearAllButton = false,
	buttonProps,
}: MultipleSelectorProps) => {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null); // Added this

	const [selected, setSelected] = React.useState<Option[]>(value || []);
	const [options, setOptions] = React.useState<GroupOption>(
		transToGroupOption(arrayDefaultOptions, groupBy),
	);
	const [inputValue, setInputValue] = React.useState("");
	const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

	const handleClickOutside = (event: MouseEvent | TouchEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node) &&
			inputRef.current &&
			!inputRef.current.contains(event.target as Node)
		) {
			setOpen(false);
			inputRef.current.blur();
		}
	};

	const handleUnselect = React.useCallback(
		(option: Option) => {
			const newOptions = selected.filter((s) => s.value !== option.value);
			setSelected(newOptions);
			onChange?.(newOptions);
		},
		[onChange, selected],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "" && selected.length > 0) {
						const lastSelectOption = selected[selected.length - 1];
						// If last item is fixed, we should not remove it.
						if (!lastSelectOption.fixed) {
							handleUnselect(selected[selected.length - 1]);
						}
					}
				}
				// This is not a default behavior of the <input /> field
				if (e.key === "Escape") {
					input.blur();
				}
			}
		},
		[handleUnselect, selected],
	);

	useEffect(() => {
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchend", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		};
	}, [open]);

	useEffect(() => {
		if (value) {
			setSelected(value);
		}
	}, [value]);

	useEffect(() => {
		/** If `onSearch` is provided, do not trigger options updated. */
		if (!arrayOptions || onSearch) {
			return;
		}
		const newOption = transToGroupOption(arrayOptions || [], groupBy);
		if (JSON.stringify(newOption) !== JSON.stringify(options)) {
			setOptions(newOption);
		}
	}, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

	useEffect(() => {
		/** sync search */

		const doSearchSync = () => {
			const res = onSearchSync?.(debouncedSearchTerm);
			setOptions(transToGroupOption(res || [], groupBy));
		};

		const exec = async () => {
			if (!onSearchSync || !open) return;

			if (triggerSearchOnFocus) {
				doSearchSync();
			}

			if (debouncedSearchTerm) {
				doSearchSync();
			}
		};

		void exec();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

	useEffect(() => {
		/** async search */

		const doSearch = async () => {
			setIsLoading(true);
			const res = await onSearch?.(debouncedSearchTerm);
			setOptions(transToGroupOption(res || [], groupBy));
			setIsLoading(false);
		};

		const exec = async () => {
			if (!onSearch || !open) return;

			if (triggerSearchOnFocus) {
				await doSearch();
			}

			if (debouncedSearchTerm) {
				await doSearch();
			}
		};

		void exec();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

	const CreatableItem = () => {
		if (!creatable) return undefined;
		if (
			isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
			selected.find((s) => s.value === inputValue)
		) {
			return undefined;
		}

		const Item = (
			<CommandItem
				value={inputValue}
				className="cursor-pointer m-1"
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onSelect={(value: string) => {
					if (selected.length >= maxSelected) {
						onMaxSelected?.(selected.length);
						return;
					}
					setInputValue("");
					const newOptions = [...selected, { value, label: value }];
					setSelected(newOptions);
					onChange?.(newOptions);
				}}
			>
				{`Criar "${inputValue}"`}
			</CommandItem>
		);

		// For normal creatable
		if (!onSearch && inputValue.length > 0) {
			return Item;
		}

		// For async search creatable. avoid showing creatable item before loading at first.
		if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
			return Item;
		}

		return undefined;
	};

	const EmptyItem = React.useCallback(() => {
		if (!emptyIndicator) return undefined;

		// For async search that showing emptyIndicator
		if (onSearch && !creatable && Object.keys(options).length === 0) {
			return (
				<CommandItem value="-" disabled>
					{emptyIndicator}
				</CommandItem>
			);
		}

		return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
	}, [creatable, emptyIndicator, onSearch, options]);

	const selectables = React.useMemo<GroupOption>(() => options, [options]);

	/** Avoid Creatable Selector freezing or lagging when paste a long string. */
	const commandFilter = React.useCallback(() => {
		if (commandProps?.filter) {
			return commandProps.filter;
		}

		if (creatable) {
			return (value: string, search: string) => {
				return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
			};
		}
		// Using default filter in `cmdk`. We don&lsquo;t have to provide it.
		return undefined;
	}, [creatable, commandProps?.filter]);

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className={cn(
						"border bg-background border-input w-full justify-between truncate h-10 px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
						{
							"pl-1! py-0!": selected.length !== 0,
						},
						className,
						buttonProps?.className,
					)}
					disabled={disabled}
					{...buttonProps}
				>
					{selected.length > 0 ? (
						<ScrollArea
							viewportClassName="flex items-center"
							className="h-full"
						>
							<div className="relative flex items-center text-nowrap gap-1">
								{selected.map((option) => {
									return (
										<div
											key={option.value}
											className={cn(
												"animate-fadeIn bg-background dark:bg-input/30 dark:border-input text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-pointer items-center rounded-sm border ps-2 pe-7 pl-2 text-xs font-medium transition-all capitalize disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2",
												badgeClassName,
											)}
											data-fixed={option.fixed}
											data-disabled={disabled || undefined}
										>
											{option.label}
											<div
												className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center cursor-pointer justify-center rounded-e-md border border-transparent p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleUnselect(option);
													}
												}}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												onClick={(e) => {
													handleUnselect(option);
													e.stopPropagation();
												}}
												aria-label="Remove"
											>
												<XIcon size={14} aria-hidden="true" />
											</div>
										</div>
									);
								})}
							</div>
							<ScrollBar
								onClick={(e) => e.stopPropagation()}
								orientation="horizontal"
								className="h-1.5 pb-0 hover:bg-inherit dark:hover:bg-inherit"
							/>
						</ScrollArea>
					) : (
						<span className="font-normal text-muted-foreground">
							{placeholder}
						</span>
					)}

					<ChevronDown className="text-muted-foreground ml-auto" />
				</Button>
				{/* <div
          className={cn(
            //buttonVariants({variant: "outline" }),
            "bg-background! h-10 justify-start data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            {
              "pl-1! py-0!": selected.length !== 0,
            },
            //!hideClearAllButton && "pe-9",
            //className,
            "border-red-800"
          )}
          data-disabled={disabled}
        >

        </div> */}
			</PopoverTrigger>
			<PopoverContent
				className="w-full min-w-[var(--radix-popper-anchor-width)] p-0"
				sideOffset={6}
			>
				<Command
					ref={dropdownRef}
					{...commandProps}
					onKeyDown={(e) => {
						handleKeyDown(e);
						commandProps?.onKeyDown?.(e);
					}}
					className={cn("bg-background", commandProps?.className)}
					shouldFilter={
						commandProps?.shouldFilter !== undefined
							? commandProps.shouldFilter
							: !onSearch
					} // When onSearch is provided, we don&lsquo;t want to filter the options. You can still override it.
					filter={commandFilter()}
				>
					<CommandInput
						{...inputProps}
						ref={inputRef}
						value={inputValue}
						disabled={disabled}
						onValueChange={(value) => {
							setInputValue(value);
							inputProps?.onValueChange?.(value);
						}}
						onBlur={(event) => {
							inputProps?.onBlur?.(event);
						}}
						onFocus={(event) => {
							if (triggerSearchOnFocus) {
								onSearch?.(debouncedSearchTerm);
							}
							inputProps?.onFocus?.(event);
						}}
						showIcon={!creatable}
						placeholder={inputProps?.placeholder}
						className={cn(
							"placeholder:text-muted-foreground w-full",
							inputProps?.className,
						)}
					/>
					<ScrollArea className="max-h-full flex flex-col">
						<CommandList className="overflow-visible flex-1">
							{isLoading ? (
								<>{loadingIndicator}</>
							) : (
								<>
									{EmptyItem()}
									{CreatableItem()}

									{!selectFirstItem && (
										<CommandItem value="-" className="hidden" />
									)}
									{Object.entries(selectables).map(([key, dropdowns]) => (
										<CommandGroup
											key={key}
											heading={key}
											className={cn(creatable && "border-b")}
										>
											<>
												{dropdowns.map((option) => {
													const isSelected = selected.some(
														(s) => s.value === option.value,
													);

													return (
														<CommandItem
															key={option.value}
															value={option.label}
															disabled={option.disable}
															onMouseDown={(e) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onSelect={() => {
																if (selected.length >= maxSelected) {
																	onMaxSelected?.(selected.length);
																	return;
																}
																setInputValue("");
																const newOptions = isSelected
																	? selected.filter(
																			(s) => s.value !== option.value,
																		)
																	: [...selected, option];
																setSelected(newOptions);
																onChange?.(newOptions);
															}}
															className={cn(
																"cursor-pointer flex items-center justify-between",
																option.disable &&
																	"pointer-events-none cursor-not-allowed opacity-50",
															)}
														>
															<span>{option.label}</span>
															{isSelected && <CheckIcon />}
														</CommandItem>
													);
												})}
											</>
										</CommandGroup>
									))}
								</>
							)}
						</CommandList>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
