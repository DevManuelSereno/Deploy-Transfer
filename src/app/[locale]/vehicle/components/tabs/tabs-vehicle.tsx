"use client";

import { FileText, Fuel, Info, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormVehiclePassData } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-data";
import { FormDocumentation } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-documentation";
import { FormGasSupply } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-gas-supply";
import { FormOccurrence } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-occurrence";
import { useModalContextPass } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
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
	const { tabPanel, setTabPanel } = useModalContextPass();

	const handleTabChange = (newValue: string) => {
		setTabPanel(newValue as any);
	};

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
				>
					<TriangleAlert />
					{t("occurrence")}
				</TabsTrigger>
			</TabsList>
			<TabsContents className="flex-1 overflow-y-auto">
				<TabsContent value="tab-general-data" id="tab-general-data">
					<FormVehiclePassData />
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
