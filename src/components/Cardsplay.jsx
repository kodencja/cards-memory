import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
  useReducer,
  lazy,
  Suspense,
} from "react";
import $ from "jquery";
// import "../css/style.css";
import Cards from "./Cards";
import useDrawWithSetRepeating from "./useDrawWithSetRepeating";
import TestImg from "./TestImg";
// import kartaFront from "../img/g/karta.png";

// const kartaFront = lazy(() => import("../img/g/karta.png"));

const photoGroup = {
  fruits: [
    "ananas.jpg",
    "pear.jpg",
    "apple.jpg",
    "banan.jpg",
    "kiwi.jpg",
    "orange.jpg",
  ],
  animals: [
    "camel.jpg",
    "bear.jpg",
    "eagle.jpg",
    "jelen.jpg",
    "horse.jpg",
    "golden.jpg",
  ],
  flags: [
    "Hungary.png",
    "Francja.png",
    "Finlandia.png",
    "Polska.png",
    "Italy.png",
    "Spain.png",
  ],
};
// const fruits = [
//   "ananas.jpg",
//   "pear.jpg",
//   "apple.jpg",
//   "banan.jpg",
//   "kiwi.jpg",
//   "orange.jpg",
// ];

// const animals = [
//   "camel.jpg",
//   "bear.jpg",
//   "eagle.jpg",
//   "jelen.jpg",
//   "horse.jpg",
//   "golden.jpg",
// ];

const initState = {
  // photoNames: [...fruits],
  // photoNames: [...fruits],
  // photoNames: photoGroup.fruits,
  // photoNames: "apple.jpg",
  topic: "fruits",
  repeatNo: 1,
  start: false,
  finished: false,
  turn: 0,
  drawn: false,
};

const reducer = (state, action) => {
  const prevTurn = state.turn;
  // console.log(prevTurn);
  //   console.log("state inside reducer!");
  //   console.log(action.type);
  //   console.log(action.value);
  //   console.log(state);

  switch (action.type) {
    // case "photo":
    //   console.log(action.value);
    //   const photoArray = { ...photoGroup };
    //   // return { ...state, photoNames: [...photoArray] };
    //   return { ...state, photoNames: [...photoArray[`${action.value}`]] };
    // return { ...state, photoNames: eval(action.value) };
    case "start":
      return { ...state, start: action.value };
    case "finished":
      return { ...state, finished: action.value };
    case "turn":
      return { ...state, turn: prevTurn + action.value };
    case "repeatNo":
      return { ...state, repeatNo: action.value };
    case "topic":
      return { ...state, topic: action.value };
    case "drawn":
      return { ...state, drawn: action.value };
    case "reset":
      return {
        ...state,
        turn: 0,
        repeatNo: 1,
        topic: "fruits",
        finished: false,
      };
    default:
      return state;
  }
};

function Cardsplay() {
  const [state, dispatch] = useReducer(reducer, initState);

  // array with names of photos
  const [newArray, randomDraw] = useDrawWithSetRepeating(photoGroup["fruits"]);
  const boardRef = useRef();
  const cardsRef = useRef([]);
  const oneVisible = useRef(false);
  const displayedCards = useRef([]);
  const noOfClickedCards = useRef(0);

  const pairsLeft = useRef(6);

  const { turn, topic, repeatNo, start, finished, photoNames, drawn } = state;

  useEffect(() => {
    console.log(cardsRef.current.length);
  }, [newArray]);

  useEffect(() => {
    console.log("RANDOMdraw useEffect");

    // if (start === true) {
    console.log("RANDOMdraw start === true");
    randomDraw(repeatNo, photoGroup[`${topic}`]);
    console.log(cardsRef.current.length);
  }, [topic, repeatNo]);
  // }, [start]);

  useEffect(() => {
    console.log("centerLastRow CALLED!");
    console.log(state);
    console.log(cardsRef.current.length);
    if (start === true) {
      console.log("centerLastRow drawn === true!");
      centerLastRow();
      console.log(cardsRef.current.length);
    }
  }, [start]);

  const refresh =
    //  useCallback(
    (e) => {
      console.log("Refresh Fn");
      e.preventDefault();
      pairsLeft.current = 6;
      dispatch({ type: "reset" });
      // dispatch({ type: "finished", value: false });
    };
  // ,[]);

  const handleSubmit = (e) => {
    console.log("handleSubmit Fn");
    e.preventDefault();
    dispatch({ type: "start", value: true });
  };

  const handleSelectChange =
    //   useCallback(
    (e) => {
      console.log("handleLevelSelectChange Fn");
      if (e.target.name === "topic") {
        dispatch({
          type: "topic",
          value: e.target.value,
        });
      } else if (e.target.name === "repeatNo")
        dispatch({
          type: "repeatNo",
          value: parseInt(e.target.value),
        });
      //     },
      //     [repeatNo, topic]
      //   );
    };

  const addToCardsRef =
    //   useCallback(
    (el) => {
      if (el && !cardsRef.current.includes(el)) {
        cardsRef.current.push(el);
      }
      //     },
      //     [cardsRef]
      //   );
    };

  const hideCards = (arrOfRevealedCards) => {
    console.log("You hit the ball!");
    arrOfRevealedCards.forEach((el) => {
      $(el.nextElementSibling).css("opacity", "0");
    });
    noOfClickedCards.current = 0;
    pairsLeft.current--;
    setTimeout(() => {
      displayedCards.current = [];
      console.log("pairsLeft MINUS");
      console.log(pairsLeft.current);
      if (pairsLeft.current === 0) {
        dispatch({ type: "start", value: false });
        dispatch({ type: "finished", value: true });
        cardsRef.current = [];
        clearCenteredClasses();
      }
      oneVisible.current = false;
    }, 450);
    // setFinished(true);
  };

  const restoreCards = (arrOfRevealedCards) => {
    console.log("You missed!");
    arrOfRevealedCards.forEach((el) => {
      $(el.offsetParent).css("transform", "rotateY(0deg)");
      $(el.offsetParent).removeClass("revealed");
    });

    setTimeout(() => {
      displayedCards.current = [];
      noOfClickedCards.current = 0;
      oneVisible.current = false;
    }, 450);
  };

  const checkIfCardsAreTheSame = (arrOfRevealedCards) => {
    console.log("checkIfCardsAreTheSame Fn");
    const bgrImgToCompareWith =
      arrOfRevealedCards[0].nextElementSibling.style.backgroundImage;
    // metoda every() dla tablic przerywa dalsze liczenie, jeżeli już w trakcie sprawdzania zwróci 'false'
    const areBgrImgTheSame = arrOfRevealedCards.every((el, ind) => {
      return (
        el.nextElementSibling.style.backgroundImage === bgrImgToCompareWith
      );
    });

    if (areBgrImgTheSame === true) {
      arrOfRevealedCards.forEach((el) => {
        $(el).css("opacity", "0");
      });

      setTimeout(() => {
        hideCards(arrOfRevealedCards);
      }, 1100);
    } else {
      setTimeout(() => {
        restoreCards(arrOfRevealedCards);
      }, 1100);
      // randomDraw(2);
    }
    // dispatch({type: "turn", value: (prevC) => prevC + 1})
    dispatch({ type: "turn", value: 1 });
    // setTurnCounter((prevC) => prevC + 1);
  };

  const reverseCard = (e) => {
    console.log("reverseCard Fn");
    console.log(topic);
    if (
      oneVisible.current === false &&
      !e.target.offsetParent.classList.contains("revealed")
    ) {
      if (noOfClickedCards.current < repeatNo) {
        displayedCards.current[noOfClickedCards.current] = e.target;
        $(e.target.offsetParent).css("transform", "rotateY(180deg)");
        $(e.target.offsetParent).addClass("revealed");
        noOfClickedCards.current++;
      } else if (noOfClickedCards.current === repeatNo) {
        // console.log("=== repeatNo 1");

        displayedCards.current[noOfClickedCards.current] = e.target;
        $(e.target.offsetParent).css("transform", "rotateY(180deg)");
        oneVisible.current = true;
        $(e.target.offsetParent).addClass("revealed");
        noOfClickedCards.current++;
        checkIfCardsAreTheSame(displayedCards.current);
      }
      // console.log(displayedCards.current[noOfClickedCards.current]);
    }
  };

  const centerLastRow =
    //   useCallback(
    () => {
      console.log("centerLastRow FUNCTION");
      //   console.log(cardsRef.current.length);
      //   console.log(start);
      //   console.log(repeatNo);
      // if (start === true) {
      console.log("centerLastRow FUN && start === TRUE");
      // if (cardsRef.current.length <= 12) {
      if (repeatNo === 1) {
        boardRef.current.classList.add("board-easy");
        cardsRef.current.forEach((el) => el.classList.add("easy"));
        // } else if (cardsRef.current.length <= 18) {
      } else if (repeatNo === 2) {
        boardRef.current.classList.add("board-hard");
        cardsRef.current.forEach((el) => el.classList.add("hard"));
      } else {
        boardRef.current.classList.add("board-hero");
        cardsRef.current.forEach((el) => el.classList.add("hero"));
      }

      // apropriatly fit the size of the image to the size of the flag div according to topic
      if (topic === "flags") {
        boardRef.current.classList.add("board-flags");
      } else if (topic === "fruits") {
        boardRef.current.classList.add("board-fruits");
      } else if (topic === "animals") {
        boardRef.current.classList.add("board-animals");
      } else {
        boardRef.current.classList.add("board-paintings");
      }
    };
  //   }, [start]);
  // }, [newArray, repeatNo, start]);

  const clearCenteredClasses =
    //   useCallback(
    () => {
      console.log("clearCenteredClasses FUNCT");
      boardRef.current.classList.remove(
        "board-easy",
        "board-hard",
        "board-hero",
        "board-paintings",
        "board-animals",
        "board-fruits",
        "board-flags"
      );
      //   }, []);
    };

  const replayMsg = useMemo(() => {
    if (finished === true) {
      console.log("replayMsg");
      return (
        <div className="replay">
          {turn === newArray.length / 2 ? (
            <h1>Excellent!</h1>
          ) : (
            <h1>Congratulations!</h1>
          )}
          <h2>You've won in {turn} turns!</h2>
          <button className="btn btn-secondary" onClick={refresh}>
            One more time?
          </button>
        </div>
      );
    }
  }, [finished]);

  const settings = useMemo(() => {
    return (
      <div className="replay">
        <div className="form-group">
          <h2>SETTINGS</h2>
          <form className="form">
            <div className="topic form-group">
              <label htmlFor="topic">Topic</label>
              <select
                id="topic"
                name="topic"
                onChange={handleSelectChange}
                className="form-control form-control-lg"
                defaultValue={topic}
              >
                <option value="fruits">Fruits</option>
                <option value="animals">Animals</option>
                <option value="flags">Flags</option>
              </select>
            </div>

            <div className="level form-group">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                name="repeatNo"
                onChange={handleSelectChange}
                className="form-control form-control-lg"
                defaultValue={repeatNo}
              >
                <option value={1}>Easy</option>
                <option value={2}>Hard</option>
                <option value={3}>Hero</option>
              </select>
            </div>
          </form>
          <button
            className="btn btn-secondary"
            type="submit"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="container">
      <div className="board" ref={boardRef}>
        {finished && !start ? (
          replayMsg
        ) : !finished && start ? (
          <Cards
            onArray={newArray}
            onReverseCard={reverseCard}
            onAddToCardsRef={addToCardsRef}
            onTopic={topic}
          />
        ) : !finished && !start ? (
          settings
        ) : (
          settings
        )}
      </div>
      <div style={{ width: "100%" }}></div>
      {!finished && start && <div className="score">Turn no: {turn}</div>}
    </div>
  );
}

export default Cardsplay;
