<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDogs } from '@/composables/useDogs'
import { useShelters } from '@/composables/useShelters'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

import DogCard from './components/DogCard.vue'
import ShelterCard from './components/ShelterCard.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import ContactModal from './components/ContactModal.vue'
import Dashboard from './components/Dashboard.vue'
import ShelterDashboard from './components/ShelterDashboard.vue'
import ShelterContactModal from './components/ShelterContactModal.vue'

const { user, isLoading, logout } = useAuth()
const { dogs, isLoading: dogsLoading, getAllDogs } = useDogs()
const { shelters, getAllShelters } = useShelters()

const currentView = ref('home')
const searchTerm = ref('')
const filters = ref({
  age: '',
  size: '',
  location: ''
})
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showContactModal = ref(false)
const selectedDog = ref(null)
const userRole = ref(null)
const showShelterContactModal = ref(false)
const selectedShelter = ref(null)

const filteredDogs = computed(() => {
  return dogs.value.filter(dog => {
    const matchesSearch = searchTerm.value === '' || 
      dog.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesAge = !filters.value.age || getAgeCategory(dog.age) === filters.value.age
    const matchesSize = !filters.value.size || dog.size === filters.value.size
    const matchesLocation = !filters.value.location || dog.location === filters.value.location
    
    return matchesSearch && matchesAge && matchesSize && matchesLocation
  })
})

const loadUserRole = async () => {
  if (user.value) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.value.uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
        if (userRole.value === 'shelter' && currentView.value !== 'dashboard') {
          currentView.value = 'dashboard'
        }
      }
    } catch (error) {
    }
  } else {
    userRole.value = null
  }
}

const getAgeCategory = (age) => {
  if (age <= 1) return 'puppy'
  if (age <= 3) return 'young'
  if (age <= 7) return 'adult'
  return 'senior'
}

const clearFilters = () => {
  filters.value = {
    age: '',
    size: '',
    location: ''
  }
  searchTerm.value = ''
}

const handleContactDog = (dog) => {
  if (!user.value) {
    showLoginModal.value = true
    return
  }
  selectedDog.value = dog
  showContactModal.value = true
}

const handleFavorite = async (dog) => {
  if (!user.value) {
    showLoginModal.value = true
    return
  }
}

const handleLogout = async () => {
  try {
    await logout()
    currentView.value = 'home'
    userRole.value = null
  } catch (error) {
  }
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  loadUserRole()
}

const handleRegisterSuccess = () => {
  showRegisterModal.value = false
  loadUserRole()
}

const handleContactSuccess = () => {
  showContactModal.value = false
  selectedDog.value = null
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const viewShelterDogs = (shelter) => {
  filters.value.location = shelter.location
  currentView.value = 'home'
}

const contactShelter = (shelter) => {
  if (!user.value) {
    showLoginModal.value = true
    return
  }
  selectedShelter.value = shelter
  showShelterContactModal.value = true
}

const handleShelterContactSuccess = () => {
  showShelterContactModal.value = false
  selectedShelter.value = null
}

watch(user, () => {
  loadUserRole()
})

onMounted(async () => {
  try {
    await loadUserRole()
    if (userRole.value !== 'shelter') {
      await getAllDogs()
      await getAllShelters()
    }
  } catch (error) {
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">

    <header class="bg-pink-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">🐕 Croatian Pet Adoption</h1>
            <p class="text-pink-100 mt-1">
              {{ userRole === 'shelter' ? 'Shelter Management Platform' : 'Connecting shelters and families across Croatia' }}
            </p>
          </div>
          <nav class="flex items-center space-x-6">

            <template v-if="userRole !== 'shelter'">
              <button 
                @click="currentView = 'home'"
                :class="['px-4 py-2 rounded transition-colors', currentView === 'home' ? 'bg-pink-700' : 'hover:bg-pink-700']"
              >
                Find Dogs
              </button>
              <button 
                @click="currentView = 'shelters'"
                :class="['px-4 py-2 rounded transition-colors', currentView === 'shelters' ? 'bg-pink-700' : 'hover:bg-pink-700']"
              >
                Shelters
              </button>
            </template>
            

            <div v-if="user" class="flex items-center space-x-4">
              <span class="text-pink-100">
                Hello, {{ user.displayName || user.email }}
                <span v-if="userRole" class="text-xs bg-pink-500 px-2 py-1 rounded ml-2">
                  {{ userRole === 'shelter' ? '🏢 Shelter' : '👤 Adopter' }}
                </span>
              </span>
              <button 
                @click="currentView = 'dashboard'"
                :class="['px-4 py-2 rounded transition-colors', currentView === 'dashboard' ? 'bg-pink-700' : 'hover:bg-pink-700']"
              >
                {{ userRole === 'shelter' ? 'Manage Shelter' : 'Dashboard' }}
              </button>
              <button 
                @click="handleLogout"
                class="px-4 py-2 rounded hover:bg-pink-700 transition-colors"
              >
                Logout
              </button>
            </div>
            <div v-else class="flex space-x-2">
              <button 
                @click="showLoginModal = true"
                class="px-4 py-2 rounded hover:bg-pink-700 transition-colors"
              >
                Login
              </button>
              <button 
                @click="showRegisterModal = true"
                class="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Register
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">

      <div v-if="isLoading || (dogsLoading && userRole !== 'shelter')" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>


      <template v-else-if="userRole === 'shelter'">
        <ShelterDashboard 
          :user="user"
          :shelter-name="user?.displayName || 'Your Shelter'"
        />
      </template>


      <template v-else>

        <div v-if="currentView === 'home'">

          <div class="mb-8 bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Search by dog name or breed..."
                  class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Filter Dogs</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <select 
                      v-model="filters.age"
                      class="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Any Age</option>
                      <option value="puppy">Puppy (0-1 years)</option>
                      <option value="young">Young (1-3 years)</option>
                      <option value="adult">Adult (3-7 years)</option>
                      <option value="senior">Senior (7+ years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select 
                      v-model="filters.size"
                      class="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Any Size</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select 
                      v-model="filters.location"
                      class="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">All Croatia</option>
                      <option value="Zagreb">Zagreb</option>
                      <option value="Split">Split</option>
                      <option value="Rijeka">Rijeka</option>
                      <option value="Osijek">Osijek</option>
                    </select>
                  </div>
                  
                  <button 
                    @click="clearFilters"
                    class="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>


            <div class="lg:col-span-3">
              <div class="mb-4">
                <h2 class="text-2xl font-semibold text-gray-800">
                  Available Dogs ({{ filteredDogs.length }})
                </h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <DogCard 
                  v-for="dog in filteredDogs" 
                  :key="dog.id" 
                  :dog="dog" 
                  :user="user"
                  @contact="handleContactDog"
                  @favorite="handleFavorite"
                />
              </div>
              
              <div v-if="filteredDogs.length === 0" class="text-center py-12">
                <p class="text-gray-500 text-lg">No dogs match your current filters.</p>
                <button 
                  @click="clearFilters"
                  class="mt-4 text-pink-600 hover:text-pink-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        </div>


        <div v-else-if="currentView === 'shelters'">
          <div class="mb-8">
            <h2 class="text-3xl font-semibold text-gray-800 mb-4">Animal Shelters in Croatia</h2>
            <p class="text-gray-600">Connect directly with shelters across the country</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ShelterCard 
              v-for="shelter in shelters" 
              :key="shelter.id" 
              :shelter="shelter" 
              @view-dogs="viewShelterDogs"
              @contact="contactShelter"
            />
          </div>
        </div>


        <div v-else-if="currentView === 'dashboard' && user">
          <Dashboard 
            :user="user" 
          />
        </div>
      </template>
    </main>


    <LoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
      @switch-to-register="switchToRegister"
    />


    <RegisterModal 
      :show="showRegisterModal" 
      @close="showRegisterModal = false"
      @success="handleRegisterSuccess"
      @switch-to-login="switchToLogin"
    />


    <ContactModal 
      v-if="userRole !== 'shelter'"
      :show="showContactModal"
      :dog="selectedDog"
      :user="user"
      @close="showContactModal = false"
      @success="handleContactSuccess"
    />


    <ShelterContactModal 
      v-if="userRole !== 'shelter'"
      :show="showShelterContactModal"
      :shelter="selectedShelter"
      :user="user"
      @close="showShelterContactModal = false"
      @success="handleShelterContactSuccess"
    />


    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2025 Croatian Pet Adoption. {{ userRole === 'shelter' ? 'Shelter Management Platform' : 'Helping pets find loving homes across Croatia.' }}</p>
      </div>
    </footer>
  </div>
</template>