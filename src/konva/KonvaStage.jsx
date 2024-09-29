import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

const SelectionRectangle = () => {

  const [elements, setElements] = useState([
    {
      id: "rect1",
      x: 60,
      y: 60,
      width: 100,
      height: 90,
      fill: "",
      stroke:'2px solid black',
      draggable: true,
    },
    
  ]);


  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selecting, setSelecting] = useState(false);

  const [selectionRect, setSelectionRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const transformerRef = useRef();
  const stageRef = useRef();


  const handleMouseDown = (e) => {
    if (e.target === stageRef.current) {
      const pos = stageRef.current.getPointerPosition();
      setSelectionRect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        visible: true,
      });
      setSelecting(true);
    }
  };

  const handleMouseMove = (e) => {
    if (selecting) {
      const pos = stageRef.current.getPointerPosition();
      const newRect = {
        x: Math.min(selectionRect.x, pos.x),
        y: Math.min(selectionRect.y, pos.y),
        width: Math.abs(pos.x - selectionRect.x),
        height: Math.abs(pos.y - selectionRect.y),
        visible: true,
      };
      setSelectionRect(newRect);
    }
  };

  const handleMouseUp = (e) => {
    if (selecting) {
      setSelecting(false);
      const shapes = stageRef.current.find(".rect");
      const box = stageRef.current
        .findOne(".selection")
        .getClientRect();
      const selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect()),
      );
      setSelectedShapes(selected);
      setSelectionRect({ ...selectionRect, visible: false });
    }
  };

  useEffect(() => {
    if (transformerRef.current && selectedShapes.length > 0) {
      transformerRef.current.nodes(selectedShapes);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedShapes]);

  const handleClick = (e) => {
    if (selectionRect.visible || e.target === stageRef.current) {
      setSelectedShapes([]);
      return;
    }
    const metaPressed =
      e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedShapes.includes(e.target);
    if (!metaPressed) {
      setSelectedShapes([e.target]);
    } else if (isSelected) {
      setSelectedShapes(
        selectedShapes.filter((shape) => shape !== e.target),
      );
    } else {
      setSelectedShapes([...selectedShapes, e.target]);
    }
  };

  // Button Handlers
  const addRectangle = () => {
    const newRect = {
      id: `rect${elements.length + 1}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: 100,
      height: 90,
      stroke:'2px solid black',
      draggable: true,
    };
    setElements([...elements, newRect]);
  };

  const clearSelection = () => {
    setSelectedShapes([]);
  };

  return (
    <div className=" overflow-hidden ">
      <div>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={clearSelection}>Clear Selection</button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight*0.8}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        <Layer>
          {elements.map((el) => (
            <Rect key={el.id} {...el} name='rect' />
          ))}
          <Rect
            {...selectionRect}
            fill=''
            listening={false}
            className='selection'
          />
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default SelectionRectangle;
