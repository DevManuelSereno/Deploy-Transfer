import {
	Activity,
	AudioWaveform,
	BedDouble,
	Building2,
	BusFront,
	CalendarDays,
	Camera,
	Command,
	DollarSign,
	FileText,
	GalleryVerticalEnd,
	LayoutDashboard,
	Map as MapIcon,
	MapPin,
	Package,
	Puzzle,
	Settings,
	Star,
	Ticket,
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
			name: "Atividade",
			url: "#",
			icon: Activity,
		},
	],
	services: [
		{
			name: "Transfer",
			url: "#",
			icon: BusFront,
		},
		{
			name: "Combo",
			url: "#",
			icon: Package,
		},
		{
			name: "Hospedagem",
			url: "#",
			icon: BedDouble,
		},
		{
			name: "Ingresso",
			url: "#",
			icon: Ticket,
		},
		{
			name: "Passeio",
			url: "#",
			icon: Camera,
		},
		{
			name: "Experiência",
			url: "#",
			icon: Star,
		},
		{
			name: "Circuito",
			url: "#",
			icon: MapIcon,
		},
	],
	comercial: [
		{
			name: "Tarifário",
			url: "#",
			icon: DollarSign,
		},
		{
			name: "Disponibilidade",
			url: "#",
			icon: CalendarDays,
		},
	],
	compliments: [
		{
			name: "Slots",
			url: "#",
			icon: Puzzle,
		},
		{
			name: "Perímetros",
			url: "#",
			icon: MapPin,
		},
		{
			name: "Diretrizes",
			url: "#",
			icon: FileText,
		},
	],
	organization: [
		{
			name: "Configurações",
			url: "#",
			icon: Settings,
		},
	],
};
