import { Card, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useEffect } from "react";
import useGetCreatedSlides from "../hooks/useGetCreatedSlides";

import { Link, useLocation } from "react-router-dom";

function CreatedSlides() {
  const { datas, loading, fetchCreated } = useGetCreatedSlides();
  const location = useLocation();
  useEffect(() => {
    fetchCreated();
  }, [location.pathname]);
  console.log(datas);

  return (
    <div className='w-full  p-3  '>
      {loading ? (
        <div className=' flex justify-center '>
          <Spin />
        </div>
      ) : datas.length ? (
        <div className='w-full  grid grid-cols-3 justify-items-center gap-6  pt-5'>
          {datas?.map((data, i) => {
            return (
              <Link 
              key={i}
                className='w-full'
                to={`/created-slides/${data.projectName}`}
              >
                <div className='border w-full rounded-lg p-2 flex flex-col h-56'>
                  <div className='w-full h-[70%] text-center felx pt-10 text-3xl bg-slate-900 rounded-xl text-gray-400'>
                    slide
                  </div>
                  <hr className='mt-4' />
                  <div className=' w-full flex flex-col'>
                    <p>Owener {data.userName}</p>
                    <p>Slide name: {data.projectName}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className=' text-center pt-40 text-2xl font-bold '>
          No Slides
        </div>
      )}
    </div>
  );
}

export default CreatedSlides;
