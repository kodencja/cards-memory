import React, { useContext } from "react";
import { ModalContext } from "./Footer";
import("./css/modalContent.css");

function ModalContent() {
  const modalContextValue = useContext(ModalContext);
  const { handleModalOpen } = modalContextValue;
  // console.log("ModalContent Fn");

  return (
    <>
      <div className="btn-close2">
        <button
          className="btn close-btn btn-sm"
          onClick={() => handleModalOpen(false)}
        >
          X
        </button>
      </div>

      <p className="title-code">Webdeveloping information</p>
      <div className="dialog-question dev-box">
        <div>
          <p>
            &nbsp;&nbsp;&nbsp;This page was built in <b>REACT.JS</b> with
            functional components supported by <b>HOOK tools</b> such as{" "}
            <b>
              useReducer, useState, useContext, useRef, useCallback, useMemo
            </b>{" "}
            and <b>useEffect</b>. Other React libraries embrace:{" "}
            <b>createContext, memo, react-modal</b> as well as{" "}
            <b>my own custom hook</b>, called "<b>useDrawWithSetRepeating</b>""
            to draw a random order of a given photo array. The page layout is
            built with <b>CSS GRID</b>, while stylesheets are written in{" "}
            <b>SCSS</b>.
            <br />
            &nbsp;&nbsp;&nbsp;Images in the cards are loaded dynamically with no
            need of separate components to each different photo topic. <br />
            &nbsp;&nbsp;&nbsp;All react components have been optimized using
            functions such as <b>React.memo()</b> along with '<b>areEqual</b>'
            function (as a second parameter of React.memo()) that compares
            previous and next values of a component's 'props', as well as{" "}
            <b>lazy</b> and <b>Suspense</b> React's libraries. <br />
          </p>
          <a
            href="https://github.com/kodencja/cards-memory"
            target="_blank"
            rel="noreferrer"
          >
            See the code
          </a>
        </div>
      </div>
    </>
  );
}

export default React.memo(ModalContent);
