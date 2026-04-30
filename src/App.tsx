import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { Download, Moon, Sun, Upload } from "lucide-react";
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
	const [query, setQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
		new Set(),
	);
	const importRef = useRef<HTMLInputElement>(null);
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

	const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const imported = JSON.parse(ev.target?.result as string) as Record<
					string,
					DiagramNote
				>;
				setNotes(imported);
			} catch {
				alert("Invalid notes.json");
			}
		};
		reader.readAsText(file);
		e.target.value = "";
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

	const allCategories = Array.from(
		new Set(diagrams.flatMap((d) => d.categories ?? [])),
	).sort();

	const toggleCategory = (cat: string) => {
		setSelectedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(cat)) next.delete(cat);
			else next.add(cat);
			return next;
		});
	};

	const filteredDiagrams = diagrams
		.filter((d) => !d.hidden)
		.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()))
		.filter(
			(d) =>
				selectedCategories.size === 0 ||
				d.categories?.some((c) => selectedCategories.has(c)),
		);

	const categoryFilter = (compact?: boolean) =>
		allCategories.length > 0 && (
			<div
				className={`flex flex-wrap ${compact ? "gap-0.5 my-1" : "gap-1 my-2"}`}
			>
				<button
					type="button"
					onClick={() => setSelectedCategories(new Set())}
					className={`border rounded-full transition-colors ${compact ? "px-1.5 py-0 text-xs" : "px-2 py-0.5 text-sm"} ${selectedCategories.size === 0 ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"}`}
				>
					すべて
				</button>
				{allCategories.map((cat) => (
					<button
						key={cat}
						type="button"
						onClick={() => toggleCategory(cat)}
						className={`border rounded-full transition-colors ${compact ? "px-1.5 py-0 text-xs" : "px-2 py-0.5 text-sm"} ${selectedCategories.has(cat) ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"}`}
					>
						{cat}
					</button>
				))}
			</div>
		);

	const searchInput = (compact?: boolean) => (
		<input
			type="search"
			placeholder="Search diagrams..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			className={`w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-full px-4 focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--foreground)]/40 ${compact ? "py-1 text-sm" : "py-2"}`}
		/>
	);

	const getNote = (diagram: Diagram): DiagramNote => ({
		memo: notes[diagram.filename]?.memo ?? "",
		published: notes[diagram.filename]?.published ?? false,
	});

	const getPublished = (diagram: Diagram): boolean =>
		notes[diagram.filename]?.published ?? false;

	const headerButtons = (
		<div className="flex items-center gap-3">
			<input
				ref={importRef}
				type="file"
				accept=".json"
				className="hidden"
				onChange={handleImport}
			/>
			<button
				type="button"
				onClick={() => importRef.current?.click()}
				className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
				aria-label="Import notes"
				title="Import notes.json"
			>
				<Upload size={20} />
			</button>
			<button
				type="button"
				onClick={handleExport}
				className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
				aria-label="Export notes"
				title="Export notes.json"
			>
				<Download size={20} />
			</button>
			<button
				type="button"
				onClick={toggle}
				className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
				aria-label="Toggle dark mode"
				title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
					{searchInput(true)}
					{categoryFilter(true)}
					<div className="border-2 border-[var(--border)]">
						<Masonry
							breakpointCols={2}
							className="masonry-grid"
							columnClassName="masonry-grid_column"
						>
							{filteredDiagrams.map((diagram) => (
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
			{searchInput()}
			{categoryFilter()}
			<div className="border-2 border-[var(--border)]">
				<Masonry
					breakpointCols={breakpointCols}
					className="masonry-grid"
					columnClassName="masonry-grid_column"
				>
					{filteredDiagrams.map((diagram) => (
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
