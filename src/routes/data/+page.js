// here we want to get from appt table the apptid, patientIC, date, amounnt. in the same request, from our patient table, we need the name of patient
import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-all-revenue');

	const res = await resp.json();
	if (resp.status == 200) {
		return {
			revenueDetails: res.revenueDetails
		};
	} else {
		return {
			revenueDetails: []
		};
	}
}
