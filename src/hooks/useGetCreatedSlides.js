import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { message } from "antd";
import { collection, getDocs } from "firebase/firestore";


function useGetCreatedSlides() {
  const [loading , setLoading] = useState(false)
  const [datas , setData] = useState([])
  const fetchCreated = async () => {
    
    
    setLoading(true)
    try {
      const querySnapshot = await getDocs(
        collection(db, "createSlides"),
      );
      const slidesArray = [];
      querySnapshot.forEach((doc) => {
        slidesArray.push({ id: doc.id, ...doc.data() }); // Hujjat ID'si bilan birga ma'lumotlarni qo'shish
      });
      setData(slidesArray);
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false); // Ma'lumotlar yuklanishi tugagach
    }
  };
  useEffect(() => {
    fetchCreated();
  }, []);

  return {datas , loading , fetchCreated}
}

export default useGetCreatedSlides