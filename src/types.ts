export interface Diagram {
	title: string;
	filename: string;
	path: string;
	updatedAt: string;
}

export interface DiagramNote {
	memo: string;
	published: boolean;
}
