<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	// import { signUpAlert, signUpEmailTaken } from '../../../utils/alert';
	// import Spinner from '../../../spinner/spinner.svelte';
	// import { loading } from '../../../stores/store';

	let formErrors = {};

	export function postSignUp() {
		// signUpAlert();
		goto('/sign-in-doctor');
	}

	async function createDoctor(evt) {
		evt.preventDefault();

		// // spinner shits
		// loading.update((value) => {
		// 	return true;
		// });

		const doctorData = {
			name: evt.target['name'].value,
			email: evt.target['email'].value,
			password: evt.target['password'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/doctors', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(doctorData)
		});

		if (resp.status == 200) {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			postSignUp();
		} else if (resp.status == 500) {
			// spinner shits
			loading.update((value) => {
				return false;
			});
			// signUpEmailTaken();
		} else {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			const res = await resp.json();

			// formErrors = res.data;
			if (res.error) {
				formErrors = res.error; // Update formErrors with validation errors
			}
		}
	}
</script>

<div class="bg-white min-h-screen">
	<header class="bg-gray-100 shadow">
		<div class="container mx-auto py-4">
			<h1 class="text-2xl font-semibold text-gray-900 ml-4">Owner Sign Up</h1>
		</div>
	</header>

	<main class="container mx-auto py-8">
		<!-- <Spinner /> -->
		<div class="flex justify-center items-center">
			<form on:submit={createDoctor} class="w-1/2 bg-white shadow-lg rounded-lg p-8">
				<div class="mb-6">
					<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
					<input
						type="text"
						name="name"
						placeholder="Enter your name"
						class="block w-full rounded-md py-2 px-3 border border-gray-300 bg-black text-white"
					/>
					{#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="email" class="block text-gray-700 text-sm font-bold mb-2"> Email </label>
					<input
						type="email"
						name="email"
						placeholder="Enter your email"
						class="block w-full rounded-md py-2 px-3 border border-gray-300 bg-black text-white"
						required
					/>
					{#if 'email' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['email']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="password" class="block text-gray-700 text-sm font-bold mb-2">
						Password
					</label>
					<input
						type="password"
						name="password"
						placeholder="Enter your password"
						class="block w-full rounded-md py-2 px-3 border border-gray-300 bg-black text-white"
						required
					/>
					{#if 'password' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['password']}</p>
					{/if}
				</div>

				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Create an Account
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
