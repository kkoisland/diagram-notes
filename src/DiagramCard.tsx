import type { Diagram } from "./types";

interface Props {
	diagram: Diagram;
	onClick: (diagram: Diagram) => void;
}

const DiagramCard = ({ diagram, onClick }: Props) => {
	return (
		<button
			type="button"
			className="cursor-pointer rounded-lg border border-[var(--foreground)]/20 overflow-hidden hover:border-[var(--accent)] transition-colors w-full text-left"
			onClick={() => onClick(diagram)}
		>
			<img src={diagram.path} alt={diagram.title} className="w-full block" />
			<div className="p-3">
				<p className="text-sm font-medium text-[var(--foreground)]">
					{diagram.title}
				</p>
				<p className="text-xs text-[var(--foreground)]/60 mt-1">
					{diagram.updatedAt}
				</p>
			</div>
		</button>
	);
};

export default DiagramCard;
