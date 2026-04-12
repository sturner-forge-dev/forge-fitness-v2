import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { getExercises } from '#/components/Exercises/api';
import { ExercisePanel } from '#/components/Exercises/ExercisePanel';
import type { Exercise } from '#/components/Exercises/types';
import PaginatedTable from '#/components/PaginatedTable';
import { Input } from '#/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#/components/ui/select';
import { useExerciseColumns } from '#/hooks/Exercises/useExerciseColumns';

export const Route = createFileRoute('/exercises')({
	loader: () => getExercises(),
	component: ExercisesPage,
});

const ALL = '__all__';

function ExercisesPage() {
	const allExercises = Route.useLoaderData();
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState<Exercise | null>(null);
	const [categoryFilter, setCategoryFilter] = useState(ALL);
	const [levelFilter, setLevelFilter] = useState(ALL);
	const [equipmentFilter, setEquipmentFilter] = useState(ALL);
	const [muscleFilter, setMuscleFilter] = useState(ALL);

	const filterOptions = useMemo(() => {
		const sorted = (vals: (string | null | undefined)[]) =>
			[...new Set(vals.filter(Boolean))].sort() as string[];
		return {
			categories: sorted(allExercises.map((ex) => ex.category)),
			levels: sorted(allExercises.map((ex) => ex.level)),
			equipment: sorted(allExercises.map((ex) => ex.equipment)),
			muscles: sorted(allExercises.flatMap((ex) => ex.primaryMuscles)),
		};
	}, [allExercises]);

	const hasActiveFilters =
		categoryFilter !== ALL ||
		levelFilter !== ALL ||
		equipmentFilter !== ALL ||
		muscleFilter !== ALL;

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return allExercises.filter((ex) => {
			if (q) {
				const textMatch =
					ex.name.toLowerCase().includes(q) ||
					ex.category.toLowerCase().includes(q) ||
					ex.equipment?.toLowerCase().includes(q) ||
					ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
					ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q));
				if (!textMatch) return false;
			}
			if (categoryFilter !== ALL && ex.category !== categoryFilter)
				return false;
			if (levelFilter !== ALL && ex.level !== levelFilter) return false;
			if (equipmentFilter !== ALL && ex.equipment !== equipmentFilter)
				return false;
			if (muscleFilter !== ALL && !ex.primaryMuscles.includes(muscleFilter))
				return false;
			return true;
		});
	}, [
		allExercises,
		query,
		categoryFilter,
		levelFilter,
		equipmentFilter,
		muscleFilter,
	]);

	const columns = useExerciseColumns(selected, setSelected);

	function clearFilters() {
		setCategoryFilter(ALL);
		setLevelFilter(ALL);
		setEquipmentFilter(ALL);
		setMuscleFilter(ALL);
	}

	const isFiltered = query || hasActiveFilters;

	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			<div className='rise-in mb-6'>
				<p className='island-kicker mb-1'>Library</p>
				<h1 className='display-title text-4xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl'>
					Exercise Library
				</h1>
				<p className='mt-2 text-sm text-(--sea-ink-soft)'>
					{isFiltered
						? `${filtered.length} result${filtered.length === 1 ? '' : 's'}`
						: `${allExercises.length} exercises`}
				</p>
			</div>

			<div
				className='rise-in mb-4 space-y-3'
				style={{ animationDelay: '20ms' }}
			>
				<div className='flex justify-center'>
					<div className='w-150'>
						<Input
							type='search'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder='Search by name, muscle, equipment…'
						/>
					</div>
				</div>

				<div className='flex flex-wrap justify-center gap-2'>
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className='w-44 capitalize'>
							<SelectValue placeholder='Category' />
						</SelectTrigger>
						<SelectContent className='capitalize'>
							<SelectItem value={ALL}>All categories</SelectItem>
							{filterOptions.categories.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={levelFilter} onValueChange={setLevelFilter}>
						<SelectTrigger className='w-36 capitalize'>
							<SelectValue placeholder='Level' />
						</SelectTrigger>
						<SelectContent className='capitalize'>
							<SelectItem value={ALL}>All levels</SelectItem>
							{filterOptions.levels.map((l) => (
								<SelectItem key={l} value={l}>
									{l}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
						<SelectTrigger className='w-44 capitalize'>
							<SelectValue placeholder='Equipment' />
						</SelectTrigger>
						<SelectContent className='capitalize'>
							<SelectItem value={ALL}>All equipment</SelectItem>
							{filterOptions.equipment.map((e) => (
								<SelectItem key={e} value={e}>
									{e}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={muscleFilter} onValueChange={setMuscleFilter}>
						<SelectTrigger className='w-44 capitalize'>
							<SelectValue placeholder='Primary muscle' />
						</SelectTrigger>
						<SelectContent className='capitalize'>
							<SelectItem value={ALL}>All muscles</SelectItem>
							{filterOptions.muscles.map((m) => (
								<SelectItem key={m} value={m}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{hasActiveFilters && (
						<button
							type='button'
							onClick={clearFilters}
							className='text-sm text-(--sea-ink-soft) underline-offset-2 hover:text-(--sea-ink) hover:underline'
						>
							Clear filters
						</button>
					)}
				</div>
			</div>

			<section
				className='island-shell rise-in overflow-hidden rounded-2xl p-3'
				style={{ animationDelay: '80ms' }}
			>
				<PaginatedTable columns={columns} data={filtered} />
			</section>

			{selected && (
				<ExercisePanel exercise={selected} onClose={() => setSelected(null)} />
			)}
		</main>
	);
}
