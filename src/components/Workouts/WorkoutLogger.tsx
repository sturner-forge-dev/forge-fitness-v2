import { useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { Dumbbell, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Exercise } from '#/components/Exercises/types';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { createWorkoutSession } from './api';
import { ExercisePicker } from './ExercisePicker';
import type { WorkoutExercise } from './types';
import { makeEmptySet, makeId } from './utils';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { WorkoutSummaryBar } from './WorkoutSummaryBar';
import { useAppForm } from './workout-form';

interface WorkoutLoggerProps {
	exercises: Exercise[];
}

export function WorkoutLogger({ exercises }: WorkoutLoggerProps) {
	const navigate = useNavigate();
	const { user } = useUser();
	const [startedAt] = useState(() => new Date());
	const [pickerOpen, setPickerOpen] = useState(false);

	const form = useAppForm({
		defaultValues: {
			name: '',
			notes: '',
			exercises: [] as WorkoutExercise[],
		},
		onSubmit: async ({ value }) => {
			if (value.exercises.length === 0 || !user) return;
			await createWorkoutSession({
				data: {
					clerkId: user.id,
					name: value.name || undefined,
					notes: value.notes || undefined,
					startedAt: startedAt.toISOString(),
					completedAt: new Date().toISOString(),
					exercises: value.exercises.map((ex) => ({
						exerciseId: ex.exerciseId,
						order: ex.order,
						notes: ex.notes,
						sets: ex.sets.map((s) => ({
							setNumber: s.setNumber,
							reps: s.reps,
							weight: s.weight,
							durationSeconds: s.durationSeconds,
							isWarmup: s.isWarmup,
							rpe: s.rpe,
						})),
					})),
				},
			});
			navigate({ to: '/workouts' });
		},
	});

	function addExercise(exercise: Exercise) {
		form.setFieldValue('exercises', (prev) => [
			...prev,
			{
				id: makeId(),
				exerciseId: exercise.id,
				exerciseName: exercise.name,
				order: prev.length,
				sets: [makeEmptySet(1)],
			} satisfies WorkoutExercise,
		]);
	}

	return (
		<form.AppForm>
			<div className='space-y-4 pb-24'>
				{/* Workout name */}
				<div className='island-shell rounded-2xl p-4'>
					<form.Field name='name'>
						{(field) => (
							<Input
								type='text'
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder='Workout name (optional)'
								className='border-none bg-transparent p-0 text-base font-semibold text-(--sea-ink) shadow-none focus-visible:ring-0'
							/>
						)}
					</form.Field>
				</div>

				{/* Exercise cards */}
				<form.Field name='exercises' mode='array'>
					{(exercisesField) => (
						<>
							{exercisesField.state.value.map((ex, exIdx) => (
								<WorkoutExerciseCard
									key={ex.id}
									form={form}
									exerciseIndex={exIdx}
									onDelete={() => exercisesField.removeValue(exIdx)}
								/>
							))}

							{exercisesField.state.value.length === 0 && (
								<div className='island-shell rounded-2xl px-6 py-12 text-center'>
									<Dumbbell className='mx-auto mb-3 h-8 w-8 text-(--sea-ink-soft)' />
									<p className='text-sm font-medium text-(--sea-ink)'>No exercises yet</p>
									<p className='mt-1 text-xs text-(--sea-ink-soft)'>Add your first exercise to get started</p>
								</div>
							)}
						</>
					)}
				</form.Field>

				{/* Add exercise button */}
				<Button type='button' variant='outline' className='w-full border-dashed' onClick={() => setPickerOpen(true)}>
					<Plus className='mr-2 h-4 w-4' />
					Add Exercise
				</Button>
			</div>

			<ExercisePicker open={pickerOpen} onOpenChange={setPickerOpen} exercises={exercises} onSelect={addExercise} />

			<form.Subscribe selector={(state) => ({ values: state.values, isSubmitting: state.isSubmitting })}>
				{({ values, isSubmitting }) => (
					<WorkoutSummaryBar
						workout={values}
						startedAt={startedAt}
						onFinish={() => form.handleSubmit()}
						isSubmitting={isSubmitting}
					/>
				)}
			</form.Subscribe>
		</form.AppForm>
	);
}
