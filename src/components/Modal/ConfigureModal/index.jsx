import React, { useState } from "react";

import CusModal from "..";

import { Button, Select, Checkbox, Row, Col } from "antd";
import "./styles.scss";

import { useDispatch } from "react-redux";
import { updateObjectThunk } from "../../../redux/slices/objectSlice";

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;
const serviceOptions = [
  "Checkbox 1",
  "Checkbox 2",
  "Checkbox 3",
  "Checkbox 4",
  "Checkbox 5",
  "Checkbox 6",
  "Checkbox 7",
  "Checkbox 8",
];

const ConfigureModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const dispatch = useDispatch();
  const [osValue, setOSValue] = useState(
    data.configure.os ? data.configure.os : "window"
  );
  const [checkedList, setCheckedList] = useState(
    data.configure.services ? data.configure.services : []
  );
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    setOSValue(value);
  };

  const handleSave = () => {
    dispatch(
      updateObjectThunk({
        id: data.id,
        configure: {
          os: osValue,
          services: checkedList,
        },
      })
    );
    handleCancel();
  };

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < serviceOptions.length);
    setCheckAll(list.length === serviceOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? serviceOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
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
      <div className="configure-modal">
        <div className="configure-modal__os">
          <h3>OS:</h3>
          <Select
            defaultValue={osValue}
            style={{
              width: 120,
            }}
            onChange={handleChange}
          >
            <Option value="window">Window</Option>
            <Option value="ubuntu">Ubuntu</Option>
          </Select>
        </div>

        <div className="configure-modal__service">
          <div className="configure-modal__service--header">
            <h3>Service</h3>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Choose All
            </Checkbox>
          </div>
          <div className="configure-modal__service--checkbox-gr">
            <CheckboxGroup value={checkedList} onChange={onChange}>
              <Row gutter={[16, 16]}>
                {serviceOptions.map((service, index) => (
                  <Col span={12} key={service + index}>
                    <Checkbox value={service}>{service}</Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </div>
        </div>
      </div>
    </CusModal>
  );
};

export default ConfigureModal;
