export function LevelChip({ level }: { level: string }) {
	return (
		<span
			className={`inline-block w-24 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold ${
				level === 'beginner'
					? 'bg-(--success) text-(--palm)'
					: level === 'intermediate'
						? 'bg-(--warning) text-amber-700 dark:text-amber-400'
						: 'bg-(--danger) text-red-600 dark:text-red-400'
			}`}
		>
			{level}
		</span>
	);
}
