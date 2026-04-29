import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Moon, Sun } from "lucide-react";
import DiagramCard from "./DiagramCard";
import type { Diagram } from "./types";

const breakpointCols = {
	default: 3,
	1024: 2,
	640: 1,
};

function App() {
	const [diagrams, setDiagrams] = useState<Diagram[]>([]);
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

	const handleCardClick = (diagram: Diagram) => {
		console.log("clicked:", diagram.filename);
	};

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
			<div className="flex justify-end mb-4">
				<button
					type="button"
					onClick={() => setIsDark((d) => !d)}
					className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
					aria-label="Toggle dark mode"
				>
					{isDark ? <Moon size={20} /> : <Sun size={20} />}
				</button>
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
							onClick={handleCardClick}
						/>
					))}
				</Masonry>
			</div>
		</div>
	);
}

export default App;
