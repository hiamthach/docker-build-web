import React, { useState } from "react";

import "./styles.scss";

import { Popover } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";

//Component
import ConfigureModal from "../Modal/ConfigureModal";

//utils
import { renderIcon } from "../../utils/index";

import { useDispatch } from "react-redux";
import {
  deleteObjectThunk,
  updateObjectThunk,
} from "../../redux/slices/objectSlice";

const ObjectItem = ({ data }) => {
  const [popOpen, setPopOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleRightMouse = (e) => {
    e.preventDefault();
    setPopOpen(true);
  };

  const handlePopOpen = (open) => {
    setPopOpen(open);
  };

  const handleDelete = () => {
    dispatch(deleteObjectThunk(data.id));
  };

  const handleConfigure = () => {
    setIsModalOpen(true);
  };

  const PopoverContent = () => {
    return (
      <div className="object-item__popover">
        {data.type === "end-device" && (
          <div
            className="object-item__popover--item object-item__popover--item-configure"
            onClick={handleConfigure}
          >
            <SettingOutlined />
            <span>Configure</span>
          </div>
        )}
        <div
          className="object-item__popover--item object-item__popover--item-delete"
          onClick={handleDelete}
        >
          <DeleteOutlined />
          <span>Delete</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="object-item" onContextMenu={handleRightMouse}>
        <Popover
          placement="rightTop"
          content={PopoverContent}
          trigger={["contextMenu"]}
          open={popOpen}
          onOpenChange={handlePopOpen}
        >
          <div className="object-item__main">
            <img src={renderIcon(data.type)} alt="" />
            <span className="object-item__name">{data.name}</span>
          </div>
        </Popover>
      </div>

      {data.type === "end-device" && (
        <ConfigureModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          data={data}
        />
      )}
    </>
  );
};

export default ObjectItem;
