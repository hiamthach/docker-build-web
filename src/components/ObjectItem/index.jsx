import React, { useState, useCallback } from "react";

//styles
import "./styles.scss";
import { Popover } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";

//Component
import ConfigureModal from "../Modal/ConfigureModal";

//utils
import { renderIcon } from "../../utils/index";

//Redux
import { useDispatch } from "react-redux";
import {
  deleteObjectThunk,
  updateObjectThunk,
} from "../../redux/slices/objectSlice";

//React flow
import { Handle } from "reactflow";

const ObjectItem = ({ data }) => {
  const [popOpen, setPopOpen] = useState(false); // Trạng thái mở của Pop khi mà mình nhấn chuột phải
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(data.status); //Trạng thái của Object(loading: sẽ chỉnh được tên, idle: thì bình thường)
  const [nameValue, setNameValue] = useState(data.name);
  const dispatch = useDispatch();

  //Khi click chuột phải sẽ đổi trạng thái của pop
  const handleRightMouse = (e) => {
    e.preventDefault();
    setPopOpen(true);
  };

  const handlePopOpen = (open) => {
    setPopOpen(open);
  };

  //Khi click delete sẽ xử dụng hàm thunk trên store để xóa object đi
  const handleDelete = () => {
    dispatch(deleteObjectThunk(data.id));
  };

  //Khi click configure sẽ mở modal configure lên
  const handleConfigure = () => {
    setIsModalOpen(true);
  };

  //Khi đổi tên
  const handleInputChange = (e) => {
    e.stopPropagation();
    setNameValue(e.target.value);
  };

  //Xử lý hành động khi double click sẽ đổi trạng thái của object sang loading để chỉnh sửa
  const handleDblClick = () => {
    if (status !== "loading") {
      setStatus("loading");
    }
  };

  //Xử lý khi người dùng click Enter hoặc click trỏ chuột ra ngoài sẽ cập nhật tên Object
  const handleDoneInput = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      dispatch(
        updateObjectThunk({
          id: data.id,
          name: nameValue,
          status: "idle",
        })
      );
      setStatus("idle");
    }
  };

  //Nội dung của Pop
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
      {/* Tất cả các phần Handle này là các dấu chấm để kết nối thì mỗi dấu sẽ có position.
        Handle nào có type="target" có nghĩa là hàm đó có thể kéo vào.
        Xem thêm Handle ở Link React Flow ở trang README 
      */}
      <Handle
        isConnectable={true}
        position="top"
        id={data.id + "top"}
        style={{
          width: "10px",
          height: "10px",
          background: "#1890ff",
        }}
      />
      <Handle
        type="target"
        isConnectable={true}
        position="top"
        id={data.id + "top"}
        style={{
          width: "10px",
          height: "10px",
          background: "#1890ff",
        }}
      />
      <Handle
        isConnectable={true}
        position="left"
        id={data.id + "left"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />
      <Handle
        type="target"
        isConnectable={true}
        position="left"
        id={data.id + "left"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />
      <Handle
        isConnectable={true}
        position="right"
        id={data.id + "right"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />
      <Handle
        type="target"
        isConnectable={true}
        position="right"
        id={data.id + "right"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />
      <Handle
        isConnectable={true}
        position="bottom"
        id={data.id + "bot"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />
      <Handle
        type="target"
        isConnectable={true}
        position="bottom"
        id={data.id + "bot"}
        style={{ width: "10px", height: "10px", background: "#1890ff" }}
      />

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
            <div className="object-item__footer" onDoubleClick={handleDblClick}>
              {status === "loading" ? (
                <input
                  type="text"
                  defaultValue={data.name}
                  className="object-item__input"
                  size={"auto"}
                  onBlur={handleDoneInput}
                  onKeyDown={handleDoneInput}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="object-item__name">{data.name}</span>
              )}
            </div>
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
