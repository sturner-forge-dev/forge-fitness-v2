import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
					Forge Fitness
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
					Forge Fitness was born from the desire for simplicity. Track workouts.
					See progress overtime. <br />
					No frills. <br />
					No fluff. <br />
					Just hard work and good data.
				</p>
			</section>
		</main>
	);
}
