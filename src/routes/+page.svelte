<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { writable } from 'svelte/store';

	export let data;
	export const filteredPatients = writable([]);
	export const filterOn = writable(false);
	export let patientIC;

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
			patientIC: patientIC
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
				</div>
			{/each}
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
					<button class="bg-pink-700" on:click={openAppointmentModal}>Create Appointment</button>
				</div>
			{/each}
		{/if}
	</div>
</div>
