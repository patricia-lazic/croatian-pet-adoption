<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-green-200">
    <div class="relative">
      <img 
        :src="dog.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop'" 
        :alt="dog.name"
        class="w-full h-40 object-cover"
      />
      <div class="absolute top-2 right-2">
        <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">❤️ Favorite</span>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ dog.name }}</h3>
        <button 
          @click="removeFavorite"
          class="text-red-500 hover:text-red-600 transition-colors"
          title="Remove from favorites"
        >
          ❤️
        </button>
      </div>
      
      <div class="space-y-1 mb-3 text-sm">
        <p class="text-gray-600">{{ dog.age }} years • {{ dog.breed }}</p>
        <p class="text-gray-600">{{ dog.size }} • {{ dog.location }}</p>
        <p class="text-gray-600">{{ dog.shelter }}</p>
      </div>
      
      <p class="text-gray-700 text-xs mb-3 line-clamp-2">{{ dog.description }}</p>
      
      <div class="flex space-x-2">
        <button 
          @click="viewDog"
          class="flex-1 bg-pink-600 text-white py-2 px-3 text-sm rounded hover:bg-pink-700 transition-colors"
        >
          View Details
        </button>
        <button 
          @click="contactShelter"
          class="flex-1 bg-green-600 text-white py-2 px-3 text-sm rounded hover:bg-green-700 transition-colors"
        >
          Contact
        </button>
      </div>
      
      <p class="text-xs text-gray-400 mt-2">
        Added {{ formatDate(dog.favoritedAt) }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dog: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove', 'view', 'contact'])

const removeFavorite = () => {
  emit('remove', props.dog)
}

const viewDog = () => {
  emit('view', props.dog)
}

const contactShelter = () => {
  emit('contact', props.dog)
}

const formatDate = (date) => {
  if (!date) return 'recently'
  
  try {
    const d = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return d.toLocaleDateString()
  } catch {
    return 'recently'
  }
}
</script>