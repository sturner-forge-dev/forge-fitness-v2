import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { prisma } from "#/db";
import type { Exercise } from "#/generated/prisma";

const PAGE_SIZE = 20;

const getExercises = createServerFn({ method: "GET" }).handler(async () =>
	prisma.exercise.findMany({ orderBy: { name: "asc" } }),
);

export const Route = createFileRoute("/exercises")({
	loader: () => getExercises(),
	component: ExercisesPage,
});

function LevelChip({ level }: { level: string }) {
	return (
		<span
			className={`inline-block w-24 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold ${
				level === "beginner"
					? "bg-[rgba(47,106,74,0.12)] text-(--palm)"
					: level === "intermediate"
						? "bg-[rgba(79,184,178,0.14)] text-(--lagoon-deep)"
						: "bg-[rgba(220,38,38,0.1)] text-red-600 dark:text-red-400"
			}`}
		>
			{level}
		</span>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
				{label}
			</p>
			<p className="mt-0.5 capitalize text-(--sea-ink)">{value}</p>
		</div>
	);
}

function ExercisePanel({
	exercise,
	onClose,
}: { exercise: Exercise; onClose: () => void }) {
	return (
		<aside className="island-shell rise-in flex w-80 shrink-0 flex-col overflow-y-auto rounded-2xl p-5">
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
				{exercise.force && (
					<DetailRow label="Force" value={exercise.force} />
				)}
				{exercise.mechanic && (
					<DetailRow label="Mechanic" value={exercise.mechanic} />
				)}
			</div>

			{exercise.primaryMuscles.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
						Primary Muscles
					</p>
					<p className="mt-0.5 capitalize text-(--sea-ink)">
						{exercise.primaryMuscles.join(", ")}
					</p>
				</div>
			)}

			{exercise.secondaryMuscles.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
						Secondary Muscles
					</p>
					<p className="mt-0.5 capitalize text-(--sea-ink)">
						{exercise.secondaryMuscles.join(", ")}
					</p>
				</div>
			)}

			{exercise.instructions.length > 0 && (
				<div className="mt-4 border-t border-(--line) pt-4">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
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

function ExercisesPage() {
	const allExercises = Route.useLoaderData();
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
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

	const total = filtered.length;
	const totalPages = Math.ceil(total / PAGE_SIZE);
	const start = (page - 1) * PAGE_SIZE;
	const exercises = filtered.slice(start, start + PAGE_SIZE);
	const hasPrev = page > 1;
	const hasNext = page < totalPages;

	function handleSearch(value: string) {
		setQuery(value);
		setPage(1);
	}

	return (
		<main className="page-wrap px-4 pb-12 pt-14">
			<div className="rise-in mb-6">
				<p className="island-kicker mb-1">Library</p>
				<h1 className="display-title text-4xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl">
					Exercise Library
				</h1>
				<p className="mt-2 text-sm text-(--sea-ink-soft)">
					{query
						? `${total} result${total === 1 ? "" : "s"} for "${query}"`
						: `${allExercises.length} exercises — showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)}`}
				</p>
			</div>

			<div className="flex justify-center">
				<div className="rise-in mb-4 w-150" style={{ animationDelay: "60ms" }}>
					<Input
						type="search"
						value={query}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search by name, muscle, equipment…"
					/>
				</div>
			</div>

			<div className="flex items-start gap-5">
				<div className="min-w-0 flex-1">
					<section
						className="island-shell rise-in overflow-hidden rounded-2xl"
						style={{ animationDelay: "80ms" }}
					>
						<Table className="table-fixed">
							<colgroup>
								<col className="w-[30%]" />
								<col className="w-[13%]" />
								<col className="w-[14%]" />
								<col className="w-[16%]" />
								<col className="w-[20%]" />
								<col className="w-[7%]" />
							</colgroup>
							<TableHeader>
								<TableRow className="border-b border-(--line)">
									<TableHead className="font-semibold text-(--sea-ink)">
										Name
									</TableHead>
									<TableHead className="font-semibold text-(--sea-ink)">
										Category
									</TableHead>
									<TableHead className="font-semibold text-(--sea-ink)">
										Level
									</TableHead>
									<TableHead className="font-semibold text-(--sea-ink)">
										Equipment
									</TableHead>
									<TableHead className="font-semibold text-(--sea-ink)">
										Primary Muscles
									</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{exercises.length > 0 ? (
									exercises.map((ex) => (
										<TableRow
											key={ex.id}
											className="border-b border-(--line) hover:bg-[rgba(79,184,178,0.06)]"
										>
											<TableCell className="truncate font-medium text-(--sea-ink)">
												{ex.name}
											</TableCell>
											<TableCell className="truncate capitalize text-(--sea-ink-soft)">
												{ex.category}
											</TableCell>
											<TableCell>
												<LevelChip level={ex.level} />
											</TableCell>
											<TableCell className="truncate capitalize text-(--sea-ink-soft)">
												{ex.equipment ?? "—"}
											</TableCell>
											<TableCell className="truncate text-(--sea-ink-soft)">
												{ex.primaryMuscles.join(", ")}
											</TableCell>
											<TableCell>
												<Button
													size="xs"
													variant="ghost"
													onClick={() =>
														setSelected((prev) =>
															prev?.id === ex.id ? null : ex,
														)
													}
													className={
														selected?.id === ex.id
															? "text-(--lagoon-deep)"
															: ""
													}
												>
													{selected?.id === ex.id ? "Close" : "View"}
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={6}
											className="py-12 text-center text-(--sea-ink-soft)"
										>
											No exercises match "{query}"
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</section>

					{totalPages > 1 && (
						<div
							className="rise-in mt-5 flex items-center justify-between"
							style={{ animationDelay: "160ms" }}
						>
							<p className="text-sm text-(--sea-ink-soft)">
								Page {page} of {totalPages}
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => setPage((p) => p - 1)}
									disabled={!hasPrev}
								>
									← Previous
								</Button>
								<Button
									variant="outline"
									onClick={() => setPage((p) => p + 1)}
									disabled={!hasNext}
								>
									Next →
								</Button>
							</div>
						</div>
					)}
				</div>

				{selected && (
					<ExercisePanel exercise={selected} onClose={() => setSelected(null)} />
				)}
			</div>
		</main>
	);
}
