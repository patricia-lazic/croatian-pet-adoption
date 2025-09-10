<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-screen overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">
          🏢 Edit Shelter Information
        </h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Shelter Name *</label
            >
            <input
              v-model="shelterForm.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Zagreb Animal Shelter"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Address *</label
            >
            <textarea
              v-model="shelterForm.address"
              required
              rows="2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Heinzelova ul. 55, 10000 Zagreb"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Phone Number *</label
              >
              <input
                v-model="shelterForm.phone"
                type="tel"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="+385 1 2345 678"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email *</label
              >
              <input
                v-model="shelterForm.email"
                type="email"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="info@shelter.hr"
              />
            </div>
          </div>

          <!-- Add location selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Location *</label
            >
            <select
              v-model="shelterForm.location"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Working Hours</label
            >
            <input
              v-model="shelterForm.workingHours"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Mon-Fri: 8:00-16:00, Sat: 8:00-12:00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >About Your Shelter</label
            >
            <textarea
              v-model="shelterForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Tell people about your shelter, mission, and how long you've been helping animals..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Website (optional)</label
            >
            <input
              v-model="shelterForm.website"
              type="url"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="https://your-shelter-website.hr"
            />
          </div>
        </div>

        <div v-if="error" class="mt-4 text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="mt-4 text-green-600 text-sm">
          {{ success }}
        </div>

        <div class="flex space-x-4 mt-8">
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
            {{ isLoading ? "Saving..." : "Update Shelter" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useShelters } from "@/composables/useShelters";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  shelter: {
    type: Object,
    default: null,
  },
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);

const { updateShelter } = useShelters();

// Form data with location field
const shelterForm = ref({
  name: "",
  address: "",
  phone: "",
  email: "",
  location: "",
  workingHours: "",
  description: "",
  website: "",
});

const isLoading = ref(false);
const error = ref("");
const success = ref("");

// Watch for shelter data and populate form
watch(
  () => props.shelter,
  (newShelter) => {
    if (newShelter) {
      shelterForm.value = {
        name: newShelter.name || "",
        address: newShelter.address || "",
        phone: newShelter.phone || "",
        email: newShelter.email || "",
        location: newShelter.location || "",
        workingHours: newShelter.workingHours || "",
        description: newShelter.description || "",
        website: newShelter.website || "",
      };
    }
  },
  { immediate: true }
);

// Form validation
const validateForm = () => {
  if (!shelterForm.value.name.trim()) {
    error.value = "Shelter name is required";
    return false;
  }
  if (!shelterForm.value.address.trim()) {
    error.value = "Address is required";
    return false;
  }
  if (!shelterForm.value.phone.trim()) {
    error.value = "Phone number is required";
    return false;
  }
  if (!shelterForm.value.email.trim()) {
    error.value = "Email is required";
    return false;
  }
  if (!shelterForm.value.location) {
    error.value = "Location is required";
    return false;
  }
  return true;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  error.value = "";
  success.value = "";

  try {
    const shelterData = {
      name: shelterForm.value.name.trim(),
      address: shelterForm.value.address.trim(),
      phone: shelterForm.value.phone.trim(),
      email: shelterForm.value.email.trim(),
      location: shelterForm.value.location,
      workingHours:
        shelterForm.value.workingHours.trim() || "Contact for hours",
      description: shelterForm.value.description.trim(),
      website: shelterForm.value.website.trim(),
    };

    await updateShelter(props.userId, shelterData);

    success.value = "Shelter information updated successfully!";

    setTimeout(() => {
      emit("success");
    }, 1500);
  } catch (err) {
    console.error("Error in handleSubmit:", err);
    error.value = `Failed to update shelter information: ${
      err.message || "Please try again."
    }`;
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  error.value = "";
  success.value = "";
  emit("close");
};
</script>
