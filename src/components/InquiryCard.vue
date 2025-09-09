<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4" 
       :class="getStatusBorderClass(inquiry.status)">
    

    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ inquiry.dogName || 'General Inquiry' }}
        </h3>
        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>From:</strong> {{ inquiry.contactInfo?.name || 'Unknown' }}</p>
          <p><strong>Email:</strong> {{ inquiry.contactInfo?.email || 'No email' }}</p>
          <p v-if="inquiry.contactInfo?.phone"><strong>Phone:</strong> {{ inquiry.contactInfo.phone }}</p>
          <p><strong>Interest Level:</strong> {{ inquiry.interestLevel || inquiry.reason || 'Not specified' }}</p>
        </div>
      </div>
      
      <div class="text-right">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              :class="getStatusClass(inquiry.status)">
          {{ getStatusText(inquiry.status) }}
        </span>
        <p class="text-xs text-gray-500 mt-2">
          {{ formatDate(inquiry.createdAt) }}
        </p>
      </div>
    </div>


    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <h4 class="font-medium text-gray-800 mb-2">Original Message:</h4>
      <p class="text-gray-700 text-sm leading-relaxed">{{ inquiry.message }}</p>
    </div>


    <div v-if="inquiry.response" class="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
      <h4 class="font-medium text-blue-800 mb-2">Your Response:</h4>
      <p class="text-blue-700 text-sm leading-relaxed">{{ inquiry.response }}</p>
      <p class="text-xs text-blue-600 mt-2">
        Replied on {{ formatDate(inquiry.respondedAt || inquiry.updatedAt) }}
      </p>
    </div>


    <div v-if="showReplyForm && inquiry.status === 'pending'" class="border-t pt-4">
      <h4 class="font-medium text-gray-800 mb-3">Reply to Inquiry:</h4>
      
      <div class="space-y-4">
        <textarea
          v-model="replyMessage"
          rows="4"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write your response to the adopter..."
        ></textarea>
        
        <div class="flex space-x-3">
          <button
            @click="handleReply('approved')"
            :disabled="!replyMessage.trim() || isSubmitting"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Sending...' : 'Approve & Reply' }}
          </button>
          
          <button
            @click="handleReply('declined')"
            :disabled="!replyMessage.trim() || isSubmitting"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Sending...' : 'Decline & Reply' }}
          </button>
          
          <button
            @click="cancelReply"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>


    <div v-else class="flex space-x-3 pt-4 border-t">
      <button
        v-if="inquiry.status === 'pending'"
        @click="showReplyForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Reply to Inquiry
      </button>
      
      <button
        v-if="inquiry.status === 'pending'"
        @click="handleQuickAction('declined')"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Quick Decline
      </button>
    </div>


    <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <div v-if="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  inquiry: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reply', 'update'])


const showReplyForm = ref(false)
const replyMessage = ref('')
const isSubmitting = ref(false)
const error = ref('')
const successMessage = ref('')


const handleReply = async (status) => {
  if (!replyMessage.value.trim()) {
    error.value = 'Please write a response message'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    await emit('reply', {
      inquiryId: props.inquiry.id,
      status: status,
      response: replyMessage.value.trim(),
      respondedAt: new Date()
    })

    successMessage.value = `Inquiry ${status} and response sent!`
    showReplyForm.value = false
    replyMessage.value = ''
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err) {
    error.value = 'Failed to send response. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleQuickAction = async (status) => {
  const defaultMessages = {
    approved: 'Thank you for your interest! We would be happy to discuss this adoption further. Please contact us to arrange a meeting.',
    declined: 'Thank you for your interest. Unfortunately, this pet may not be the best match at this time. We encourage you to browse other available pets.'
  }

  isSubmitting.value = true
  error.value = ''

  try {
    await emit('reply', {
      inquiryId: props.inquiry.id,
      status: status,
      response: defaultMessages[status],
      respondedAt: new Date()
    })

    successMessage.value = `Inquiry ${status}!`
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err) {
    error.value = 'Failed to process inquiry. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const cancelReply = () => {
  showReplyForm.value = false
  replyMessage.value = ''
  error.value = ''
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  
  try {
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  } catch {
    return 'Unknown'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'declined':
      return 'bg-red-100 text-red-800'
    case 'replied':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBorderClass = (status) => {
  switch (status) {
    case 'pending':
      return 'border-yellow-400'
    case 'approved':
      return 'border-green-400'
    case 'declined':
      return 'border-red-400'
    case 'replied':
      return 'border-blue-400'
    default:
      return 'border-gray-400'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Awaiting Response'
    case 'approved':
      return 'Approved'
    case 'declined':
      return 'Declined'
    case 'replied':
      return 'Replied'
    default:
      return 'Unknown'
  }
}
</script>