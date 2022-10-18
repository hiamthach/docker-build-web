import React from "react";

import { Modal } from "antd";

const CusModal = ({ isModalOpen, setIsModalOpen, children, title, footer }) => {
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={footer}
    >
      {children}
    </Modal>
  );
};

export default CusModal;
