import React, { useId, useState } from "react";

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

//
import { listType } from "../../utils/index";
import { alertConfirmation } from "../../utils/alert";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { objectList } = useSelector((state) => state.objects);

  const [popOpen, setPopOpen] = useState(false);

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const renderMenuObject = () => {
    const objectsMapped = objectList.map((object) =>
      getItem(object.name, object.id)
    );

    const list = [
      getItem("Objects", "objects", null, objectsMapped),
      getItem("Delete All Objects", "delete", <DeleteOutlined />),
      getItem("Export", "export", <ExportOutlined />),
    ];

    return list;
  };

  const renderMenuType = () => {
    const list = listType.map((type) => getItem(type.name, type.key));
    return list;
  };

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

  const onAddClick = (e) => {
    const id = uuidv4();
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
        <Menu
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
