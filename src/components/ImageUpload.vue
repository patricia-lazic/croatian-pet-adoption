<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Dog Image
      </label>
      <p class="text-xs text-gray-500 mb-4">
        You can either upload an image from your computer or provide an image
        URL
      </p>
      <!-- Debug info -->
      <div v-if="user" class="text-xs text-green-600 mb-2">
        ✓ Logged in as: {{ user.email }}
      </div>
      <div v-else class="text-xs text-red-600 mb-2">⚠ Not logged in</div>
    </div>

    <div class="flex space-x-4 mb-4">
      <button
        type="button"
        @click="switchToFileUpload"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium',
          uploadMethod === 'file'
            ? 'bg-pink-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        Upload File
      </button>
      <button
        type="button"
        @click="switchToUrlInput"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium',
          uploadMethod === 'url'
            ? 'bg-pink-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        Image URL
      </button>
    </div>

    <div v-if="uploadMethod === 'file'" class="space-y-4">
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
        <div class="space-y-2">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Choose Image
            </button>
            <p class="text-sm text-gray-500 mt-2">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>

      <div v-if="selectedFiles.length > 0" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">Selected File:</h4>
        <div class="border rounded-lg p-2 max-w-xs">
          <img
            :src="selectedFiles[0].preview"
            :alt="selectedFiles[0].name"
            class="w-full h-32 object-cover rounded"
          />
          <div class="flex justify-between items-center mt-2">
            <p class="text-xs text-gray-600 truncate">
              {{ selectedFiles[0].name }}
            </p>
            <button
              type="button"
              @click="removeFile"
              class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>

          <div v-if="selectedFiles[0].uploading" class="mt-2">
            <div class="bg-gray-200 rounded-full h-2">
              <div
                class="bg-pink-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: selectedFiles[0].progress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ selectedFiles[0].progress }}%
            </p>
          </div>

          <div v-if="selectedFiles[0].uploaded" class="mt-2 flex items-center">
            <svg
              class="w-4 h-4 text-green-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-xs text-green-600">Uploaded</span>
          </div>

          <div v-if="selectedFiles[0].error" class="mt-2 text-xs text-red-600">
            Error: {{ selectedFiles[0].error }}
          </div>
        </div>
      </div>

      <button
        v-if="selectedFiles.length > 0 && !allFilesUploaded"
        type="button"
        @click="uploadFiles"
        :disabled="isUploading"
        class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isUploading ? "Uploading..." : "Upload Image" }}
      </button>
    </div>

    <div v-else class="space-y-4">
      <div class="flex space-x-2">
        <input
          :value="singleUrl"
          @input="updateSingleUrl($event.target.value)"
          type="url"
          placeholder="Enter image URL"
          class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <button
          v-if="singleUrl"
          type="button"
          @click="clearUrl"
          class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div v-if="singleUrl && singleUrl.trim() !== ''" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">Image Preview:</h4>
        <div class="border rounded-lg p-2 max-w-xs">
          <img
            :src="singleUrl"
            alt="Dog image preview"
            class="w-full h-32 object-cover rounded"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ error }}
    </div>

    <div
      v-if="success"
      class="p-3 bg-green-100 border border-green-400 text-green-700 rounded"
    >
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { storage } from "@/firebase/config";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "@/composables/useAuth";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { user } = useAuth();

const uploadMethod = ref("file");
const selectedFiles = ref([]);
const singleUrl = ref("");
const isUploading = ref(false);
const error = ref("");
const success = ref("");

const allFilesUploaded = computed(() => {
  return (
    selectedFiles.value.length > 0 &&
    selectedFiles.value.every((file) => file.uploaded)
  );
});

const currentImageUrls = computed(() => {
  if (uploadMethod.value === "file") {
    const uploadedFile = selectedFiles.value.find(
      (file) => file.uploaded && file.url
    );
    return uploadedFile ? [uploadedFile.url] : [];
  } else {
    return singleUrl.value && singleUrl.value.trim() !== ""
      ? [singleUrl.value.trim()]
      : [];
  }
});

onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0) {
    singleUrl.value = props.modelValue[0] || "";
    emitUpdate();
  }
});

const switchToFileUpload = () => {
  uploadMethod.value = "file";
  emitUpdate();
};

const switchToUrlInput = () => {
  uploadMethod.value = "url";
  emitUpdate();
};

const updateSingleUrl = (newValue) => {
  singleUrl.value = newValue;
  emitUpdate();
};

const clearUrl = () => {
  singleUrl.value = "";
  emitUpdate();
};

const emitUpdate = () => {
  const urls = currentImageUrls.value;
  emit("update:modelValue", urls);
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  error.value = "";

  const file = files[0];
  if (!file) return;

  selectedFiles.value.forEach((existingFile) => {
    if (existingFile.preview) {
      URL.revokeObjectURL(existingFile.preview);
    }
  });
  selectedFiles.value = [];

  if (file.size > props.maxFileSize) {
    error.value = `File ${file.name} is too large. Maximum size is ${
      props.maxFileSize / (1024 * 1024)
    }MB`;
    return;
  }

  if (!file.type.startsWith("image/")) {
    error.value = `File ${file.name} is not a valid image`;
    return;
  }

  const fileObj = {
    file,
    name: file.name,
    preview: URL.createObjectURL(file),
    uploading: false,
    uploaded: false,
    progress: 0,
    url: null,
    error: null,
  };

  selectedFiles.value.push(fileObj);

  event.target.value = "";
};

const removeFile = () => {
  const file = selectedFiles.value[0];
  if (file && file.preview) {
    URL.revokeObjectURL(file.preview);
  }
  selectedFiles.value = [];
  emitUpdate();
};

const uploadFiles = async () => {
  if (!user.value) {
    error.value = "You must be logged in to upload images";
    return;
  }

  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;
  error.value = "";

  const fileObj = selectedFiles.value[0];
  fileObj.uploading = true;
  fileObj.error = null;

  try {
    const timestamp = Date.now();
    const sanitizedFilename = fileObj.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `dogs/${user.value.uid}/${timestamp}_${sanitizedFilename}`;
    const imageRef = storageRef(storage, filename);

    const metadata = {
      contentType: fileObj.file.type,
      customMetadata: {
        uploadedBy: user.value.uid,
        originalName: fileObj.file.name,
      },
    };

    const snapshot = await uploadBytes(imageRef, fileObj.file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    fileObj.uploaded = true;
    fileObj.uploading = false;
    fileObj.progress = 100;
    fileObj.url = downloadURL;

    success.value = "Image uploaded successfully!";
    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err) {
    fileObj.error = err.message;
    fileObj.uploading = false;

    if (err.code === "storage/unauthorized") {
      error.value =
        "Upload permission denied. Please make sure you are logged in and have proper permissions.";
    } else if (err.code === "storage/quota-exceeded") {
      error.value = "Storage quota exceeded. Please contact support.";
    } else if (err.code === "storage/invalid-argument") {
      error.value =
        "Invalid file or arguments. Please check your file and try again.";
    } else {
      error.value = `Failed to upload ${fileObj.name}: ${err.message}`;
    }
  }

  isUploading.value = false;
  emitUpdate();
};

const handleImageError = () => {
  error.value = "Failed to load image. Please check the URL and try again.";
};

onBeforeUnmount(() => {
  selectedFiles.value.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
});
</script>
