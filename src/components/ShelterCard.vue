<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ shelter.name }}</h3>
    
    <div class="space-y-2 text-gray-600 mb-4">
      <p class="flex items-center">
        {{ shelter.address }}
      </p>
      <p class="flex items-center">
        {{ shelter.phone }}
      </p>
      <p class="flex items-center">
        {{ shelter.workingHours }}
      </p>
      <p class="flex items-center">
        {{ shelter.email }}
      </p>
    </div>
    
    <div class="flex space-x-2">
      <button 
        @click="viewDogs"
        class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        View Dogs
      </button>
      <button 
        @click="contactShelter"
        class="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
      >
        Contact
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  shelter: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-dogs', 'contact'])

const viewDogs = () => {
  emit('view-dogs', props.shelter)
}

const contactShelter = () => {
  emit('contact', props.shelter)
}
</script>