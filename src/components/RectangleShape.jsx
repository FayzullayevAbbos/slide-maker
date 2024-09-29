import React, { useRef, useEffect, useState } from "react";
import { Rect, Transformer } from "react-konva";
import useGetAuth from "../hooks/useGetAuth";

const RectangleShape = ({
  id,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  draggable,
  setElements, // setElements funksiyasini props orqali qabul qilamiz
  onUpdate,
  slideUid
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const { userData } = useGetAuth();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

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

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);

    node.scaleX(1);
    node.scaleY(1);

    // setElements orqali yangilanishni amalga oshiramiz
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

  // Shartli renderlash va hodisalarni faqat userData.uid === slideUid bo'lsa ishlatamiz
  const isOwner = userData?.uid === slideUid;

  return (
    <>
      <Rect
        ref={shapeRef}
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        draggable={isOwner}
        onClick={isOwner ? handleSelect : undefined} // undefined hodisani olib tashlaydi
        onDblClick={isOwner ? handleDeselect : undefined}
        onDragEnd={isOwner ? handleDragEnd : undefined}
        onTransformEnd={isOwner ? handleTransformEnd : undefined}
        onMouseEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "default";
        }}
      />
      {isSelected && isOwner && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
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

export default RectangleShape;
