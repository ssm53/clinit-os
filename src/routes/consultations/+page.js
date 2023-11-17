import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-waiting');

	const res = await resp.json();
	if (resp.status == 200) {

		return {
			waitingAppointments: res.appointmentsWaiting,
		};
	} else {
		return {
			waitingAppointments: [],
		};
	}
}