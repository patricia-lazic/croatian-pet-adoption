<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ isEditing ? 'Edit Dog' : 'Add New Dog' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Dog Name *</label>
              <input
                v-model="dogForm.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter dog's name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Age (years) *</label>
              <input
                v-model.number="dogForm.age"
                type="number"
                min="0"
                max="20"
                step="0.5"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
              <input
                v-model="dogForm.breed"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter breed"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Size *</label>
              <select
                v-model="dogForm.size"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                v-model="dogForm.gender"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                v-model="dogForm.color"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter color/markings"
              />
            </div>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="dogForm.description"
              rows="4"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell people about this dog's personality, behavior, special needs, etc."
            ></textarea>
          </div>


          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Health Status *</label>
              <select
                v-model="dogForm.healthStatus"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select health status</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair - Minor Issues">Fair - Minor Issues</option>
                <option value="Special Needs">Special Needs</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vaccination Status</label>
              <select
                v-model="dogForm.vaccinationStatus"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select vaccination status</option>
                <option value="Up to date">Up to date</option>
                <option value="Partially vaccinated">Partially vaccinated</option>
                <option value="Not vaccinated">Not vaccinated</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Spayed/Neutered</label>
              <select
                v-model="dogForm.spayedNeutered"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Good with Kids</label>
              <select
                v-model="dogForm.goodWithKids"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unknown</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Older kids only">Older kids only</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Good with Other Dogs</label>
              <select
                v-model="dogForm.goodWithDogs"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unknown</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="With proper introduction">With proper introduction</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Good with Cats</label>
              <select
                v-model="dogForm.goodWithCats"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unknown</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="With proper introduction">With proper introduction</option>
              </select>
            </div>
          </div>


          <div class="border-t pt-6">
            <ImageUpload 
              v-model="dogForm.imageUrls"
              :max-files="5"
              :max-file-size="5 * 1024 * 1024"
            />
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <select
              v-model="dogForm.location"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select location</option>
              <option value="Zagreb">Zagreb</option>
              <option value="Split">Split</option>
              <option value="Rijeka">Rijeka</option>
              <option value="Osijek">Osijek</option>
              <option value="Zadar">Zadar</option>
              <option value="Slavonski Brod">Slavonski Brod</option>
              <option value="Pula">Pula</option>
              <option value="Sesvete">Sesvete</option>
              <option value="Karlovac">Karlovac</option>
              <option value="Varaždin">Varaždin</option>
            </select>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
            <textarea
              v-model="dogForm.specialNotes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special requirements, medical needs, or other important information..."
            ></textarea>
          </div>


          <div v-if="error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ error }}
          </div>
          
          <div v-if="success" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ success }}
          </div>


          <div class="flex space-x-4 pt-4 border-t">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Dog' : 'Add Dog') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDogs } from '@/composables/useDogs'
import ImageUpload from './ImageUpload.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  dog: {
    type: Object,
    default: null
  },
  shelterId: {
    type: String,
    required: true
  },
  shelterName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const { addDog, updateDog } = useDogs()


const dogForm = ref({
  name: '',
  age: '',
  breed: '',
  size: '',
  gender: '',
  color: '',
  description: '',
  healthStatus: '',
  vaccinationStatus: '',
  spayedNeutered: '',
  goodWithKids: '',
  goodWithDogs: '',
  goodWithCats: '',
  imageUrls: [],
  location: '',
  specialNotes: ''
})

const isSubmitting = ref(false)
const error = ref('')
const success = ref('')


const isEditing = computed(() => !!props.dog)


const resetForm = () => {
  dogForm.value = {
    name: '',
    age: '',
    breed: '',
    size: '',
    gender: '',
    color: '',
    description: '',
    healthStatus: '',
    vaccinationStatus: '',
    spayedNeutered: '',
    goodWithKids: '',
    goodWithDogs: '',
    goodWithCats: '',
    imageUrls: [],
    location: '',
    specialNotes: ''
  }
  error.value = ''
  success.value = ''
}


watch(() => props.dog, (newDog) => {
  if (newDog) {
    dogForm.value = {
      name: newDog.name || '',
      age: newDog.age || '',
      breed: newDog.breed || '',
      size: newDog.size || '',
      gender: newDog.gender || '',
      color: newDog.color || '',
      description: newDog.description || '',
      healthStatus: newDog.healthStatus || '',
      vaccinationStatus: newDog.vaccinationStatus || '',
      spayedNeutered: newDog.spayedNeutered || '',
      goodWithKids: newDog.goodWithKids || '',
      goodWithDogs: newDog.goodWithDogs || '',
      goodWithCats: newDog.goodWithCats || '',
      imageUrls: newDog.imageUrls || [newDog.image].filter(Boolean) || [],
      location: newDog.location || '',
      specialNotes: newDog.specialNotes || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })


const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    const dogData = {
      ...dogForm.value,
      shelterId: props.shelterId,
      shelter: props.shelterName,

      image: dogForm.value.imageUrls[0] || '',

      imageUrls: dogForm.value.imageUrls
    }

    if (isEditing.value) {
      await updateDog(props.dog.id, dogData)
      success.value = 'Dog updated successfully!'
    } else {
      await addDog(dogData)
      success.value = 'Dog added successfully!'
    }

    setTimeout(() => {
      emit('success')
    }, 1500)

  } catch (err) {
    error.value = `Failed to ${isEditing.value ? 'update' : 'add'} dog. Please try again.`
  } finally {
    isSubmitting.value = false
  }
}

const validateForm = () => {
  if (!dogForm.value.name.trim()) {
    error.value = 'Dog name is required'
    return false
  }

  if (!dogForm.value.age || dogForm.value.age <= 0) {
    error.value = 'Please enter a valid age'
    return false
  }

  if (!dogForm.value.breed.trim()) {
    error.value = 'Breed is required'
    return false
  }

  if (!dogForm.value.size) {
    error.value = 'Size is required'
    return false
  }

  if (!dogForm.value.description.trim()) {
    error.value = 'Description is required'
    return false
  }

  if (!dogForm.value.healthStatus) {
    error.value = 'Health status is required'
    return false
  }

  if (!dogForm.value.location) {
    error.value = 'Location is required'
    return false
  }

  if (dogForm.value.imageUrls.length === 0) {
    error.value = 'At least one image is required'
    return false
  }

  return true
}

const closeModal = () => {
  resetForm()
  emit('close')
}
</script>