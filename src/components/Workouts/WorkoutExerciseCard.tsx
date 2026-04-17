import { useField } from '@tanstack/react-form';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { SetRow } from './SetRow';
import type { WorkoutExercise } from './types';
import { makeEmptySet } from './utils';
import { withForm } from './workout-form';

export const WorkoutExerciseCard = withForm({
	defaultValues: {
		name: '',
		notes: '',
		exercises: [] as WorkoutExercise[],
	},
	props: {
		exerciseIndex: 0 as number,
		onDelete: (() => {}) as () => void,
	},
	render: ({ form, exerciseIndex, onDelete }) => {
		const setsField = useField({
			form,
			name: `exercises[${exerciseIndex}].sets`,
			mode: 'array',
		});

		const sets = setsField.state.value;
		const workingSets = sets.filter((s) => !s.isWarmup);
		const exerciseName = form.state.values.exercises[exerciseIndex]?.exerciseName;

		return (
			<div className='island-shell rounded-2xl p-4'>
				<div className='mb-3 flex items-start justify-between gap-2'>
					<div>
						<h3 className='font-semibold text-(--sea-ink)'>{exerciseName}</h3>
						<div className='mt-1 flex items-center gap-2'>
							<Badge variant='outline' className='text-xs'>
								{sets.length} {sets.length === 1 ? 'set' : 'sets'}
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
					{sets.map((set, setIdx) => (
						<SetRow
							key={set.id}
							form={form}
							exerciseIndex={exerciseIndex}
							setIndex={setIdx}
							onDelete={() => setsField.removeValue(setIdx)}
						/>
					))}
				</div>

				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => setsField.pushValue(makeEmptySet(sets.length + 1))}
					className='mt-3 w-full text-(--lagoon-deep) hover:bg-[rgba(79,184,178,0.1)] hover:text-(--lagoon-deep)'
				>
					<Plus className='mr-1 h-3.5 w-3.5' />
					Add Set
				</Button>
			</div>
		);
	},
});
