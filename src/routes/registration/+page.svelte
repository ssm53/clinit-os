<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import { writable } from 'svelte/store';
	import { DateTime } from 'luxon';
	import { appointmentsWaiting } from '../../stores/store';

	let formErrors = {};
	export const walkIn = writable(true);
	export const booking = writable(false);
	export const filteredPatients = writable([]);
	export const tempPatientIC = writable('');
	export let patientIC;
	export let patientDetails = [];
	let today = DateTime.local().toISODate();

	export function clickWalkIn() {
		booking.set(false);
		walkIn.set(true);
	}

	export function clickBooking() {
		walkIn.set(false);
		booking.set(true);
	}

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
		filteredPatients.set([]);
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
			if (res.error) {
				formErrors = res.error;
				console.log(formErrors);
			}
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

	export async function newPatient(evt) {
		let age;
		if (parseInt(evt.target['age'].value) !== typeof Number) {
			age = 0;
		} else {
			age = parseInt(evt.target['age'].value);
		}
		let gender;
		if (evt.target['gender'].value == '') {
			gender = 'null';
		} else {
			gender = evt.target['gender'].value;
		}
		let email;
		if (evt.target['email'].value == '') {
			email = 'null';
		} else {
			email = evt.target['email'].value;
		}
		let race;
		if (evt.target['race'].value == '') {
			race = 'null';
		} else {
			race = evt.target['race'].value;
		}
		let doctor;
		if (evt.target['doctor'].value == '') {
			doctor = 'null';
		} else {
			doctor = evt.target['doctor'].value;
		}

		const newPatientData = {
			name: evt.target['name'].value.toLowerCase(),
			IC: evt.target['IC'].value,
			age: age,
			gender: gender,
			email: email,
			contact: evt.target['contact'].value,
			race: race,
			reason: evt.target['reason'].value.toLowerCase(),
			doctor: doctor
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
			// appointmentsWaiting.update((waitingAppointments) => [...waitingAppointments, newPatientData]);
			// appendAppointmentWaiting.set(newPatientData);
			postRegisterPatient();
		} else {
			if (res.error) {
				formErrors = res.error;
				console.log(formErrors);
			}
		}
	}

	export async function newPatientBooking(evt) {
		let age;
		if (parseInt(evt.target['age'].value) !== typeof Number) {
			age = 0;
		} else {
			age = parseInt(evt.target['age'].value);
		}
		let gender;
		if (evt.target['gender'].value == '') {
			gender = 'null';
		} else {
			gender = evt.target['gender'].value;
		}
		let email;
		if (evt.target['email'].value == '') {
			email = 'null';
		} else {
			email = evt.target['email'].value;
		}
		let race;
		if (evt.target['race'].value == '') {
			race = 'null';
		} else {
			race = evt.target['race'].value;
		}
		let doctor;
		if (evt.target['doctor'].value == '') {
			doctor = 'null';
		} else {
			doctor = evt.target['doctor'].value;
		}
		const newPatientData = {
			name: evt.target['name'].value.toLowerCase(),
			IC: evt.target['IC'].value,
			date: DateTime.fromISO(evt.target['date'].value).toISO(),
			contact: evt.target['contact'].value,
			reason: evt.target['reason'].value.toLowerCase(),
			age: age,
			gender: gender,
			email: email,
			race: race,
			doctor: doctor
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/new-patient-appointment-booking', {
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
		let doctor;
		if (evt.target['doctor'].value == '') {
			doctor = 'null';
		} else {
			doctor = evt.target['doctor'].value;
		}

		const appointmentDetails = {
			reason: evt.target['reason'].value,
			patientIC: patientIC,
			doctor: doctor
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

	export async function existingPatientBooking(evt) {
		let doctor;
		if (evt.target['doctor'].value == '') {
			doctor = 'null';
		} else {
			doctor = evt.target['doctor'].value;
		}

		const appointmentDetails = {
			date: DateTime.fromISO(evt.target['date'].value).toISO(),
			reason: evt.target['reason'].value,
			patientIC: patientIC,
			doctor: doctor
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/existing-patient-appointment-booking`, {
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
		let age;
		if (parseInt(evt.target['age'].value) !== typeof Number) {
			age = 0;
		} else {
			age = parseInt(evt.target['age'].value);
		}
		let gender;
		if (evt.target['gender'].value == '') {
			gender = 'null';
		} else {
			gender = evt.target['gender'].value;
		}
		let email;
		if (evt.target['email'].value == '') {
			email = 'null';
		} else {
			email = evt.target['email'].value;
		}
		let race;
		if (evt.target['race'].value == '') {
			race = 'null';
		} else {
			race = evt.target['race'].value;
		}

		let ic;
		tempPatientIC.subscribe((value) => (ic = value));

		const editPatientData = {
			name: evt.target['name'].value,
			IC: evt.target['IC'].value,
			contact: evt.target['contact'].value,
			age: age,
			gender: gender,
			email: email,
			race: race
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
			if (res.error) {
				formErrors = res.error;
				console.log(formErrors);
			}
		}
	}
</script>

<div
	class="top-container flex flex-col justify-center items-center border-b-2 border-black bg-white h-44"
>
	<div>
		<span class="font-bold text-3xl text-pink-700">Register Patient and Create Appointment</span>
	</div>
	<div class="flex flex-row justify-between mt-5">
		<button
			on:click={clickWalkIn}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Walk-In</button
		>
		<button
			on:click={clickBooking}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Bookings</button
		>
	</div>
</div>

{#if $walkIn}
	<div class="bg-white min-h-screen">
		<header class="bg-gray-100 shadow">
			<div class="container mx-auto py-4">
				<h1 class="text-2xl font-semibold text-gray-900">
					Register Patient and Create Appointment
				</h1>
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
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name * </label>
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
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number * </label>
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
						<label for="contact" class="block text-gray-700 text-sm font-bold mb-2">
							Contact Number *
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
						<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">
							Reason of Visit *
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
						<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
						<input
							type="number"
							name="age"
							placeholder="Enter age"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
						{#if 'age' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.age}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="gender" class="block text-gray-700 text-sm font-bold mb-2"> Gender </label>
						<select name="gender" class="block w-full rounded-md py-2 px-3 border border-gray-300">
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
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
						/>
						{#if 'email' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.email}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="race" class="block text-gray-700 text-sm font-bold mb-2"> Race </label>
						<input
							type="text"
							name="race"
							placeholder="Enter race"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
						{#if 'race' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.race}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2">Doctor</label>
						<input
							type="text"
							name="doctor"
							placeholder="Enter consultation doctor"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC * </label>
						<input
							type="text"
							name="IC"
							placeholder="Enter IC"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
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
							<button class="bg-pink-700" on:click={openAppointmentModal}>Create Appointment</button
							>
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
							Reason for visit *
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

						<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2"> Doctor </label>
						<input
							type="text"
							name="doctor"
							placeholder="Enter doctor in charge"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
						{#if 'doctor' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.doctor}</p>
						{/if}

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
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name * </label>
						<input
							type="text"
							name="name"
							placeholder="Enter name"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.name}
							required
						/>
						{#if 'name' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.name}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number * </label>
						<input
							type="text"
							name="IC"
							placeholder="Enter IC number"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.IC}
							required
						/>
						{#if 'IC' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.IC}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="contact" class="block text-gray-700 text-sm font-bold mb-2">
							Contact Number *
						</label>
						<input
							type="text"
							name="contact"
							placeholder="Enter contact number"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.contact}
							required
						/>
						{#if 'contact' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.contact}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
						<input
							type="number"
							name="age"
							placeholder="Enter age"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.age}
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
							value={patientDetails.gender}
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
							value={patientDetails.email}
						/>
						{#if 'email' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.email}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="race" class="block text-gray-700 text-sm font-bold mb-2"> Race </label>
						<input
							type="text"
							name="race"
							placeholder="Enter race"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.race}
						/>
						{#if 'race' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.race}</p>
						{/if}
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
{:else}
	<div class="bg-gray-700 min-h-screen">
		<header class="bg-gray-100 shadow">
			<div class="container mx-auto py-4">
				<h1 class="text-2xl font-semibold text-gray-900">
					Register Patient and Create Appointment
				</h1>
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
				<form
					on:submit|preventDefault={newPatientBooking}
					class="w-1/2 bg-white shadow-md rounded-lg p-8"
				>
					<div class="mb-6">
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name * </label>
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
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number * </label>
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
						<label for="date" class="block text-gray-700 text-sm font-bold mb-2">
							Appointment Date and Time *
						</label>
						<input
							type="datetime-local"
							name="date"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
						/>
						{#if 'date' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.date}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="contact" class="block text-gray-700 text-sm font-bold mb-2">
							Contact Number *
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
						<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">
							Reason of Visit *
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
						<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
						<input
							type="number"
							name="age"
							placeholder="Enter age"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
						/>
						{#if 'email' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.email}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="race" class="block text-gray-700 text-sm font-bold mb-2"> Race </label>
						<input
							type="text"
							name="race"
							placeholder="Enter race"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
						{#if 'race' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.race}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2">Doctor</label>
						<input
							type="text"
							name="doctor"
							placeholder="Enter consultation doctor"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC * </label>
						<input
							type="text"
							name="IC"
							placeholder="Enter IC"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
						/>
						{#if 'IC' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.IC}</p>
						{/if}
					</div>

					<div class="flex justify-end">
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
							type="submit"
						>
							Find Patient
						</button>
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
							<button class="bg-pink-700" on:click={openAppointmentModal}>Create Appointment</button
							>
						</div>
					{/each}
				</div>
			</div>
			<!-- Appointment Modal -->
			<div class=" w-screen flex-col hidden create-existing-appointment bg-white">
				<form
					on:submit|preventDefault={existingPatientBooking}
					class="w-1/2 bg-white shadow-md rounded-lg p-8"
				>
					<div class="mb-6">
						<label for="date" class="block text-gray-700 text-sm font-bold mb-2">
							Appointment Date and Time *
						</label>
						<input
							type="datetime-local"
							name="date"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
						/>
						{#if 'date' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.date}</p>
						{/if}

						<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">
							Reason for visit *
						</label>
						<input
							type="text"
							name="reason"
							placeholder="Enter reason"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
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
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name * </label>
						<input
							type="text"
							name="name"
							placeholder="Enter name"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.name}
							required
						/>
						<!-- {#if 'name' in formErrors}
					<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
				{/if} -->
					</div>

					<div class="mb-6">
						<label for="IC" class="block text-gray-700 text-sm font-bold mb-2"> IC Number * </label>
						<input
							type="text"
							name="IC"
							placeholder="Enter IC number"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.IC}
							required
						/>
						{#if 'IC' in formErrors}
							<p class="text-red-500 text-xs mt-1">{formErrors.IC}</p>
						{/if}
					</div>

					<div class="mb-6">
						<label for="contact" class="block text-gray-700 text-sm font-bold mb-2">
							Contact Number *
						</label>
						<input
							type="number"
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
						<label for="age" class="block text-gray-700 text-sm font-bold mb-2"> Age </label>
						<input
							type="number"
							name="age"
							placeholder="Enter age"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							value={patientDetails.age}
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
						/>
						<!-- {#if 'email' in formErrors}
					<p class="text-red-500 text-xs mt-1">{formErrors['email']}</p>
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
{/if}
