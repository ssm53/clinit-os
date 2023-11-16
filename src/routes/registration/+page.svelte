<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	// import { uploadImageFail, uploadImageSuc } from '../../utils/alert';

	let formErrors = {};

	export function postRegisterPatient() {
		// uploadImageSuc();
		goto('/');
	}

	async function registerPatient(evt) {
		// // spinner shits
		// loading.update((value) => {
		// 	return true;
		// });
		// name, IC, age, sex, email, contact nummber, age, race
		const patientData = {
			name: evt.target['name'].value,
			IC: evt.target['IC'].value,
			age: parseInt(evt.target['age'].value),
			gender: evt.target['gender'].value,
			email: evt.target['email'].value,
			contact: evt.target['contact'].value,
			race: evt.target['race'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/register-patient', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: getUserTokenFromLocalStorage()
			},
			body: JSON.stringify(patientData)
		});

		const res = await resp.json();
		console.log(res);

		if (resp.status == 200) {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			postRegisterPatient();
		} else {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			// uploadImageFail();
			if (res.error) {
				formErrors = res.error; // Update formErrors with validation errors
			}
		}
	}
</script>

<div class="bg-white min-h-screen">
	<header class="bg-gray-100 shadow">
		<div class="container mx-auto py-4">
			<h1 class="text-2xl font-semibold text-gray-900">Register Patient</h1>
		</div>
	</header>

	<main class="container mx-auto py-8">
		<!-- <Spinner /> -->
		<div class="flex justify-center items-center">
			<form
				on:submit|preventDefault={registerPatient}
				class="w-1/2 bg-white shadow-md rounded-lg p-8"
			>
				<div class="mb-6">
					<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
					<input
						type="text"
						name="name"
						placeholder="Enter name"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>
					{#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number </label>
					<input
						type="text"
						name="IC"
						placeholder="Enter IC number"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>
					{#if 'IC' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['IC']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
					<input
						type="number"
						name="age"
						placeholder="Enter age"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'age' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['age']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="gender" class="block text-gray-700 text-sm font-bold mb-2"> Gender </label>
					<input
						type="text"
						name="gender"
						placeholder="Enter gender"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'gender' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['gender']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="email" class="block text-gray-700 text-sm font-bold mb-2"> Email </label>
					<input
						type="text"
						name="email"
						placeholder="Enter email"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'email' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['email']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="contact" class="block text-gray-700 text-sm font-bold mb-2">
						Contact Number
					</label>
					<input
						type="text"
						name="contact"
						placeholder="Enter contact number"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'contact' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['contact']}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="race" class="block text-gray-700 text-sm font-bold mb-2"> Race </label>
					<input
						type="text"
						name="race"
						placeholder="Enter race"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'race' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['race']}</p>
					{/if}
				</div>

				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Complete Registration
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
