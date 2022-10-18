import React from "react";

import { Row, Col } from "antd";
import "./styles.scss";

import ScreenCanvas from "../../containers/ScreenCanvas";
import Sidebar from "../../containers/Sidebar/Sidebar";

import "./styles.scss";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Row>
        <Col span={4}>
          <Sidebar />
        </Col>
        <Col span={20}>
          <ScreenCanvas />
        </Col>
      </Row>
    </div>
  );
};

export default MainLayout;
