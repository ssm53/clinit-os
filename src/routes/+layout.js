export const ssr = false;

import { userIsLoggedIn } from '../utils/auth';

let hasCheckedLoggedIn = false; // Add this flag

export async function load() {
	if (!hasCheckedLoggedIn) {
		// Check if isLoggedIn has been called before
		await userIsLoggedIn();
		hasCheckedLoggedIn = true; // Set the flag to true to prevent further calls
	}
}
