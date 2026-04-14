import { Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Switch } from '#/components/ui/switch';
import { cn } from '#/lib/utils';
import type { WorkoutSet } from './types';

interface SetRowProps {
	set: WorkoutSet;
	index: number;
	onChange: (updates: Partial<WorkoutSet>) => void;
	onDelete: () => void;
}

export function SetRow({ set, index, onChange, onDelete }: SetRowProps) {
	return (
		<div
			className={cn(
				'grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-2 rounded-lg px-2 py-1.5',
				set.isWarmup && 'bg-(--surface)',
			)}
		>
			<span className='text-center text-xs font-medium text-(--sea-ink-soft)'>
				{set.isWarmup ? 'W' : index + 1}
			</span>

			<div className='flex flex-col gap-0.5'>
				<label className='text-[10px] font-medium text-(--sea-ink-soft)'>
					Weight (lbs)
				</label>
				<Input
					type='number'
					min='0'
					step='2.5'
					value={set.weight ?? ''}
					onChange={(e) =>
						onChange({
							weight: e.target.value ? Number(e.target.value) : undefined,
						})
					}
					className='h-8 text-sm'
					placeholder='0'
				/>
			</div>

			<div className='flex flex-col gap-0.5'>
				<label className='text-[10px] font-medium text-(--sea-ink-soft)'>
					Reps
				</label>
				<Input
					type='number'
					min='0'
					step='1'
					value={set.reps ?? ''}
					onChange={(e) =>
						onChange({ reps: e.target.value ? Number(e.target.value) : undefined })
					}
					className='h-8 text-sm'
					placeholder='0'
				/>
			</div>

			<div className='flex flex-col items-center gap-0.5'>
				<span className='text-[10px] font-medium text-(--sea-ink-soft)'>
					Warm
				</span>
				<Switch
					checked={set.isWarmup}
					onCheckedChange={(checked) => onChange({ isWarmup: checked })}
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
}
