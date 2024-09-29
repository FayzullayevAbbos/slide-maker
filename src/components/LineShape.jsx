import React, { useRef, useEffect, useState } from "react";
import { Line, Transformer } from "react-konva";
import useGetAuth from "../hooks/useGetAuth";

const LineShape = ({ id, points, stroke, strokeWidth, setElements, slideUid }) => {
  const lineRef = useRef();
  const trRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const { userData } = useGetAuth();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([lineRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Tanlash funksiyalari
  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

  const handleDragEnd = () => {
    const newPoints = lineRef.current.points();
    const newPosition = {
      x: lineRef.current.x(),
      y: lineRef.current.y(),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, points: newPoints, ...newPosition } : el
      )
    );
  };

  const handleTransformEnd = () => {
    const newPoints = lineRef.current.points();
    const newPosition = {
      x: lineRef.current.x(),
      y: lineRef.current.y(),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, points: newPoints, ...newPosition } : el
      )
    );
  };

  return (
    <>
      <Line
        ref={lineRef}
        id={id}
        points={points}
        stroke={stroke}
        strokeWidth={strokeWidth}
        draggable={userData?.uid === slideUid}
        onClick={userData?.uid === slideUid ? handleSelect : ''} // Tanlash
        onDblClick={userData?.uid === slideUid ? handleDeselect : ''} // Tanlovni bekor qilish
        onDragEnd={userData?.uid === slideUid ? handleDragEnd : ''} // O'zgartirishlarni saqlash
        onTransformEnd={userData?.uid === slideUid ? handleTransformEnd : ''} // Transformatsiyalarni saqlash
        onDragStart={() => {
          document.body.style.cursor = "grabbing"; // Kursorni 'grabbing' ga o'zgartirish
        }}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer"; // Kursorni 'pointer' ga o'zgartirish
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default"; // Kursorni standart holatga qaytarish
        }}
      />
      {isSelected && userData?.uid === slideUid && (
        <Transformer
          ref={trRef}
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

export default LineShape;
