import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/clerk-react';

export default function HeaderUser() {
	return (
		<>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<SignedOut>
				<SignInButton mode='modal'>
					<button
						type='button'
						className='rounded-md border border-(--line) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) transition-colors hover:bg-(--surface-strong)'
					>
						Sign in
					</button>
				</SignInButton>
			</SignedOut>
		</>
	);
}
