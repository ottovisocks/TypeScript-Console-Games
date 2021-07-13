import * as chalk from "chalk";

export type Direction = "Up" | "Right" | "Left" | "Down";
export const FRAMES_PER_SECOND = 8;

const fs = require('fs'); // mēģināju, sanāk tikai šādi.
const gameGroundFromTxt: string[] = fs.readFileSync('map.txt', 'utf8').toString().replace(/\r\n/g, '\n').split('\n');
const playground: string[][] = [];
const gridSize: number[] = [14, 40];
const blueGhostTime: number = 7000; // 1000 = 1sec
const wall: string = "∎";
const regularFood: string = "·";
const specialFood: string = "●";
const ghostHouseGates: string = "≏";
const specialFoodCoordinates: number[][] = [];
const regularFoodCoordinates: number[][] = [];
const ghostHouseGateCoordinates: number[][] = [[6, 19], [6, 20], [6, 21]];
const ghostsCoordinates: number[][] = [[7, 17]] // , [7, 19], [7, 21], [7, 23]
let ghost: string = "⍝";
let ghostDirection: string = "Right";
let score: number = 0;
let lives: number = 3;
let pacman: string = "◒";
let pacmanCoordinates: number[] = [9, 20];
let setTime: number = 0;
let rightSideDownSquare: number = 0;
let rightSideUpSquare: number = 0;
let leftSideDownSquare: number = 0;
let leftSideUpSquare: number = 0;

const buildPlaygroundArray = (): void => {
  for (let i = 0; i < gameGroundFromTxt.length; i++) {
    playground.push(Array.from(gameGroundFromTxt[i]));
  }
}

const buildRegularFoodArray = (): void => {
  for (let i = 0; i < playground.length; i++) {
    for (let j = 0; j < playground[i].length; j++) {
      if (playground[i][j] === "·") {
        regularFoodCoordinates.push([i, j]);
      }
    }
  }
}

const buildSpecialFoodArray = (): void => {
  for (let i = 0; i < playground.length; i++) {
    for (let j = 0; j < playground[i].length; j++) {
      if (playground[i][j] === "●") {
        specialFoodCoordinates.push([i, j]);
      }
    }
  }
}

buildPlaygroundArray();
buildRegularFoodArray();
buildSpecialFoodArray();

const drawPlayground = (): void => {
  for (let i = 0; i < playground.length; i++) {
    let line = "";
    for (let j = 0; j < playground[i].length; j++) {
      line += playground[i][j] + " ";
    }
    console.log(chalk.white.bgBlackBright.bold(" " + line));
  }
}

const drawPacManTurns = (dir: Direction): void => {
  if (dir === "Right") {
    pacman = "◐";
    if (playground[pacmanCoordinates[0]][pacmanCoordinates[1] + 1] !== wall) {
      pacmanCoordinates[1]++;
      playground[pacmanCoordinates[0]][pacmanCoordinates[1] - 1] = " ";
    }
  }
  if (dir === "Up") {
    pacman = "◒";
    if (playground[pacmanCoordinates[0] - 1][pacmanCoordinates[1]] !== wall) {
      pacmanCoordinates[0]--;
      playground[pacmanCoordinates[0] + 1][pacmanCoordinates[1]] = " ";
    }
  }
  if (dir === "Left") {
    pacman = "◑";
    if (playground[pacmanCoordinates[0]][pacmanCoordinates[1] - 1] !== wall) {
      pacmanCoordinates[1]--;
      playground[pacmanCoordinates[0]][pacmanCoordinates[1] + 1] = " ";
    }
  }
  if (dir === "Down") {
    pacman = "◓";
    if (playground[pacmanCoordinates[0] + 1][pacmanCoordinates[1]] !== wall) {
      if (playground[pacmanCoordinates[0] + 1][pacmanCoordinates[1]] !== ghostHouseGates) {
        pacmanCoordinates[0]++;
        playground[pacmanCoordinates[0] - 1][pacmanCoordinates[1]] = " ";
      }
    }
  }
}

const pacmanGoTroughtTheTunel = (): void => {
  if (pacmanCoordinates[1] === - 1) {
    pacmanCoordinates[1] = gridSize[1];
  }
  if (pacmanCoordinates[1] === gridSize[1] + 1) {
    pacmanCoordinates[1] = 0;
  }
}

const ghostGoTroughtTheTunel = (): void => {
  for (let i = 0; i < ghostsCoordinates.length; i++) {
    if (ghostsCoordinates[i][1] === - 1) {
      ghostsCoordinates[i][1] = gridSize[1];
    }
    if (ghostsCoordinates[i][1] === gridSize[1] + 1) {
      ghostsCoordinates[i][1] = 0;
    }
  }
}

const drawPacMan = (): void => {
  playground[pacmanCoordinates[0]][pacmanCoordinates[1]] = pacman;
}

const drawGhostHouseGates = (): void => {
  for (const item of ghostHouseGateCoordinates) {
    playground[item[0]][item[1]] = ghostHouseGates;
  }
}

const drawRegularFood = (): void => {
  for (const item of regularFoodCoordinates) {
    playground[item[0]][item[1]] = regularFood;
  }
}

const drawSpecialFood = (): void => {
  for (const item of specialFoodCoordinates) {
    playground[item[0]][item[1]] = specialFood;
  }
}

const pacmanHandlerEatFood = (): void => {
  for (let i = 0; i < regularFoodCoordinates.length; i++) {
    if (pacmanCoordinates[0] === regularFoodCoordinates[i][0] && pacmanCoordinates[1] === regularFoodCoordinates[i][1]) {
      regularFoodCoordinates.splice(i, 1);
      score += 10;
    }
  }
}

const pacmanHandlerEatSpecialFood = (): void => {
  for (let i = 0; i < specialFoodCoordinates.length; i++) {
    if (pacmanCoordinates[0] === specialFoodCoordinates[i][0] && pacmanCoordinates[1] === specialFoodCoordinates[i][1]) {
      specialFoodCoordinates.splice(i, 1);
      score += 50;
      ghost = chalk.blue.bgBlackBright.bold("⍝");
      setTime = blueGhostTime;
    }
  }
}

const drawGhost = (): void => {
  for (const item of ghostsCoordinates) {
    playground[item[0]][item[1]] = ghost;
  }
}

const drawGhostMoves = (): void => {
  if (ghostsCoordinates[0][0] <= pacmanCoordinates[0]) {
    if (ghostsCoordinates[0][1] <= pacmanCoordinates[1]) {
      if (rightSideDownSquare === 1) {
        if (playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Up";
          rightSideDownSquare = 2;
        } else {
          ghostDirection = "Left";
        }
      } else {
        if (rightSideDownSquare !== 2 && playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Down";
        } else {
          if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] + 1] !== wall) {
            ghostDirection = "Right";
            rightSideDownSquare = 0;
          } else {
            if (rightSideDownSquare === 2 || playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
              if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] - 1] !== wall) {
                rightSideDownSquare = 1;
              } else {
                ghostDirection = "Up";
              }
            } else {
              ghostDirection = "Left";
              rightSideDownSquare = 1;
            }
          }
        }
      }
    }
    if (ghostsCoordinates[0][1] >= pacmanCoordinates[1]) {
      if (leftSideDownSquare === 1) {
        if (playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Up";
          leftSideDownSquare = 2;
        } else {
          ghostDirection = "Right";
        }
      } else {
        if (leftSideDownSquare !== 2 && playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Down";
        } else {
          if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] - 1] !== wall) {
            ghostDirection = "Left";
            leftSideDownSquare = 0;
          } else {
            if (leftSideDownSquare === 2 || playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
              if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] + 1] !== wall) {
                leftSideDownSquare = 1;
              } else {
                ghostDirection = "Up";
              }
            } else {
              ghostDirection = "Right";
              leftSideDownSquare = 1;
            }
          }
        }
      }
    }
  }
  if (ghostsCoordinates[0][0] >= pacmanCoordinates[0]) {
    if (ghostsCoordinates[0][1] <= pacmanCoordinates[1]) {
      if (rightSideUpSquare === 1) {
        if (playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Down";
          rightSideUpSquare = 2;
        } else {
          ghostDirection = "Left";
        }
      } else {
        if (rightSideUpSquare !== 2 && playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Up";
        } else {
          if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] + 1] !== wall) {
            ghostDirection = "Right";
            rightSideUpSquare = 0;
          } else {
            if (rightSideUpSquare === 2 || playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
              if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] - 1] !== wall) {
                rightSideUpSquare = 1;
              } else {
                ghostDirection = "Down";
              }
            } else {
              ghostDirection = "Left";
              rightSideUpSquare = 1;
            }
          }
        }
      }
    }
    if (ghostsCoordinates[0][1] >= pacmanCoordinates[1]) {
      if (leftSideUpSquare === 1) {
        if (playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Down";
          leftSideUpSquare = 2;
        } else {
          ghostDirection = "Right";
        }
      } else {
        if (leftSideUpSquare !== 2 && playground[ghostsCoordinates[0][0] - 1][ghostsCoordinates[0][1]] !== wall) {
          ghostDirection = "Up";
        } else {
          if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] - 1] !== wall) {
            ghostDirection = "Left";
            leftSideUpSquare = 0;
          } else {
            if (leftSideUpSquare === 2 || playground[ghostsCoordinates[0][0] + 1][ghostsCoordinates[0][1]] !== wall) {
              if (playground[ghostsCoordinates[0][0]][ghostsCoordinates[0][1] - 1] !== wall) {
                leftSideUpSquare = 1;
              } else {
                ghostDirection = "Down";
              }
            } else {
              ghostDirection = "Right";
              leftSideUpSquare = 1;
            }
          }
        }
      }
    }
  }
}

const drawGhostTurns = (): void => {
  for (let i = 0; i < ghostsCoordinates.length; i++) {
    if (ghostDirection === "Right") {
      if (playground[ghostsCoordinates[i][0]][ghostsCoordinates[i][1] + 1] !== wall) {
        ghostsCoordinates[i][1]++;
        playground[ghostsCoordinates[i][0]][ghostsCoordinates[i][1] - 1] = " ";
      }
    }
    if (ghostDirection === "Up") {
      if (playground[ghostsCoordinates[i][0] - 1][ghostsCoordinates[i][1]] !== wall) {
        ghostsCoordinates[i][0]--;
        playground[ghostsCoordinates[i][0] + 1][ghostsCoordinates[i][1]] = " ";
      }
    }
    if (ghostDirection === "Left") {
      if (playground[ghostsCoordinates[i][0]][ghostsCoordinates[i][1] - 1] !== wall) {
        ghostsCoordinates[i][1]--;
        playground[ghostsCoordinates[i][0]][ghostsCoordinates[i][1] + 1] = " ";
      }
    }
    if (ghostDirection === "Down") {
      if (playground[ghostsCoordinates[i][0] + 1][ghostsCoordinates[i][1]] !== wall) {
        ghostsCoordinates[i][0]++;
        playground[ghostsCoordinates[i][0] - 1][ghostsCoordinates[i][1]] = " ";
      }
    }
  }
}

const drawPacmanMeetGhost = (): void => {
  for (let i = 0; i < ghostsCoordinates.length; i++) {
    if (ghostsCoordinates[i][0] === pacmanCoordinates[0] && ghostsCoordinates[i][1] === pacmanCoordinates[1] && ghost !== chalk.blue.bgBlackBright.bold("⍝")) {
      lives--;
      score -= 200;
      pacmanCoordinates[0] = 9;
      pacmanCoordinates[1] = 20;
    } 
    if (ghostsCoordinates[i][0] === pacmanCoordinates[0] && ghostsCoordinates[i][1] === pacmanCoordinates[1] && ghost === chalk.blue.bgBlackBright.bold("⍝")) {
      score += 300;
      ghostsCoordinates[i][0] = 7;
      ghostsCoordinates[i][1] = 17;
      ghost = "⍝";
      setTime = 0;
    }
  }
}

const whenPacmanGetZeroLives = (): void => {
  if (lives === 0) {
    console.log(chalk.yellow.bold("Game Over!"));
    process.exit();
  }
}

const whenPacmanWin = (): void => {
  if (regularFoodCoordinates.length === 0 && specialFoodCoordinates.length === 0) {
    console.log(chalk.yellow.bold("You WIN! Wohhoo!!!!"));
    process.exit();
  }
}

const setTimer = () => {
  if (setTime !== 0) {
    setTime -= 1000 / FRAMES_PER_SECOND;
  } else {
    ghost = "⍝";
  }
}

export const draw = (direction: Direction) => {
  console.clear();
  console.log(chalk.blackBright.bgGreenBright.bold(` Score: ${score} | Lives: ${lives} `));

  drawPlayground();
  drawGhostHouseGates();
  drawRegularFood();
  drawSpecialFood();
  whenPacmanGetZeroLives();
  whenPacmanWin();
  drawPacManTurns(direction);
  pacmanGoTroughtTheTunel();
  ghostGoTroughtTheTunel();
  drawGhostMoves();
  drawGhostTurns();
  drawPacMan();
  drawGhost();
  pacmanHandlerEatFood();
  pacmanHandlerEatSpecialFood();
  drawPacmanMeetGhost();
  setTimer();
};