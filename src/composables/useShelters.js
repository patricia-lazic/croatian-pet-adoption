import { ref } from "vue";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export function useShelters() {
  const shelters = ref([]);
  const isLoading = ref(false);

  const getAllShelters = async () => {
    isLoading.value = true;
    try {
      const q = query(collection(db, "shelters"), orderBy("name"));

      const querySnapshot = await getDocs(q);
      shelters.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  const getShelterById = async (id) => {
    try {
      const docRef = doc(db, "shelters", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const addShelter = async (shelterData) => {
    try {
      const docRef = await addDoc(collection(db, "shelters"), {
        ...shelterData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const updateShelter = async (shelterId, shelterData) => {
    try {
      const shelterRef = doc(db, "shelters", shelterId);

      const shelterDoc = await getDoc(shelterRef);

      const updateData = {
        ...shelterData,
        updatedAt: new Date(),
      };

      if (shelterDoc.exists()) {
        await updateDoc(shelterRef, updateData);
      } else {
        await setDoc(shelterRef, {
          ...updateData,
          id: shelterId,
          createdAt: new Date(),
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const getSheltersByLocation = async (location) => {
    try {
      const q = query(
        collection(db, "shelters"),
        where("location", "==", location),
        orderBy("name")
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

  return {
    shelters,
    isLoading,
    getAllShelters,
    getShelterById,
    addShelter,
    updateShelter,
    getSheltersByLocation,
  };
}
