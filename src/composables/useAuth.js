import { ref, onMounted } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

export function useAuth() {
  const user = ref(null);
  const isLoading = ref(true);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email,
    password,
    displayName,
    role = "user",
    shelterData = null
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName,
        role,
        createdAt: new Date(),
        favorites: [],
      });

      if (role === "shelter" && shelterData) {
        await setDoc(doc(db, "shelters", user.uid), {
          ...shelterData,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const getCurrentUser = async () => {
    if (user.value) {
      const userDoc = await getDoc(doc(db, "users", user.value.uid));
      return userDoc.exists() ? userDoc.data() : null;
    }
    return null;
  };

  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      isLoading.value = false;
    });
  });

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  };
}
