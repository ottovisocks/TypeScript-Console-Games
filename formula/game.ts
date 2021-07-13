import * as chalk from "chalk";

export type Direction = "Stop" | "Up" | "Right" | "Left" | "Down" | "undefined";
export const FRAMES_PER_SECOND = 8;

const playground: string[][] = [];
const playgroundGridSize: number[] = [15, 10];
const playgroundSides: number[][] = [];
const roadCenterLines: number[][] = [[1, 5], [2, 5], [5, 5], [6, 5], [9, 5], [10, 5], [13, 5], [14, 5]];
const opponentFormulaCoordinates: number[][] = [];
const formulaCoordinates: number[][] = [[11, 5], [12, 4], [12, 5], [12, 6], [13, 5], [14, 4], [14, 5], [14, 6]];
const neededDistanceToAdScore: number = 10;
let score: number = 0;
let randomOpponentFormulaColorNumber: number = 0;
let opponentFormulaBlock: string = "∎";
let drivenDistance: number = 0;
let addOpponentFormula: boolean = false;
let opponentFormulaRandomSide: number = 0; // 0 - left, 1 - center, 2 - right
let buildOpponentFormulaStep: number = 0;

const buildPlaygrondArray = (): void => {
  for (let i = 0; i <= playgroundGridSize[0]; i++) {
    let line = "";
    for (let j = 0; j <= playgroundGridSize[1]; j++) {
      line += " ";
    }
    playground.push(line.split(''));
  }
}

const buildPlaygrondSidesArray = (): void => {
  for (let i = 0; i <= playgroundGridSize[0]; i++) {
    playgroundSides.push([i, 0]);
    playgroundSides.push([i, playgroundGridSize[1]]);
  }
}

buildPlaygrondArray();
buildPlaygrondSidesArray();

const drawPlayground = (): void => {
  for (let i = 0; i < playground.length; i++) {
    let line = "";
    for (let j = 0; j < playground[i].length; j++) {
      line += playground[i][j] + " ";
    }
    console.log(chalk.white.bgBlackBright.bold(" " + line));
  }
}

const drawPlaygroundSides = (): void => {
  for (const item of playgroundSides) {
    playground[item[0]][item[1]] = "║";
  }
}

const drawCenterLines = (): void => {
  for (let i = 0; i <= 1; i++) {
    for (let j = 0; j < roadCenterLines.length; j++) {
      if (roadCenterLines[j][0] === playgroundGridSize[0]) {
        playground[roadCenterLines[j][0]][roadCenterLines[j][1]] = " ";
        roadCenterLines[j][0] = 0;
      } else {
        roadCenterLines[j][0] += 1;
        playground[roadCenterLines[j][0] - 1][roadCenterLines[j][1]] = " ";
      }
    }
    for (const item of roadCenterLines) {
      playground[item[0]][item[1]] = "│";
    }
  }
}

const drawFormulaMoves = (dir: Direction): void => {
  if (dir === "Right") {
    if (playground[formulaCoordinates[3][0]][formulaCoordinates[3][1] + 1] !== "║") {
      for (let i = 0; i < formulaCoordinates.length; i++) {
        formulaCoordinates[i][1]++;
        playground[formulaCoordinates[i][0]][formulaCoordinates[i][1] - 1] = " ";
      }
    }
  }
  if (dir === "Up") {
    if (formulaCoordinates[0][0] !== 0) {
      for (let i = 0; i < formulaCoordinates.length; i++) {
        formulaCoordinates[i][0]--;
        playground[formulaCoordinates[i][0] + 1][formulaCoordinates[i][1]] = " ";
      }
    }
  }
  if (dir === "Left") {
    if (playground[formulaCoordinates[1][0]][formulaCoordinates[1][1] - 1] !== "║") {
      for (let i = 0; i < formulaCoordinates.length; i++) {
        formulaCoordinates[i][1]--;
        playground[formulaCoordinates[i][0]][formulaCoordinates[i][1] + 1] = " ";
      }
    }
  }
  if (dir === "Down") {
    if (formulaCoordinates[6][0] !== playgroundGridSize[0]) {
      for (let i = 0; i < formulaCoordinates.length; i++) {
        formulaCoordinates[i][0]++;
        playground[formulaCoordinates[i][0] - 1][formulaCoordinates[i][1]] = " ";
      }
    }
  }
}

const drawOpponentFormulaMoveDown = () => {
  for (let i = 0; i < opponentFormulaCoordinates.length; i++) {
    if (opponentFormulaCoordinates[i][0] !== playgroundGridSize[0]) {
      opponentFormulaCoordinates[i][0]++;
      playground[opponentFormulaCoordinates[i][0] - 1][opponentFormulaCoordinates[i][1]] = " ";
    } else {
      playground[opponentFormulaCoordinates[i][0]][opponentFormulaCoordinates[i][1]] = " ";
      opponentFormulaCoordinates.splice(i, 1);
    }
  }
}

const drawFormula = (): void => {
  for (const item of formulaCoordinates) {
    playground[item[0]][item[1]] = chalk.red.bgBlackBright.bold("∎");
  }
}

const makeOponentFormula = (): void => {
  if (addOpponentFormula !== true && opponentFormulaCoordinates.length === 0) {
    opponentFormulaRandomSide = Math.floor(Math.random() * 3);
    randomOpponentFormulaColorNumber = Math.floor(Math.random() * 5);
    addOpponentFormula = true;
  }
  if (addOpponentFormula) {
    if (opponentFormulaRandomSide === 0) {
      if (buildOpponentFormulaStep === 0) {
        opponentFormulaCoordinates.push([0, 1], [0, 2], [0, 3]);
        buildOpponentFormulaStep = 1;
      } else if (buildOpponentFormulaStep === 1) {
        opponentFormulaCoordinates.push([0, 2]);
        buildOpponentFormulaStep = 2;
      } else if (buildOpponentFormulaStep === 2) {
        opponentFormulaCoordinates.push([0, 1], [0, 2], [0, 3]);
        buildOpponentFormulaStep = 3;
      } else {
        opponentFormulaCoordinates.push([0, 2]);
        buildOpponentFormulaStep = 0;
        addOpponentFormula = false;
      }
    }
    if (opponentFormulaRandomSide === 1) {
      if (buildOpponentFormulaStep === 0) {
        opponentFormulaCoordinates.push([0, 4], [0, 5], [0, 6]);
        buildOpponentFormulaStep = 1;
      } else if (buildOpponentFormulaStep === 1) {
        opponentFormulaCoordinates.push([0, 5]);
        buildOpponentFormulaStep = 2;
      } else if (buildOpponentFormulaStep === 2) {
        opponentFormulaCoordinates.push([0, 4], [0, 5], [0, 6]);
        buildOpponentFormulaStep = 3;
      } else {
        opponentFormulaCoordinates.push([0, 5]);
        buildOpponentFormulaStep = 0;
        addOpponentFormula = false;
      }
    }
    if (opponentFormulaRandomSide === 2) {
      if (buildOpponentFormulaStep === 0) {
        opponentFormulaCoordinates.push([0, 7], [0, 8], [0, 9]);
        buildOpponentFormulaStep = 1;
      } else if (buildOpponentFormulaStep === 1) {
        opponentFormulaCoordinates.push([0, 8]);
        buildOpponentFormulaStep = 2;
      } else if (buildOpponentFormulaStep === 2) {
        opponentFormulaCoordinates.push([0, 7], [0, 8], [0, 9]);
        buildOpponentFormulaStep = 3;
      } else {
        opponentFormulaCoordinates.push([0, 8]);
        buildOpponentFormulaStep = 0;
        addOpponentFormula = false;
      }
    }
  }
}

const drawOpponentFormula = (): void => {
  for (const item of opponentFormulaCoordinates) {
    playground[item[0]][item[1]] = opponentFormulaBlock;
  }
}

const addScore = (): void => {
  if (drivenDistance === neededDistanceToAdScore) {
    score += 5;
    drivenDistance = 0;
  }
}

const increseDistance = (): void => {
  drivenDistance += 1;
}

const formulaCrash = () => {
  for (let i = 0; i < formulaCoordinates.length; i++) {
    for (let j = 0; j < opponentFormulaCoordinates.length; j++) {
      if (formulaCoordinates[i][0] === opponentFormulaCoordinates[j][0] && formulaCoordinates[i][1] === opponentFormulaCoordinates[j][1]) {
        console.log(chalk.yellow("CRASH!!! Game Over!"));
        process.exit();
      }
    }
  }
}

const addOpponentFormulaColor = () => {
  if (randomOpponentFormulaColorNumber === 0) {
    opponentFormulaBlock = chalk.blue.bgBlackBright.bold("∎");
  }
  if (randomOpponentFormulaColorNumber === 1) {
    opponentFormulaBlock = chalk.green.bgBlackBright.bold("∎");
  }
  if (randomOpponentFormulaColorNumber === 2) {
    opponentFormulaBlock = chalk.yellow.bgBlackBright.bold("∎");
  }
  if (randomOpponentFormulaColorNumber === 3) {
    opponentFormulaBlock = chalk.magenta.bgBlackBright.bold("∎");
  }
  if (randomOpponentFormulaColorNumber === 4) {
    opponentFormulaBlock = chalk.white.bgBlackBright.bold("∎");
  }
}

export const draw = (direction: Direction) => {
  console.clear();
  console.log(chalk.blackBright.bgGreenBright.bold(` Score: ${score} `));
  increseDistance();
  addOpponentFormulaColor();
  drawPlayground();
  drawPlaygroundSides();
  formulaCrash();
  drawFormulaMoves(direction);
  drawOpponentFormulaMoveDown();
  drawCenterLines();
  drawFormula();
  makeOponentFormula();
  drawOpponentFormula();
  addScore();
};