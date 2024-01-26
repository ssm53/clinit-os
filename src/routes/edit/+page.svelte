<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { writable } from 'svelte/store';

	export let data;
	let seeMore;
	let apptToEdit;

	// filtering name and IC for table
	let nameFilter = '';
	let icFilter = '';

	$: filteredAppointments = data.completedAppointments.filter(
		(appointment) =>
			appointment.patientDetails.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
			appointment.patientIC.toLowerCase().includes(icFilter.toLowerCase())
	);

	export function openSeeMore(appointment) {
		seeMore = appointment;
		let modalToHide = document.querySelector('.see-all');
		modalToHide.classList.add('hidden');
		let modalToShow = document.querySelector('.see-more');
		modalToShow.classList.remove('hidden');
	}

	export function closeSeeMore() {
		seeMore;
		let modalToHide = document.querySelector('.see-more');
		modalToHide.classList.add('hidden');
		let modalToShow = document.querySelector('.see-all');
		modalToShow.classList.remove('hidden');
	}

	export function openEditAppt(appointment) {
		apptToEdit = appointment;
		let modalToHide1 = document.querySelector('.see-all');
		modalToHide1.classList.add('hidden');
		let modalToHide2 = document.querySelector('.see-more');
		modalToHide2.classList.add('hidden');

		let modalToShow = document.querySelector('.edit-appt');
		modalToShow.classList.remove('hidden');
	}

	export function closeEditAppt() {
		apptToEdit;
		let modalToHide1 = document.querySelector('.see-more');
		modalToHide1.classList.add('hidden');
		let modalToHide2 = document.querySelector('.edit-appt');
		modalToHide2.classList.add('hidden');

		let modalToShow = document.querySelector('.see-all');
		modalToShow.classList.remove('hidden');
	}
</script>

<div class="see-all">
	<span class="font-bold text-3xl text-pink-700">Completed Appointments</span>
	<div>
		{#if data.completedAppointments.length > 0}
			<div>
				<input type="text" bind:value={nameFilter} placeholder="Filter by Name" />
				<input type="text" bind:value={icFilter} placeholder="Filter by IC" />

				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Age</th>
							<th>Gender</th>
							<th>IC</th>
							<th>Date</th>
							<th>Consult Start Time</th>
							<th>Reason</th>
							<th>Doctor</th>
							<th>Notes</th>
							<th>Documents</th>
							<th>MedName1</th>
							<th>Quantity1</th>
							<th>Notes1</th>
							<th>MedName2</th>
							<th>Quantity2</th>
							<th>Notes2</th>
							<th>Amount</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredAppointments as completed}
							<tr>
								<td>{completed.patientDetails.name}</td>
								<td>{completed.patientDetails.age}</td>
								<td>{completed.patientDetails.gender}</td>
								<td>{completed.patientIC}</td>
								<td>{completed.date}</td>
								<td>{completed.consultStartTime}</td>
								<td>{completed.reason}</td>
								<td>{completed.doctor}</td>
								<td>{completed.notes}</td>
								<td>{completed.documents}</td>
								<td>{completed.medName1}</td>
								<td>{completed.quantity1}</td>
								<td>{completed.notes1}</td>
								<td>{completed.medName2}</td>
								<td>{completed.quantity2}</td>
								<td>{completed.notes2}</td>
								<td>{completed.amount}</td>
								<td>
									<button on:click={() => openSeeMore(completed)}>See More</button>
									<button on:click={() => openEditAppt(completed)}>Edit</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>No completed appointments!</p>
		{/if}
	</div>
</div>
<!-- See More Modal -->
<div class="see-more hidden flex flex-col">
	{#if seeMore}
		<button on:click={closeSeeMore}>Close</button>
		<button on:click={() => openEditAppt(seeMore)}>Edit</button>
		<div>
			<h2>{seeMore.patientDetails.name}'s Details</h2>
			<p>Age: {seeMore.patientDetails.age}</p>
			<p>Gender: {seeMore.patientDetails.gender}</p>
			<p>IC: {seeMore.patientIC}</p>
			<p>Date: {seeMore.date}</p>
			<p>Consult Start Time: {seeMore.consultStartTime}</p>
			<p>Reason: {seeMore.reason}</p>
			<p>Doctor: {seeMore.doctor}</p>
			<p>Notes: {seeMore.notes}</p>
			<p>Documents: {seeMore.documents}</p>
			<p>MedName1: {seeMore.medName1}</p>
			<p>Quantity1: {seeMore.quantity1}</p>
			<p>Notes1: {seeMore.notes1}</p>
			<p>MedName2: {seeMore.medName2}</p>
			<p>Quantity2: {seeMore.quantity2}</p>
			<p>Notes2: {seeMore.notes2}</p>
			<p>Amount: {seeMore.amount}</p>
		</div>
	{:else}
		<p>Nothing to show</p>
	{/if}
</div>
<!-- Edit Appt Modal -->
<div class="flex hidden justify-center items-center edit-appt">
	<p>Edit Appointment</p>
	<form
		on:submit|preventDefault={editCompletedAppointment}
		class="w-1/2 bg-white shadow-md rounded-lg p-8"
	>
		<div class="mb-6">
			<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Name </label>
			<input
				type="text"
				name="name"
				placeholder="Enter name"
				class="block w-full rounded-md py-2 px-3 border border-gray-300"
				required
			/>
			<!-- {#if 'name' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.name}</p>
			{/if} -->
		</div>

		<div class="flex justify-end">
			<button
				class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
				type="submit"
			>
				Complete Registration
			</button>
			<button
				class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
				on:click={closeEditAppt}
			>
				Cancel
			</button>
		</div>
	</form>
</div>
