import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Firebase konfiguratsiyasini import qiling

function useGetOngoingSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
let a = 1
  const fetchSlides = async () => {
    console.log(a + 1);
    
    setLoading(true)
    try {
      const querySnapshot = await getDocs(
        collection(db, "ongoingSlides"),
      );
      const slidesArray = [];
      querySnapshot.forEach((doc) => {
        slidesArray.push({ id: doc.id, ...doc.data() }); // Hujjat ID'si bilan birga ma'lumotlarni qo'shish
      });
      setSlides(slidesArray);
    } catch (err) {
      setError(err); // Xatolik yuz berishi holatida
    } finally {
      setLoading(false); // Ma'lumotlar yuklanishi tugagach
    }
  };
  useEffect(() => {
    fetchSlides();
  }, []);

  return { slides, loading, error, setLoading, fetchSlides };
}

export default useGetOngoingSlides;
