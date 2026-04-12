import { Link } from "@tanstack/react-router";

export default function NotFound() {
	return (
		<main className="page-wrap px-4 pb-12 pt-14">
			<section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-16 text-center sm:px-12 sm:py-24">
				<div className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]" />
				<div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

				<p className="island-kicker mb-4">404 — Page Not Found</p>
				<h1 className="display-title mb-5 text-6xl font-bold tracking-tight text-(--sea-ink) sm:text-8xl">
					Lost your<br />
					<span className="text-(--lagoon-deep)">way?</span>
				</h1>
				<p className="mx-auto mb-8 max-w-md text-base text-(--sea-ink-soft) sm:text-lg">
					This page doesn't exist. It may have been moved, deleted, or you may
					have followed a broken link.
				</p>

				<Link
					to="/"
					className="inline-flex items-center gap-2 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-6 py-3 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
				>
					← Back to home
				</Link>
			</section>
		</main>
	);
}
