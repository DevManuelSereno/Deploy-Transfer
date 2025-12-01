import {
	AlertTriangle,
	AudioWaveform,
	Building2,
	BusFront,
	Calendar,
	Command,
	Fuel,
	Home,
	LayoutDashboard,
	Plane,
	Settings,
	User,
	Wallet,
	Wrench,
} from "lucide-react";

export const teamsItems = [
	{
		name: "Pass",
		logo: Building2,
	},
	{
		name: "Acme Corp.",
		logo: AudioWaveform,
	},
	{
		name: "Evil Corp.",
		logo: Command,
	},
];

export const navbarItems = {
	principal: [
		{
			name: "Painel",
			url: "#",
			icon: LayoutDashboard,
		},
		{
			name: "Serviços",
			url: "#",
			icon: Home,
		},
		{
			name: "Viagens",
			url: "#",
			icon: Plane,
		},
		{
			name: "Agenda",
			url: "#",
			icon: Calendar,
		},
	],
	frota: [
		{
			name: "Veículos",
			url: "vehicle",
			icon: BusFront,
		},
		{
			name: "Abastecimento",
			url: "#",
			icon: Fuel,
		},
		{
			name: "Ocorrências",
			url: "#",
			icon: AlertTriangle,
		},
		{
			name: "Despesas",
			url: "#",
			icon: Wallet,
		},
		{
			name: "Manutenções",
			url: "#",
			icon: Wrench,
		},
		{
			name: "Marcas",
			url: "brand",
			icon: Building2,
		},
	],
	organization: [
		{
			name: "Usuário",
			url: "#",
			icon: User,
		},
	],
};
