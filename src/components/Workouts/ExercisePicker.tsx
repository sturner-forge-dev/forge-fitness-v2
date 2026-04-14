import { useMemo, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#/components/ui/select';
import type { Exercise } from '#/components/Exercises/types';

const ALL = '__all__';

interface ExercisePickerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	exercises: Exercise[];
	onSelect: (exercise: Exercise) => void;
}

export function ExercisePicker({
	open,
	onOpenChange,
	exercises,
	onSelect,
}: ExercisePickerProps) {
	const [query, setQuery] = useState('');
	const [categoryFilter, setCategoryFilter] = useState(ALL);
	const [muscleFilter, setMuscleFilter] = useState(ALL);

	const filterOptions = useMemo(() => {
		const sorted = (vals: (string | null | undefined)[]) =>
			[...new Set(vals.filter(Boolean))].sort() as string[];
		return {
			categories: sorted((exercises ?? []).map((ex) => ex.category)),
			muscles: sorted((exercises ?? []).flatMap((ex) => ex.primaryMuscles)),
		};
	}, [exercises]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return (exercises ?? []).filter((ex) => {
			if (q) {
				const match =
					ex.name.toLowerCase().includes(q) ||
					ex.category.toLowerCase().includes(q) ||
					ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));
				if (!match) return false;
			}
			if (categoryFilter !== ALL && ex.category !== categoryFilter) return false;
			if (muscleFilter !== ALL && !ex.primaryMuscles.includes(muscleFilter))
				return false;
			return true;
		});
	}, [exercises, query, categoryFilter, muscleFilter]);

	function handleSelect(exercise: Exercise) {
		onSelect(exercise);
		onOpenChange(false);
		setQuery('');
		setCategoryFilter(ALL);
		setMuscleFilter(ALL);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='island-shell flex max-h-[80vh] flex-col gap-0 p-0 sm:max-w-lg'>
				<DialogHeader className='shrink-0 border-b border-(--line) px-5 py-4'>
					<DialogTitle className='text-base font-semibold text-(--sea-ink)'>
						Add Exercise
					</DialogTitle>
				</DialogHeader>

				<div className='shrink-0 space-y-2 border-b border-(--line) px-4 py-3'>
					<Input
						type='search'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search exercises…'
						autoFocus
					/>
					<div className='flex gap-2'>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className='flex-1 capitalize text-xs'>
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

						<Select value={muscleFilter} onValueChange={setMuscleFilter}>
							<SelectTrigger className='flex-1 capitalize text-xs'>
								<SelectValue placeholder='Muscle' />
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
					</div>
				</div>

				<div className='min-h-0 flex-1 overflow-y-auto'>
					{filtered.length === 0 ? (
						<p className='py-10 text-center text-sm text-(--sea-ink-soft)'>
							No exercises found
						</p>
					) : (
						<ul className='divide-y divide-(--line)'>
							{filtered.slice(0, 100).map((ex) => (
								<li key={ex.id}>
									<button
										type='button'
										onClick={() => handleSelect(ex)}
										className='w-full px-5 py-3 text-left transition-colors hover:bg-(--surface-strong)'
									>
										<p className='text-sm font-medium text-(--sea-ink)'>
											{ex.name}
										</p>
										<p className='mt-0.5 text-xs capitalize text-(--sea-ink-soft)'>
											{ex.category}
											{ex.primaryMuscles.length > 0 &&
												` · ${ex.primaryMuscles[0]}`}
										</p>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
