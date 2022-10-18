import React from "react";

import "./styles.scss";

import { useSelector, useDispatch } from "react-redux";

import ObjectItem from "../../components/ObjectItem";

const ScreenCanvas = () => {
  const { objectList } = useSelector((state) => state.objects);

  return (
    <div className="screen-canvas">
      {objectList.map((object) => (
        <ObjectItem data={object} key={object.id} />
      ))}
    </div>
  );
};

export default ScreenCanvas;
