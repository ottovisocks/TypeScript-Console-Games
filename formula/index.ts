import * as keypress from "keypress";
import * as chalk from "chalk";
import { Direction, FRAMES_PER_SECOND, draw } from "./game";

keypress(process.stdin);
process.stdin.setRawMode(true);

const start = (draw: (direction: Direction) => void) => {
  // prompts is blocking ctrl+c event, so let's listen for it manually
  process.stdin.on("keypress", (_str, key) => {
    if (key.ctrl && key.name === "c" || key.name === "space") {
      console.log(chalk.yellow("Bye!"));
      process.exit();
    }
  });

  let direction: Direction = "Stop"; // 

  process.stdin.on("keypress", function (_ch, key) {
    switch (key.name) {
      case "up":
        direction = "Up";
        setTimeout(function(){ direction = "Stop";}, 110);
        break;
      case "right":
        direction = "Right";
        setTimeout(function(){ direction = "Stop";}, 110);
        break;
      case "left":
        direction = "Left";
        setTimeout(function(){ direction = "Stop";}, 110);
        break;
      case "down":
        direction = "Down";
        setTimeout(function(){ direction = "Stop";}, 110);
        break;
      default:
        direction = "undefined";
        break;
    }
  });

  setInterval(() => draw(direction), 1000 / FRAMES_PER_SECOND);
};

start(draw);
