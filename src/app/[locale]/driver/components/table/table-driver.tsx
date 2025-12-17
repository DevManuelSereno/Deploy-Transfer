"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	type ColumnFiltersState,
	type ColumnPinningState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	Calendar,
	IdCard,
	LucidePlus,
	MapIcon,
	UserPlus,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { getDriverColumns } from "@/app/[locale]/driver/components/columns/columns-table-driver";
import { FormDriverData } from "@/app/[locale]/driver/components/form/form-driver-data";
import { ModalDeleteDriver } from "@/app/[locale]/driver/components/modal/modal-delete-driver";
import { ModalTableDriver } from "@/app/[locale]/driver/components/modal/modal-table-driver";
import { useDriverFormContext } from "@/app/[locale]/driver/context/driver-context";
import type { DriverData } from "@/app/[locale]/driver/types/types-driver";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselCardInsight } from "@/components/ui/carousel-card-insight";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import type { DriverColumnActions } from "../columns/columns-table-driver";

export default function TableDriver() {
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("DriverPage.Table.Columns");
	const { setEditingDriver, editingDriver } = useDriverFormContext();
	const queryClient = useQueryClient();

	const [isModalEditOpen, setIsModalEditOpen] = useState(false);

	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
		right: ["actions"],
	});

	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const openEditModal = useCallback(
		(driver: DriverData) => {
			setEditingDriver(driver);
			setIsModalEditOpen(true);
		},
		[setEditingDriver, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(driver?: DriverData) => {
			setEditingDriver(driver);
			setIsModalDeleteOpen(true);
		},
		[setEditingDriver],
	);

	const actions: DriverColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getDriverColumns(actions, tColumns as any),
		[actions, tColumns],
	);

	const dataDriver = [
		{
			IDD: 1,
			FirstName: "João",
			LastName: "Silva",
			CreatedAt: "2024-01-10T10:00:00Z",
			UpdatedAt: "2024-06-01T12:30:00Z",
			Category: "B",
			BirthDate: "1990-05-12",
			Email: "joao.silva@email.com",
			Phone: "+55 11 99999-1111",
			Street: "Rua das Flores",
			Number: "123",
			District: "Centro",
			City: "São Paulo",
			State: "SP",
			Country: "Brasil",
			PostalCode: "01000-000",
			Observation: "Motorista experiente, sem infrações recentes.",
		},
		{
			IDD: 2,
			FirstName: "Maria",
			LastName: "Oliveira",
			CreatedAt: "2024-02-15T09:20:00Z",
			UpdatedAt: "2024-06-10T08:45:00Z",
			Category: "C",
			BirthDate: "1985-09-22",
			Email: "maria.oliveira@email.com",
			Phone: "+55 21 98888-2222",
			Street: "Avenida Brasil",
			Number: "456",
			District: "Copacabana",
			City: "Rio de Janeiro",
			State: "RJ",
			Country: "Brasil",
			PostalCode: "22000-000",
			Observation: "Possui curso de direção defensiva.",
		},
		{
			IDD: 3,
			FirstName: "Carlos",
			LastName: "Pereira",
			CreatedAt: "2024-03-01T14:00:00Z",
			UpdatedAt: "2024-06-12T16:10:00Z",
			Category: "A",
			BirthDate: "1995-02-03",
			Email: "carlos.pereira@email.com",
			Phone: "+55 31 97777-3333",
			Street: "Rua Minas Gerais",
			Number: "78",
			District: "Savassi",
			City: "Belo Horizonte",
			State: "MG",
			Country: "Brasil",
			PostalCode: "30100-000",
			Observation: "Especializado em motocicletas.",
		},
		{
			IDD: 4,
			FirstName: "Ana",
			LastName: "Costa",
			CreatedAt: "2024-03-20T11:40:00Z",
			UpdatedAt: "2024-06-14T10:00:00Z",
			Category: "D",
			BirthDate: "1980-11-30",
			Email: "ana.costa@email.com",
			Phone: "+55 41 96666-4444",
			Street: "Rua Paraná",
			Number: "910",
			District: "Batel",
			City: "Curitiba",
			State: "PR",
			Country: "Brasil",
			PostalCode: "80000-000",
			Observation: "Experiência com transporte coletivo.",
		},
		{
			IDD: 5,
			FirstName: "Roberto",
			LastName: "Lima",
			CreatedAt: "2024-04-05T08:10:00Z",
			UpdatedAt: "2024-06-18T13:25:00Z",
			Category: "E",
			BirthDate: "1978-07-19",
			Email: "roberto.lima@email.com",
			Phone: "+55 51 95555-5555",
			Street: "Rua do Porto",
			Number: "50",
			District: "Centro Histórico",
			City: "Porto Alegre",
			State: "RS",
			Country: "Brasil",
			PostalCode: "90000-000",
			Observation: "Habilitado para veículos de grande porte.",
		},
		{
			IDD: 6,
			FirstName: "Lucas",
			LastName: "Mendes",
			CreatedAt: "2024-04-18T15:00:00Z",
			UpdatedAt: "2024-06-20T09:40:00Z",
			Category: "B",
			BirthDate: "1998-03-14",
			Email: "lucas.mendes@email.com",
			Phone: "+55 61 94444-6666",
			Street: "SQN 210",
			Number: "12",
			District: "Asa Norte",
			City: "Brasília",
			State: "DF",
			Country: "Brasil",
			PostalCode: "70800-000",
			Observation: "Motorista jovem, bom histórico.",
		},
		{
			IDD: 7,
			FirstName: "Fernanda",
			LastName: "Rocha",
			CreatedAt: "2024-05-02T10:30:00Z",
			UpdatedAt: "2024-06-22T14:15:00Z",
			Category: "C",
			BirthDate: "1987-12-01",
			Email: "fernanda.rocha@email.com",
			Phone: "+55 85 93333-7777",
			Street: "Rua Beira Mar",
			Number: "300",
			District: "Meireles",
			City: "Fortaleza",
			State: "CE",
			Country: "Brasil",
			PostalCode: "60100-000",
			Observation: "Atua em transporte de cargas leves.",
		},
		{
			IDD: 8,
			FirstName: "Pedro",
			LastName: "Alves",
			CreatedAt: "2024-05-10T09:00:00Z",
			UpdatedAt: "2024-06-25T11:50:00Z",
			Category: "A",
			BirthDate: "2000-08-25",
			Email: "pedro.alves@email.com",
			Phone: "+55 71 92222-8888",
			Street: "Rua Bahia",
			Number: "45",
			District: "Barra",
			City: "Salvador",
			State: "BA",
			Country: "Brasil",
			PostalCode: "40100-000",
			Observation: "Entrega rápida em áreas urbanas.",
		},
		{
			IDD: 9,
			FirstName: "Patricia",
			LastName: "Gomes",
			CreatedAt: "2024-05-20T13:15:00Z",
			UpdatedAt: "2024-06-27T16:00:00Z",
			Category: "D",
			BirthDate: "1983-06-09",
			Email: "patricia.gomes@email.com",
			Phone: "+55 19 91111-9999",
			Street: "Rua Campinas",
			Number: "600",
			District: "Cambuí",
			City: "Campinas",
			State: "SP",
			Country: "Brasil",
			PostalCode: "13000-000",
			Observation: "Experiência com fretamento.",
		},
		{
			IDD: 10,
			FirstName: "Diego",
			LastName: "Santos",
			CreatedAt: "2024-06-01T07:45:00Z",
			UpdatedAt: "2024-06-30T18:20:00Z",
			Category: "B",
			BirthDate: "1992-01-17",
			Email: "diego.santos@email.com",
			Phone: "+55 27 90000-0000",
			Street: "Rua Vitória",
			Number: "88",
			District: "Praia do Canto",
			City: "Vitória",
			State: "ES",
			Country: "Brasil",
			PostalCode: "29000-000",
			Observation: "Disponível para viagens longas.",
		},
	];

	const tableData = useMemo(() => dataDriver ?? [], []);

	const table = useReactTable<DriverData>({
		data: tableData,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnPinningChange: setColumnPinning,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			pagination,
			columnPinning,
			globalFilter,
		},
	});

	const cardDriverData = useMemo(
		() => [
			{
				title: "Total de motoristas",
				value: <AnimatedCounter value={17} />,
				Icon: Users,
				description: "Total de motoristas registrados",
			},
			{
				title: "Motoristas registrados no mês",
				value: <AnimatedCounter value={5} />,
				Icon: UserPlus,
				description: "Total de motoristas registrados neste mês",
			},
			{
				title: "Categoria dominante",
				value: "B",
				Icon: IdCard,
				description: "Categoria de CNH mais registrada",
			},
			{
				title: "Idade média",
				value: <AnimatedCounter value={29.7} />,
				Icon: Calendar,
				description: "Média de idade dos motoristas cadastrados",
			},
			{
				title: "Estado com mais motorista",
				value: "RJ",
				Icon: MapIcon,
				description: "Estado com maior número de motoristas",
			},
		],
		[],
	);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<CarouselCardInsight cardData={cardDriverData} />
			<Card
				className={cn(
					"border-0 gap-0 p-0 shadow-custom! bg-[linear-gradient(to_bottom,#ffffff_0%,#fcfcfc_50%,#fafafa_100%)]",
					"dark:bg-[linear-gradient(to_top,#232323_0%,#1c1c1c_30%,#161616_100%)] dark:shadow-none dark:border",
					"dark:border-[#262626] overflow-hidden",
				)}
			>
				<ScrollArea>
					<div className="flex h-full border-b items-center py-4 justify-between gap-4 px-5">
						<div className="flex items-center gap-2">
							<OpenAiToolbar />
							<Separator
								orientation="vertical"
								className="data-[orientation=vertical]:w-px data-[orientation=vertical]:h-4 mx-0.5"
							/>
							<DataTableSearchInput
								value={globalFilter}
								onChangeValue={(filter) => setGlobalFilter(filter)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={() => {
									setEditingDriver(undefined);
									setIsModalEditOpen(true);
								}}
							>
								<LucidePlus />
								{tTable("addButton")}
							</Button>
						</div>
					</div>
				</ScrollArea>
				<DataTableProvider
					recordCount={tableData.length}
					table={table}
					isLoading={false}
				>
					<DataTable />
					<DataTablePagination />
				</DataTableProvider>
				<ModalTableDriver open={isModalEditOpen} setOpen={setIsModalEditOpen}>
					<FormDriverData editingDriver={editingDriver} />
				</ModalTableDriver>
				<ModalDeleteDriver
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
