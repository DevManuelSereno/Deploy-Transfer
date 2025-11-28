"use client";

import { Globe, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function LanguageToggle() {
	const [selectedLanguage, setSelectedLanguage] =
		React.useState<string>("portuguese");

	const handleLanguageChange = (language: string) => {
		setSelectedLanguage(language);
	};

	return (
		<Select value={selectedLanguage} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-fit rounded-full border-none hover:bg-input/30">
				<Globe />
				{selectedLanguage === "portuguese" ? "Português" : null}
				{selectedLanguage === "english" ? "Inglês" : null}
				{selectedLanguage === "spanish" ? "Espanhol" : null}
			</SelectTrigger>
			<SelectContent className="bg-background">
				<SelectItem value="portuguese">Português</SelectItem>
				<SelectItem value="english">Inglês</SelectItem>
				<SelectItem value="spanish">Espanhol</SelectItem>
			</SelectContent>
		</Select>
	);
}
