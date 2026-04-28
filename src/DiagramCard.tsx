import { BadgeCheck } from "lucide-react";
import type { Diagram } from "./types";

interface Props {
	diagram: Diagram;
	onClick: (diagram: Diagram) => void;
}

const DiagramCard = ({ diagram, onClick }: Props) => {
	return (
		<div className="border-2 border-[#d8b4fe] overflow-hidden w-full">
			<button
				type="button"
				className="cursor-pointer w-full"
				onClick={() => onClick(diagram)}
			>
				<img
					src={diagram.path}
					alt={diagram.title}
					className="w-full block bg-white"
				/>
			</button>
			<div className="px-3 pt-2 pb-0">
				<div className="flex items-start justify-between gap-2">
					<p className="text-lg font-medium text-[var(--foreground)] leading-tight">
						{diagram.title}
					</p>
					{diagram.published && (
						<BadgeCheck size={18} className="text-[var(--accent)] shrink-0 mt-1" />
					)}
				</div>
				<p className="text-sm text-[var(--foreground)]/60">
					{diagram.updatedAt}
				</p>
			</div>
		</div>
	);
};

export default DiagramCard;
