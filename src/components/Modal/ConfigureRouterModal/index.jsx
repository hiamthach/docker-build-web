import React, { useState } from "react";

import CusModal from "..";

import { Button, Select, InputNumber } from "antd";
import "./styles.scss";

import { useDispatch, useSelector } from "react-redux";
import { updateObjectThunk } from "../../../redux/slices/objectSlice";

const { Option } = Select;

const subnetList = ["255.255.0.0(/16)", "255.255.255.0(/24)"];

const RouterModalSide = ({ data, side, setData }) => {
  const [subnetValue, setSubnetValue] = useState(
    data.subnet ? data.subnet : subnetList[0]
  );

  const [IPList, setIPList] = useState(
    data.IP ? data.IP : [null, null, null, null]
  );

  const handleSubChange = (value) => {
    setSubnetValue(value);
    setData({
      ...data,
      subnet: value,
    });
  };

  const handleIPChange = (value, index) => {
    const newList = [...IPList];
    newList[index] = value;
    setIPList(newList);
    setData({
      ...data,
      IP: newList,
    });
  };

  return (
    <>
      <div className="configure-router-modal__side">
        <h2>
          {side === "left"
            ? "Interface g0/0 (on the left)"
            : "Interface g0/1 (on the right)"}
        </h2>
        <div className="configure-modal__section">
          <h3>IP Address:</h3>
          <InputNumber
            style={{ width: "60px" }}
            min={1}
            max={254}
            onChange={(value) => {
              handleIPChange(value, 0);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={0}
            max={255}
            onChange={(value) => {
              handleIPChange(value, 1);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={0}
            max={255}
            onChange={(value) => {
              handleIPChange(value, 2);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={1}
            max={254}
            onChange={(value) => {
              handleIPChange(value, 3);
            }}
          />
        </div>

        <div className="configure-modal__section">
          <h3>Subnet Mask:</h3>
          <Select
            defaultValue={subnetValue}
            style={{
              width: "auto",
            }}
            onChange={handleSubChange}
          >
            {subnetList.map((subnet) => (
              <Option value={subnet.toLowerCase()} key={subnet}>
                {subnet}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

const ConfigureRouterModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const [leftData, setLeftData] = useState(
    data.configure.left
      ? data.configure.left
      : { IP: [null, null, null, null], subnet: subnetList[0] }
  );
  const [rightData, setRightData] = useState(
    data.configure.right
      ? data.configure.right
      : { IP: [null, null, null, null], subnet: subnetList[0] }
  );

  const edges = useSelector((state) => state.objects.edges);
  const dispatch = useDispatch();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    dispatch(
      updateObjectThunk({
        id: data.id,
        configure: {
          left: leftData,
          right: rightData,
        },
      })
    );
    handleCancel();
  };

  const renderRouterSide = () => {
    const edgeList = edges.filter(
      (edge) => edge.source === data.id || edge.target === data.id
    );

    if (edgeList.length > 0) {
      const sides = [];
      const indexLeft = edgeList.findIndex(
        (edge) =>
          edge.sourceHandle === data.id + "-left" ||
          edge.targetHandle === data.id + "-left"
      );

      const indexRight = edgeList.findIndex(
        (edge) =>
          edge.sourceHandle === data.id + "-right" ||
          edge.targetHandle === data.id + "-right"
      );

      if (indexLeft >= 0) {
        sides.push("left");
      }

      if (indexRight >= 0) {
        sides.push("right");
      }
      return sides.map((side, index) => {
        return (
          <RouterModalSide
            data={side === "left" ? leftData : rightData}
            setData={side === "left" ? setLeftData : setRightData}
            side={side}
            key={index}
          />
        );
      });
    } else {
      return <span>No connections</span>;
    }
  };

  return (
    <CusModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      title="Configure"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <div className="configure-modal">{renderRouterSide()}</div>
    </CusModal>
  );
};

export default ConfigureRouterModal;
