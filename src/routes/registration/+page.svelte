<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import { writable } from 'svelte/store';

	let formErrors = {};
	export const filteredPatients = writable([]);
	export const tempPatientIC = writable('');
	export let patientIC;
	export let patientDetails = [];

	export function postRegisterPatient() {
		goto('/');
	}

	export async function openExistingPatient() {
		let modalToHide = document.querySelector('.new-patient');
		modalToHide.classList.add('hidden');

		let modalToShow = document.querySelector('.existing-patient');
		modalToShow.classList.remove('hidden');
	}

	export async function closeExistingPatient() {
		let modalToHide = document.querySelector('.existing-patient');
		modalToHide.classList.add('hidden');

		let modalToShow = document.querySelector('.new-patient');
		modalToShow.classList.remove('hidden');
	}

	// filter patients function for nurses to get ori
	export async function getPatient(evt) {
		patientIC = evt.target['IC'].value;

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/filtered-patients/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			filteredPatients.set(res.filteredPatients);
		} else {
			console.log(res);
			filteredPatients.set([]);
		}
	}

	export async function clickEditDetails(ic) {
		// so here we're passing the ic as parameter, so we can change the store of IC to be used in editPatientDetails function.. this is cause we ady need evt as a parameter there. so we cant use it as a parameter

		await getPatientDetails(ic);
		let modalToHide = document.querySelector('.existing-patient');
		modalToHide.classList.add('hidden');
		let modalToShow = document.querySelector('.edit-details');
		modalToShow.classList.remove('hidden');

		tempPatientIC.set(ic); // Use set to update the store value
	}

	// when user clicks edit details, this function needs to be automatiacally called..maybe use onmount or something
	export async function getPatientDetails(ic) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-patient-details/${ic}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			console.log('success');
			patientDetails = res.patientDetails;
		} else {
			console.log('fail');
			patientDetails = [];
		}
	}

	export async function closeEditDetailsModal() {
		let modalToHide = document.querySelector('.edit-details');
		modalToHide.classList.add('hidden');
		let modalToShow = document.querySelector('.existing-patient');
		modalToShow.classList.remove('hidden');
	}

	export async function openAppointmentModal() {
		let modalToShow = document.querySelector('.create-existing-appointment');
		modalToShow.classList.remove('hidden');
	}

	export async function closeAppointmentModal() {
		let modalToHide = document.querySelector('.create-existing-appointment');
		modalToHide.classList.add('hidden');
	}

	async function newPatient(evt) {
		const newPatientData = {
			name: evt.target['name'].value.toLowerCase(),
			IC: evt.target['IC'].value,
			age: parseInt(evt.target['age'].value),
			gender: evt.target['gender'].value.toLowerCase(),
			email: evt.target['email'].value,
			contact: evt.target['contact'].value,
			race: evt.target['race'].value.toLowerCase(),
			reason: evt.target['reason'].value.toLowerCase(),
			doctor: evt.target['doctor'].value.toLowerCase()
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/new-patient-appointment', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: getUserTokenFromLocalStorage()
			},
			body: JSON.stringify(newPatientData)
		});

		const res = await resp.json();
		console.log(res);

		if (resp.status == 200) {
			postRegisterPatient();
		} else {
			if (res.error) {
				formErrors = res.error;
				console.log(formErrors);
			}
		}
	}

	export async function existingPatient(evt) {
		const appointmentDetails = {
			reason: evt.target['reason'].value,
			patientIC: patientIC,
			doctor: evt.target['doctor'].value
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/existing-patient-appointment`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(appointmentDetails)
		});

		const res = await resp.json();
		if (resp.status == 200) {
			let modalToHide = document.querySelector('.create-existing-appointment');
			modalToHide.classList.add('hidden');
			goto('/');
		} else {
			console.log('hello2');
		}
	}

	export async function editPatientDetails(evt) {
		let ic;

		tempPatientIC.subscribe((value) => (ic = value));

		const editPatientData = {
			name: evt.target['name'].value,
			IC: evt.target['IC'].value,
			age: parseInt(evt.target['age'].value),
			gender: evt.target['gender'].value,
			email: evt.target['email'].value,
			contact: evt.target['contact'].value,
			race: evt.target['race'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/update-patient-details/${ic}`, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: sellerToken
				// need onre more which is authorisation - for that the value will be the token when youre signed in
			},
			body: JSON.stringify(editPatientData)
		});

		const res = await resp.json();

		if (resp.status === 200) {
			// loading.set(false);
			// loading.update((value) => {
			// 	return false;
			// });
			closeEditDetailsModal();
		} else {
			console.log('something went wrong there matey');
		}
	}
</script>

<div class="bg-white min-h-screen">
	<header class="bg-gray-100 shadow">
		<div class="container mx-auto py-4">
			<h1 class="text-2xl font-semibold text-gray-900">Register Patient and Create Appointment</h1>
		</div>
	</header>

	<button
		class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
		on:click={openExistingPatient}
	>
		Existing Patient
	</button>

	<main class="container mx-auto py-8">
		<!-- <Spinner /> -->
		<div class="flex justify-center items-center new-patient">
			<form on:submit|preventDefault={newPatient} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6">
					<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
					<input
						type="text"
						name="name"
						placeholder="Enter name"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors.name}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number </label>
					<input
						type="text"
						name="IC"
						placeholder="Enter IC number"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'IC' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors.IC}</p>
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
						<p class="text-red-500 text-xs mt-1">{formErrors.age}</p>
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
						<p class="text-red-500 text-xs mt-1">{formErrors.gender}</p>
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
						<p class="text-red-500 text-xs mt-1">{formErrors.email}</p>
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
						<p class="text-red-500 text-xs mt-1">{formErrors.contact}</p>
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
						<p class="text-red-500 text-xs mt-1">{formErrors.race}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">
						Reason of Visit
					</label>
					<input
						type="text"
						name="reason"
						placeholder="Enter reason"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'reason' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors.reason}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2">Doctor</label>
					<input
						type="text"
						name="doctor"
						placeholder="Enter consultation doctor"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						required
					/>
					{#if 'doctor' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors.doctor}</p>
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
		<!-- here we're gonna have a small search box at the top  to find for the patient, then once found, the patent details will
		show in the middle of the page, and a create apppointment button at the right. if appointment created, we go to appointment page. should have a button to say go back, which
		will go back to new patient tab.  -->
		<!-- MODAL 1 -->
		<div class=" w-screen flex-col hidden bg-white existing-patient">
			<button
				class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
				on:click={closeExistingPatient}
			>
				Go Back
			</button>
			<form on:submit|preventDefault={getPatient} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6">
					<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC </label>
					<input
						type="text"
						name="IC"
						placeholder="Enter IC"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>

					<div class="flex justify-end">
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
							type="submit"
						>
							Find Patient
						</button>
					</div>
				</div>
			</form>
			<div>
				{#each $filteredPatients as fPatient}
					<div class=" flex flex-row">
						<p class="mr-5">{fPatient.name}</p>
						<p class="mr-5">{fPatient.IC}</p>
						<p class="mr-5">{fPatient.age}</p>
						<p class="mr-5">{fPatient.gender}</p>
						<p class="mr-5">{fPatient.email}</p>
						<p class="mr-5">{fPatient.contact}</p>
						<p>{fPatient.race}</p>
						<button on:click={() => clickEditDetails(fPatient.IC)}>Edit Details</button>
						<button class="bg-pink-700" on:click={openAppointmentModal}>Create Appointment</button>
					</div>
				{/each}
			</div>
		</div>
		<!-- Appointment Modal -->
		<div class=" w-screen flex-col hidden create-existing-appointment bg-white">
			<form
				on:submit|preventDefault={existingPatient}
				class="w-1/2 bg-white shadow-md rounded-lg p-8"
			>
				<div class="mb-6">
					<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">
						Reason for visit
					</label>
					<input
						type="text"
						name="reason"
						placeholder="Enter reason"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>

					<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2"> Doctor </label>
					<input
						type="text"
						name="doctor"
						placeholder="Enter doctor in charge"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>

					<div class="flex justify-end">
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
							type="submit"
						>
							Set Appointment
						</button>
						<button on:click={closeAppointmentModal}> Cancel </button>
					</div>
				</div>
			</form>
		</div>

		<!-- MODAL 3 -->
		<div class=" w-screen flex-col hidden edit-details bg-white">
			<button on:click={closeEditDetailsModal}>Close Modal</button>
			<form
				on:submit|preventDefault={editPatientDetails}
				class="w-1/2 bg-white shadow-md rounded-lg p-8"
			>
				<div class="mb-6">
					<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
					<input
						type="text"
						name="name"
						placeholder="Enter name"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.name}
					/>
					<!-- {#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
					{/if} -->
				</div>

				<div class="mb-6">
					<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number </label>
					<input
						type="text"
						name="IC"
						placeholder="Enter IC number"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.IC}
					/>
					<!-- {#if 'IC' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['IC']}</p>
					{/if} -->
				</div>

				<div class="mb-6">
					<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
					<input
						type="number"
						name="age"
						placeholder="Enter age"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.age}
						required
					/>
					<!-- {#if 'age' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['age']}</p>
					{/if} -->
				</div>

				<div class="mb-6">
					<label for="gender" class="block text-gray-700 text-sm font-bold mb-2"> Gender </label>
					<input
						type="text"
						name="gender"
						placeholder="Enter gender"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.gender}
						required
					/>
					<!-- {#if 'gender' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['gender']}</p>
					{/if} -->
				</div>

				<div class="mb-6">
					<label for="email" class="block text-gray-700 text-sm font-bold mb-2"> Email </label>
					<input
						type="text"
						name="email"
						placeholder="Enter email"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.email}
						required
					/>
					<!-- {#if 'email' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['email']}</p>
					{/if} -->
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
						value={patientDetails.contact}
						required
					/>
					<!-- {#if 'contact' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['contact']}</p>
					{/if} -->
				</div>

				<div class="mb-6">
					<label for="race" class="block text-gray-700 text-sm font-bold mb-2"> Race </label>
					<input
						type="text"
						name="race"
						placeholder="Enter race"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
						value={patientDetails.race}
						required
					/>
					<!-- {#if 'race' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['race']}</p>
					{/if} -->
				</div>

				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Complete Edit Details
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
