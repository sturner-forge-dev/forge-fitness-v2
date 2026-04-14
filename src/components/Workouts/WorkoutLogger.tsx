import { useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { Dumbbell, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Exercise } from '#/components/Exercises/types';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { createWorkoutSession } from './api';
import { ExercisePicker } from './ExercisePicker';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { WorkoutSummaryBar } from './WorkoutSummaryBar';
import type { WorkoutDraft, WorkoutExercise, WorkoutSet } from './types';

function makeId() {
	return Math.random().toString(36).slice(2);
}

function makeEmptySet(setNumber: number): WorkoutSet {
	return { id: makeId(), setNumber, reps: undefined, weight: undefined, isWarmup: false };
}

interface WorkoutLoggerProps {
	exercises: Exercise[];
}

export function WorkoutLogger({ exercises }: WorkoutLoggerProps) {
	const navigate = useNavigate();
	const { user } = useUser();
	const [startedAt] = useState(() => new Date());
	const [pickerOpen, setPickerOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [workout, setWorkout] = useState<WorkoutDraft>({
		name: '',
		notes: '',
		exercises: [],
	});

	function addExercise(exercise: Exercise) {
		setWorkout((prev) => ({
			...prev,
			exercises: [
				...prev.exercises,
				{
					id: makeId(),
					exerciseId: exercise.id,
					exerciseName: exercise.name,
					order: prev.exercises.length,
					sets: [makeEmptySet(1)],
				},
			],
		}));
	}

	function removeExercise(exerciseId: string) {
		setWorkout((prev) => ({
			...prev,
			exercises: prev.exercises
				.filter((ex) => ex.id !== exerciseId)
				.map((ex, i) => ({ ...ex, order: i })),
		}));
	}

	function addSet(exerciseId: string) {
		setWorkout((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) => {
				if (ex.id !== exerciseId) return ex;
				return {
					...ex,
					sets: [...ex.sets, makeEmptySet(ex.sets.length + 1)],
				};
			}),
		}));
	}

	function updateSet(exerciseId: string, setId: string, updates: Partial<WorkoutSet>) {
		setWorkout((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) => {
				if (ex.id !== exerciseId) return ex;
				return {
					...ex,
					sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
				};
			}),
		}));
	}

	function deleteSet(exerciseId: string, setId: string) {
		setWorkout((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) => {
				if (ex.id !== exerciseId) return ex;
				const remaining = ex.sets
					.filter((s) => s.id !== setId)
					.map((s, i) => ({ ...s, setNumber: i + 1 }));
				return { ...ex, sets: remaining };
			}),
		}));
	}

	async function finishWorkout() {
		if (workout.exercises.length === 0 || !user) return;
		setIsSubmitting(true);
		try {
			await createWorkoutSession({
				data: {
					clerkId: user.id,
					name: workout.name || undefined,
					notes: workout.notes || undefined,
					startedAt: startedAt.toISOString(),
					completedAt: new Date().toISOString(),
					exercises: workout.exercises.map((ex) => ({
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
		} catch (err) {
			console.error('Failed to save workout:', err);
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<div className='space-y-4 pb-24'>
				{/* Workout name */}
				<div className='island-shell rounded-2xl p-4'>
					<Input
						type='text'
						value={workout.name}
						onChange={(e) =>
							setWorkout((prev) => ({ ...prev, name: e.target.value }))
						}
						placeholder='Workout name (optional)'
						className='border-none bg-transparent p-0 text-base font-semibold text-(--sea-ink) shadow-none focus-visible:ring-0'
					/>
				</div>

				{/* Exercise cards */}
				{workout.exercises.map((ex: WorkoutExercise) => (
					<WorkoutExerciseCard
						key={ex.id}
						exercise={ex}
						onUpdateSet={(setId, updates) => updateSet(ex.id, setId, updates)}
						onDeleteSet={(setId) => deleteSet(ex.id, setId)}
						onAddSet={() => addSet(ex.id)}
						onDelete={() => removeExercise(ex.id)}
					/>
				))}

				{/* Empty state */}
				{workout.exercises.length === 0 && (
					<div className='island-shell rounded-2xl px-6 py-12 text-center'>
						<Dumbbell className='mx-auto mb-3 h-8 w-8 text-(--sea-ink-soft)' />
						<p className='text-sm font-medium text-(--sea-ink)'>
							No exercises yet
						</p>
						<p className='mt-1 text-xs text-(--sea-ink-soft)'>
							Add your first exercise to get started
						</p>
					</div>
				)}

				{/* Add exercise button */}
				<Button
					type='button'
					variant='outline'
					className='w-full border-dashed'
					onClick={() => setPickerOpen(true)}
				>
					<Plus className='mr-2 h-4 w-4' />
					Add Exercise
				</Button>
			</div>

			<ExercisePicker
				open={pickerOpen}
				onOpenChange={setPickerOpen}
				exercises={exercises}
				onSelect={addExercise}
			/>

			<WorkoutSummaryBar
				workout={workout}
				startedAt={startedAt}
				onFinish={finishWorkout}
				isSubmitting={isSubmitting}
			/>
		</>
	);
}
