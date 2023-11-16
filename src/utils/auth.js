import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
//SHAUNS CODE
import { goto } from '$app/navigation';
import { userLoggedIn } from '../stores/store';

// also need to set emptyauth
// pleaase note that we need to set three things to our local strage... at the moment, it is two

const userEmptyAuth = {
	userToken: '',
	user: ''
};
export function userLogOut() {
	localStorage.setItem('auth', JSON.stringify(userEmptyAuth));
	//SHAUNS CODE
	userLoggedIn.update((value) => {
		return false;
	});
	goto('/');

	return true;
}

// original authenticate user function
export async function authenticateUser(email, password) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/auth-user', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	const res = await resp.json();

	if (resp.status == 200) {
		// const res = await resp.json();
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userToken: res.userAccessToken, // here i put access token
				// refreshToken: res.refreshToken,
				user: res.userId
			})
		);
		//shauns code
		userLoggedIn.update((value) => {
			return true;
		});
		goto('/');
		// shaun's code
		return {
			success: true,
			res: res
		};
	} else {
		return {
			success: false,
			res: res
		};
	}
}

export function getUserId() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['user'];
	}
	return null;
}

export function getUserTokenFromLocalStorage() {
	let auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['userToken'];
	}
	return null;
}

export async function userIsLoggedIn() {
	if (!getUserTokenFromLocalStorage()) {
		userLoggedIn.set(false);
	} else {
		userLoggedIn.set(true);
	}
}
