"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, CloudDownload, RotateCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FormBrand } from "@/app/[locale]/brand/components/form/form-brand";
import { ModalDeleteBrand } from "@/app/[locale]/brand/components/modal/modal-delete-brand";
import { ModalTableBrand } from "@/app/[locale]/brand/components/modal/modal-table-brand";
import { useBrandFormContext } from "@/app/[locale]/brand/context/brand-context";
import { useModalContext } from "@/app/[locale]/brand/context/modal-table-brand";
import type { BrandData } from "@/app/[locale]/brand/types/types-brand";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { Separator } from "@/components/ui/separator";
import { getData } from "@/lib/functions.api";
import { cn } from "@/lib/utils";
import {
	type BrandColumnActions,
	getBrandColumns,
} from "../columns/columns-table-brand";

export default function TableBrand() {
	const { setEditingBrand } = useBrandFormContext();
	const { isModalEditOpen, setIsModalEditOpen } = useModalContext();

	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const openEditModal = useCallback(
		(brand: BrandData) => {
			setEditingBrand(brand);
			setIsModalEditOpen(true);
		},
		[setEditingBrand, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(brand?: BrandData) => {
			setEditingBrand(brand);
			setIsModalDeleteOpen(true);
		},
		[setEditingBrand],
	);

	const actions: BrandColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getBrandColumns(actions), [actions]);

	const { data: dataBrand, isLoading } = useQuery({
		queryKey: ["brand-get"],
		queryFn: ({ signal }) =>
			getData<BrandData[]>({
				url: "/brand",
				signal,
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
					data={dataBrand ?? []}
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
							<ModalTableBrand
								open={isModalEditOpen}
								setOpen={setIsModalEditOpen}
							>
								<FormBrand />
							</ModalTableBrand>
						</div>
					}
				/>
				<ModalDeleteBrand
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
