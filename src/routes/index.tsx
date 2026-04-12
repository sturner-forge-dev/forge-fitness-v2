import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/')({ component: HomePage });

function HomePage() {
	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			{/* Hero */}
			<section className='island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-12 sm:px-12 sm:py-16'>
				<div className='pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]' />
				<div className='pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />

				<p className='island-kicker mb-4'>Your Training. Your Progress.</p>
				<h1 className='display-title mb-5 max-w-2xl text-5xl font-bold leading-[1.02] tracking-tight text-(--sea-ink) sm:text-7xl'>
					Forge your
					<br />
					<span className='text-(--lagoon-deep)'>best self.</span>
				</h1>
				<p className='mb-8 max-w-xl text-base text-(--sea-ink-soft) sm:text-lg'>
					Log workouts, track PRs, and watch your strength grow over time. Built
					for athletes who take their training seriously.
				</p>

				<SignedIn>
					<div className='flex flex-wrap gap-3'>
						<Button variant='outline' size='lg' asChild>
							<a href='/workouts/new'>Log a Workout</a>
						</Button>
						<Button variant='outline' size='lg' asChild>
							<a href='/workouts'>View History</a>
						</Button>
					</div>
				</SignedIn>
			</section>

			{/* Quick Stats */}
			<SignedIn>
				<section className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
					{[
						{ label: 'Workouts', value: '—', unit: 'this month' },
						{ label: 'Volume', value: '—', unit: 'lbs lifted' },
						{ label: 'Streak', value: '—', unit: 'days' },
						{ label: 'PRs Set', value: '—', unit: 'all time' },
					].map(({ label, value, unit }, i) => (
						<article
							key={label}
							className='island-shell feature-card rise-in rounded-2xl p-5 text-center'
							style={{ animationDelay: `${i * 60 + 120}ms` }}
						>
							<p className='island-kicker mb-1'>{label}</p>
							<p className='my-1 text-3xl font-bold text-(--sea-ink)'>
								{value}
							</p>
							<p className='m-0 text-xs text-(--sea-ink-soft)'>{unit}</p>
						</article>
					))}
				</section>
			</SignedIn>

			{/* Features */}
			<section className='mt-6 grid gap-4 sm:grid-cols-3'>
				{[
					{
						icon: '🏋️',
						title: 'Exercise Library',
						desc: 'Browse hundreds of exercises with guided instructions. Build custom routines from scratch or choose a template.',
						href: '/exercises',
					},
					{
						icon: '📈',
						title: 'Progress Tracking',
						desc: 'Visualize strength gains over time. See volume trends, set new PRs, and keep your momentum going.',
						href: '/progress',
					},
					{
						icon: '📋',
						title: 'Workout Programs',
						desc: 'Follow structured programs or build your own split. Schedule rest days and plan your training week.',
						href: '/programs',
					},
				].map(({ icon, title, desc, href }, i) => (
					<a
						key={title}
						href={href}
						className='island-shell feature-card rise-in block rounded-2xl p-6 no-underline'
						style={{ animationDelay: `${i * 80 + 300}ms` }}
					>
						<span className='mb-4 block text-3xl' aria-hidden='true'>
							{icon}
						</span>
						<h2 className='mb-2 text-base font-semibold text-(--sea-ink)'>
							{title}
						</h2>
						<p className='m-0 text-sm leading-relaxed text-(--sea-ink-soft)'>
							{desc}
						</p>
					</a>
				))}
			</section>

			{/* Recent Activity placeholder */}
			<section
				className='island-shell rise-in mt-6 rounded-2xl p-6'
				style={{ animationDelay: '480ms' }}
			>
				<div className='flex items-center justify-between'>
					<div>
						<p className='island-kicker mb-1'>Recent Activity</p>
						<h2 className='m-0 text-base font-semibold text-(--sea-ink)'>
							Your last workouts
						</h2>
					</div>
					<SignedIn>
						<a
							href='/workouts'
							className='rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.1)] px-4 py-2 text-xs font-semibold text-(--lagoon-deep) no-underline transition hover:bg-[rgba(79,184,178,0.2)]'
						>
							View all
						</a>
					</SignedIn>
				</div>
				<div className='mt-5 rounded-xl border border-dashed border-(--line) px-6 py-10 text-center'>
					<SignedIn>
						<p className='m-0 text-sm text-(--sea-ink-soft)'>
							No workouts logged yet.{' '}
							<a href='/workouts/new' className='font-semibold'>
								Start your first session →
							</a>
						</p>
					</SignedIn>
					<SignedOut>
						<p className='m-0 text-sm text-(--sea-ink-soft)'>
							Sign in to start tracking workouts.
						</p>
					</SignedOut>
				</div>
			</section>
		</main>
	);
}
