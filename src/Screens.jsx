import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import successSound from "./multimedia_files/correct-match.mp3";
import failSound from "./multimedia_files/incorrect-match.mp3";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col gap-8 justify-center items-center bg-pink-100 w-[80%] h-[55%] lg:w-[40%] rounded-lg">
        <h1 className="text-pink-600 text-2xl font-bold">Memory</h1>
        <p className="text-pink-600">Flip over tiles looking for pairs</p>
        <button
          onClick={start}
          className="bg-gradient-to-t from-pink-600 to-pink-500 text-white w-20 h-10 rounded-full"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [pairedCount, setPairedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [timer, setTimer] = useState(60)

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    // if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const playSuccessSound = () => {
    const sound = new Audio(successSound);
    sound.play();
  };

  const playFailSound = () => {
    const sound = new Audio(failSound);
    sound.play();
  };

  const toggleMute = () => {
    const sound = document.querySelector("audio");
    sound.muted = !sound.muted;
    // sound.muted = true
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 200,
        });
        newState = "matched";
        playSuccessSound();
        setPairedCount((c) => c + 1);
      } else {
        playFailSound();
        setFailedCount((c) => c + 1);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  const handleDifficultyLevel = (difficulty) => {
    setSelectedDifficulty(difficulty);

    let tileCount;
    // switch(difficulty) {
    //   case 'easy':
    //     tileCount = 8;
    //     break;
    //   case 'medium':
    //     tileCount = 12;
    //     break;
    //   case 'hard':
    //     tileCount = 20;
    //     break;
    // }

    if (difficulty === "easy") {
      tileCount = 8;
      console.log(difficulty);
      console.log(tileCount);
      // return
    } else if (difficulty === "medium") {
      tileCount = 12;
      console.log(difficulty);
      console.log(tileCount);
    } else {
      tileCount = 20;
      console.log(difficulty);
      console.log(tileCount);
    }

    const newTiles = getTiles(tileCount);
    setTiles(newTiles);
  };

  useEffect(() => {
    handleDifficultyLevel(selectedDifficulty);
    setTimer(60)
  }, [selectedDifficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer -1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timer === 0) {
      setTimeout(end, 0);
      return
    }
  })

  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center h-screen w-full">
        <div className="w-[80%] lg:w-[60%] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p
              className={`text-lg font-medium ${
                selectedDifficulty === "easy"
                  ? "selected-difficulty"
                  : "unselected-difficulty"
              }`}
              onClick={() => handleDifficultyLevel("easy")}
            >
              Easy
            </p>
            <p
              className={`text-lg font-medium ${
                selectedDifficulty === "medium"
                  ? "selected-difficulty"
                  : "unselected-difficulty"
              }`}
              onClick={() => handleDifficultyLevel("medium")}
            >
              Medium
            </p>
            <p
              className={`text-lg font-medium ${
                selectedDifficulty === "hard"
                  ? "selected-difficulty"
                  : "unselected-difficulty"
              }`}
              onClick={() => handleDifficultyLevel("hard")}
            >
              Hard
            </p>
          </div>
          <div>
            <p className="py-2 px-3 bg-red-600 text-white rounded-lg">
              {Math.floor(timer / 60).toString().padStart(2, '0')}:
              {Math.floor(timer % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="w-[80%] lg:w-[60%] bg-indigo-50 flex justify-center items-center p-4 rounded-lg">
          <div className="grid grid-cols-4 gap-4 justify-center items-center w-full">
            {}
            {tiles &&
              tiles.map((tile, i) => (
                <Tile key={i} flip={() => flip(i)} {...tile} />
              ))}
          </div>
        </div>
        <div className="flex item-center justify-between w-[80%] lg:w-[60%] transition duration-3000 transform rotate-y-180">
          <p className="text-blue-600 font-semibold lg:text-xl">
            Tries:{" "}
            <span className="bg-blue-200 py-1 px-2 rounded-lg">{tryCount}</span>
          </p>
          <p className="text-green-600 font-semibold lg:text-xl">
            Matched:{" "}
            <span className="bg-green-200 py-1 px-2 rounded-lg">
              {pairedCount}
            </span>
          </p>
          <p className="text-red-600 font-semibold lg:text-xl">
            Mismatched:{" "}
            <span className="bg-red-200 py-1 px-2 rounded-lg">
              {failedCount}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
