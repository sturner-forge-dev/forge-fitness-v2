import { useEffect, useState } from 'react';
import type { WorkoutSet } from './types';

export function makeId() {
	return Math.random().toString(36).slice(2);
}

export function makeEmptySet(setNumber: number): WorkoutSet {
	return {
		id: makeId(),
		setNumber,
		reps: undefined,
		weight: undefined,
		isWarmup: false,
	};
}

export function useElapsedTime(startedAt: Date) {
	const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startedAt.getTime()) / 1000));

	useEffect(() => {
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [startedAt]);

	const hours = Math.floor(elapsed / 3600);
	const minutes = Math.floor((elapsed % 3600) / 60);
	const seconds = elapsed % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
