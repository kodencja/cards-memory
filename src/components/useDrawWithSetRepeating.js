import { useState } from "react";

function useDrawWithSetRepeating() {
  console.log("useDrawWithSetRepeating Fn");
  const arrayToDrawTo = [];
  const [drawnArray, setDrawnArray] = useState([]);
  // losowanie indeksu
  // random draw with defined number of repetitions
  const randomDraw = (rNo, photoNamesArray) => {
    const arrayToDrawFrom = [...photoNamesArray];
    let arrFromLength = arrayToDrawFrom.length;

    let n = 0;
    while (arrFromLength > 0) {
      const randomIndex = Math.floor(Math.random() * arrFromLength);

      if (
        arrayToDrawTo.filter((el) => el === arrayToDrawFrom[randomIndex])
          .length < rNo
      ) {
        arrayToDrawTo[n] = arrayToDrawFrom[randomIndex];
        n++;
      } else {
        arrayToDrawTo[n] = arrayToDrawFrom[randomIndex];
        arrayToDrawFrom.splice(randomIndex, 1);
        arrFromLength--;
        n++;
      }

      setDrawnArray(arrayToDrawTo);
    }
  };

  return [drawnArray, randomDraw];
}

export default useDrawWithSetRepeating;
