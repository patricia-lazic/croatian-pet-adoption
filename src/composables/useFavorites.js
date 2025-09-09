import { ref } from "vue";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export function useFavorites() {
  const isLoading = ref(false);

  const toggleFavorite = async (userId, dogId, dogData = null) => {
    if (!userId || !dogId) {
      throw new Error("User ID and Dog ID are required");
    }

    isLoading.value = true;

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }

      const userData = userDoc.data();
      const currentFavorites = userData.favorites || [];
      const favoriteDogs = userData.favoriteDogs || {};

      const isFavorited = currentFavorites.includes(dogId);

      if (isFavorited) {
        const newFavorites = currentFavorites.filter((id) => id !== dogId);
        const newFavoriteDogs = { ...favoriteDogs };
        delete newFavoriteDogs[dogId];

        await updateDoc(userRef, {
          favorites: newFavorites,
          favoriteDogs: newFavoriteDogs,
        });
        return false;
      } else {
        const newFavorites = [...currentFavorites, dogId];
        const newFavoriteDogs = {
          ...favoriteDogs,
          [dogId]: {
            ...dogData,
            favoritedAt: new Date(),
          },
        };

        await updateDoc(userRef, {
          favorites: newFavorites,
          favoriteDogs: newFavoriteDogs,
        });
        return true;
      }
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getUserFavorites = async (userId) => {
    if (!userId) return [];

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return [];
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      const favoriteDogs = userData.favoriteDogs || {};

      return favorites
        .map((dogId) => ({
          id: dogId,
          ...favoriteDogs[dogId],
        }))
        .filter((dog) => dog.name);
    } catch (error) {
      return [];
    }
  };

  const isFavorited = async (userId, dogId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) return false;

      const favorites = userDoc.data().favorites || [];
      return favorites.includes(dogId);
    } catch (error) {
      return false;
    }
  };

  return {
    isLoading,
    toggleFavorite,
    getUserFavorites,
    isFavorited,
  };
}
