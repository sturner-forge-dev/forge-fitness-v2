export function PlaceholderSection({
	kicker,
	title,
	linkHref,
	linkLabel,
	emptyText,
	emptyLinkHref,
	emptyLinkLabel,
	animationDelay,
}: {
	kicker: string;
	title: string;
	linkHref: string;
	linkLabel: string;
	emptyText: string;
	emptyLinkHref: string;
	emptyLinkLabel: string;
	animationDelay: string;
}) {
	return (
		<section
			className='island-shell rise-in rounded-2xl p-6'
			style={{ animationDelay }}
		>
			<div className='flex items-center justify-between'>
				<div>
					<p className='island-kicker mb-1'>{kicker}</p>
					<h2 className='m-0 text-base font-semibold text-(--sea-ink)'>
						{title}
					</h2>
				</div>
				<a
					href={linkHref}
					className='rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.1)] px-4 py-2 text-xs font-semibold text-(--lagoon-deep) no-underline transition hover:bg-[rgba(79,184,178,0.2)]'
				>
					{linkLabel}
				</a>
			</div>
			<div className='mt-5 rounded-xl border border-dashed border-(--line) px-6 py-10 text-center'>
				<p className='m-0 text-sm text-(--sea-ink-soft)'>
					{emptyText}{' '}
					<a href={emptyLinkHref} className='font-semibold'>
						{emptyLinkLabel}
					</a>
				</p>
			</div>
		</section>
	);
}
