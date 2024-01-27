import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-need-restock-medicine');

	const res = await resp.json();
	if (resp.status == 200) {
		console.log(res.resotckMeds);
		return {
			restockMeds: res.restockMeds
		};
	} else {
		return {
			restockMeds: []
		};
	}
}
