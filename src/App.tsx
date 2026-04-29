import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Moon, Sun } from "lucide-react";
import DiagramCard from "./DiagramCard";
import DetailView from "./DetailView";
import type { Diagram } from "./types";

const breakpointCols = {
	default: 3,
	1024: 2,
	640: 1,
};

const darkModeButton = (isDark: boolean, toggle: () => void) => (
	<button
		type="button"
		onClick={toggle}
		className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
		aria-label="Toggle dark mode"
	>
		{isDark ? <Moon size={20} /> : <Sun size={20} />}
	</button>
);

function App() {
	const [diagrams, setDiagrams] = useState<Diagram[]>([]);
	const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
	const [isDark, setIsDark] = useState(() => {
		const saved = localStorage.getItem("diagram-notes:theme");
		if (saved !== null) return saved === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
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

	const toggle = () => setIsDark((d) => !d);

	if (selectedDiagram) {
		return (
			<div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
				<div className="w-1/4 h-full overflow-y-auto border-r-2 border-[var(--border)] p-2">
					<div className="flex justify-end mb-2">
						{darkModeButton(isDark, toggle)}
					</div>
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
								/>
							))}
						</Masonry>
					</div>
				</div>
				<div className="w-3/4 h-full">
					<DetailView
						diagram={selectedDiagram}
						onClose={() => setSelectedDiagram(null)}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
			<div className="flex justify-end mb-4">
				{darkModeButton(isDark, toggle)}
			</div>
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
						/>
					))}
				</Masonry>
			</div>
		</div>
	);
}

export default App;
