import { createFileRoute } from '@tanstack/react-router';
import { getExercises } from '#/components/Exercises/api';
import { WorkoutLogger } from '#/components/Workouts/WorkoutLogger';

export const Route = createFileRoute('/workouts/new')({
	loader: async () => getExercises(),
	component: NewWorkoutPage,
});

function NewWorkoutPage() {
	const exercises = Route.useLoaderData();

	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			<div className='rise-in mb-6'>
				<p className='island-kicker mb-1'>Log Session</p>
				<h1 className='display-title text-4xl font-bold tracking-tight text-(--sea-ink)'>
					New Workout
				</h1>
			</div>

			<WorkoutLogger exercises={exercises} />
		</main>
	);
}
