import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';

function useGetAuth() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // onAuthStateChanged hodisasini o'rnatish
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Foydalanuvchi tizimga kirgan bo'lsa
        setUserData(user);
      } else {
        // Foydalanuvchi tizimdan chiqqan bo'lsa
        setUserData(null);
      }
    });

    // Component o'chirilganda obunani bekor qilish
    return () => unsubscribe();
  }, []);

  return { userData };
}

export default useGetAuth;
