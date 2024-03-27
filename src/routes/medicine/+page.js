// import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
// import { getDoctorTokenFromLocalStorage, getUserTokenFromLocalStorage } from '../../utils/auth.js';

// export async function load({ fetch }) {
// 	// here if there is no doctor token, then redirect to home page
// 	if (!getDoctorTokenFromLocalStorage() && !getUserTokenFromLocalStorage()) {
// 		throw redirect(307, '/');
// 	}
// 	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-all-medicine');

// 	const res = await resp.json();
// 	if (resp.status == 200) {
// 		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-need-restock-medicine');
// 		const res2 = await resp2.json();
// 		return {
// 			allMeds: res.allMeds,
// 			restockMeds: res2.restockMeds
// 		};
// 	} else {
// 		return {
// 			allMeds: [],
// 			restockMeds: []
// 		};
// 	}
// }
