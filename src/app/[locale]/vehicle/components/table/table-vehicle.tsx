"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, CloudDownload, RotateCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ModalDeleteVehicle } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle";
import { ModalTableVehicle } from "@/app/[locale]/vehicle/components/modal/modal-table-vehicle";
import TabsVehicle from "@/app/[locale]/vehicle/components/tabs/tabs-vehicle";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { Separator } from "@/components/ui/separator";
import { getData } from "@/lib/functions.api";
import { cn } from "@/lib/utils";
import {
	getVehicleColumns,
	type VehicleColumnActions,
} from "../columns/columns-table-vehicle";

export default function TableVehicle() {
	const { setEditingVehicle } = useVehicleFormContext();
	const { isModalEditOpen, setIsModalEditOpen, setTabPanel } =
		useModalContext();

	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const openEditModal = useCallback(
		(vehicle: VehicleData) => {
			setEditingVehicle(vehicle);
			setTabPanel("tab-general-data");
			setIsModalEditOpen(true);
		},
		[setEditingVehicle, setTabPanel, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(vehicle?: VehicleData) => {
			setEditingVehicle(vehicle);
			setIsModalDeleteOpen(true);
		},
		[setEditingVehicle],
	);

	const actions: VehicleColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getVehicleColumns(actions), [actions]);

	const { data: dataVehicle, isLoading } = useQuery({
		queryKey: ["vehicle-get"],
		queryFn: ({ signal }) =>
			getData<VehicleData[]>({
				url: "/vehicle",
				signal,
				query:
					"include.classification=true&include.category=true" +
					"&&include.brand=true&&include.company&&include.status=true",
			}),
	});
	return (
		<div className="flex flex-1 flex-col gap-6">
			<Card
				className={cn(
					"rounded-[14px] p-0 gap-0 overflow-hidden shadow-custom! border dark:border-[#262626]",
					"max-h-[calc(100dvh-var(--header-height))] md:max-h-[calc(100dvh-var(--header-height)-3rem)]",
					"min-[56rem]:max-h-[calc(100dvh-var(--header-height)-4rem)] dark:shadow-none",
				)}
			>
				<DataTable
					columns={columns}
					loading={isLoading}
					data={dataVehicle ?? []}
					topLeftActions={(table) => <DataTableToolbar table={table} />}
					topRightActions={
						<div className="flex items-center gap-2">
							<Button variant="outline">
								<RotateCw />
								Atualizar
							</Button>
							<ButtonGroup>
								<Button variant="outline">
									<CloudDownload />
									Export
								</Button>
								<Button variant="outline" size="icon">
									<ChevronDown />
								</Button>
							</ButtonGroup>
							<Separator
								orientation="vertical"
								className="data-[orientation=vertical]:w-px data-[orientation=vertical]:h-4 mx-0.5"
							/>
							<ModalTableVehicle
								open={isModalEditOpen}
								setOpen={setIsModalEditOpen}
							>
								<TabsVehicle />
							</ModalTableVehicle>
						</div>
					}
				/>
				<ModalDeleteVehicle
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
