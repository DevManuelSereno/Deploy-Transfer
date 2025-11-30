"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
	type DocumentationColumnActions,
	getDocumentationColumns,
} from "@/app/components/columns/columns-table-documentation";
import { ModalDeleteDocumentation } from "@/app/components/modal/modal-delete-documentation";
import { ModalFormDocumentation } from "@/app/components/modal/modal-form-documentation";
import { useDocumentationFormContext } from "@/app/context/documentation-context";
import { useModalContext } from "@/app/context/modal-context";
import { useVehicleFormContext } from "@/app/context/vehicle-context";
import type { DocumentationData } from "@/app/types/types-documentation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getData } from "@/lib/functions.api";

export function FormDocumentation() {
	const { setEditingDocumentation } = useDocumentationFormContext();
	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const [isModalFormOpen, setIsModalFormOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const handleForward = () => setTabPanel("tab-gas-supply");

	const handleBack = () => setTabPanel("tab-general-data");

	const vehicleId = editingVehicle?.id;

	const { data: dataDocumentation, isLoading } = useQuery({
		queryKey: ["documentation-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<DocumentationData[]>({
				url: "/documentation",
				signal,
				query: `where.vehicleId=${vehicleId}&&include.file=true`,
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(documentation: DocumentationData) => {
			setEditingDocumentation(documentation);
			setIsModalFormOpen(true);
		},
		[setEditingDocumentation],
	);

	const handleOpenDeleteModal = useCallback(
		(documentation?: DocumentationData) => {
			setEditingDocumentation(documentation);
			setIsModalDeleteOpen(true);
		},
		[setEditingDocumentation],
	);

	const actions: DocumentationColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getDocumentationColumns(actions), [actions]);

	return (
		<>
			<div className="space-y-5 p-6">
				<DataTable
					loading={isLoading}
					columns={columns}
					data={dataDocumentation ?? []}
				/>
				<Button
					type="button"
					onClick={() => {
						setEditingDocumentation(undefined);
						setIsModalFormOpen(true);
					}}
				>
					Adicionar documentação
				</Button>

				<ModalFormDocumentation
					open={isModalFormOpen}
					setOpen={setIsModalFormOpen}
				/>

				<ModalDeleteDocumentation
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
