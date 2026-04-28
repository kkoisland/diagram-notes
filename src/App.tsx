import { useEffect, useState } from "react";
import DiagramCard from "./DiagramCard";
import type { Diagram } from "./types";

function App() {
	const [diagrams, setDiagrams] = useState<Diagram[]>([]);

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
			<div className="columns-3 gap-4">
				{diagrams.map((diagram) => (
					<div key={diagram.filename} className="mb-4 break-inside-avoid">
						<DiagramCard diagram={diagram} onClick={handleCardClick} />
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
