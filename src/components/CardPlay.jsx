import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import $ from "jquery";
import Cards from "./Cards";
import useDrawWithSetRepeating from "./useDrawWithSetRepeating";
import Footer from "./footer/Footer";

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
  paintings: [
    "Liza.jpg",
    "woman.jpg",
    "girl1.jpg",
    "girl2.jpg",
    "woman3.jpg",
    "woman2.jpg",
  ],
};

const initState = {
  topic: "fruits",
  repeatNo: 1,
  start: false,
  finished: false,
  turn: 0,
  drawn: false,
};

const reducer = (state, action) => {
  const prevTurn = state.turn;

  switch (action.type) {
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

function CardPlay() {
  const [state, dispatch] = useReducer(reducer, initState);

  // array with names of photos
  const [newPhotoArray, randomDraw] = useDrawWithSetRepeating(
    photoGroup["fruits"]
  );
  const boardRef = useRef();
  const cardsRef = useRef([]);
  const oneVisible = useRef(false);
  const displayedCards = useRef([]);
  const noOfClickedCards = useRef(0);

  const pairsLeft = useRef(6);

  const { turn, topic, repeatNo, start, finished } = state;

  useEffect(() => {
    // console.log("RANDOMdraw useEffect");
    randomDraw(repeatNo, photoGroup[`${topic}`]);
  }, [start, topic, repeatNo]);

  useEffect(() => {
    // console.log("centerLastRow CALLED!");
    if (start === true) {
      // console.log("centerLastRow drawn === true!");
      centerLastRow();
    }
  }, [start]);

  const refresh = (e) => {
    // console.log("Refresh Fn");
    e.preventDefault();
    pairsLeft.current = 6;
    dispatch({ type: "reset" });
  };

  const handleSubmit = (e) => {
    // console.log("handleSubmit Fn");
    e.preventDefault();
    dispatch({ type: "start", value: true });
  };

  const handleSelectChange = (e) => {
    // console.log("handleLevelSelectChange Fn");
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
  };

  const addToCardsRef = useCallback(
    (el) => {
      // console.log("addToCardsRef Fn");
      if (el && !cardsRef.current.includes(el)) {
        cardsRef.current.push(el);
      }
    },
    [cardsRef]
  );

  const hideCards = (arrOfRevealedCards) => {
    // console.log("You hit the ball!");
    arrOfRevealedCards.forEach((el) => {
      $(el.nextElementSibling).css("opacity", "0");
    });
    noOfClickedCards.current = 0;
    pairsLeft.current--;
    setTimeout(() => {
      displayedCards.current = [];
      // console.log("pairsLeft MINUS");
      if (pairsLeft.current === 0) {
        dispatch({ type: "start", value: false });
        dispatch({ type: "finished", value: true });
        cardsRef.current = [];
        clearCenteredClasses();
      }
      oneVisible.current = false;
    }, 450);
  };

  const restoreCards = (arrOfRevealedCards) => {
    // console.log("You missed!");
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
    // console.log("checkIfCardsAreTheSame Fn");

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
    }
    dispatch({ type: "turn", value: 1 });
  };

  const reverseCard = (e) => {
    // console.log("reverseCard Fn");
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
        displayedCards.current[noOfClickedCards.current] = e.target;
        $(e.target.offsetParent).css("transform", "rotateY(180deg)");
        oneVisible.current = true;
        $(e.target.offsetParent).addClass("revealed");
        noOfClickedCards.current++;
        checkIfCardsAreTheSame(displayedCards.current);
      }
    }
  };

  // needed in "hard" level with 18 tiles
  const centerLastRow = () => {
    // console.log("centerLastRow FUNCTION");
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

    //  fit the size of the image appropriately to the size of the flag div according to topic -  it might be useful somehow n the future
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

  const clearCenteredClasses = () => {
    // console.log("clearCenteredClasses FUNCT");
    boardRef.current.classList.remove(
      "board-easy",
      "board-hard",
      "board-hero",
      "board-paintings",
      "board-animals",
      "board-fruits",
      "board-flags"
    );
  };

  const wordAnswer = useCallback(
    (word) => {
      // console.log("wordAnswer Fn");
      const divLetter = [...word].map((letter, ind) => (
        <p
          className="letters-replay"
          key={ind}
          style={{ animationDelay: `${0.15 * ind}s` }}
        >
          {letter}
        </p>
      ));
      return <div className="word-answer">{divLetter}</div>;
    },
    [start, finished, topic]
  );

  const replayMsg = useMemo(() => {
    if (finished === true) {
      // console.log("replayMsg");
      return (
        <div className="replay">
          {turn === newPhotoArray.length / 2
            ? wordAnswer("Wow!\u00A0\u00A0Excellent!")
            : turn === newPhotoArray.length / 2 + newPhotoArray.length / 6
            ? wordAnswer("Fantastic!")
            : turn <= newPhotoArray.length / 2 + newPhotoArray.length / 6 + 2
            ? wordAnswer("Wonderful!")
            : turn <= newPhotoArray.length / 2 + newPhotoArray.length / 6 + 4
            ? wordAnswer("Congratulations!")
            : turn <= newPhotoArray.length / 2 + newPhotoArray.length / 6 + 8
            ? wordAnswer("Good!")
            : turn >= (newPhotoArray.length / 2) * 3
            ? wordAnswer("Keep\u00A0\u00A0training!")
            : wordAnswer("Quite\u00A0\u00A0well!")}
          <p className="h4">You've won in {turn} turns!</p>
          <button className="btn btn-secondary" onClick={refresh}>
            One more time?
          </button>
        </div>
      );
    }
  }, [finished]);

  const settings = (
    <div className="settings">
      <div className="form-group">
        <p className="title">SETTINGS</p>
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
              <option value="paintings">Paintings</option>
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
  const getMainTitle = useMemo(() => {
    // console.log("getMainTitle Fn");
    return wordAnswer("MEMORY\u00A0\u00A0CARDS");
  }, []);

  return (
    <div className="main-container">
      <header className="head">{getMainTitle}</header>
      <div className="container">
        <div className="board" ref={boardRef}>
          {finished && !start ? (
            replayMsg
          ) : !finished && start ? (
            <Cards
              onArray={newPhotoArray}
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
      </div>
      {!finished && start && <div className="score">Turn no: {turn}</div>}
      <Footer />
    </div>
  );
}

export default CardPlay;
