import React, { useRef, useEffect, useState } from "react";
import { Circle, Transformer } from "react-konva";
import useGetAuth from "../hooks/useGetAuth";

const CircleShape = ({
  id,
  x,
  y,
  radius,
  fill,
  draggable,
  stroke,
  strokeWidth,
  setElements,
  slideUid
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const {userData} = useGetAuth();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Shaklni tanlash
  const handleSelect = () => {
    setIsSelected(true);
    if (trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  };

  // Shaklni tanlagan holda uni aylantirish yoki kattalashtirish
  const handleDeselect = () => {
    setIsSelected(false);
  };

  // Drag tugagandan keyin holatni saqlash
  const handleDragEnd = () => {
    const newPosition = {
      x: shapeRef.current.x(),
      y: shapeRef.current.y(),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, ...newPosition } : el
      )
    );
  };

  // Transformatsiya tugagandan keyin holatni saqlash
  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const newRadius = node.radius() * node.scaleX();
    node.scaleX(1);
    node.scaleY(1);

    const newPosition = {
      x: node.x(),
      y: node.y(),
      radius: newRadius,
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, ...newPosition } : el
      )
    );
  };

  return (
    <>
      <Circle
        ref={shapeRef}
        id={id}
        x={x}
        y={y}
        radius={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        draggable={userData?.uid == slideUid}
        onDblClick={userData?.uid === slideUid ? handleDeselect : ''}
        onClick={userData?.uid == slideUid ? handleSelect : ''} // Bir marta bosganda tanlash
        onDragEnd={userData?.uid == slideUid ? handleDragEnd:''} // Drag tugagandan keyin saqlash
        onTransformEnd={userData?.uid == slideUid ? handleTransformEnd :''} // Transformatsiya tugagandan keyin saqlash
      />
      {isSelected && userData?.uid == slideUid && (
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

export default CircleShape;
