import { X } from "lucide-react";
import type { Diagram } from "./types";

interface Props {
	diagram: Diagram;
	onClose: () => void;
}

const DetailView = ({ diagram, onClose }: Props) => {
	return (
		<div className="h-full flex flex-col bg-[var(--background)]">
			<div className="flex justify-between items-center p-4 border-b-2 border-[var(--border)]">
				<div>
					<p className="text-lg font-medium text-[var(--foreground)]">
						{diagram.title}
					</p>
					<p className="text-sm text-[var(--foreground)]/60">
						{diagram.updatedAt}
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			</div>
			<div className="flex-1 overflow-auto p-4">
				<img
					src={diagram.path}
					alt={diagram.title}
					className="w-full bg-white"
				/>
			</div>
		</div>
	);
};

export default DetailView;
