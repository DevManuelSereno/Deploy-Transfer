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
			key: "dashboard",
			url: "/",
			icon: LayoutDashboard,
		},
		{
			key: "services",
			url: "#",
			icon: Home,
		},
		{
			key: "trips",
			url: "#",
			icon: Plane,
		},
		{
			key: "schedule",
			url: "#",
			icon: Calendar,
		},
	],
	frota: [
		{
			key: "vehicles",
			url: "/vehicle",
			icon: BusFront,
		},
		{
			key: "refueling",
			url: "/fueling",
			icon: Fuel,
		},
		{
			key: "incidents",
			url: "#",
			icon: AlertTriangle,
		},
		{
			key: "expenses",
			url: "#",
			icon: Wallet,
		},
		{
			key: "maintenance",
			url: "#",
			icon: Wrench,
		},
		{
			key: "brands",
			url: "/brand",
			icon: Building2,
		},
	],
	organization: [
		{
			key: "user",
			url: "#",
			icon: User,
		},
	],
};
