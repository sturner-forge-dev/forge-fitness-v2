import { useField } from '@tanstack/react-form';
import { Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Switch } from '#/components/ui/switch';
import { cn } from '#/lib/utils';
import type { WorkoutExercise } from './types';
import { withForm } from './workout-form';

export const SetRow = withForm({
	defaultValues: {
		name: '',
		notes: '',
		exercises: [] as WorkoutExercise[],
	},
	props: {
		exerciseIndex: 0 as number,
		setIndex: 0 as number,
		onDelete: (() => {}) as () => void,
	},
	render: ({ form, exerciseIndex, setIndex, onDelete }) => {
		const baseName = `exercises[${exerciseIndex}].sets[${setIndex}]` as const;
		const weightId = `${baseName}.weight`;
		const repsId = `${baseName}.reps`;

		const isWarmupField = useField({ form, name: `${baseName}.isWarmup` });
		const weightField = useField({ form, name: `${baseName}.weight` });
		const repsField = useField({ form, name: `${baseName}.reps` });

		return (
			<div
				className={cn(
					'grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-2 rounded-lg px-2 py-1.5',
					isWarmupField.state.value && 'bg-(--surface)',
				)}
			>
				<span className='text-center text-xs font-medium text-(--sea-ink-soft)'>
					{isWarmupField.state.value ? 'W' : setIndex + 1}
				</span>

				<div className='flex flex-col gap-0.5'>
					<label htmlFor={weightId} className='text-[10px] font-medium text-(--sea-ink-soft)'>
						Weight (lbs)
					</label>
					<Input
						id={weightId}
						type='number'
						min='0'
						step='2.5'
						value={weightField.state.value ?? ''}
						onChange={(e) => weightField.handleChange(e.target.value ? Number(e.target.value) : undefined)}
						onBlur={weightField.handleBlur}
						className='h-8 text-sm'
						placeholder='0'
					/>
				</div>

				<div className='flex flex-col gap-0.5'>
					<label htmlFor={repsId} className='text-[10px] font-medium text-(--sea-ink-soft)'>
						Reps
					</label>
					<Input
						id={repsId}
						type='number'
						min='0'
						step='1'
						value={repsField.state.value ?? ''}
						onChange={(e) => repsField.handleChange(e.target.value ? Number(e.target.value) : undefined)}
						onBlur={repsField.handleBlur}
						className='h-8 text-sm'
						placeholder='0'
					/>
				</div>

				<div className='flex flex-col items-center gap-0.5'>
					<span className='text-[10px] font-medium text-(--sea-ink-soft)'>Warm</span>
					<Switch
						checked={isWarmupField.state.value}
						onCheckedChange={(checked) => isWarmupField.handleChange(checked)}
						onBlur={isWarmupField.handleBlur}
						className='scale-75'
					/>
				</div>

				<Button
					type='button'
					variant='ghost'
					size='icon'
					onClick={onDelete}
					className='h-7 w-7 text-(--sea-ink-soft) hover:text-red-500'
				>
					<Trash2 className='h-3.5 w-3.5' />
				</Button>
			</div>
		);
	},
});
