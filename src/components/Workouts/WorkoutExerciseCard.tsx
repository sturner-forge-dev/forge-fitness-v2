import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { SetRow } from './SetRow';
import type { WorkoutExercise, WorkoutSet } from './types';

interface WorkoutExerciseCardProps {
	exercise: WorkoutExercise;
	onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
	onDeleteSet: (setId: string) => void;
	onAddSet: () => void;
	onDelete: () => void;
}

export function WorkoutExerciseCard({
	exercise,
	onUpdateSet,
	onDeleteSet,
	onAddSet,
	onDelete,
}: WorkoutExerciseCardProps) {
	const workingSets = exercise.sets.filter((s) => !s.isWarmup);

	return (
		<div className='island-shell rounded-2xl p-4'>
			<div className='mb-3 flex items-start justify-between gap-2'>
				<div>
					<h3 className='font-semibold text-(--sea-ink)'>{exercise.exerciseName}</h3>
					<div className='mt-1 flex items-center gap-2'>
						<Badge variant='outline' className='text-xs'>
							{exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
						</Badge>
						{workingSets.length > 0 && (
							<span className='text-xs text-(--sea-ink-soft)'>
								{workingSets.filter((s) => s.weight && s.reps).length} logged
							</span>
						)}
					</div>
				</div>
				<Button
					type='button'
					variant='ghost'
					size='icon'
					onClick={onDelete}
					className='h-8 w-8 shrink-0 text-(--sea-ink-soft) hover:text-red-500'
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</div>

			<div className='space-y-1'>
				{exercise.sets.map((set, i) => (
					<SetRow
						key={set.id}
						set={set}
						index={i}
						onChange={(updates) => onUpdateSet(set.id, updates)}
						onDelete={() => onDeleteSet(set.id)}
					/>
				))}
			</div>

			<Button
				type='button'
				variant='ghost'
				size='sm'
				onClick={onAddSet}
				className='mt-3 w-full text-(--lagoon-deep) hover:bg-[rgba(79,184,178,0.1)] hover:text-(--lagoon-deep)'
			>
				<Plus className='mr-1 h-3.5 w-3.5' />
				Add Set
			</Button>
		</div>
	);
}
