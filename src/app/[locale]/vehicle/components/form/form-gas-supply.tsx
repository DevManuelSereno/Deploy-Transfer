"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
	type GasSupplyColumnActions,
	getGasSupplyColumns,
} from "@/app/[locale]/vehicle/components/columns/columns-table-gas-supply";
import { ModalDeleteGasSupply } from "@/app/[locale]/vehicle/components/modal/modal-delete-gas-supply";
import { ModalFormGasSupply } from "@/app/[locale]/vehicle/components/modal/modal-form-gas-supply";
import { useGasSupplyFormContext } from "@/app/[locale]/vehicle/context/gas-supply-context";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { GasSupplyData } from "@/app/[locale]/vehicle/types/types-gas-supply";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getData } from "@/lib/functions.api";

export function FormGasSupply() {
	const { setEditingGasSupply } = useGasSupplyFormContext();
	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const [isModalFormOpen, setIsModalFormOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const handleForward = () => setTabPanel("tab-occurrence");

	const handleBack = () => setTabPanel("tab-documentation");

	const vehicleId = editingVehicle?.id;

	const { data: dataGasSupply, isLoading } = useQuery({
		queryKey: ["gas-supply-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<GasSupplyData[]>({
				url: "/gasSupply",
				signal,
				query:
					`where.vehicleId=${vehicleId}&&include.file=true&&` +
					"include.gas&&include.gasStation=true",
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(gasSupply: GasSupplyData) => {
			setEditingGasSupply(gasSupply);
			setIsModalFormOpen(true);
		},
		[setEditingGasSupply],
	);

	const handleOpenDeleteModal = useCallback(
		(gasSupply?: GasSupplyData) => {
			setEditingGasSupply(gasSupply);
			setIsModalDeleteOpen(true);
		},
		[setEditingGasSupply],
	);

	const actions: GasSupplyColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getGasSupplyColumns(actions), [actions]);

	return (
		<>
			<div className="space-y-5 p-6">
				<DataTable
					loading={isLoading}
					columns={columns}
					data={dataGasSupply ?? []}
				/>
				<Button
					type="button"
					onClick={() => {
						setEditingGasSupply(undefined);
						setIsModalFormOpen(true);
					}}
				>
					Adicionar abastecimento
				</Button>

				<ModalFormGasSupply
					open={isModalFormOpen}
					setOpen={setIsModalFormOpen}
				/>

				<ModalDeleteGasSupply
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</div>
			<div className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<Button variant="outline" onClick={handleBack}>
					Voltar
				</Button>

				<Button
					type="button"
					onClick={handleForward}
					disabled={!editingVehicle?.id}
				>
					Continuar
				</Button>
			</div>
		</>
	);
}
