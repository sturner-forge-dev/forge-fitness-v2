import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { syncUser } from './api';

export default function UserSync() {
	const { isLoaded, isSignedIn, user } = useUser();

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user) return;

		syncUser({
			data: {
				clerkId: user.id,
				email: user.primaryEmailAddress?.emailAddress ?? '',
				firstName: user.firstName ?? undefined,
				lastName: user.lastName ?? undefined,
				imageUrl: user.imageUrl ?? undefined,
			},
		}).catch(console.error);
	}, [isLoaded, isSignedIn, user]);

	return null;
}
