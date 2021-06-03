import React, { useState, lazy, Suspense } from "react";
import("./css/footer.css");

const ModalComp = lazy(() => import("./ModalComp"));

export const ModalContext = React.createContext();

function Footer() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // console.log("Footer Comp.");

  return (
    <footer className="down-buttons">
      <a
        href="https://codencja.herokuapp.com/"
        target="_blank"
        rel="noreferrer"
      >
        <button type="link" className="btn-down home-page-link">
          Home Page
        </button>
      </a>
      <div className="footer">
        {" "}
        <b>&copy; 2021 </b>
        <i>by</i> <strong>Codencja</strong>
      </div>
      <button
        type="button"
        className="btn btn-down btn-code"
        onClick={(e) => {
          setModalIsOpen(true);
        }}
      >
        Code info
      </button>

      <Suspense fallback={<p>Loading...</p>}>
        <ModalContext.Provider
          value={{ modalIsOpen, handleModalOpen: setModalIsOpen }}
        >
          {/* <ModalComp isModalOpen={modalIsOpen} handleModalOpen={setModalIsOpen} /> */}
          <ModalComp />
        </ModalContext.Provider>
      </Suspense>
    </footer>
  );
}

// export default Footer;

export default React.memo(Footer);
