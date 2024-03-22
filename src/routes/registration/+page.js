import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getDoctorTokenFromLocalStorage, getUserTokenFromLocalStorage } from '../../utils/auth.js';

export async function load({ fetch }) {
	// here if there is no doctor token, then redirect to home page
	if (!getDoctorTokenFromLocalStorage() && !getUserTokenFromLocalStorage()) {
		throw redirect(307, '/');
	}
}
