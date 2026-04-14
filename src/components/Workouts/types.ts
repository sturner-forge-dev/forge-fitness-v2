export interface WorkoutSet {
	id: string;
	setNumber: number;
	reps?: number;
	weight?: number;
	durationSeconds?: number;
	isWarmup: boolean;
	rpe?: number;
}

export interface WorkoutExercise {
	id: string;
	exerciseId: number;
	exerciseName: string;
	order: number;
	notes?: string;
	sets: WorkoutSet[];
}

export interface WorkoutDraft {
	name: string;
	notes: string;
	exercises: WorkoutExercise[];
}
