<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img 
      :src="dog.imageUrls?.[0] || dog.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop'" 
      :alt="dog.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-semibold text-gray-800">{{ dog.name }}</h3>
        <button 
          @click="handleFavorite"
          :disabled="isFavoriteLoading"
          class="text-2xl transition-all duration-200 disabled:opacity-50"
          :class="[
            isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500',
            isFavoriteLoading ? 'animate-pulse' : 'hover:scale-110'
          ]"
        >
          {{ isFavorited ? '❤️' : '🤍' }}
        </button>
      </div>
      
      <div class="space-y-2 mb-3">
        <p class="text-gray-600"><strong>Age:</strong> {{ dog.age }} years</p>
        <p class="text-gray-600"><strong>Breed:</strong> {{ dog.breed }}</p>
        <p class="text-gray-600"><strong>Size:</strong> {{ dog.size }}</p>
        <p class="text-gray-600 flex items-center">
          {{ dog.shelter }}, {{ dog.location }}
        </p>
      </div>
      
      <p class="text-gray-700 text-sm mb-3">{{ dog.description }}</p>
      <p class="text-green-600 text-sm mb-4"><strong>Health:</strong> {{ dog.healthStatus }}</p>
      
      <button 
        @click="contactShelter"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Contact Shelter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps({
  dog: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['contact', 'favorite'])


const { toggleFavorite, isFavorited: checkIsFavorited, isLoading: isFavoriteLoading } = useFavorites()
const isFavorited = ref(false)


const contactShelter = () => {
  emit('contact', props.dog)
}

const handleFavorite = async () => {
  if (!props.user) {
    emit('favorite', props.dog)
    return
  }

  try {

    const dogData = {
      name: props.dog.name,
      age: props.dog.age,
      breed: props.dog.breed,
      size: props.dog.size,
      description: props.dog.description,
      healthStatus: props.dog.healthStatus,
      image: props.dog.image || props.dog.imageUrls?.[0],
      shelter: props.dog.shelter,
      location: props.dog.location,
      shelterId: props.dog.shelterId
    }
    
    const newFavoriteStatus = await toggleFavorite(props.user.uid, props.dog.id, dogData)
    isFavorited.value = newFavoriteStatus
    

    emit('favorite', { dog: props.dog, isFavorited: newFavoriteStatus })
    
  } catch (error) {

  }
}


onMounted(async () => {
  if (props.user?.uid && props.dog?.id) {
    try {
      isFavorited.value = await checkIsFavorited(props.user.uid, props.dog.id)
    } catch (error) {

    }
  }
})
</script>