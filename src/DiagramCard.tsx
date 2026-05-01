import { useEffect, useRef } from "react";
import { BadgeCheck } from "lucide-react";
import type { Diagram } from "./types";

interface Props {
	diagram: Diagram;
	onClick: (diagram: Diagram) => void;
	isSelected?: boolean;
	published?: boolean;
}

const DiagramCard = ({ diagram, onClick, isSelected, published }: Props) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isSelected && ref.current) {
			ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}, [isSelected]);

	return (
		<div
			ref={ref}
			className={`border-2 overflow-hidden w-full bg-white ${isSelected ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
		>
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
					<p className="text-lg font-medium text-gray-800 leading-tight">
						{diagram.title}
					</p>
					{published && (
						<BadgeCheck
							size={18}
							className="text-[var(--accent)] shrink-0 mt-1"
						/>
					)}
				</div>
				<p className="text-sm text-gray-500">{diagram.updatedAt}</p>
			</div>
		</div>
	);
};

export default DiagramCard;
