<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { writable } from 'svelte/store';

	let seeAllModal = writable(true);
	let seeMoreModal = writable(false);
	let editApptModal = writable(false);

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
		console.log(seeMore);
		seeAllModal.set(false);
		seeMoreModal.set(true);
	}

	export function closeSeeMore() {
		seeMore;
		seeMoreModal.set(false);
		seeAllModal.set(true);
	}

	export function openEditAppt(appointment) {
		apptToEdit = appointment;
		console.log(appointment);
		seeAllModal.set(false);
		seeMoreModal.set(false);
		editApptModal.set(true);
	}

	export function closeEditAppt() {
		apptToEdit;
		editApptModal.set(false);
		seeMoreModal.set(false);
		seeAllModal.set(true);
	}

	export async function editCompletedAppointment(appointment) {
		apptToEdit = appointment;
		const ID = apptToEdit.id;
		// reason, doctor, notes, documents, medName1, medName2, quantity1, quantity2, notes1, notes2, amount
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/edit-completed-appointment/${ID}`, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(apptToEdit)
		});

		const res = await resp.json();
		if (resp.status == 200) {
			apptToEdit;
			editApptModal.set(false);
			seeMoreModal.set(false);
			seeAllModal.set(true);
		} else {
			apptToEdit;
			console.log('hello2');
		}
	}
</script>

{#if $seeAllModal}
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
{:else if $seeMoreModal}
	<!-- See More Modal -->
	<div class="see-more flex flex-col">
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
{:else}
	<!-- Edit Appt Modal -->
	<div class="flex justify-center items-center edit-appt">
		<p>Edit Appointment</p>
		<form
			on:submit|preventDefault={() => editCompletedAppointment(apptToEdit)}
			class="w-1/2 bg-white shadow-md rounded-lg p-8"
		>
			<div class="mb-6">
				<label for="reason" class="block text-gray-700 text-sm font-bold mb-2"> Reason </label>
				<input
					type="text"
					name="reason"
					placeholder="Enter reason"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.reason}
					required
				/>
				<!-- {#if 'reason' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.reason}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="doctor" class="block text-gray-700 text-sm font-bold mb-2"> Doctor </label>
				<input
					type="text"
					name="doctor"
					placeholder="Enter doctor"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.doctor}
					required
				/>
				<!-- {#if 'doctor' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.doctor}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="documents" class="block text-gray-700 text-sm font-bold mb-2">
					Documents
				</label>
				<input
					type="text"
					name="documents"
					placeholder="Enter documents"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.documents}
					required
				/>
				<!-- {#if 'documents' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.documents}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
				<input
					type="text"
					name="notes"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.notes}
					required
				/>
				<!-- {#if 'notes' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name1" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name1"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.medName1}
					required
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity1" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity1"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.quantity1}
					required
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes1" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes1"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.notes1}
					required
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>
			<div class="mb-6">
				<label for="med-name2" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name2"
					placeholder="Enter med name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.medName2}
					required
				/>
				<!-- {#if 'med-name2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity2" class="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
				<input
					type="number"
					name="quantity2"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.quantity2}
					required
				/>
				<!-- {#if 'quantity2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes2" class="block text-gray-700 text-sm font-bold mb-2">Med Notes</label>
				<input
					type="text"
					name="notes2"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.notes2}
					required
				/>
				<!-- {#if 'notes2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="amount" class="block text-gray-700 text-sm font-bold mb-2">Amount</label>
				<input
					type="number"
					name="amount"
					placeholder="Enter amount"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.amount}
					required
				/>
				<!-- {#if 'amount' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.amount}</p>
			{/if} -->
			</div>

			<div class="flex justify-end">
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					type="submit"
				>
					Edit Completed Appointment
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
{/if}
