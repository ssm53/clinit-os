<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { formatDateTime } from '../../utils/date.js';

	export let data;
	let nameSearch = '';
</script>

{#if data.revenueDetails.length > 0}
	<div>
		<table class="border-collapse w-full">
			<thead>
				<tr>
					<th class="border border-gray-400 px-4 py-2">Patient Name</th>
					<th class="border border-gray-400 px-4 py-2">Appt ID</th>
					<th class="border border-gray-400 px-4 py-2">IC</th>
					<th class="border border-gray-400 px-4 py-2">Date</th>
					<th class="border border-gray-400 px-4 py-2">Amount</th>
				</tr>
				<th class="border border-gray-400 px-4 py-2">
					<input
						type="text"
						placeholder="Search by Name"
						bind:value={nameSearch}
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>
				</th>
			</thead>
			<tbody>
				{#each data.revenueDetails.filter((dispensary) => dispensary.patientDetails.name
						.toLowerCase()
						.includes(nameSearch.toLowerCase())) as revDeets}
					<tr class="hover:bg-gray-100">
						<td class="border border-gray-400 px-4 py-2">{revDeets.patientDetails.name}</td>
						<td class="border border-gray-400 px-4 py-2">{revDeets.id}</td>

						<td class="border border-gray-400 px-4 py-2">{revDeets.patientIC}</td>
						<td class="border border-gray-400 px-4 py-2">{formatDateTime(revDeets.date)}</td>
						<td class="border border-gray-400 px-4 py-2">RM{revDeets.amount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p>No revenue to show</p>
{/if}
