import React, { useRef, useState, useEffect } from "react";
import { Text, Transformer } from "react-konva";
import useGetAuth from "../hooks/useGetAuth";

const TextShape = ({
  id,
  x,
  y,
  text,
  fontSize,
  fill,
  draggable,
  stageRef,
  setElements,
  slideUid
}) => {
  const textRef = useRef();
  const transformerRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [value, setValue] = useState(text);
  const [textPos, setTextPos] = useState({ x, y });
  const { userData } = useGetAuth();

  // Matn tahrirlashni boshqarish
  useEffect(() => {
    if (isEditing && stageRef.current) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "absolute";
      textarea.style.top = `${textPos.y}px`;
      textarea.style.left = `${textPos.x}px`;
      textarea.style.fontSize = `${fontSize}px`;
      textarea.style.fontFamily = "Arial";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      document.body.appendChild(textarea);

      textarea.focus();

      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          setValue(textarea.value);
          setIsEditing(false);
          if (document.body.contains(textarea)) {
            document.body.removeChild(textarea); // textarea ni olib tashlash
          }
        }
      });

      const handleOutsideClick = (e) => {
        if (e.target !== textarea) {
          setValue(textarea.value);
          setIsEditing(false);
          if (document.body.contains(textarea)) {
            document.body.removeChild(textarea); // textarea ni olib tashlash
          }
        }
      };

      window.addEventListener("click", handleOutsideClick);

      return () => {
        window.removeEventListener("click", handleOutsideClick);
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea); // textarea ni olib tashlash
        }
      };
    }
  }, [isEditing, stageRef, value, textPos, fontSize]);

  // Transformer faqat tanlangan shaklga ishlaydi
  useEffect(() => {
    if (isSelected && textRef.current && transformerRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Matnni ikki marta bosganda tahrirlash holatiga o'tish
  const handleDblClick = (e) => {
    const stageBox = stageRef.current.container().getBoundingClientRect();
    setTextPos({
      x: stageBox.left + e.target.x(),
      y: stageBox.top + e.target.y(),
    });
    setIsEditing(true);
  };

  // Drag tugagandan keyin holatni saqlash
  const handleDragEnd = () => {
    const newPosition = {
      x: textRef.current.x(),
      y: textRef.current.y(),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, x: newPosition.x, y: newPosition.y, text: value } : el
      )
    );
  };

  // Transformatsiya tugagandan keyin holatni saqlash
  const handleTransformEnd = () => {
    const node = textRef.current;
    const newPosition = {
      x: node.x(),
      y: node.y(),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, x: newPosition.x, y: newPosition.y, text: value } : el
      )
    );
  };

  // Matn o'zgarganida yangi qiymatlarni saqlash
  useEffect(() => {
    if (value !== text) {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, text: value } : el))
      );
    }
  }, [value, id, setElements, text]);

  return (
    <>
      <Text
        ref={textRef}
        id={id}
        x={x}
        y={y}
        text={value}
        fontSize={fontSize}
        fill={fill}
        draggable={userData?.uid === slideUid}
        onDblClick={userData?.uid === slideUid ? handleDblClick : null} // Ikki marta bosganda tahrirlash
        onClick={userData?.uid === slideUid ? () => setIsSelected(true) : null} // Bir marta bosganda tanlash
        onDragEnd={userData?.uid === slideUid ? handleDragEnd : null} // Drag tugagandan keyin saqlash
        onTransformEnd={userData?.uid === slideUid ? handleTransformEnd : null} // Transformatsiya tugagandan keyin saqlash
        visible={!isEditing} // Tahrir paytida yashirish
      />
      {isSelected && !isEditing && userData?.uid === slideUid && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true} // Aylantirish imkoniyati
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </>
  );
};

export default TextShape;
