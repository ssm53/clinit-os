<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { writable } from 'svelte/store';

	export let data;
	export const filteredPatients = writable([]);
	export const filterOn = writable(false);
	// export const editDetailsOn = writable(false);
	export const tempPatientIC = writable('');
	const patientDetailsStore = writable([]);
	export let patientIC;
	export let patientDetails = [];

	// open modal
	export async function openFilter() {
		let hiddenModal = document.querySelector('.filter-box');
		hiddenModal.classList.remove('hidden');
	}
	// close Modal
	export async function closeFilter() {
		let hiddenModal = document.querySelector('.filter-box');
		hiddenModal.classList.add('hidden');
	}

	// filter patients function
	export async function filterPatients(evt) {
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
			console.log('hello');
			filterOn.set(true);
			filteredPatients.set(res.filteredPatients);
			let hiddenModal = document.querySelector('.filter-box');
			hiddenModal.classList.add('hidden');
		} else {
			console.log(res);
			filteredPatients.set([]);
		}
	}

	export async function clearFilters() {
		filterOn.set(false);
	}

	export async function openAppointmentModal() {
		let hiddenModal = document.querySelector('.filter-box2');
		hiddenModal.classList.remove('hidden');
	}

	export async function setAppointment(evt) {
		const appointmentDetails = {
			reason: evt.target['reason'].value,
			patientIC: patientIC,
			doctor: evt.target['doctor'].value
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/set-appointment`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				appointmentDetails
			})
		});

		const res = await resp.json();
		if (resp.status == 200) {
			console.log('hello');
			let hiddenModal = document.querySelector('.filter-box2');
			hiddenModal.classList.add('hidden');
			goto('/');
		} else {
			console.log('hello2');
		}
	}

	export async function closeAppointmentModal() {
		let hiddenModal = document.querySelector('.filter-box2');
		hiddenModal.classList.add('hidden');
	}

	export async function clickEditDetails(ic) {
		// so here we're passing the ic as parameter, so we can change the store of IC to be used in editPatientDetails function.. this is cause we ady need evt as a parameter there. so we cant use it as a parameter

		await getPatientDetails(ic);
		let hiddenModal = document.querySelector('.filter-box3');
		hiddenModal.classList.remove('hidden');
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

	export async function editPatientDetails(evt) {
		// loading.set(true);
		// // loading.update((value) => {
		// //   return true
		// // })
		let ic;

		tempPatientIC.subscribe((value) => (ic = value));

		const editPatientData = {
			// name, IC, age, gender, email, contact, race
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
			// console.log('formErrors:', formErrors);
		} else {
			// loading.set(false);
			// // loading.update((value) => {
			// // 	return false;
			// // });
			// const res = await resp.json();
			// formErrors = res.data;
			// // showEditAlert();
			console.log('something went wrong there matey');
		}
	}

	export function closeEditDetailsModal() {
		let hiddenModal = document.querySelector('.filter-box3');
		hiddenModal.classList.add('hidden');
	}
</script>

<!-- Beginning -->
<div class="bg-gray-100 min-h-screen">
	<header class="bg-white shadow">
		<div class="container mx-auto py-4">
			<h1 class="text-2xl font-semibold">All Patients</h1>
		</div>
	</header>
	<!-- Open filter Button -->
	<div>
		<button on:click={openFilter}>Filter Patients</button>
	</div>
	<div>
		<button on:click={clearFilters}>Clear Filters</button>
	</div>

	<!-- MODAL 1 -->
	<div class=" w-screen flex-col hidden filter-box bg-white">
		<form on:submit|preventDefault={filterPatients} class="w-1/2 bg-white shadow-md rounded-lg p-8">
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
					<button on:click={closeFilter}> Close Filter </button>
				</div>
			</div>
		</form>
	</div>

	<!-- MODAL 2 -->
	<div class=" w-screen flex-col hidden filter-box2 bg-white">
		<form on:submit|preventDefault={setAppointment} class="w-1/2 bg-white shadow-md rounded-lg p-8">
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

	<div class="overflow-x-auto w-full bg-white">
		{#if $filterOn === false}
			{#each data.patients as patient}
				<div class=" flex flex-row">
					<p class="mr-5">{patient.name}</p>
					<p class="mr-5">{patient.IC}</p>
					<p class="mr-5">{patient.age}</p>
					<p class="mr-5">{patient.gender}</p>
					<p class="mr-5">{patient.email}</p>
					<p class="mr-5">{patient.contact}</p>
					<p>{patient.race}</p>
					<button on:click={() => clickEditDetails(patient.IC)}>Edit Details</button>
				</div>
			{/each}
			<!-- MODAL 3 -->
			<div class=" w-screen flex-col hidden filter-box3 bg-white">
				<button on:click={closeEditDetailsModal()}>Close Modal</button>
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
		{:else}
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
		{/if}
	</div>
</div>
