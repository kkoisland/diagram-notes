export interface Diagram {
	title: string;
	filename: string;
	path: string;
	updatedAt: string;
	categories?: string[];
	hidden?: boolean;
}

export interface DiagramNote {
	memo: string;
	published: boolean;
}
