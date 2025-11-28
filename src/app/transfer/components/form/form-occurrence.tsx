"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
	getOccurrenceColumns,
	type OccurrenceColumnActions,
} from "@/app/transfer/components/columns/columns-table-occurrence";
import { ModalDeleteOccurrence } from "@/app/transfer/components/modal/modal-delete-occurrence";
import { ModalFormOccurrence } from "@/app/transfer/components/modal/modal-form-occurrence";
import { useModalContext } from "@/app/transfer/context/modal-context";
import { useOccurrenceFormContext } from "@/app/transfer/context/occurrence-context";
import { useVehicleFormContext } from "@/app/transfer/context/vehicle-context";
import type { OccurrenceData } from "@/app/transfer/types/types-occurrence";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getData } from "@/lib/functions.api";

export function FormOccurrence() {
	const { setEditingOccurrence } = useOccurrenceFormContext();
	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const [isModalFormOpen, setIsModalFormOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const handleBack = () => setTabPanel("tab-gas-supply");

	const vehicleId = editingVehicle?.id;

	const { data: dataOccurrence, isLoading } = useQuery({
		queryKey: ["occurrence-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<OccurrenceData[]>({
				url: "/occurrence",
				signal,
				query:
					`where.vehicleId=${vehicleId}&&include.file=true&&` +
					"include.classification&&include.seriousness=true",
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(occurrence: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalFormOpen(true);
		},
		[setEditingOccurrence],
	);

	const handleOpenDeleteModal = useCallback(
		(occurrence?: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalDeleteOpen(true);
		},
		[setEditingOccurrence],
	);

	const actions: OccurrenceColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getOccurrenceColumns(actions), [actions]);

	return (
		<>
			<div className="space-y-5 p-6">
				<DataTable
					loading={isLoading}
					columns={columns}
					data={dataOccurrence ?? []}
				/>
				<Button
					type="button"
					onClick={() => {
						setEditingOccurrence(undefined);
						setIsModalFormOpen(true);
					}}
				>
					Adicionar ocorrência
				</Button>
				<ModalFormOccurrence
					open={isModalFormOpen}
					setOpen={setIsModalFormOpen}
				/>

				<ModalDeleteOccurrence
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</div>
			<div className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<Button variant="outline" onClick={handleBack}>
					Voltar
				</Button>
			</div>
		</>
	);
}
