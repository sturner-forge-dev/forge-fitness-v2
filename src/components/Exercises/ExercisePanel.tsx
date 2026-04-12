import { X } from "lucide-react";
import { LevelChip } from "./LevelChip";
import type { Exercise } from "./types";

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)">
				{label}
			</p>
			<p className="mt-0.5 capitalize text-(--sea-ink)">{value}</p>
		</div>
	);
}

export function ExercisePanel({
	exercise,
	onClose,
}: {
	exercise: Exercise;
	onClose: () => void;
}) {
	return (
		<aside
			className="island-shell fixed top-0 right-0 z-50 flex h-full w-160 flex-col overflow-y-auto rounded-none border-l border-(--line) p-5 shadow-xl"
			style={{ animation: "slideInRight 200ms ease-out" }}
		>
			<div className="mb-4 flex items-start justify-between gap-2">
				<h2 className="display-title text-xl font-bold leading-snug text-(--sea-ink)">
					{exercise.name}
				</h2>
				<button
					type="button"
					onClick={onClose}
					className="mt-0.5 shrink-0 rounded-md p-1 text-(--sea-ink-soft) hover:bg-[rgba(79,184,178,0.1)] hover:text-(--sea-ink)"
					aria-label="Close panel"
				>
					<X size={18} />
				</button>
			</div>

			<LevelChip level={exercise.level} />

			<div className="mt-5 grid grid-cols-2 gap-4 border-t border-(--line) pt-4">
				<DetailRow label="Category" value={exercise.category} />
				{exercise.equipment && (
					<DetailRow label="Equipment" value={exercise.equipment} />
				)}
				{exercise.force && <DetailRow label="Force" value={exercise.force} />}
				{exercise.mechanic && (
					<DetailRow label="Mechanic" value={exercise.mechanic} />
				)}
			</div>

			{exercise.primaryMuscles.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)">
						Primary Muscles
					</p>
					<p className="mt-0.5 capitalize text-(--sea-ink)">
						{exercise.primaryMuscles.join(", ")}
					</p>
				</div>
			)}

			{exercise.secondaryMuscles.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)">
						Secondary Muscles
					</p>
					<p className="mt-0.5 capitalize text-(--sea-ink)">
						{exercise.secondaryMuscles.join(", ")}
					</p>
				</div>
			)}

			{exercise.instructions.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="mb-2 text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)">
						Instructions
					</p>
					<ol className="space-y-2">
						{exercise.instructions.map((step, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
							<li key={i} className="flex gap-2 text-sm text-(--sea-ink)">
								<span className="shrink-0 font-semibold text-(--lagoon-deep)">
									{i + 1}.
								</span>
								{step}
							</li>
						))}
					</ol>
				</div>
			)}
		</aside>
	);
}
