import * as chalk from "chalk";

export type Direction = "Up" | "Right" | "Left" | "Down";
export const FRAMES_PER_SECOND = 5;

const playground: string[][] = [];
let snakeHead: string = "▸";
let currentDirection: Direction = "Right";
const apples: number[][] = [];
const bonusApples: number[][] = [];
let score: number = 0;
const addScore: number = 5;
const addBonusScore: number = 15;
const bonusFromScore: number = 50;
const randomBonusChance: number = 3;
let bonusRandom: number = 0;
let bonusCount: number = 0;
const tail: number[][] = [[2, 3], [2, 4], [2, 5]];
const lastTailParts: number[][] = [[2, 3]];
const gridSize: number[] = [14, 39];
const snakeHeadCoordinates: number[] = [2, 6];

for (let i = 0; i <= gridSize[0]; i++) {
  let line = "";
  for (let j = 0; j <= gridSize[1]; j++) {
    line += " ";
  }
  playground.push(line.split(''));
}

const drawSnakeTurns = (dir: Direction): void => {
  if (dir === "Right") {
    if (currentDirection === "Left") {
      snakeHead = "◂";
      currentDirection = "Left";
      snakeHeadCoordinates[1]--;
      tail.push([snakeHeadCoordinates[0], snakeHeadCoordinates[1] + 1]);
      tail.shift();
    } else {
      snakeHead = "▸";
      currentDirection = "Right";
      snakeHeadCoordinates[1]++;
      tail.push([snakeHeadCoordinates[0], snakeHeadCoordinates[1] - 1]);
      tail.shift();
    }
  }
  if (dir === "Up") {
    if (currentDirection === "Down") {
      snakeHead = "▾";
      currentDirection = "Down";
      snakeHeadCoordinates[0]++;
      tail.push([snakeHeadCoordinates[0] - 1, snakeHeadCoordinates[1]]);
      tail.shift();
    } else {
      snakeHead = "▴";
      currentDirection = "Up";
      snakeHeadCoordinates[0]--;
      tail.push([snakeHeadCoordinates[0] + 1, snakeHeadCoordinates[1]]);
      tail.shift();
    }
  }
  if (dir === "Left") {
    if (currentDirection === "Right") {
      snakeHead = "▸";
      currentDirection = "Right";
      snakeHeadCoordinates[1]++;
      tail.push([snakeHeadCoordinates[0], snakeHeadCoordinates[1] - 1]);
      tail.shift();
    } else {
      snakeHead = "◂";
      currentDirection = "Left";
      snakeHeadCoordinates[1]--;
      tail.push([snakeHeadCoordinates[0], snakeHeadCoordinates[1] + 1]);
      tail.shift();
    }
  }
  if (dir === "Down") {
    if (currentDirection === "Up") {
      snakeHead = "▴";
      currentDirection = "Up";
      snakeHeadCoordinates[0]--;
      tail.push([snakeHeadCoordinates[0] + 1, snakeHeadCoordinates[1]]);
      tail.shift();
    } else {
      snakeHead = "▾";
      currentDirection = "Down";
      snakeHeadCoordinates[0]++;
      tail.push([snakeHeadCoordinates[0] - 1, snakeHeadCoordinates[1]]);
      tail.shift();
    }
  }
}

const goThroughTheWalls = () => {
  if (snakeHeadCoordinates[0] === -1) {
    snakeHeadCoordinates[0] = gridSize[0];
  }
  if (snakeHeadCoordinates[0] === gridSize[0] + 1) {
    snakeHeadCoordinates[0] = 0;
  }
  if (snakeHeadCoordinates[1] === -1) {
    snakeHeadCoordinates[1] = gridSize[1];
  }
  if (snakeHeadCoordinates[1] === gridSize[1] + 1) {
    snakeHeadCoordinates[1] = 0;
  }
}

const drawSnake = (): void => {
  playground[snakeHeadCoordinates[0]][snakeHeadCoordinates[1]] = snakeHead;

  for (const item of tail) {
    playground[item[0]][item[1]] = "▪";
  }

  for (const item of lastTailParts) {
    playground[item[0]][item[1]] = " ";
  }
  lastTailParts.push([tail[0][0], tail[0][1]]);
  lastTailParts.shift();
}

const drawPlayground = (): void => {
  for (let i = 0; i < playground.length; i++) {
    let line = "";
    for (let j = 0; j < playground[i].length; j++) {
      line += playground[i][j] + " ";
    }
    console.log(chalk.white.bgBlackBright.bold(line));
  }
}
const placeBonusApples = () => {
  if (score % bonusFromScore === 0 && score !== 0 && bonusCount === 0) {
    bonusCount += 1;
    bonusRandom = Math.floor(Math.random() * randomBonusChance);
    if (bonusRandom < 1) {
      bonusApples.push([Math.floor(Math.random() * gridSize[0]), Math.floor(Math.random() * gridSize[1])]);
    }
  }
  if (score % bonusFromScore !== 0 && bonusCount !== 0) {
    bonusCount = 0;
  }
  for (const item of bonusApples) {
    playground[item[0]][item[1]] = "○";
  }
}

const placeRandomApples = (): void => {
  if (apples.length === 0) {
    const random = Math.floor(Math.random() * 3);
    for (let i = 0; i <= random; i++) {
      apples.push([Math.floor(Math.random() * gridSize[0]), Math.floor(Math.random() * gridSize[1])]);
    }
  }
  for (const item of apples) {
    playground[item[0]][item[1]] = "●";
  }

  placeBonusApples();
}

const handlerSnakeEatFood = (): void => {
  for (let i = 0; i < apples.length; i++) {
    if (snakeHeadCoordinates[0] === apples[i][0] && snakeHeadCoordinates[1] === apples[i][1]) {
      apples.splice(i, 1);
      tail.splice(1, 0, [tail[0][0], tail[0][1]]);
      score += addScore;
    }
  }

  for (let i = 0; i < bonusApples.length; i++) {
    if (snakeHeadCoordinates[0] === bonusApples[i][0] && snakeHeadCoordinates[1] === bonusApples[i][1]) {
      bonusCount = 0;
      bonusApples.splice(i, 1);
      let removed = tail.splice(1, 3);
      for (const item of removed) {
        playground[item[0]][item[1]] = " ";
      }
      score += addBonusScore;
    }
  }
}

const handlerRunInTail = (): void => {
  for (let i = 0; i < tail.length; i++) {
    if (tail[i][0] === snakeHeadCoordinates[0] && tail[i][1] === snakeHeadCoordinates[1]) {
      console.log(chalk.yellow("Game Over!"));
      process.exit();
    }
  }
}

export const draw = (direction: Direction): void => {
  console.clear();
  console.log(chalk.blackBright.bgGreenBright.bold(` Score: ${score} `));

  drawSnakeTurns(direction);
  goThroughTheWalls();
  drawSnake();
  drawPlayground();
  placeRandomApples();
  handlerSnakeEatFood();
  handlerRunInTail();
};