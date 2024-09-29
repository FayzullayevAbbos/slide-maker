import { Form, Input, Button, Modal } from "antd";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // Firebase konfiguratsiyasi
import useGetOngoingSlides from "../hooks/useGetOngoingSlides";

function ModalCreateSlide({ checkSlide , setCompletedSlide}) {
  const { isModalOpen, setIsModalOpen } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const {fetchSlides} = useGetOngoingSlides()
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const { projectName } = values;
    const user = auth.currentUser; // Foydalanuvchi ma'lumotlari
  
    if (!user) {
      console.error("User not logged in");
      return;
    }
  
    try {
      setLoading(true);
  
      // Firesore'ga yangi slayd yaratish (ongoing slides collection)
      await addDoc(collection(db, "ongoingSlides"), {
        uid: user.uid,
        projectName,
        completed: false, // Slayd yaratish vaqtidagi dastlabki holat
      });
  
      // Foydalanuvchi hujjatiga project holatini qo'shish
      await updateDoc(doc(db, "users", user.uid), {
        projectName,
        completed: false,
      });
  
      // setChanged ni to'g'ri ishlatish
      checkSlide() // Har bir o'zgarish uchun raqamli qiymatni oshirish
      setCompletedSlide([{}])
      fetchSlides()
      handleOk(); // Modalni yopish yoki boshqa tugallash funksiyasi
      setLoading(false);
    } catch (error) {
      console.error("Error creating slide:", error);
      setLoading(false);
    }
  };
  

  return (
    <Modal
      title='Create New Slide'
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='projectName'
          label='Project Name'
          rules={[
            {
              required: true,
              message: "Please input the project name!",
            },
          ]}
        >
          <Input placeholder='Enter project name' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            block
          >
            Create Slide
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalCreateSlide;
