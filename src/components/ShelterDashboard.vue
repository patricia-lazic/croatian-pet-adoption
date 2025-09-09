<template>
  <div class="shelter-dashboard">
    <div class="mb-8">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">
        🏢 Shelter Management Dashboard
      </h2>
      <p class="text-gray-600">Manage your shelter, dogs, and adoption inquiries</p>
    </div>


    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-800">{{ shelterInfo?.name || 'Your Shelter' }}</h3>
          <p class="text-gray-600">{{ shelterInfo?.address }}</p>
          <p class="text-gray-600">{{ shelterInfo?.phone }}</p>
          <p class="text-gray-600">{{ shelterInfo?.email }}</p>
        </div>
        <button 
          @click="showEditShelter = true"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Edit Shelter Info
        </button>
      </div>
    </div>


    <div class="mb-6">
      <nav class="flex space-x-8">
        <button
          @click="currentTab = 'overview'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            currentTab === 'overview' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Overview
        </button>
        <button
          @click="currentTab = 'dogs'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            currentTab === 'dogs' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Dogs ({{ availableDogs.length }})
        </button>
        <button
          @click="currentTab = 'inquiries'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm relative',
            currentTab === 'inquiries' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Inquiries ({{ inquiryStats.total }})
          <span v-if="inquiryStats.pending > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {{ inquiryStats.pending }}
          </span>
        </button>
      </nav>
    </div>


    <div v-if="currentTab === 'overview'">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-green-50 rounded-lg p-6 text-center">
          <h4 class="text-lg font-semibold text-green-800">Available Dogs</h4>
          <p class="text-3xl font-bold text-green-600">{{ availableDogs.length }}</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-6 text-center">
          <h4 class="text-lg font-semibold text-blue-800">Total Inquiries</h4>
          <p class="text-3xl font-bold text-blue-600">{{ inquiryStats.total }}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-6 text-center">
          <h4 class="text-lg font-semibold text-yellow-800">Pending</h4>
          <p class="text-3xl font-bold text-yellow-600">{{ inquiryStats.pending }}</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-6 text-center">
          <h4 class="text-lg font-semibold text-purple-800">Approved</h4>
          <p class="text-3xl font-bold text-purple-600">{{ inquiryStats.approved }}</p>
        </div>
      </div>


      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Recent Inquiries</h3>
        
        <div v-if="isLoadingInquiries" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading inquiries...</p>
        </div>

        <div v-else-if="sortedInquiries.length > 0" class="space-y-4">
          <div 
            v-for="inquiry in sortedInquiries.slice(0, 3)" 
            :key="inquiry.id"
            class="border-l-4 p-4 rounded-r-lg"
            :class="{
              'border-yellow-500 bg-yellow-50': inquiry.status === 'pending',
              'border-green-500 bg-green-50': inquiry.status === 'approved',
              'border-blue-500 bg-blue-50': inquiry.status === 'replied'
            }"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ inquiry.dogName || 'General Inquiry' }}</h4>
                <p class="text-sm text-gray-600 mb-1">From: {{ inquiry.contactInfo?.name }}</p>
                <p class="text-sm">{{ inquiry.message?.substring(0, 80) }}...</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-500">{{ formatDate(inquiry.createdAt) }}</span>
                <br>
                <span class="text-sm px-2 py-1 rounded"
                      :class="{
                        'bg-yellow-200 text-yellow-800': inquiry.status === 'pending',
                        'bg-green-200 text-green-800': inquiry.status === 'approved',
                        'bg-blue-200 text-blue-800': inquiry.status === 'replied'
                      }">
                  {{ inquiry.status }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="text-center pt-4">
            <button 
              @click="currentTab = 'inquiries'"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Inquiries →
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500">No inquiries yet</p>
        </div>
      </div>
    </div>


    <div v-if="currentTab === 'dogs'">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Your Dogs</h3>
          <button 
            @click="showAddDog = true"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            ➕ Add New Dog
          </button>
        </div>


        <div v-if="availableDogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="dog in availableDogs" 
            :key="dog.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <img 
              :src="dog.image || dog.imageUrls?.[0] || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop'" 
              :alt="dog.name"
              class="w-full h-32 object-cover rounded mb-3"
            />
            <h4 class="font-semibold text-lg">{{ dog.name }}</h4>
            <p class="text-gray-600 text-sm mb-3">{{ dog.breed }}, {{ dog.age }} years</p>
            
            <div class="flex space-x-2">
              <button 
                @click="editDog(dog)"
                class="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button 
                @click="deleteDog(dog)"
                class="flex-1 bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 text-lg">No dogs added yet</p>
          <button 
            @click="showAddDog = true"
            class="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Add Your First Dog
          </button>
        </div>
      </div>
    </div>


    <div v-if="currentTab === 'inquiries'">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Adoption Inquiries</h3>
          <button 
            @click="loadInquiries"
            class="text-blue-600 hover:text-blue-800 text-sm"
            :disabled="isLoadingInquiries"
          >
            {{ isLoadingInquiries ? 'Refreshing...' : '🔄 Refresh' }}
          </button>
        </div>


        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 rounded p-3 text-center">
            <div class="text-2xl font-bold text-gray-600">{{ inquiryStats.total }}</div>
            <div class="text-sm text-gray-500">Total</div>
          </div>
          <div class="bg-yellow-50 rounded p-3 text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ inquiryStats.pending }}</div>
            <div class="text-sm text-yellow-600">Pending</div>
          </div>
          <div class="bg-green-50 rounded p-3 text-center">
            <div class="text-2xl font-bold text-green-600">{{ inquiryStats.approved }}</div>
            <div class="text-sm text-green-600">Approved</div>
          </div>
          <div class="bg-red-50 rounded p-3 text-center">
            <div class="text-2xl font-bold text-red-600">{{ inquiryStats.declined }}</div>
            <div class="text-sm text-red-600">Declined</div>
          </div>
        </div>


        <div v-if="isLoadingInquiries" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading inquiries...</p>
        </div>

        <div v-else-if="sortedInquiries.length > 0" class="space-y-4">
          <InquiryCard 
            v-for="inquiry in sortedInquiries" 
            :key="inquiry.id"
            :inquiry="inquiry"
            @reply="handleInquiryReply"
            @view-details="viewInquiryDetails"
          />
        </div>

        <div v-else class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">📭</div>
          <h4 class="text-lg font-semibold text-gray-600 mb-2">No inquiries yet</h4>
          <p class="text-gray-500">
            Inquiries will appear here when adopters contact you about your dogs.
          </p>
        </div>
      </div>
    </div>


    <DogModal 
      :show="showAddDog || !!editingDog"
      :dog="editingDog"
      :shelter-id="user.uid"
      :shelter-name="shelterInfo?.name || shelterName || 'Your Shelter'"
      @close="closeModals"
      @success="handleDogSuccess"
    />


    <EditShelterModal 
      :show="showEditShelter"
      :shelter="shelterInfo"
      :user-id="user.uid"
      @close="showEditShelter = false"
      @success="handleShelterSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDogs } from '@/composables/useDogs'
import { useShelters } from '@/composables/useShelters'
import { useInquiries } from '@/composables/useInquiries'
import DogModal from './DogModal.vue'
import EditShelterModal from './EditShelterModal.vue'
import InquiryCard from './InquiryCard.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  shelterName: {
    type: String,
    default: 'Your Shelter'
  }
})


const { dogs, getAllDogs, deleteDog: removeDog } = useDogs()
const { getShelterById } = useShelters()
const { getShelterInquiries, updateInquiryStatus } = useInquiries()


const shelterInfo = ref(null)
const inquiries = ref([])
const isLoadingInquiries = ref(false)
const showAddDog = ref(false)
const showEditShelter = ref(false)
const editingDog = ref(null)
const selectedInquiry = ref(null)
const currentTab = ref('overview')


const availableDogs = computed(() => 
  dogs.value.filter(dog => dog.shelterId === props.user.uid)
)

const inquiryStats = computed(() => ({
  total: inquiries.value.length,
  pending: inquiries.value.filter(i => i.status === 'pending').length,
  approved: inquiries.value.filter(i => i.status === 'approved').length,
  declined: inquiries.value.filter(i => i.status === 'declined').length,
  replied: inquiries.value.filter(i => i.status === 'replied').length
}))

const sortedInquiries = computed(() => {
  return [...inquiries.value].sort((a, b) => {

    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    
    const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return bDate - aDate
  })
})


const loadShelterData = async () => {
  try {

    shelterInfo.value = await getShelterById(props.user.uid)
    

    await getAllDogs()
    

    await loadInquiries()
  } catch (error) {

  }
}

const loadInquiries = async () => {
  isLoadingInquiries.value = true
  try {
    inquiries.value = await getShelterInquiries(props.user.uid)
  } catch (error) {

  } finally {
    isLoadingInquiries.value = false
  }
}

const handleInquiryReply = async (replyData) => {
  try {
    await updateInquiryStatus(
      replyData.inquiryId, 
      replyData.status, 
      replyData.response
    )
    

    await loadInquiries()
  } catch (error) {
    throw error
  }
}

const viewInquiryDetails = (inquiry) => {
  selectedInquiry.value = inquiry

}

const editDog = (dog) => {
  editingDog.value = dog
}

const deleteDog = async (dog) => {
  if (confirm(`Are you sure you want to delete ${dog.name}?`)) {
    try {
      await removeDog(dog.id)
      await getAllDogs()
    } catch (error) {

    }
  }
}

const closeModals = () => {
  showAddDog.value = false
  editingDog.value = null
}

const handleDogSuccess = () => {
  closeModals()
  getAllDogs()
}

const handleShelterSuccess = () => {
  showEditShelter.value = false
  loadShelterData()
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}


onMounted(() => {
  loadShelterData()
})
</script>
