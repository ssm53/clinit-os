<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import { delImageSuc, delImageFail } from '../../utils/alert.js';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import { todayAppts, waitingAppts, dispensaryAppts } from '../../stores/store';
	import { DateTime, Interval } from 'luxon';

	export let data;

	function calculateWaitingTime(arrivalTime) {
		const malaysiaTime = DateTime.local().setZone('Asia/Kuala_Lumpur');
		const arrivalDateTime = DateTime.fromISO(arrivalTime);

		// Calculate the waiting time
		const waitingInterval = Interval.fromDateTimes(arrivalDateTime, malaysiaTime);
		const waitingDuration = waitingInterval.toDuration(['hours', 'minutes', 'seconds']);

		// Format the waiting time
		const hours = Math.floor(waitingDuration.as('hours'));
		const minutes = Math.floor(waitingDuration.as('minutes')) % 60;
		const seconds = Math.floor(waitingDuration.as('seconds')) % 60;

		return `${hours}h ${minutes}m ${seconds}s`;
	}

	function clickToday() {
		waitingAppts.set(false);
		dispensaryAppts.set(false);
		todayAppts.set(true);
	}

	function clickWaiting() {
		dispensaryAppts.set(false);
		todayAppts.set(false);
		waitingAppts.set(true);
	}

	export async function clickDispensary() {
		todayAppts.set(false);
		waitingAppts.set(false);
		dispensaryAppts.set(true);
	}
</script>

<div
	class="top-container flex flex-col justify-center items-center border-b-2 border-black bg-white h-44"
>
	<div>
		<span class="font-bold text-3xl text-pink-700">Appointments</span>
	</div>
	<div class="flex flex-row justify-between mt-5">
		<button
			on:click={clickToday}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Today</button
		>
		<button
			on:click={clickWaiting}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Waiting</button
		>
		<button
			on:click={clickDispensary}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Dispensary</button
		>
	</div>
</div>
<div>
	{#if $todayAppts}
		<div>
			{#each data.todayAppointments as today}
				<div class="flex flex-row">
					<p>{today.patientDetails.name}</p>
					<p>{today.patientDetails.age}</p>
					<p>{today.patientDetails.gender}</p>
					<p>{today.patientIC}</p>
					<p>{today.reason}</p>
					<p>{today.doctor}</p>
					<p>{today.arrivalTime}</p>
					<p>{today.status}</p>
				</div>
			{/each}
		</div>
	{:else if $waitingAppts}
		<div>
			{#each data.waitingAppointments as waiting}
				<div class="flex flex-row">
					<p>{waiting.patientDetails.name}</p>
					<p>{waiting.patientDetails.age}</p>
					<p>{waiting.patientDetails.gender}</p>
					<p>{waiting.patientIC}</p>
					<p>{waiting.reason}</p>
					<p>{waiting.doctor}</p>
					<p>{waiting.arrivalTime}</p>
					<p>{calculateWaitingTime(waiting.arrivalTime)}</p>
					<p>{waiting.status}</p>
				</div>
			{/each}
		</div>
	{:else}
		<div>
			{#each data.dispensaryAppointments as dispensary}
				<div class="flex flex-row">
					<p>{dispensary.patientDetails.name}</p>
					<p>{dispensary.patientDetails.age}</p>
					<p>{dispensary.patientDetails.gender}</p>
					<p>{dispensary.patientIC}</p>
					<p>{dispensary.reason}</p>
					<p>{dispensary.doctor}</p>
					<p>{dispensary.arrivalTime}</p>
					<p>{dispensary.status}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
