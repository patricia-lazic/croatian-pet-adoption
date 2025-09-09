<template>
  <div class="dashboard">
    <div class="mb-8">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">
        Welcome, {{ user?.displayName || user?.email }}!
      </h2>
      <p class="text-gray-600">Your pet adoption dashboard</p>
    </div>


    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
      <div class="space-y-2">
        <p><strong>Name:</strong> {{ user?.displayName || 'Not provided' }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Account Type:</strong> Pet Adopter</p>
        <p><strong>Member Since:</strong> {{ formatDate(user?.metadata?.creationTime) }}</p>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-pink-50 rounded-lg p-6 text-center">
        <h4 class="text-lg font-semibold text-pink-800">Inquiries Sent</h4>
        <p class="text-3xl font-bold text-pink-600">{{ userInquiries.length }}</p>
      </div>
      <div class="bg-green-50 rounded-lg p-6 text-center">
        <h4 class="text-lg font-semibold text-green-800">Favorite Dogs</h4>
        <p class="text-3xl font-bold text-green-600">{{ userFavorites.length }}</p>
        <p class="text-xs text-gray-500 mt-1">Dogs you loved</p>
      </div>
    </div>


    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Your Inquiries</h3>
        <button 
          @click="loadUserInquiries" 
          class="text-pink-600 hover:text-pink-800 text-sm"
          :disabled="isLoadingInquiries"
        >
          {{ isLoadingInquiries ? 'Refreshing...' : '🔄 Refresh' }}
        </button>
      </div>
      

      <div v-if="isLoadingInquiries" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Loading your inquiries...</p>
      </div>


      <div v-else-if="userInquiries.length > 0" class="space-y-4">
        <div 
          v-for="inquiry in userInquiries" 
          :key="inquiry.id"
          class="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-semibold text-lg">
                {{ inquiry.dogName || 'Shelter Contact' }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">
                To: {{ inquiry.shelterName || 'Unknown Shelter' }}
              </p>
              <p class="text-sm text-gray-700 mb-2">
                {{ inquiry.message?.substring(0, 100) }}{{ inquiry.message?.length > 100 ? '...' : '' }}
              </p>
              <p class="text-xs text-gray-500">
                Interest Level: {{ inquiry.interestLevel || inquiry.reason || 'Not specified' }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ formatDate(inquiry.createdAt) }}</p>
              <span :class="[
                'text-xs px-2 py-1 rounded',
                inquiry.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                inquiry.status === 'replied' ? 'bg-green-200 text-green-800' :
                inquiry.status === 'approved' ? 'bg-pink-200 text-pink-800' :
                inquiry.status === 'declined' ? 'bg-red-200 text-red-800' :
                'bg-gray-200 text-gray-800'
              ]">
                {{ inquiry.status || 'pending' }}
              </span>
            </div>
          </div>
          

          <div v-if="inquiry.response" class="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
            <p class="text-sm text-green-800"><strong>Response:</strong></p>
            <p class="text-sm text-green-700">{{ inquiry.response }}</p>
          </div>
        </div>
      </div>


      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🐕</div>
        <h4 class="text-lg font-semibold text-gray-600 mb-2">No inquiries yet</h4>
        <p class="text-gray-500 mb-4">
          Start by browsing available dogs and contacting shelters about pets you're interested in.
        </p>
        <button 
          @click="goToDogs"
          class="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
        >
          Browse Dogs
        </button>
      </div>
    </div>


    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Your Favorite Dogs</h3>
        <button 
          @click="loadUserFavorites" 
          class="text-green-600 hover:text-green-800 text-sm"
          :disabled="isLoadingFavorites"
        >
          {{ isLoadingFavorites ? 'Loading...' : '🔄 Refresh' }}
        </button>
      </div>
      
      <div v-if="isLoadingFavorites" class="text-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
        <p class="text-gray-500 mt-2 text-sm">Loading favorites...</p>
      </div>
      
      <div v-else-if="userFavorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FavoriteDogCard 
          v-for="favoriteDog in userFavorites" 
          :key="favoriteDog.id"
          :dog="favoriteDog"
          @remove="handleRemoveFavorite"
          @view="handleViewDog"
          @contact="handleContactFavoriteDog"
        />
      </div>

      <div v-else class="text-center py-8">
        <div class="text-gray-400 text-4xl mb-2">🤍</div>
        <p class="text-gray-500">No favorite dogs yet</p>
        <p class="text-gray-400 text-sm">Click the heart on dogs you love!</p>
      </div>  
    </div>


    <DogDetailsModal 
      :show="showDogDetailsModal"
      :dog="selectedDog"
      @close="handleDogDetailsClose"
      @contact="handleContactFromDetails"
    />


    <ContactModal 
      :show="showContactModal"
      :dog="selectedDog"
      :user="user"
      @close="handleContactClose"
      @success="handleContactSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInquiries } from '@/composables/useInquiries'
import { useFavorites } from '@/composables/useFavorites'
import FavoriteDogCard from './FavoriteDogCard.vue'
import DogDetailsModal from './DogDetailsModal.vue'
import ContactModal from './ContactModal.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate'])


const { getUserInquiries } = useInquiries()
const { getUserFavorites, toggleFavorite } = useFavorites()


const userInquiries = ref([])
const userFavorites = ref([])
const isLoadingInquiries = ref(false)
const isLoadingFavorites = ref(false)
const showDogDetailsModal = ref(false)
const showContactModal = ref(false)
const selectedDog = ref(null)


const loadUserInquiries = async () => {
  if (!props.user?.uid) return

  isLoadingInquiries.value = true

  try {
    const inquiries = await getUserInquiries(props.user.uid)
    userInquiries.value = inquiries
  } catch (error) {

  } finally {
    isLoadingInquiries.value = false
  }
}

const loadUserFavorites = async () => {
  if (!props.user?.uid) return

  isLoadingFavorites.value = true

  try {
    const favorites = await getUserFavorites(props.user.uid)
    userFavorites.value = favorites
  } catch (error) {

  } finally {
    isLoadingFavorites.value = false
  }
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

const goToDogs = () => {
  emit('navigate', 'home')
}

const handleRemoveFavorite = async (dog) => {
  try {
    await toggleFavorite(props.user.uid, dog.id)
    await loadUserFavorites()
  } catch (error) {

  }
}

const handleViewDog = (dog) => {
  selectedDog.value = dog
  showDogDetailsModal.value = true
}

const handleContactFavoriteDog = (dog) => {
  selectedDog.value = dog
  showContactModal.value = true
}

const handleDogDetailsClose = () => {
  showDogDetailsModal.value = false
  selectedDog.value = null
}

const handleContactFromDetails = (dog) => {
  showDogDetailsModal.value = false
  selectedDog.value = dog
  showContactModal.value = true
}

const handleContactClose = () => {
  showContactModal.value = false
  selectedDog.value = null
}

const handleContactSuccess = () => {
  showContactModal.value = false
  selectedDog.value = null
  loadUserInquiries()
}


onMounted(() => {
  loadUserInquiries()
  loadUserFavorites()
})


defineExpose({
  refreshInquiries: loadUserInquiries,
  refreshFavorites: loadUserFavorites
})
</script>