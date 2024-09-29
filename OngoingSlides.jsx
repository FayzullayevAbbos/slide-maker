import React, { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useLocation } from "react-router-dom";
import useGetOngoingSlides from "../hooks/useGetOngoingSlides";
import useGetAuth from "../hooks/useGetAuth";

import ImageShape from "../components/ImageShape";
import LineShape from "../components/LineShape";
import TextShape from "../components/TextShape";
import RectangleShape from "../components/RectangleShape";
import CircleShape from "../components/CircleShape";
import { Spin } from "antd";
import useGetCreatedSlides from "../hooks/useGetCreatedSlides";

function OngoingSlides() {
  const [elements, setElements] = useState([]);
  const [sLoading, setSLoading] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const transformerRef = useRef();
  const stageRef = useRef();
  const {datas} = useGetCreatedSlides()
  const [slides , setSlides] = useState([])
  const { userData } = useGetAuth();
  const location = useLocation();
  const [slideUid, setSlideUid] = useState("");

  async function getData() {
   
    setElements(() => {
      const projectNameFromLocation = location.pathname
        .split("/")
        .pop(); // location ning oxirgi bo'lagini olish
      const abs = datas.filter(
        (slide) => slide.projectName === projectNameFromLocation,
      );
      console.log(abs[0]);
      
      return abs[0]?.elements;
    });
  }
  
  useEffect(() => {
    
    const filteredSlides = datas?.filter(
      (slide) => slide?.uid === userData?.uid,
    );

    const foundSlide = filteredSlides?.find(
      (slide) => slide?.completed === false,
    );

    
    
    setSlideUid(foundSlide?.uid);
    getData();
  //  console.log('slideUid ' + slideUid);
  //  console.log('userUid ' + userData?.uid);
   
  }, [datas]);

  return (
    <div>
      {datas.length ? (
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
          { userData?.uid == slideUid  ? <Transformer ref={transformerRef} /> :''}
          </Layer>
        </Stage>
      ) : (
        <div className='flex justify-center mt-40'>
          <Spin size='large' />
        </div>
      )}
    </div>
  );
}

export default OngoingSlides;
