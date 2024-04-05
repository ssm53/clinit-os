export const ssr = false;
import { userIsLoggedIn, doctorIsLoggedIn } from '../utils/auth';

let hasCheckedUserLoggedIn = false; // Add this flag
let hasCheckedDoctorLoggedIn = false;

export async function load() {
	if (!hasCheckedUserLoggedIn && !hasCheckedDoctorLoggedIn) {
		// Check if isLoggedIn has been called before
		await userIsLoggedIn();
		await doctorIsLoggedIn();
		hasCheckedUserLoggedIn = true; // Set the flag to true to prevent further calls
		hasCheckedDoctorLoggedIn = true;
	}
}
