import React, { useRef, useEffect, useState } from "react";
import { Image, Transformer } from "react-konva";
import useGetAuth from "../hooks/useGetAuth";

const ImageShape = ({ id, x, y, src, setElements, onUpdate, slideUid }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const { userData } = useGetAuth();

  // Tasvirni yuklash
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  // Transformer faqat tanlangan shaklga ishlaydi
  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Shaklni tanlash
  const handleSelect = () => {
    setIsSelected(true);
  };

  // Shaklni tanlagan holda uni aylantirish yoki kattalashtirish
  const handleDeselect = () => {
    setIsSelected(false);
  };

  // Drag tugagandan keyin holatni saqlash
  const handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    // setElements orqali yangilanishni amalga oshiramiz
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, x: newX, y: newY } : el
      )
    );

    // Yoki onUpdate orqali uzatish mumkin
    if (onUpdate) {
      onUpdate(id, { x: newX, y: newY });
    }
  };

  // Transformatsiya tugagandan keyin holatni saqlash
  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);

    // O'lchovlarni yangilash
    node.width(newWidth);
    node.height(newHeight);

    // Tasvirni qayta chizish uchun o'lchovlarni tiklaymiz
    node.scaleX(1);
    node.scaleY(1);

    // Yangilanishni amalga oshiramiz
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? { ...el, x: node.x(), y: node.y(), width: newWidth, height: newHeight }
          : el
      )
    );

    // Yoki onUpdate orqali uzatish mumkin
    if (onUpdate) {
      onUpdate(id, {
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
      });
    }
  };

  return (
    <>
      <Image
        ref={shapeRef}
        id={id}
        x={x}
        y={y}
        image={image}
        draggable={userData?.uid === slideUid}
        onClick={userData?.uid === slideUid ? handleSelect : ''} // Bir marta bosganda tanlash
        onDblClick={userData?.uid === slideUid ? handleDeselect : ''} // Ikki marta bosganda tanlovni bekor qilish
        onDragEnd={userData?.uid === slideUid ? handleDragEnd : ''} // Drag tugagandan keyin saqlash
        onTransformEnd={userData?.uid === slideUid ? handleTransformEnd : ''} // O'lcham yoki aylanish tugagach, yangilanish
      />
      {isSelected && userData?.uid === slideUid && (
        <Transformer
          ref={trRef}
          rotateEnabled={true} // Aylantirish imkoniyati
          enabledAnchors={[
            'top-left',
            'top-center',
            'top-right',
            'middle-left', // Chap markaz
            'middle-right', // O'ng markaz
            'bottom-left',
            'bottom-center',
            'bottom-right',
          ]} // Faqat burchaklarda o'lchamlarni o'zgartirish imkoniyati
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox; // Minimal o'lcham
            }
            return newBox; // Yangilangan o'lcham
          }}
        />
      )}
    </>
  );
};

export default ImageShape;
