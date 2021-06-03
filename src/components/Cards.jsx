import React from "react";

function areEqual(prevProps, nextProps) {
  return prevProps.onArray === nextProps.onArray;
}

function Cards({ onArray, onReverseCard, onAddToCardsRef, onTopic }) {
  // console.log("Cards Comp.");

  // load background-image in flip-card-back dynamically
  const cardsDivs = onArray.map((photoName, ind) => {
    return (
      <div className={"flip-card card" + ind} key={ind} ref={onAddToCardsRef}>
        <div className="flip-card-inner" onClick={onReverseCard}>
          <div className="flip-card-front"></div>
          <div
            className="flip-card-back"
            style={{
              backgroundImage:
                "url(" +
                require(`../img/${onTopic}/${photoName}`).default +
                ")",
            }}
          ></div>
        </div>
      </div>
    );
  });

  return <>{cardsDivs}</>;
}

export default React.memo(Cards, areEqual);
