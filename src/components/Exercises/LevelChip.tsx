export function LevelChip({ level }: { level: string }) {
	return (
		<span
			className={`inline-block w-24 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold ${
				level === "beginner"
					? "bg-[rgba(47,106,74,0.12)] text-(--palm)"
					: level === "intermediate"
						? "bg-[rgba(79,184,178,0.14)] text-(--lagoon-deep)"
						: "bg-[rgba(220,38,38,0.1)] text-red-600 dark:text-red-400"
			}`}
		>
			{level}
		</span>
	);
}
