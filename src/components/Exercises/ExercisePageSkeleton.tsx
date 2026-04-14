export function ExercisesPageSkeleton() {
	return (
		<main className='page-wrap px-4 pb-12 pt-14'>
			<div className='mb-6'>
				<div className='mb-1 h-3.5 w-16 animate-pulse rounded-full bg-(--surface-strong)' />
				<div className='mt-2 h-10 w-56 animate-pulse rounded-lg bg-(--surface-strong)' />
				<div className='mt-3 h-3.5 w-24 animate-pulse rounded-full bg-(--surface-strong)' />
			</div>

			<div className='mb-4 space-y-3'>
				<div className='flex justify-center'>
					<div className='h-9 w-150 animate-pulse rounded-md bg-(--surface-strong)' />
				</div>
				<div className='flex flex-wrap justify-center gap-2'>
					{[44, 36, 44, 44].map((w, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
						<div key={i} className={`h-9 w-${w} animate-pulse rounded-md bg-(--surface-strong)`} />
					))}
				</div>
			</div>

			<section className='island-shell overflow-hidden rounded-2xl p-3'>
				<div className='divide-y divide-(--line)'>
					{Array.from({ length: 12 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
						<div key={i} className='flex items-center gap-4 px-3 py-3'>
							<div className='h-4 w-48 animate-pulse rounded-full bg-(--surface-strong)' />
							<div className='h-4 w-20 animate-pulse rounded-full bg-(--surface-strong)' />
							<div className='ml-auto h-4 w-16 animate-pulse rounded-full bg-(--surface-strong)' />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
