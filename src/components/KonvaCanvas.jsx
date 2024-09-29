import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import RectangleShape from "./RectangleShape";
import CircleShape from "./CircleShape";
import TextShape from "./TextShape";
import ImageShape from "./ImageShape";
import { Button, Dropdown, Menu, message, Upload } from "antd";
import {
  BgColorsOutlined,
  BorderOutlined,
  DownOutlined,
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useGetOngoingSlides from "../hooks/useGetOngoingSlides";
import useGetAuth from "../hooks/useGetAuth";
import LineShape from "./LineShape";

const KonvaCanvas = ({ checkSlide, setCompletedSlide }) => {
  const [elements, setElements] = useState([]);
  const [sLoading, setSLoading] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const transformerRef = useRef();
  const stageRef = useRef();
  const { slides, loading, setLoading, fetchSlides } =
    useGetOngoingSlides();
  const { userData } = useGetAuth();
  const [slideUid, setSlideUid] = useState("");
  console.log(userData);

  const updateFirebaseDocument = async () => {
    console.log(elements);

    setSLoading(true);
    try {
      const filteredSlides = slides?.filter(
        (slide) => slide?.uid === userData?.uid,
      );

      const foundSlide = filteredSlides?.find(
        (slide) => slide?.completed === false,
      );

      const docRef = doc(db, "ongoingSlides", foundSlide.id);
      const slideData = {
        elements: elements.filter((el) => el !== undefined),
        createdAt: new Date(),
      };
      await updateDoc(docRef, slideData);

      message.info("success");
      setSLoading(false);
    } catch (error) {
      setSLoading(false);
      message.error(error.message);
    }
  };

  const deleteAndSaveSlide = async (slideId) => {
    setSLoading(true);
    try {
      const filteredSlides = slides?.filter(
        (slide) => slide?.uid === userData?.uid,
      );

      const foundSlide = filteredSlides?.find(
        (slide) => slide?.completed === false,
      );
      const ongoingSlideRef = doc(db, "ongoingSlides", foundSlide.id);
      const ongoingSlideSnap = await getDoc(ongoingSlideRef);

      if (ongoingSlideSnap.exists()) {
        const slideData = ongoingSlideSnap.data();

        // Yangi createSlides kolleksiyasiga saqlash
        const createSlideRef = collection(db, "createSlides");
        await addDoc(createSlideRef, {
          ...slideData,
          elements:  elements ,
          userName: userData.email.split("@")[0],
          movedAt: new Date(), // Qo'shimcha vaqt belgisi
        });

        // Ongoing slide-ni o'chirish
        await deleteDoc(ongoingSlideRef);
        fetchSlides();
        checkSlide();
        setCompletedSlide(undefined);
        message.info(
          "Slide muvaffaqiyatli ko'chirildi va o'chirildi",
        );
      } else {
        message.warning("Slide topilmadi");
      }

      setSLoading(false);
    } catch (error) {
      setSLoading(false);
      message.error(error.message);
    }
  };

  function reLoad() {
    setSLoading(true);
    try {
      const filteredSlides = slides?.filter(
        (slide) => slide?.uid === userData?.uid,
      );

      const foundSlide = filteredSlides?.find(
        (slide) => slide?.completed === false,
      );
      setSlideUid(foundSlide?.uid);

      setElements(foundSlide?.elements || []);
    } catch (error) {
      console.error("Hujjatni yangilashda xato:", error.message);
    } finally {
      setSLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault(); // Standart saqlashni to'xtatish
      updateFirebaseDocument(); // Firebase ga saqlash
    }
  };

  useEffect(() => {
    reLoad();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides]);

  const optionsRec = [
    {
      key: "default",
      label: (
        <>
          <BorderOutlined /> Rect
        </>
      ),
      color: "none",
      stroke: "black",
      strokeWidth: 2,
    },
    {
      key: "green",
      label: (
        <>
          <BgColorsOutlined style={{ color: "green" }} /> Green
        </>
      ),
      color: "green",
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "black",
      label: (
        <>
          <BgColorsOutlined style={{ color: "black" }} /> Black
        </>
      ),
      color: "black",
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "red",
      label: (
        <>
          <BgColorsOutlined style={{ color: "red" }} /> Red
        </>
      ),
      color: "red",
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "blue",
      label: (
        <>
          <BgColorsOutlined style={{ color: "blue" }} /> Blue
        </>
      ),
      color: "blue",
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "yellow",
      label: (
        <>
          <BgColorsOutlined style={{ color: "yellow" }} /> Yellow
        </>
      ),
      color: "yellow",
      stroke: "none",
      strokeWidth: 0,
    },
  ];
  const optionsCircle = [
    {
      key: "greenCircle",
      label: (
        <>
          <BgColorsOutlined style={{ color: "green" }} /> Green Circle
        </>
      ),
      color: "green",
      radius: 50,
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "redCircle",
      label: (
        <>
          <BgColorsOutlined style={{ color: "red" }} /> Red Circle
        </>
      ),
      color: "red",
      radius: 50,
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "transparentCircle",
      label: (
        <>
          <BgColorsOutlined style={{ color: "none" }} /> Transparent
          Circle
        </>
      ),
      color: "none",
      radius: 50,
      stroke: "black",
      strokeWidth: 2,
    },
    {
      key: "blue",
      label: (
        <>
          <BgColorsOutlined style={{ color: "blue" }} /> Blue Circle
        </>
      ),
      color: "blue",
      stroke: "none",
      strokeWidth: 0,
    },
    {
      key: "yellow",
      label: (
        <>
          <BgColorsOutlined style={{ color: "yellow" }} /> Yellow
          Circle
        </>
      ),
      color: "yellow",
      stroke: "none",
      strokeWidth: 0,
    },
  ];
  // Add shape functions
  const addShape = (shapeOptions) => {
    const newRect = {
      id: `rect${elements?.length + 1}`,
      type: "rectangle",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill:
        shapeOptions.color === "none"
          ? "transparent"
          : shapeOptions.color, // Tanlangan rang
      stroke: shapeOptions.stroke, // Chegara rangi
      strokeWidth: shapeOptions.strokeWidth, // Chegara qalinligi
      draggable: true,
    };
    setElements([...elements, newRect]);
  };

  const addCircle = (shapeOptions) => {
    const newCircle = {
      id: `circle${elements?.length + 1}`,
      type: "circle",
      x: 150,
      y: 150,
      radius: 50,
      fill:
        shapeOptions.color === "none"
          ? "transparent"
          : shapeOptions.color, // Tanlangan rang
      stroke: shapeOptions.stroke, // Chegara rangi
      strokeWidth: shapeOptions.strokeWidth,
      draggable: true,
    };
    setElements([...elements, newCircle]);
  };

  const addText = () => {
    const newText = {
      id: `text${elements?.length + 1}`,
      type: "text",
      x: 250,
      y: 100,
      text: "new text",
      fontSize: 24,
      fill: "black",
      draggable: true,
    };
    setElements([...elements, newText]);
  };

  const addLine = () => {
    const newLine = {
      id: `line${elements?.length + 1}`,
      type: "line", // 'text' o'rniga 'line' deb o'zgartiring
      points: [250, 200, 300, 300], // (x1, y1, x2, y2) formatida nuqtalar
      stroke: "black",
      strokeWidth: 3,
      draggable: true,
    };
    setElements([...elements, newLine]);
  };

  const removeLastShape = () => {
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1),
    );
  };

  // Image upload function using Ant Design Upload
  const addImage = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        id: `image${elements.length + 1}`,
        type: "image",
        x: 350,
        y: 150,
        src: reader.result, // Fayl manbai sifatida yuklangan tasvir
        draggable: true,
      };
      setElements([...elements, newImage]);
    };
    reader.readAsDataURL(file);
  };

  const handleMenuClickRec = (e) => {
    const selectedShape = optionsRec.find(
      (option) => option.key === e.key,
    );
    addShape(selectedShape);
  };

  const handleMenuClickCircle = (e) => {
    const selectedCircle = optionsCircle.find(
      (option) => option.key === e.key,
    );
    addCircle(selectedCircle);
  };
  const menuRec = (
    <Menu onClick={handleMenuClickRec}>
      {optionsRec.map((option) => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  const menuCircle = (
    <Menu onClick={handleMenuClickCircle}>
      {optionsCircle.map((option) => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  const clearSelection = () => {
    setElements([]); // Barcha elementlarni o'chiradi
  };

  return (
    <>
      <div className='flex justify-between'>
        <div className='flex gap-6 border'>
          <Button onClick={addLine}>
            line <span className='w-6 h-1 bg-black'></span>
          </Button>

          <Dropdown overlay={menuRec}>
            <Button className='flex items-center text-center'>
              <BorderOutlined className='text-xl pb-1' />{" "}
              <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown overlay={menuCircle}>
            <Button className='flex items-center text-center'>
              <span className='w-5 h-5 rounded-[50%] border-black border-[2px] mr-2'></span>
              <DownOutlined />
            </Button>
          </Dropdown>
          <Button onClick={addText}>
            <EditOutlined /> Text
          </Button>
          <Upload
            accept='image/*'
            showUploadList={false}
            customRequest={addImage}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          <Button
            loading={sLoading}
            onClick={() => updateFirebaseDocument()}
          >
            Ctrl+S
          </Button>
          <Button onClick={removeLastShape}>
            <RollbackOutlined />
            Remove last
          </Button>
          <Button onClick={clearSelection} danger>
            <DeleteOutlined />
            Clear All
          </Button>
          {/* Ant Design Upload for image upload */}
        </div>
        <Button
          className='bg-[#4096FF] text-white'
          onClick={deleteAndSaveSlide}
        >
          {" "}
          save to created
        </Button>
      </div>

      <Stage
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.8}
        ref={stageRef}
        onMouseDown={() => setSelectedShapes([])}
      >
        <Layer>
          {elements?.map((el) => {
            if (el.type === "rectangle") {
              return (
                <RectangleShape
                  slideUid={slideUid}
                  setElements={setElements}
                  key={el.id}
                  {...el}
                />
              );
            } else if (el.type === "circle") {
              return (
                <CircleShape
                  slideUid={slideUid}
                  setElements={setElements}
                  key={el.id}
                  {...el}
                />
              );
            } else if (el.type === "text") {
              return (
                <TextShape
                  slideUid={slideUid}
                  setElements={setElements}
                  stageRef={stageRef}
                  key={el.id}
                  {...el}
                />
              );
            } else if (el.type === "image") {
              return (
                <ImageShape
                  slideUid={slideUid}
                  setElements={setElements}
                  key={el.id}
                  {...el}
                />
              );
            } else if (el.type === "line") {
              return (
                <LineShape
                  slideUid={slideUid}
                  setElements={setElements}
                  key={el.id}
                  {...el}
                />
              ); // Chiziqni qo'shish
            }
            return null;
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </>
  );
};

export default KonvaCanvas;
