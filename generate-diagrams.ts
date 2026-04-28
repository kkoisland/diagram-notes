import {
	existsSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

const DIAGRAMS_DIR = "./public/diagrams";
const OUTPUT = "./public/diagrams.json";

function toTitle(filename: string): string {
	const base = filename.replace(".excalidraw.svg", "");
	const spaced = base.replace(/-/g, " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function toDate(filePath: string): string {
	const mtime = statSync(filePath).mtime;
	return mtime.toISOString().split("T")[0];
}

type Diagram = {
	title: string;
	filename: string;
	path: string;
	updatedAt: string;
};

const existing: Record<string, Diagram> = {};
if (existsSync(OUTPUT)) {
	const data = JSON.parse(readFileSync(OUTPUT, "utf-8")) as Diagram[];
	for (const d of data) {
		existing[d.filename] = d;
	}
}

const files = readdirSync(DIAGRAMS_DIR)
	.filter((f) => f.endsWith(".excalidraw.svg"))
	.sort();

const diagrams = files.map((filename) => {
	const filePath = join(DIAGRAMS_DIR, filename);
	if (existing[filename]) {
		return { ...existing[filename], updatedAt: toDate(filePath) };
	}
	return {
		title: toTitle(filename),
		filename,
		path: `/diagrams/${filename}`,
		updatedAt: toDate(filePath),
	};
});

writeFileSync(OUTPUT, JSON.stringify(diagrams, null, 2));
console.log(`Generated ${diagrams.length} diagrams → ${OUTPUT}`);
