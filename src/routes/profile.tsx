import { useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { PlaceholderSection } from '#/components/Profile/PlaceholderSection';

export const Route = createFileRoute('/profile')({
	component: ProfilePage,
});

function ProfilePage() {
	const { isLoaded, isSignedIn, user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			navigate({ to: '/' });
		}
	}, [isLoaded, isSignedIn, navigate]);

	if (!isLoaded || !isSignedIn) return null;

	const memberSince = user.createdAt
		? new Intl.DateTimeFormat('en-US', {
				month: 'long',
				year: 'numeric',
			}).format(user.createdAt)
		: null;

	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			{/* Profile header */}
			<section className='island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-12'>
				<div className='pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]' />
				<div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center'>
					{user.imageUrl && (
						<img
							src={user.imageUrl}
							alt={`${user.firstName} ${user.lastName}`}
							className='h-20 w-20 rounded-full border-2 border-(--line) object-cover'
						/>
					)}
					<div>
						<p className='island-kicker mb-1'>Profile</p>
						<h1 className='display-title mb-1 text-3xl font-bold text-(--sea-ink) sm:text-4xl'>
							{user.firstName} {user.lastName}
						</h1>
						<p className='text-sm text-(--sea-ink-soft)'>
							{user.primaryEmailAddress?.emailAddress}
						</p>
						{memberSince && (
							<p className='mt-2 text-xs text-(--sea-ink-soft)'>
								Member since {memberSince}
							</p>
						)}
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
				{[
					{ label: 'Workouts', value: '—', unit: 'total' },
					{ label: 'Volume', value: '—', unit: 'lbs lifted' },
					{ label: 'Best Streak', value: '—', unit: 'days' },
					{ label: 'PRs Set', value: '—', unit: 'all time' },
				].map(({ label, value, unit }, i) => (
					<article
						key={label}
						className='island-shell feature-card rise-in rounded-2xl p-5 text-center'
						style={{ animationDelay: `${i * 60 + 120}ms` }}
					>
						<p className='island-kicker mb-1'>{label}</p>
						<p className='my-1 text-3xl font-bold text-(--sea-ink)'>{value}</p>
						<p className='m-0 text-xs text-(--sea-ink-soft)'>{unit}</p>
					</article>
				))}
			</section>

			<div className='mt-6 grid gap-4 sm:grid-cols-2'>
				{/* Recent workouts */}
				<PlaceholderSection
					kicker='Workouts'
					title='Recent sessions'
					linkHref='/workouts'
					linkLabel='View all'
					emptyText='No workouts logged yet.'
					emptyLinkHref='/workouts/new'
					emptyLinkLabel='Start your first session →'
					animationDelay='360ms'
				/>

				{/* Active programs */}
				<PlaceholderSection
					kicker='Programs'
					title='Active programs'
					linkHref='/programs'
					linkLabel='Browse'
					emptyText='No active programs.'
					emptyLinkHref='/programs'
					emptyLinkLabel='Find a program →'
					animationDelay='420ms'
				/>
			</div>
		</main>
	);
}
