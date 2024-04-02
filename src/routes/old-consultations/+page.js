import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getDoctorTokenFromLocalStorage } from '../../utils/auth.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch }) {
	// here if there is no doctor token, then redirect to home page
	if (!getDoctorTokenFromLocalStorage()) {
		throw redirect(307, '/');
	}
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/queue');

	const res = await resp.json();
	if (resp.status == 200) {
		return {
			waitingAppointments: res.appointmentsWaiting
		};
	} else {
		return {
			waitingAppointments: []
		};
	}
}
