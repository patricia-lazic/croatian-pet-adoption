<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Contact About {{ dog?.name }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>


      <div v-if="dog" class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-4">
          <img 
            :src="dog.imageUrls?.[0] || dog.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=64&h=64&fit=crop'" 
            :alt="dog.name"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h3 class="font-semibold text-lg">{{ dog.name }}</h3>
            <p class="text-gray-600">{{ dog.breed }}, {{ dog.age }} years old</p>
            <p class="text-gray-600">{{ dog.shelter }}</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
          <input
            v-model="contactForm.name"
            type="text"
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            :placeholder="user?.displayName || 'Your full name'"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="contactForm.email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            :placeholder="user?.email || 'your.email@example.com'"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            v-model="contactForm.phone"
            type="tel"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="+385 XX XXX XXXX"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Interest Level</label>
          <select
            v-model="contactForm.interestLevel"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="interested">Interested in learning more</option>
            <option value="serious">Seriously considering adoption</option>
            <option value="ready">Ready to adopt soon</option>
            <option value="questions">Just have some questions</option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            v-model="contactForm.message"
            required
            rows="4"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Tell the shelter about yourself, your living situation, experience with pets, and why you're interested in this dog..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Tip: Include information about your home, experience with pets, and availability
          </p>
        </div>

        <div v-if="error" class="mb-4 text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="mb-4 text-green-600 text-sm">
          {{ success }}
        </div>

        <div class="flex space-x-4">
          <button 
            type="button"
            @click="closeModal"
            class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="flex-1 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Sending...' : 'Send Inquiry' }}
          </button>
        </div>
      </form>

      <div class="mt-4 p-4 bg-pink-50 rounded-lg">
        <p class="text-sm text-pink-800">
          <strong>What happens next?</strong><br>
          Your inquiry will be sent directly to {{ dog?.shelter }}. They typically respond within 24-48 hours. 
          You can check your dashboard for updates on your inquiries.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useInquiries } from '@/composables/useInquiries'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  dog: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const { createInquiry } = useInquiries()


const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  interestLevel: 'interested',
  message: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')


watch(() => props.user, (newUser) => {
  if (newUser) {
    contactForm.value.name = newUser.displayName || ''
    contactForm.value.email = newUser.email || ''
  }
}, { immediate: true })

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    await createInquiry({
      dogId: props.dog.id,
      shelterId: props.dog.shelterId,
      userId: props.user.uid,
      contactInfo: {
        name: contactForm.value.name,
        email: contactForm.value.email,
        phone: contactForm.value.phone
      },
      interestLevel: contactForm.value.interestLevel,
      message: contactForm.value.message,
      dogName: props.dog.name,
      shelterName: props.dog.shelter
    })

    success.value = 'Your inquiry has been sent successfully!'
    
    setTimeout(() => {
      resetForm()
      emit('success')
    }, 2000)

  } catch (err) {
    error.value = 'Failed to send inquiry. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  contactForm.value = {
    name: props.user?.displayName || '',
    email: props.user?.email || '',
    phone: '',
    interestLevel: 'interested',
    message: ''
  }
  error.value = ''
  success.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}
</script>