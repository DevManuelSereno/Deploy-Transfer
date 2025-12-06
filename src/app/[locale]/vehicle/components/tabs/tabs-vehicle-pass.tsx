/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { FormVehiclePassData } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-data";
import { useModalContextPass } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
import { useVehiclePassFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function TabsVehiclePass() {
	const t = useTranslations("VehiclePage.Tabs");
	const { tabPanel, setTabPanel } = useModalContextPass();
	const { editingVehicle } = useVehiclePassFormContext();

	const scrollToTab = (tab: string) => {
		const tabElement = document.getElementById(tab);
		if (tabElement) {
			tabElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleTabChange = (newValue: string) => {
		if (!editingVehicle?.IDV && newValue !== "tab-general-data") {
			toast.error(t("addDataFirstMessage"));
		} else {
			// scrollToTab(newValue);
			setTabPanel(newValue as any);
		}
	};

	useEffect(() => {
		if (!editingVehicle?.IDV && tabPanel !== "tab-general-data") {
			// Use setTimeout to avoIDV state update during render
			const timeout = setTimeout(() => {
				setTabPanel("tab-general-data");
			}, 0);
			return () => clearTimeout(timeout);
		}
	}, [editingVehicle, tabPanel, setTabPanel]);

	return (
		<Tabs
			defaultValue="tab-general-data"
			className="flex flex-col flex-1 overflow-hidden"
			value={tabPanel as any}
			onValueChange={handleTabChange as any}
		>
			<TabsList
				className={cn(
					"inline-flex w-fit items-center justify-center p-[3px] text-foreground",
					"h-auto gap-2 rounded-none bg-transparent px-6 py-1 flex-shrink-0",
				)}
			>
				<TabsTrigger
					value="tab-general-data"
					className={cn(
						"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
						"after:-mb-1.5 after:h-[3px] after:rounded-t",
					)}
				>
					<Info />
					{t("generalData")}
				</TabsTrigger>
			</TabsList>
			<TabsContents className="flex-1 overflow-y-auto">
				<TabsContent value="tab-general-data" id="tab-general-data">
					<FormVehiclePassData />
				</TabsContent>
			</TabsContents>
		</Tabs>
	);
}
