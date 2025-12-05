"use client";

import { FileText, Fuel, Info, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { FormDocumentation } from "@/app/[locale]/vehicle/components/form/form-documentation";
import { FormGasSupply } from "@/app/[locale]/vehicle/components/form/form-gas-supply";
import { FormOccurrence } from "@/app/[locale]/vehicle/components/form/form-occurrence";
import { FormVehicleData } from "@/app/[locale]/vehicle/components/form/form-vehicle-data";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function TabsVehicle() {
	const t = useTranslations("VehiclePage.Tabs");
	const { tabPanel, setTabPanel } = useModalContext();
	const { editingVehicle } = useVehicleFormContext();

	const scrollToTab = (tab: string) => {
		const tabElement = document.getElementById(tab);
		if (tabElement) {
			tabElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleTabChange = (newValue: string) => {
		if (!editingVehicle?.id && newValue !== "tab-general-data") {
			toast.error(t("addDataFirstMessage"));
		} else {
			// scrollToTab(newValue);
			setTabPanel(newValue as any);
		}
	};

	useEffect(() => {
		if (!editingVehicle?.id && tabPanel !== "tab-general-data") {
			// Use setTimeout to avoid state update during render
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
				<TabsTrigger
					value="tab-documentation"
					className={cn(
						"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
						"after:-mb-1.5 after:h-[3px] after:rounded-t",
					)}
					disabled={!editingVehicle?.id}
				>
					<FileText />
					{t("documentation")}
				</TabsTrigger>
				<TabsTrigger
					value="tab-gas-supply"
					className={cn(
						"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
						"after:-mb-1.5 after:h-[3px] after:rounded-t",
					)}
					disabled={!editingVehicle?.id}
				>
					<Fuel />
					{t("gasSupply")}
				</TabsTrigger>
				<TabsTrigger
					value="tab-occurrence"
					className={cn(
						"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
						"after:-mb-1.5 after:h-[3px] after:rounded-t",
					)}
					disabled={!editingVehicle?.id}
				>
					<TriangleAlert />
					{t("occurrence")}
				</TabsTrigger>
			</TabsList>
			<TabsContents className="flex-1 overflow-y-auto">
				<TabsContent value="tab-general-data" id="tab-general-data">
					<FormVehicleData />
				</TabsContent>
				<TabsContent id="tab-documentation" value="tab-documentation">
					<FormDocumentation />
				</TabsContent>
				<TabsContent id="tab-gas-supply" value="tab-gas-supply">
					<FormGasSupply />
				</TabsContent>
				<TabsContent id="tab-occurrence" value="tab-occurrence">
					<FormOccurrence />
				</TabsContent>
			</TabsContents>
		</Tabs>
	);
}
