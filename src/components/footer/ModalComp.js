import React, { useContext } from "react";
import Modal from "react-modal";
import { ModalContext } from "./Footer";
import ModalContent from "./ModalContent";
import("./css/modalComp.css");

Modal.setAppElement("#root");

function areEqual(prevProps, nextProps) {
  return prevProps.isModalOpen === nextProps.isModalOpen;
}

function ModalComp() {
  const modalContextValue = useContext(ModalContext);
  const { modalIsOpen, handleModalOpen } = modalContextValue;
  console.log("ModalComp Fn");

  return (
    <Modal
      className="dialog-box"
      isOpen={modalIsOpen}
      onRequestClose={() => handleModalOpen(false)}
      shouldCloseOnOverlayClick={true}
      overlay={true}
    >
      <ModalContent />
    </Modal>
  );
}

export default React.memo(ModalComp, areEqual);
