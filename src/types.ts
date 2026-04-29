export interface Diagram {
	title: string;
	filename: string;
	path: string;
	updatedAt: string;
	published?: boolean;
	categories?: string[];
	hidden?: boolean;
}

export interface DiagramNote {
	memo: string;
	published: boolean;
}
