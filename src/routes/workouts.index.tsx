import { useUser } from '@clerk/clerk-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getWorkoutSessions } from '#/components/Workouts/api';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/workouts/')({
	component: WorkoutsPage,
});

type Session = Awaited<ReturnType<typeof getWorkoutSessions>>[number];

function WorkoutsPage() {
	const { user, isLoaded } = useUser();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isLoaded || !user) {
			setLoading(false);
			return;
		}
		getWorkoutSessions({ data: { clerkId: user.id } })
			.then(setSessions)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [isLoaded, user]);

	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			<div className='rise-in mb-6 flex items-end justify-between'>
				<div>
					<p className='island-kicker mb-1'>History</p>
					<h1 className='display-title text-4xl font-bold tracking-tight text-(--sea-ink)'>
						Workouts
					</h1>
				</div>
				<Button asChild>
					<Link to='/workouts/new'>Log Workout</Link>
				</Button>
			</div>

			{loading ? (
				<div className='island-shell rise-in space-y-3 rounded-2xl p-5'>
					{[...Array(3)].map((_, i) => (
						<div key={i} className='h-16 animate-pulse rounded-xl bg-(--surface-strong)' />
					))}
				</div>
			) : sessions.length === 0 ? (
				<div className='island-shell rise-in rounded-2xl px-6 py-16 text-center'>
					<p className='text-sm font-medium text-(--sea-ink)'>
						No workouts logged yet
					</p>
					<p className='mt-1 text-xs text-(--sea-ink-soft)'>
						Your sessions will appear here after you finish one.
					</p>
					<Button asChild className='mt-4' variant='outline'>
						<Link to='/workouts/new'>Start your first session →</Link>
					</Button>
				</div>
			) : (
				<div className='rise-in space-y-3'>
					{sessions.map((session) => {
						const totalSets = session.exercises.reduce(
							(acc, ex) => acc + ex._count.sets,
							0,
						);
						const date = new Date(session.startedAt);
						const duration =
							session.completedAt
								? Math.round(
										(new Date(session.completedAt).getTime() - date.getTime()) /
											60000,
									)
								: null;

						return (
							<article
								key={session.id}
								className='island-shell feature-card rounded-2xl p-5'
							>
								<div className='flex items-start justify-between gap-4'>
									<div>
										<p className='font-semibold text-(--sea-ink)'>
											{session.name ?? 'Workout'}
										</p>
										<p className='mt-0.5 text-xs text-(--sea-ink-soft)'>
											{date.toLocaleDateString('en-US', {
												weekday: 'short',
												month: 'short',
												day: 'numeric',
											})}
											{duration != null && ` · ${duration} min`}
										</p>
									</div>
									<div className='flex gap-4 text-right'>
										<div>
											<p className='text-sm font-bold text-(--sea-ink)'>
												{session._count.exercises}
											</p>
											<p className='text-xs text-(--sea-ink-soft)'>exercises</p>
										</div>
										<div>
											<p className='text-sm font-bold text-(--sea-ink)'>
												{totalSets}
											</p>
											<p className='text-xs text-(--sea-ink-soft)'>sets</p>
										</div>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</main>
	);
}
