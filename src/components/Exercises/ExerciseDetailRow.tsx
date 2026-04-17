interface ExerciseExerciseDetailRowProps {
	label: string;
	value: string;
}

export function ExerciseDetailRow({ label, value }: ExerciseExerciseDetailRowProps) {
	return (
		<div>
			<p className='text-xs font-semibold capitalize tracking-wide text-(--sea-ink-soft)'>{label}</p>
			<p className='mt-0.5 capitalize text-(--sea-ink)'>{value}</p>
		</div>
	);
}
