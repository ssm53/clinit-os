<script>
	// point to note - shaun to do logout function

	import { appointmentsBooking, doctorLoggedIn, userLoggedIn } from '../stores/store';
	import {
		userLogOut,
		doctorLogOut,
		getDoctorTokenFromLocalStorage,
		getUserTokenFromLocalStorage
	} from './auth';
	import { goto } from '$app/navigation';
	import { io } from '../socket/webSocketConnection.js';
	import { onMount } from 'svelte';
	import { appointmentsWaiting } from '../stores/store';

	onMount(() => {
		io.on('connect_error', (error) => {
			console.error('Connection error:', error);
		});

		io.on('connected', (name) => {
			console.log(`socket connected ${name}`);
		});

		io.on('new_patient_appointment', ({ appointment }) => {
			appointmentsWaiting.update((appointments) => [...appointments, appointment]);
		});
	});

	let logIO;
	userLoggedIn.subscribe((value) => {
		logIO = value;
	});

	let logDoctorIO;
	doctorLoggedIn.subscribe((value) => {
		logDoctorIO = value;
	});

	async function clickLogin() {
		goto('/sign-in');
	}

	function clickNurseRegister() {
		goto('/register');
	}

	function clickHome() {
		goto('/');
	}

	function clickPatientRegistration() {
		goto('/registration');
	}

	function clickEdit() {
		goto('/edit');
	}

	function clickConsultations() {
		goto('/consultations');
	}

	function clickData() {
		goto('/data');
	}

	// function clickMedicine() {
	// 	goto('/medicine');
	// }

	function clickAppointments() {
		goto('/');
	}

	function clickLogOut() {
		if (getDoctorTokenFromLocalStorage() && !getUserTokenFromLocalStorage()) {
			doctorLogOut();
		} else if (getUserTokenFromLocalStorage() && !getDoctorTokenFromLocalStorage()) {
			userLogOut();
		} else if (getDoctorTokenFromLocalStorage() && getUserTokenFromLocalStorage()) {
			doctorLogOut();
			userLogOut();
		}
	}
</script>

<main>
	<div class="bg-black text-white">
		<div class="container mx-auto flex justify-between items-center p-4">
			<button
				class="bg-black text-white p-3 rounded-full hover:bg-gray-900 focus:outline-none"
				on:click={clickHome}
			>
				<img
					src="https://images.websiteplanet.com/wp-content/uploads/2020/08/9-Best-Z-Logos-and-How-to-Make-Your-Own-for-Free-image1.png"
					alt="Home"
					class="w-8 h-7"
				/>
			</button>
			<div class="flex space-x-4 justify-between"
				class:w-[65%]={logIO || logDoctorIO} 
				class:w-[8%]={!(logIO || logDoctorIO)}>
				{#if logIO === true}
					<div class="flex items-center gap-10">
						<button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickAppointments}
						>
							Appointments
						</button>

						<button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickPatientRegistration}
						>
							Registration
						</button>

						<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={clickData}>
							Data
						</button>

						<!-- <button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickMedicine}
						>
							Medicine
						</button> -->
					</div>
					<button
						class="text-white hover:text-red-600 focus:outline-none"
						on:click={clickLogOut}
					>
						Log Out
					</button>
				{:else if logDoctorIO == true}
					<div class="flex items-center gap-10">
						<button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickAppointments}
						>
							Appointments
						</button>
	
						<button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickPatientRegistration}
						>
							Registration
						</button>
	
						<button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickConsultations}
						>
							Consultations
						</button>
						<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={clickEdit}>
							Edit
						</button>
						<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={clickData}>
							Data
						</button>
	
						<!-- <button
							class="text-white hover:text-indigo-600 focus:outline-none"
							on:click={clickMedicine}
						>
							Medicine
						</button> -->
					</div>
					<button
						class="text-white hover:text-red-600 focus:outline-none"
						on:click={clickLogOut}
					>
						Log Out
					</button>
				{:else}
					<button
						class="text-white hover:text-indigo-600 focus:outline-none"
						on:click={clickNurseRegister}
					>
						Register
					</button>
					<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={clickLogin}>
						Log In
					</button>
				{/if}
			</div>
		</div>
	</div>
</main>
