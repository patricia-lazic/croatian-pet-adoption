import { ref } from "vue";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export function useInquiries() {
  const inquiries = ref([]);
  const isLoading = ref(false);

  const createInquiry = async (inquiryData) => {
    try {
      const docRef = await addDoc(collection(db, "inquiries"), {
        ...inquiryData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const getUserInquiries = async (userId) => {
    isLoading.value = true;
    try {
      const querySnapshot = await getDocs(collection(db, "inquiries"));

      const userInquiries = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.userId === userId) {
          userInquiries.push({
            id: doc.id,
            ...data,
          });
        }
      });

      userInquiries.sort((a, b) => {
        const aDate = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return bDate - aDate;
      });

      return userInquiries;
    } catch (error) {
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const getShelterInquiries = async (shelterId) => {
    isLoading.value = true;
    try {
      const querySnapshot = await getDocs(collection(db, "inquiries"));

      const shelterInquiries = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.shelterId === shelterId) {
          shelterInquiries.push({
            id: doc.id,
            ...data,
          });
        }
      });

      shelterInquiries.sort((a, b) => {
        const aDate = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return bDate - aDate;
      });

      return shelterInquiries;
    } catch (error) {
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const updateInquiryStatus = async (inquiryId, status, response = "") => {
    try {
      const updateData = {
        status,
        updatedAt: new Date(),
      };

      if (response) {
        updateData.response = response;
        updateData.respondedAt = new Date();
      }

      await updateDoc(doc(db, "inquiries", inquiryId), updateData);
    } catch (error) {
      throw error;
    }
  };

  const replyToInquiry = async (inquiryId, response, status = "replied") => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        status,
        response,
        respondedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  };

  const getInquiryById = async (inquiryId) => {
    try {
      const docRef = doc(db, "inquiries", inquiryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const markInquiryAsRead = async (inquiryId) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  };

  const getInquiriesWithPagination = async (
    shelterId,
    limit = 10,
    lastDoc = null
  ) => {
    try {
      let q = query(
        collection(db, "inquiries"),
        where("shelterId", "==", shelterId),
        orderBy("createdAt", "desc")
      );

      if (limit) {
        q = query(q, limit(limit));
      }

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const inquiriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        inquiries: inquiriesData,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === limit,
      };
    } catch (error) {
      return { inquiries: [], lastDoc: null, hasMore: false };
    }
  };

  const getInquiryStats = async (shelterId) => {
    try {
      const inquiries = await getShelterInquiries(shelterId);

      const stats = {
        total: inquiries.length,
        pending: inquiries.filter((i) => i.status === "pending").length,
        approved: inquiries.filter((i) => i.status === "approved").length,
        declined: inquiries.filter((i) => i.status === "declined").length,
        replied: inquiries.filter((i) => i.status === "replied").length,
        thisMonth: inquiries.filter((i) => {
          const date = i.createdAt?.toDate
            ? i.createdAt.toDate()
            : new Date(i.createdAt);
          const now = new Date();
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }).length,
      };

      return stats;
    } catch (error) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        declined: 0,
        replied: 0,
        thisMonth: 0,
      };
    }
  };

  return {
    inquiries,
    isLoading,
    createInquiry,
    getUserInquiries,
    getShelterInquiries,
    updateInquiryStatus,
    replyToInquiry,
    getInquiryById,
    markInquiryAsRead,
    getInquiriesWithPagination,
    getInquiryStats,
  };
}
