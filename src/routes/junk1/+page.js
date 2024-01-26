import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-today');

	const res = await resp.json();
	if (resp.status == 200) {
		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-waiting');

		const res2 = await resp2.json();

		const resp3 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-dispensary');
		const res3 = await resp3.json();

		const resp4 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-all');
		const res4 = await resp4.json();

		const resp5 = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-follow-up-details');
		const res5 = await resp5.json();

		return {
			todayAppointments: res.appointmentsToday,
			waitingAppointments: res2.appointmentsWaiting,
			dispensaryAppointments: res3.appointmentsDispensary,
			allAppointments: res4.appointmentsAll,
			followUpDetails: res5.followUpDetails
		};
	} else {
		return {
			todayAppointments: [],
			waitingAppointments: [],
			dispensaryAppointments: [],
			followUpDetails: []
		};
	}
}
