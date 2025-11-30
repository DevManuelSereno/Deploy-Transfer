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

export const navbarItems = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
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
	],
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
			url: "#",
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
			url: "#",
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
