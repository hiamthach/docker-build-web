import React, { useState } from "react";

import "./styles.scss";

import {
  ExportOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Menu, Popover } from "antd";

import { v4 as uuidv4 } from "uuid";

//Component
import CusButton from "../../components/CusButton";

//Slice
import { useSelector, useDispatch } from "react-redux";
import {
  exportThunk,
  deleteAllThunk,
  addObjectThunk,
} from "../../redux/slices/objectSlice.js";

import { listType } from "../../utils/index";
import { alertConfirmation } from "../../utils/alert";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { objectList } = useSelector((state) => state.objects);

  const [popOpen, setPopOpen] = useState(false);

  // Hàm để tạo ra các Item của Menu
  function getItem(label, key, icon, children, type, style) {
    return {
      key,
      icon,
      children,
      label,
      type,
      style,
    };
  }

  //Hàm để render Menu
  const renderMenuObject = () => {
    const objectsMapped = objectList.map((object) =>
      getItem(object.name, object.id)
    );

    const list = [
      getItem("Objects", "objects", null, objectsMapped),
      getItem(
        "Delete All Objects",
        "delete",
        <DeleteOutlined />,
        null,
        "danger",
        {
          color: "#dc3545",
        }
      ),
      getItem("Export", "export", <ExportOutlined />, null, null, {
        color: "#14b8a6",
      }),
    ];

    return list;
  };

  //Render các Type lúc Add
  const renderMenuType = () => {
    const list = listType.map((type) => getItem(type.name, type.key));
    return list;
  };

  // Khi click vào các nút của Sidebar như là Delete All hay Export
  const onClick = (e) => {
    switch (e.key) {
      case "delete":
        alertConfirmation(() => {
          dispatch(deleteAllThunk());
        });
        break;
      case "export":
        dispatch(exportThunk());
        break;
      default:
        break;
    }
  };

  // Xử lý lúc add
  const onAddClick = (e) => {
    //Tạo ra 1 id ngẫu nhiên độ dài 6
    const id = uuidv4().slice(0, 6);
    const data = {
      type: e.key,
      name: id,
      id,
      status: "loading",
      configure: {},
    };
    dispatch(addObjectThunk(data));
    setPopOpen(false);
  };

  const handlePopOpen = (open) => {
    setPopOpen(open);
  };

  const addContent = (
    <div className="add-content">
      <Menu
        onClick={onAddClick}
        mode="inline"
        items={renderMenuType()}
        selectable={false}
      />
    </div>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-add">
        {/* Nút Add */}
        <Popover
          placement="rightTop"
          content={addContent}
          title="Choose object's type"
          trigger="click"
          open={popOpen}
          onOpenChange={handlePopOpen}
        >
          <div className="sidebar-add__btn">
            <CusButton>
              <PlusOutlined /> <span>New Object</span>
            </CusButton>
          </div>
        </Popover>
      </div>

      <div className="sidebar-menu">
        {/* Danh sách Objects */}
        <Menu
          theme="dark"
          onClick={onClick}
          defaultOpenKeys={["objects"]}
          mode="inline"
          items={renderMenuObject()}
          selectable={false}
        />
      </div>
    </div>
  );
};

export default Sidebar;
