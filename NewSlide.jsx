import { Button, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import ModalCreateSlide from "../components/ModalCreateSlide";
import useGetAuth from "../hooks/useGetAuth";
import useGetOngoingSlides from "../hooks/useGetOngoingSlides";
import KonvaCanvas from "../components/KonvaCanvas";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function NewSlide() {
  const { setIsModalOpen } = useContext(UserContext);
  const { userData } = useGetAuth();

  const [slides, setSlides] = useState([]);
  const { loading } = useGetOngoingSlides();
  const [userSlides, setUserSlides] = useState([]);
  const [completedSlide, setCompletedSlide] = useState(null);
  const [changed, setChanged] = useState("");


  async function checkSlide() {
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
      console.log(err.message);
       // Xatolik yuz berishi holatida
    }
    const filteredSlides = slides?.filter(
      (slide) => slide.uid === userData.uid,
    );
    setUserSlides(filteredSlides);

    // Directly finding incomplete slide from filteredSlides
    const foundSlide = filteredSlides?.find(
      (slide) => slide.completed === false,
    );
    setCompletedSlide(foundSlide);
  }
  

  useEffect(() => {
    checkSlide();
  }, [userData, slides, changed]);

  const showModal = () => {
    setIsModalOpen(true);
  };
 
 
  return (
    <div className='w-full h-full p-3'>
      {loading ? (
        <div className='w-full pt-40 grid place-items-center'>
          <Spin size='large' />
        </div>
      ) : completedSlide ? (
        <KonvaCanvas checkSlide={checkSlide} setCompletedSlide={setCompletedSlide}/>
      ) : (
        <div className='w-full flex flex-col items-center pt-32 gap-6'>
          <h1 className='text-3xl font-bold'>
            You can create new slide
          </h1>
          <Button onClick={showModal} size='large' type='primary'>
            Getting started
          </Button>
        </div>
      )}
      <ModalCreateSlide setCompletedSlide={setCompletedSlide} checkSlide={checkSlide} />
    </div>
  );
}

export default NewSlide;
