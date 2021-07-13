import * as prompts from "prompts";

interface Coordinates {
  x: number;
  y: number;
}

let coordinates: Coordinates | undefined;
let playground: string[] = ["·", "·", "·", "·", "·", "·", "·", "·", "·"];
let isGameActive: boolean = true;
let winner: string = "";
let isTie: boolean = false;
let player: string = "𝙊";
let rounds: number = 1;
let xWins: number = 0;
let oWins: number = 0;
let tie: number = 0;
let moves: number = 0;

const getWinner = (): void => {
  const victoryConditions: [string, string, string][] = [
    // Horizontal
    [playground[0], playground[1], playground[2]],
    [playground[3], playground[4], playground[5]],
    [playground[6], playground[7], playground[8]],
    // Vertical
    [playground[0], playground[3], playground[6]],
    [playground[1], playground[4], playground[7]],
    [playground[2], playground[5], playground[8]],
    // Diogonals
    [playground[0], playground[4], playground[8]],
    [playground[2], playground[4], playground[6]],
  ];

  for (let i = 0; i < victoryConditions.length; i++) {
    const xo = player == "✘" ? "𝙊" : "✘";
    if (victoryConditions[i][0] === xo && victoryConditions[i][1] === xo && victoryConditions[i][2] === xo) {
      winner = xo;
      if (player === "𝙊") {
        xWins++;
      } else {
        oWins++;
      }
    }
  }
}

const symbolInput = (index: number): void => {
  if (playground[index] === "·") {
    moves++;
    playground[index] = player;
  } else {
    player = player === "✘" ? "𝙊" : "✘";
  }
}

const putLocationInArray = (x: string, y: string): void => {
  if (x === '0' && y === '0') { symbolInput(0); }
  if (x === '1' && y === '0') { symbolInput(1); }
  if (x === '2' && y === '0') { symbolInput(2); }
  if (x === '0' && y === '1') { symbolInput(3); }
  if (x === '1' && y === '1') { symbolInput(4); }
  if (x === '2' && y === '1') { symbolInput(5); }
  if (x === '0' && y === '2') { symbolInput(6); }
  if (x === '1' && y === '2') { symbolInput(7); }
  if (x === '2' && y === '2') { symbolInput(8); }

  player = player === "✘" ? "𝙊" : "✘";
}

const drawPlayground = (): void => {
  console.log("\n",
  playground[0], playground[1], playground[2], "\n",
  playground[3], playground[4], playground[5], "\n",
  playground[6], playground[7], playground[8]
);
}

const gameInfoBoard = (): void => {
  console.log("Tic-Tac-Toe!");
  console.log(`It's round: ${rounds}, Moves count: ${moves}`);
  console.log(`✘ wins: ${xWins}, 𝙊 wins: ${oWins}, Tie : ${tie}`);
  if (winner !== "") {
    console.log(`Winner is ${winner}!\n`);
  } else if (playground[0] !== "·" && playground[1] !== "·" && playground[2] !== "·" && playground[3] !== "·" && playground[4] !== "·" && playground[5] !== "·" && playground[6] !== "·" && playground[7] !== "·" && playground[8] !== "·" && winner === "") {
    isTie = true;
    tie++;
    console.log("Tie!\n");
  } else {
    console.log(`It's player ${player} turn!\n`);
  }
}

export const game = async (end: () => void) => {
  while (isGameActive) {
    console.clear();

    putLocationInArray(`${coordinates?.x}`, `${coordinates?.y}`);
    getWinner();
    gameInfoBoard();
    drawPlayground();
    if (winner !== "" || isTie === true) {
      isGameActive = false;
      break;
    }
    
    const response = await prompts([
      {
        type: "number",
        name: "x",
        message: "Enter coordinate on x axys",
      },
      {
        type: "number",
        name: "y",
        message: "Enter coordinate on y axys",
      },
    ]);

    coordinates = { ...response };

  };

  const playAgain = await prompts([
    {
      type: "text",
      name: "name",
      message: "Play again or exit? (play / exit): ",
    },
  ]);

  if (playAgain.name === "play") {
    playground = ["·", "·", "·", "·", "·", "·", "·", "·", "·"];
    isGameActive = true;
    winner = "";
    player = "𝙊";
    isTie = false;
    rounds++;
    moves = 0;
  } else if (playAgain.name === "exit") {
    end();
  } else {
    console.log("Wrong input!");
  }
};