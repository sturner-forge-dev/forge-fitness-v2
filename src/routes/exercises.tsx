import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getExercises } from "#/components/Exercises/api";
import { ExercisePanel } from "#/components/Exercises/ExercisePanel";
import type { Exercise } from "#/components/Exercises/types";
import PaginatedTable from "#/components/PaginatedTable";
import { Input } from "#/components/ui/input";
import { useExerciseColumns } from "#/hooks/Exercises/useExerciseColumns";

export const Route = createFileRoute("/exercises")({
	loader: () => getExercises(),
	component: ExercisesPage,
});

function ExercisesPage() {
	const allExercises = Route.useLoaderData();
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Exercise | null>(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return allExercises;
		return allExercises.filter(
			(ex) =>
				ex.name.toLowerCase().includes(q) ||
				ex.category.toLowerCase().includes(q) ||
				ex.equipment?.toLowerCase().includes(q) ||
				ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
				ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q)),
		);
	}, [allExercises, query]);

	const columns = useExerciseColumns(selected, setSelected);

	return (
		<main className="page-wrap px-4 pb-12 pt-14">
			<div className="rise-in mb-6">
				<p className="island-kicker mb-1">Library</p>
				<h1 className="display-title text-4xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl">
					Exercise Library
				</h1>
				<p className="mt-2 text-sm text-(--sea-ink-soft)">
					{query
						? `${filtered.length} result${filtered.length === 1 ? "" : "s"} for "${query}"`
						: `${allExercises.length} exercises`}
				</p>
			</div>

			<div className="flex justify-center">
				<div className="rise-in mb-4 w-150" style={{ animationDelay: "60ms" }}>
					<Input
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search by name, muscle, equipment…"
					/>
				</div>
			</div>

			<section
				className="island-shell rise-in overflow-hidden rounded-2xl p-3"
				style={{ animationDelay: "80ms" }}
			>
				<PaginatedTable columns={columns} data={filtered} />
			</section>

			{selected && (
				<ExercisePanel exercise={selected} onClose={() => setSelected(null)} />
			)}
		</main>
	);
}
