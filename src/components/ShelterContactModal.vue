<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Contact {{ shelter?.name }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>


      <div v-if="shelter" class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-lg">{{ shelter.name }}</h3>
        <p class="text-gray-600 text-sm">{{ shelter.address }}</p>
        <p class="text-gray-600 text-sm">{{ shelter.phone }}</p>
        <p class="text-gray-600 text-sm">{{ shelter.email }}</p>
        <p class="text-gray-600 text-sm">{{ shelter.workingHours }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              v-model="contactForm.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              :placeholder="user?.displayName || 'Your full name'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
            <input
              v-model="contactForm.email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              :placeholder="user?.email || 'your.email@example.com'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
            <input
              v-model="contactForm.phone"
              type="tel"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              placeholder="+385 XX XXX XXXX"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Contact</label>
            <select
              v-model="contactForm.reason"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
            >
              <option value="general">General inquiry</option>
              <option value="adoption">Adoption information</option>
              <option value="volunteer">Volunteering opportunities</option>
              <option value="donation">Donations</option>
              <option value="visit">Scheduling a visit</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              v-model="contactForm.message"
              required
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              placeholder="Tell the shelter what you'd like to know or how you'd like to help..."
            ></textarea>
          </div>
        </div>

        <div v-if="error" class="mt-4 text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="mt-4 text-green-600 text-sm">
          {{ success }}
        </div>

        <div class="flex space-x-4 mt-6">
          <button 
            type="button"
            @click="closeModal"
            class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="flex-1 bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:opacity-50"
          >
            {{ isLoading ? 'Sending...' : 'Send Message' }}
          </button>
        </div>
      </form>

      <div class="mt-4 p-4 bg-pink-50 rounded-lg">
        <p class="text-sm text-pink-800">
          <strong>Direct Contact:</strong><br>
          You can also contact them directly at {{ shelter?.phone }} or {{ shelter?.email }}
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
  shelter: {
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
  reason: 'general',
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
      type: 'shelter_contact',
      shelterId: props.shelter.id,
      userId: props.user?.uid,
      contactInfo: {
        name: contactForm.value.name,
        email: contactForm.value.email,
        phone: contactForm.value.phone
      },
      reason: contactForm.value.reason,
      message: contactForm.value.message,
      shelterName: props.shelter.name
    })

    success.value = 'Your message has been sent successfully!'

    setTimeout(() => {
      resetForm()
      emit('success')
    }, 2000)

  } catch (err) {
    error.value = 'Failed to send message. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  contactForm.value = {
    name: props.user?.displayName || '',
    email: props.user?.email || '',
    phone: '',
    reason: 'general',
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