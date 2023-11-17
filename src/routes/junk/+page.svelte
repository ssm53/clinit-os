<script>
  // some code
</script>

<div class="treatment-plan">
  <p>Treatment Plan</p>
  <form
    on:submit|preventDefault={addTreatmentPlan}
    class="w-1/2 bg-white shadow-md rounded-lg p-8"
  >
    <div class="mb-6">
      <label for="meds1" class="block text-gray-700 text-sm font-bold mb-2">
        Medicine
      </label>
      <input
        type="text"
        name="meds1"
        placeholder="Enter medicine"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />
      <label for="quantity1" class="block text-gray-700 text-sm font-bold mb-2">
        Quantity
      </label>
      <input
        type="number"
        name="quantity1"
        placeholder="Enter quantity"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />
      <label for="notes1" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
      <input
        type="text"
        name="notes1"
        placeholder="Enter notes"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />
      <label for="meds2" class="block text-gray-700 text-sm font-bold mb-2">
        Medicine
      </label>
      <input
        type="text"
        name="meds2"
        placeholder="Enter medicine"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />
      <label for="quantity2" class="block text-gray-700 text-sm font-bold mb-2">
        Quantity
      </label>
      <input
        type="number"
        name="quantity2"
        placeholder="Enter quantity"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />
      <label for="notes2" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
      <input
        type="text"
        name="notes2"
        placeholder="Enter notes"
        class="block w-full rounded-md py-2 px-3 border border-gray-300"
      />

      <div class="flex justify-end">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          type="submit"
        >
          Add Treatment Plan
        </button>
      </div>
    </div>
  </form>
</div>