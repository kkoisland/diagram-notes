import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Download, Moon, Sun } from "lucide-react";
import DiagramCard from "./DiagramCard";
import DetailView from "./DetailView";
import type { Diagram, DiagramNote } from "./types";

const breakpointCols = {
	default: 3,
	1024: 2,
	640: 1,
};

function App() {
	const [diagrams, setDiagrams] = useState<Diagram[]>([]);
	const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
	const [isDark, setIsDark] = useState(() => {
		const saved = localStorage.getItem("diagram-notes:theme");
		if (saved !== null) return saved === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});
	const [notes, setNotes] = useState<Record<string, DiagramNote>>(() => {
		try {
			return JSON.parse(localStorage.getItem("diagram-notes:notes") ?? "{}");
		} catch {
			return {};
		}
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("diagram-notes:theme", isDark ? "dark" : "light");
	}, [isDark]);

	useEffect(() => {
		fetch("/diagrams.json")
			.then((r) => r.json())
			.then(setDiagrams);
	}, []);

	useEffect(() => {
		localStorage.setItem("diagram-notes:notes", JSON.stringify(notes));
	}, [notes]);

	const toggle = () => setIsDark((d) => !d);

	const handleNoteChange = (filename: string, note: DiagramNote) => {
		setNotes((prev) => ({ ...prev, [filename]: note }));
	};

	const handleExport = () => {
		const blob = new Blob([JSON.stringify(notes, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "notes.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const getNote = (diagram: Diagram): DiagramNote => ({
		memo: notes[diagram.filename]?.memo ?? "",
		published: notes[diagram.filename]?.published ?? diagram.published ?? false,
	});

	const getPublished = (diagram: Diagram): boolean =>
		notes[diagram.filename]?.published ?? diagram.published ?? false;

	const headerButtons = (
		<div className="flex items-center gap-3">
			<button
				type="button"
				onClick={handleExport}
				className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
				aria-label="Export notes"
			>
				<Download size={20} />
			</button>
			<button
				type="button"
				onClick={toggle}
				className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
				aria-label="Toggle dark mode"
			>
				{isDark ? <Moon size={20} /> : <Sun size={20} />}
			</button>
		</div>
	);

	if (selectedDiagram) {
		return (
			<div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
				<div className="w-1/4 h-full overflow-y-auto border-r-2 border-[var(--border)] p-2">
					<div className="flex justify-end mb-2">{headerButtons}</div>
					<div className="border-2 border-[var(--border)]">
						<Masonry
							breakpointCols={2}
							className="masonry-grid"
							columnClassName="masonry-grid_column"
						>
							{diagrams.map((diagram) => (
								<DiagramCard
									key={diagram.filename}
									diagram={diagram}
									onClick={setSelectedDiagram}
									isSelected={diagram.filename === selectedDiagram?.filename}
									published={getPublished(diagram)}
								/>
							))}
						</Masonry>
					</div>
				</div>
				<div className="w-3/4 h-full">
					<DetailView
						diagram={selectedDiagram}
						onClose={() => setSelectedDiagram(null)}
						note={getNote(selectedDiagram)}
						onNoteChange={(note) =>
							handleNoteChange(selectedDiagram.filename, note)
						}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
			<div className="flex justify-end mb-4">{headerButtons}</div>
			<div className="border-2 border-[var(--border)]">
				<Masonry
					breakpointCols={breakpointCols}
					className="masonry-grid"
					columnClassName="masonry-grid_column"
				>
					{diagrams.map((diagram) => (
						<DiagramCard
							key={diagram.filename}
							diagram={diagram}
							onClick={setSelectedDiagram}
							published={getPublished(diagram)}
						/>
					))}
				</Masonry>
			</div>
		</div>
	);
}

export default App;
