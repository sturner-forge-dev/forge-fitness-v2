import { Button } from '#/components/ui/button';
import type { WorkoutDraft } from './types';
import { useElapsedTime } from './utils';

interface WorkoutSummaryBarProps {
	workout: WorkoutDraft;
	startedAt: Date;
	onFinish: () => void;
	isSubmitting: boolean;
}

export function WorkoutSummaryBar({ workout, startedAt, onFinish, isSubmitting }: WorkoutSummaryBarProps) {
	const elapsed = useElapsedTime(startedAt);
	const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 border-t border-(--line) bg-(--surface)/90 backdrop-blur-sm'>
			<div className='page-wrap flex items-center justify-between px-4 py-3'>
				<div className='flex items-center gap-6'>
					<div className='text-center'>
						<p className='text-xs text-(--sea-ink-soft)'>Exercises</p>
						<p className='text-sm font-bold text-(--sea-ink)'>{workout.exercises.length}</p>
					</div>
					<div className='text-center'>
						<p className='text-xs text-(--sea-ink-soft)'>Sets</p>
						<p className='text-sm font-bold text-(--sea-ink)'>{totalSets}</p>
					</div>
					<div className='text-center'>
						<p className='text-xs text-(--sea-ink-soft)'>Duration</p>
						<p className='font-mono text-sm font-bold text-(--lagoon-deep)'>{elapsed}</p>
					</div>
				</div>

				<Button type='button' onClick={onFinish} disabled={isSubmitting || workout.exercises.length === 0} size='sm'>
					{isSubmitting ? 'Saving…' : 'Finish Workout'}
				</Button>
			</div>
		</div>
	);
}
