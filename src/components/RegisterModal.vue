<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Register</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleRegister">

        <div v-if="!showShelterForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="displayName"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              v-model="userRole"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="user">Pet Adopter</option>
              <option value="shelter">Animal Shelter</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              Choose "Animal Shelter" if you represent a shelter organization
            </p>
          </div>
        </div>


        <div v-if="showShelterForm && userRole === 'shelter'" class="space-y-4">
          <div class="mb-4 p-3 bg-pink-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">🏢 Shelter Information</h3>
            <p class="text-sm text-gray-600">Please provide your shelter's details</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Shelter Name *
              <span class="text-red-500">{{ !shelterDetails.name.trim() ? '(Required)' : '' }}</span>
            </label>
            <input
              v-model="shelterDetails.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Zagreb Animal Shelter"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Address *
              <span class="text-red-500">{{ !shelterDetails.address.trim() ? '(Required)' : '' }}</span>
            </label>
            <textarea
              v-model="shelterDetails.address"
              required
              rows="2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Heinzelova ul. 55, 10000 Zagreb"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
              <span class="text-red-500">{{ !shelterDetails.phone.trim() ? '(Required)' : '' }}</span>
            </label>
            <input
              v-model="shelterDetails.phone"
              type="tel"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., +385 1 2345 678"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Shelter Email *
              <span class="text-red-500">{{ !shelterDetails.email.trim() ? '(Required)' : '' }}</span>
            </label>
            <input
              v-model="shelterDetails.email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., info@zagreb-shelter.hr"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
            <input
              v-model="shelterDetails.workingHours"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Mon-Fri: 8:00-16:00, Sat: 8:00-12:00"
            />
          </div>


          <div class="pt-4 border-t">
            <button 
              type="button"
              @click="goBackToBasicInfo"
              class="text-pink-600 hover:text-pink-800 text-sm"
            >
              ← Go back to account details
            </button>
          </div>
        </div>

        <div v-if="error" class="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="isButtonDisabled"
          :class="[
            'w-full mt-6 py-2 px-4 rounded-md transition-colors',
            isButtonDisabled 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'
          ]"
        >
          {{ getButtonText() }}
        </button>


        <div v-if="isButtonDisabled" class="mt-2 text-xs text-red-600">
          <p v-if="!displayName.trim()">• Full name is required</p>
          <p v-if="!email.trim()">• Email is required</p>
          <p v-if="password.length < 6">• Password must be at least 6 characters</p>
          <p v-if="password !== confirmPassword">• Passwords must match</p>
          <p v-if="isLoading">• Creating account...</p>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account? 
          <button @click="switchToLogin" class="text-pink-600 hover:text-pink-800">
            Login here
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success', 'switch-to-login'])

const { register } = useAuth()


const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const userRole = ref('user')
const isLoading = ref(false)
const error = ref('')


const showShelterForm = ref(false)
const shelterDetails = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  workingHours: ''
})


const isBasicFormValid = computed(() => {
  return displayName.value.trim() && 
         email.value.trim() && 
         password.value.length >= 6 && 
         password.value === confirmPassword.value
})

const isShelterFormValid = computed(() => {
  if (userRole.value !== 'shelter' || !showShelterForm.value) return true
  
  return shelterDetails.value.name.trim() &&
         shelterDetails.value.address.trim() &&
         shelterDetails.value.phone.trim() &&
         shelterDetails.value.email.trim()
})

const isButtonDisabled = computed(() => {
  if (isLoading.value) return true
  

  if (!showShelterForm.value) {
    return !isBasicFormValid.value
  }
  

  return !isBasicFormValid.value || !isShelterFormValid.value
})

const getButtonText = () => {
  if (isLoading.value) return 'Creating Account...'
  if (userRole.value === 'shelter' && !showShelterForm.value) return 'Continue to Shelter Details'
  return 'Create Account'
}


const handleRegister = async () => {
  error.value = ''


  if (!isBasicFormValid.value) {
    error.value = 'Please fill in all required basic information.'
    return
  }


  if (userRole.value === 'shelter' && !showShelterForm.value) {
    showShelterForm.value = true
    return
  }


  if (userRole.value === 'shelter' && showShelterForm.value) {
    if (!isShelterFormValid.value) {
      error.value = 'Please fill in all required shelter information.'
      return
    }
  }


  isLoading.value = true

  try {

    const shelterData = userRole.value === 'shelter' ? {
      name: shelterDetails.value.name.trim(),
      address: shelterDetails.value.address.trim(),
      phone: shelterDetails.value.phone.trim(),
      email: shelterDetails.value.email.trim(),
      workingHours: shelterDetails.value.workingHours.trim() || 'Contact for hours',
      location: extractLocationFromAddress(shelterDetails.value.address.trim())
    } : null


    await register(email.value, password.value, displayName.value, userRole.value, shelterData)
    

    resetForm()
    
    emit('success')
  } catch (err) {
    error.value = getErrorMessage(err.code)
  } finally {
    isLoading.value = false
  }
}

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.'
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.'
    default:
      return 'Registration failed. Please try again.'
  }
}

const resetForm = () => {
  displayName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  userRole.value = 'user'
  showShelterForm.value = false
  shelterDetails.value = {
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  }
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const switchToLogin = () => {
  closeModal()
  emit('switch-to-login')
}

const goBackToBasicInfo = () => {
  showShelterForm.value = false
  error.value = ''
}


const extractLocationFromAddress = (address) => {
  const cities = ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Dubrovnik', 'Varaždin']
  
  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city
    }
  }
  

  if (address.includes('10000') || address.toLowerCase().includes('zagreb')) return 'Zagreb'
  if (address.includes('21000') || address.toLowerCase().includes('split')) return 'Split'
  if (address.includes('51000') || address.toLowerCase().includes('rijeka')) return 'Rijeka'
  if (address.includes('52000') || address.toLowerCase().includes('pula')) return 'Pula'
  
  return 'Croatia'
}
</script>
