import React, { useState, useEffect } from "react";

//styles
import "./styles.scss";
import { Popover } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";

//Component
import ConfigureDeviceModal from "../Modal/ConfigureDeviceModal";
import ConfigureRouterModal from "../Modal/ConfigureRouterModal";

//utils
import { renderIcon } from "../../utils/index";

//Redux
import { useDispatch, useSelector } from "react-redux";
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
  const [listHandlePos, setListHandlePos] = useState(
    data.type !== "router"
      ? ["left", "right", "top", "bottom"] //Nếu là pc thì 4 chấm
      : ["left", "right"] // Nếu là router thì 2 chấm trái phải
  );
  const dispatch = useDispatch();
  const edges = useSelector((state) => state.objects.edges);

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
        <div
          className="object-item__popover--item object-item__popover--item-configure"
          onClick={handleConfigure}
        >
          <SettingOutlined />
          <span>Configure</span>
        </div>

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

  //Xử lý các chấm
  const renderHandle = () => {
    // render theo list handle ở trên
    return listHandlePos.map((pos) => {
      return (
        <div key={pos + "-" + data.id}>
          <Handle
            isConnectable={true}
            position={pos}
            id={data.id + "-" + pos}
            style={{
              width: "10px",
              height: "10px",
              background: "#1890ff",
            }}
          />
          <Handle
            type="target"
            isConnectable={true}
            position={pos}
            id={data.id + "-" + pos}
            style={{
              width: "10px",
              height: "10px",
              background: "#1890ff",
            }}
          />
        </div>
      );
    });
  };

  // Render modal đúng với loại object
  const renderConfigureModal = () => {
    switch (data.type) {
      case "end-device":
        return (
          <ConfigureDeviceModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            data={data}
          />
        );
      case "router":
        return (
          <ConfigureRouterModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            data={data}
          />
        );
      default:
        return;
    }
  };

  useEffect(() => {
    // Nếu đã là end device khi đã connect
    if (data.type === "end-device") {
      const edge = edges.find(
        (edge) => edge.source === data.id || edge.target === data.id
      );
      if (edge) {
        // Soure hay target sẽ có dạng id-left hoặc <id>-right -> Khi split như bên dưới -> <id>: left chẳng hạn
        // -> Khi đó sẽ bt đc vị trí
        const obj = {
          [edge.sourceHandle.split("-")[0]]: edge.sourceHandle.split("-")[1],
          [edge.targetHandle.split("-")[0]]: edge.targetHandle.split("-")[1],
        };

        setListHandlePos([obj[data.id]]);
      } else {
        setListHandlePos(["left", "right", "top", "bottom"]);
      }
    }
  }, [edges]);

  return (
    <>
      {/* Tất cả các phần Handle này là các dấu chấm để kết nối thì mỗi dấu sẽ có position.
        Handle nào có type="target" có nghĩa là hàm đó có thể kéo vào.
        Xem thêm Handle ở Link React Flow ở trang README 
      */}
      {renderHandle()}

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
              {/* Check xem có tên hay chưa nếu chưa thì <name> */}
              {status === "loading" ? (
                <input
                  type="text"
                  defaultValue={data.name}
                  className="object-item__input"
                  size={"auto"}
                  onBlur={handleDoneInput}
                  onKeyDown={handleDoneInput}
                  onChange={handleInputChange}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              ) : (
                <span className="object-item__name">
                  {data.name || "<name>"}
                </span>
              )}
            </div>
          </div>
        </Popover>
      </div>

      {renderConfigureModal()}
    </>
  );
};

export default ObjectItem;
