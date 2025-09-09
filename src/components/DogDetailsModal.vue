<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">{{ dog?.name }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div v-if="dog" class="space-y-6">

          <div class="text-center">
            <img 
              :src="dog.image || dog.imageUrls?.[0] || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'" 
              :alt="dog.name"
              class="w-full max-w-md mx-auto h-64 object-cover rounded-lg shadow-md"
            />
          </div>


          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-3">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-600">Name:</p>
                <p class="text-gray-800">{{ dog.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Age:</p>
                <p class="text-gray-800">{{ dog.age }} years old</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Breed:</p>
                <p class="text-gray-800">{{ dog.breed }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Size:</p>
                <p class="text-gray-800">{{ dog.size }}</p>
              </div>
              <div v-if="dog.gender">
                <p class="text-sm font-medium text-gray-600">Gender:</p>
                <p class="text-gray-800">{{ dog.gender }}</p>
              </div>
              <div v-if="dog.color">
                <p class="text-sm font-medium text-gray-600">Color:</p>
                <p class="text-gray-800">{{ dog.color }}</p>
              </div>
            </div>
          </div>


          <div class="bg-white border rounded-lg p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-3">About {{ dog.name }}</h3>
            <p class="text-gray-700 leading-relaxed">{{ dog.description }}</p>
          </div>


          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="font-semibold text-lg text-green-800 mb-3">Health & Behavior</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-green-600">Health Status:</p>
                <p class="text-green-800">{{ dog.healthStatus || 'Not specified' }}</p>
              </div>
              <div v-if="dog.vaccinationStatus">
                <p class="text-sm font-medium text-green-600">Vaccinations:</p>
                <p class="text-green-800">{{ dog.vaccinationStatus }}</p>
              </div>
              <div v-if="dog.spayedNeutered">
                <p class="text-sm font-medium text-green-600">Spayed/Neutered:</p>
                <p class="text-green-800">{{ dog.spayedNeutered }}</p>
              </div>
              <div v-if="dog.goodWithKids">
                <p class="text-sm font-medium text-green-600">Good with Kids:</p>
                <p class="text-green-800">{{ dog.goodWithKids }}</p>
              </div>
              <div v-if="dog.goodWithDogs">
                <p class="text-sm font-medium text-green-600">Good with Dogs:</p>
                <p class="text-green-800">{{ dog.goodWithDogs }}</p>
              </div>
              <div v-if="dog.goodWithCats">
                <p class="text-sm font-medium text-green-600">Good with Cats:</p>
                <p class="text-green-800">{{ dog.goodWithCats }}</p>
              </div>
            </div>
          </div>


          <div v-if="dog.specialNotes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg text-yellow-800 mb-3">Special Notes</h3>
            <p class="text-yellow-700">{{ dog.specialNotes }}</p>
          </div>


          <div class="bg-pink-50 rounded-lg p-4">
            <h3 class="font-semibold text-lg text-pink-800 mb-3">Shelter Information</h3>
            <div class="space-y-2">
              <p class="text-pink-700">
                <strong>Shelter:</strong> {{ dog.shelter || 'Unknown Shelter' }}
              </p>
              <p class="text-pink-700">
                <strong>Location:</strong> {{ dog.location || 'Not specified' }}
              </p>
            </div>
          </div>


          <div class="flex space-x-4 pt-4 border-t">
            <button 
              @click="contactShelter"
              class="flex-1 bg-pink-600 text-white py-3 px-4 rounded hover:bg-pink-700 transition-colors"
            >
              Contact Shelter About {{ dog.name }}
            </button>
            <button 
              @click="closeModal"
              class="flex-1 bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>


          <div v-if="dog.imageUrls && dog.imageUrls.length > 1" class="space-y-2">
            <h3 class="font-semibold text-lg text-gray-800">More Photos</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <img 
                v-for="(imageUrl, index) in dog.imageUrls.slice(1)"
                :key="index"
                :src="imageUrl"
                :alt="`${dog.name} photo ${index + 2}`"
                class="w-full h-32 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-75 transition-opacity"
                @click="showImageModal(imageUrl)"
              />
            </div>
          </div>


          <div v-if="dog.createdAt" class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-3">Availability</h3>
            <p class="text-gray-600 text-sm">
              Listed for adoption on {{ formatDate(dog.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  dog: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'contact'])

const contactShelter = () => {
  emit('contact', props.dog)
}

const closeModal = () => {
  emit('close')
}

const showImageModal = (imageUrl) => {
  window.open(imageUrl, '_blank')
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  
  try {
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return 'Unknown'
  }
}
</script>