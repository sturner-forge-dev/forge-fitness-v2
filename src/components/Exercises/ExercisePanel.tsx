import { Sheet, SheetContent, SheetHeader, SheetTitle } from '#/components/ui/sheet';
import { ExerciseDetailRow } from './ExerciseDetailRow';
import { LevelChip } from './LevelChip';
import type { Exercise } from './types';

interface ExercisePanelProps {
	exercise: Exercise;
	onClose: () => void;
}

export function ExercisePanel({ exercise, onClose }: ExercisePanelProps) {
	return (
		<Sheet open onOpenChange={(open) => !open && onClose()}>
			<SheetContent side='right' className='island-shell min-w-sm rounded-none border-l border-(--line) p-5'>
				<SheetHeader className='p-0'>
					<SheetTitle className='display-title text-xl font-bold leading-snug text-(--sea-ink)'>
						{exercise.name}
					</SheetTitle>
				</SheetHeader>

				<LevelChip level={exercise.level} />

				<div className='grid grid-cols-2 gap-4 border-t border-(--line) pt-4'>
					<ExerciseDetailRow label='Category' value={exercise.category} />
					{exercise.equipment && <ExerciseDetailRow label='Equipment' value={exercise.equipment} />}
					{exercise.force && <ExerciseDetailRow label='Force' value={exercise.force} />}
					{exercise.mechanic && <ExerciseDetailRow label='Mechanic' value={exercise.mechanic} />}
				</div>

				{exercise.primaryMuscles.length > 0 && (
					<div className='border-t border-(--line) pt-4'>
						<p className='text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)'>Primary Muscles</p>
						<p className='mt-0.5 capitalize text-(--sea-ink)'>{exercise.primaryMuscles.join(', ')}</p>
					</div>
				)}

				{exercise.secondaryMuscles.length > 0 && (
					<div className='border-t border-(--line) pt-4'>
						<p className='text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)'>Secondary Muscles</p>
						<p className='mt-0.5 capitalize text-(--sea-ink)'>{exercise.secondaryMuscles.join(', ')}</p>
					</div>
				)}

				{exercise.instructions.length > 0 && (
					<div className='border-t border-(--line) pt-4'>
						<p className='mb-2 text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)'>Instructions</p>
						<ol className='space-y-2'>
							{exercise.instructions.map((step, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
								<li key={i} className='flex gap-2 text-sm text-(--sea-ink)'>
									<span className='shrink-0 font-semibold text-(--lagoon-deep)'>{i + 1}.</span>
									{step}
								</li>
							))}
						</ol>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
