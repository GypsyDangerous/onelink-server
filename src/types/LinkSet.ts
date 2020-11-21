import mongoose from "mongoose";

export interface Link {
	path: string;
	embed?: boolean;
	image?: string;
	name: string;
	order: number;
	color?: string;
	active: boolean;
	id: string
}

export interface LinkSet extends mongoose.Document {
	owner: string;
	links: Link[];
	theme: string;
	linkCount: number;
}