"use client";

import { FileText, Fuel, Info, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormVehicleData } from "@/app/[locale]/vehicle/components/form/form-vehicle-data";
import { FormDocumentation } from "@/app/[locale]/vehicle/components/form/form-vehicle-documentation";
import { FormFueling } from "@/app/[locale]/vehicle/components/form/form-vehicle-fueling";
import { FormOccurrence } from "@/app/[locale]/vehicle/components/form/form-vehicle-occurrence";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { ScrollArea } from "@/components/ui/scroll-area";
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

	const handleTabChange = (newValue: string) => {
		setTabPanel(newValue as any);
	};

	return (
		<Tabs
			defaultValue="tab-general-data"
			className="flex flex-col flex-1 overflow-y-hidden"
			value={tabPanel as any}
			onValueChange={handleTabChange as any}
		>
			<div className="border-b overflow-x-auto min-h-10">
				<TabsList
					className={cn(
						"inline-flex w-fit items-center justify-center text-foreground",
						"h-auto gap-2 rounded-none bg-transparent px-6 py-1",
					)}
				>
					<TabsTrigger
						value="tab-general-data"
						className={cn(
							"shrink-0",
							"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
							"after:-mb-1.5 after:h-0.75 after:rounded-t",
						)}
					>
						<Info />
						{t("generalData")}
					</TabsTrigger>
					<TabsTrigger
						value="tab-documentation"
						className={cn(
							"shrink-0",
							"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
							"after:-mb-1.5 after:h-0.75 after:rounded-t",
						)}
					>
						<FileText />
						{t("documentation")}
					</TabsTrigger>
					<TabsTrigger
						value="tab-fueling"
						className={cn(
							"shrink-0",
							"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
							"after:-mb-1.5 after:h-0.75 after:rounded-t",
						)}
					>
						<Fuel />
						{t("fueling")}
					</TabsTrigger>
					<TabsTrigger
						value="tab-occurrence"
						className={cn(
							"shrink-0",
							"data-[state=active]:after:bg-primary after:absolute after:inset-x-0 after:bottom-0",
							"after:-mb-1.5 after:h-0.75 after:rounded-t",
						)}
					>
						<TriangleAlert />
						{t("occurrence")}
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContents className="flex-1 overflow-y-auto">
				<TabsContent value="tab-general-data" id="tab-general-data">
					<FormVehicleData />
				</TabsContent>
				<TabsContent id="tab-documentation" value="tab-documentation">
					<FormDocumentation />
				</TabsContent>
				<TabsContent id="tab-fueling" value="tab-fueling">
					<FormFueling />
				</TabsContent>
				<TabsContent id="tab-occurrence" value="tab-occurrence">
					<FormOccurrence />
				</TabsContent>
			</TabsContents>
		</Tabs>
	);
}
