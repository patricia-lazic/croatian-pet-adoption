import { ref } from "vue";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export function useDogs() {
  const dogs = ref([]);
  const isLoading = ref(false);

  const getAllDogs = async () => {
    isLoading.value = true;
    try {
      const q = query(
        collection(db, "dogs"),
        where("isAdopted", "==", false),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      dogs.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  const getDogById = async (id) => {
    try {
      const docRef = doc(db, "dogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getDogsByShelter = async (shelterId) => {
    try {
      const q = query(
        collection(db, "dogs"),
        where("shelterId", "==", shelterId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      return [];
    }
  };

  const addDog = async (dogData) => {
    try {
      const docRef = await addDoc(collection(db, "dogs"), {
        ...dogData,
        isAdopted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const updateDog = async (dogId, dogData) => {
    try {
      await updateDoc(doc(db, "dogs", dogId), {
        ...dogData,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteDog = async (dogId) => {
    try {
      await deleteDoc(doc(db, "dogs", dogId));
    } catch (error) {
      throw error;
    }
  };

  return {
    dogs,
    isLoading,
    getAllDogs,
    getDogById,
    getDogsByShelter,
    addDog,
    updateDog,
    deleteDog,
  };
}
