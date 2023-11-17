import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-today');

	const res = await resp.json();
	if (resp.status == 200) {
		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-waiting');

		const res2 = await resp2.json();

		const resp3 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-dispensary');
    const res3 = await resp3.json();

		return {
			todayAppointments: res.appointmentsToday,
			waitingAppointments: res2.appointmentsWaiting,
      dispensaryAppointments: res3.appointmentsDispensary
		};
	} else {
		return {
			todayAppointments: [],
			waitingAppointments: [],
      dispensaryAppointments: []
		};
	}
}
