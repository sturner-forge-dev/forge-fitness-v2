import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Divide } from "lucide-react";
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

const PAGE_SIZE = 20;

const getExercises = createServerFn({ method: "GET" }).handler(async () =>
	prisma.exercise.findMany({ orderBy: { name: "asc" } }),
);

export const Route = createFileRoute("/exercises")({
	loader: () => getExercises(),
	component: ExercisesPage,
});

function ExercisesPage() {
	const allExercises = Route.useLoaderData();
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);

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

			<section
				className="island-shell rise-in overflow-hidden rounded-2xl"
				style={{ animationDelay: "80ms" }}
			>
				<Table className="table-fixed">
					<colgroup>
						<col className="w-[32%]" />
						<col className="w-[14%]" />
						<col className="w-[14%]" />
						<col className="w-[18%]" />
						<col className="w-[22%]" />
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
										<span
											className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
												ex.level === "beginner"
													? "bg-[rgba(47,106,74,0.12)] text-(--palm)"
													: ex.level === "intermediate"
														? "bg-[rgba(79,184,178,0.14)] text-(--lagoon-deep)"
														: "bg-[rgba(23,58,64,0.1)] text-destructive)"
											}`}
										>
											{ex.level}
										</span>
									</TableCell>
									<TableCell className="truncate capitalize text-(--sea-ink-soft)">
										{ex.equipment ?? "—"}
									</TableCell>
									<TableCell className="truncate text-(--sea-ink-soft)">
										{ex.primaryMuscles.join(", ")}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
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
		</main>
	);
}
