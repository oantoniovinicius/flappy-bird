console.log("Flappy Bird - Antonio Vinicius");

const hitSound = new Audio();
hitSound.src = "/resources/hit.wav";
const jumpSound = new Audio();
jumpSound.src = "/resources/jump.wav";

let frames = 0;
let birdFall = false;
let birdCrash = false;
let highScore = 0;

const sprites = new Image();
sprites.src = "/resources/sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const background = {
  //drawing the background
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  positionX: 0,
  positionY: canvas.height - 204,
  draw: function () {
    context.fillStyle = "#8DE7FF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.positionX,
      background.positionY,
      background.width,
      background.height
    );

    //completing the image
    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.positionX + background.width,
      background.positionY,
      background.width,
      background.height
    );
  },
};

function createFloor() {
  const floor = {
    //drawing the floor
    spriteX: 0, //sortX
    spriteY: 610, //sortY
    width: 224,
    height: 112,
    positionX: 0,
    positionY: canvas.height - 112,

    movement() {
      const floorMovement = 1;
      const repeat = floor.width / 2;
      const floorRepeat = floor.positionX - floorMovement;

      floor.positionX = floorRepeat % repeat;
    },
    draw: function () {
      context.drawImage(
        sprites, //image
        floor.spriteX,
        floor.spriteY, //sX and sY
        floor.width,
        floor.height, //width and height of the first image(bird)
        floor.positionX,
        floor.positionY, //initial position
        floor.width,
        floor.height
      );

      //completing the image
      context.drawImage(
        sprites, //image
        floor.spriteX,
        floor.spriteY, //sX and sY
        floor.width,
        floor.height, //width and height of the first image(bird)
        floor.positionX + floor.width,
        floor.positionY, //initial position
        floor.width,
        floor.height
      );
    },
  };
  return floor;
}

function collide(flappyBird, floor) {
  const flappyBirdY = flappyBird.positionY + flappyBird.height;
  const floorY = floor.positionY;

  if (flappyBirdY >= floorY) {
    return true;
  }

  return false;
}

function createFlappyBird() {
  const flappyBird = {
    //drawing the bird itself
    spriteX: 0, //sortX
    spriteY: 0, //sortY
    width: 32,
    height: 23,
    positionX: 10,
    positionY: 50,
    gravity: 0.15,
    speed: 0,
    jump: 4.4,

    falling() {
      if (collide(flappyBird, globals.floor)) {
        hitSound.play();
        birdFall = true;
        changeScreen(screens.gameOver);
        return;
      }
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.positionY = flappyBird.positionY + flappyBird.speed;
    },
    jumping() {
      flappyBird.speed = -flappyBird.jump;
      jumpSound.play();
    },
    movements: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
      { spriteX: 0, spriteY: 26 },
    ],
    currentFrame: 0,
    updateFrame() {
      const framesBreak = 10;
      const passedBreak = frames % framesBreak === 0;

      if (passedBreak) {
        const aux = 1;
        const increment = aux + flappyBird.currentFrame;
        const repeatBase = flappyBird.movements.length;
        flappyBird.currentFrame = increment % repeatBase;
      }
    },
    draw: function () {
      flappyBird.updateFrame();
      const { spriteX, spriteY } =
        flappyBird.movements[flappyBird.currentFrame];
      context.drawImage(
        sprites, //image
        spriteX,
        spriteY, //sX and sY
        flappyBird.width,
        flappyBird.height, //width and height of the first image(bird)
        flappyBird.positionX,
        flappyBird.positionY, //initial position
        flappyBird.width,
        flappyBird.height
      );
    },
  };
  return flappyBird;
}

function createPipes() {
  const pipes = {
    width: 52,
    height: 400,
    floor: {
      //pipe on the floor
      spriteX: 0,
      spriteY: 169,
    },
    sky: {
      //pipe in the sky
      spriteX: 52,
      spriteY: 169,
    },
    space: 90,
    draw() {
      //[Pipe in the sky]
      pipes.pairs.forEach(function (pair) {
        const randomY = pair.y;
        const between = 100;

        const pipeSkyX = pair.x;
        const pipeSkyY = randomY;
        context.drawImage(
          sprites,
          pipes.sky.spriteX,
          pipes.sky.spriteY,
          pipes.width,
          pipes.height,
          pipeSkyX,
          pipeSkyY,
          pipes.width,
          pipes.height
        );

        //[Pipe on the floor]
        const pipeFloorX = pair.x;
        const pipeFloorY = pipes.height + between + randomY;
        context.drawImage(
          sprites,
          pipes.floor.spriteX,
          pipes.floor.spriteY,
          pipes.width,
          pipes.height,
          pipeFloorX,
          pipeFloorY,
          pipes.width,
          pipes.height
        );

        pair.pipeSky = {
          x: pipeSkyX,
          y: pipes.height + pipeSkyY,
        };
        pair.pipeFloor = {
          x: pipeFloorX,
          y: pipeFloorY,
        };
      });
    },
    collideFlappyBird(pair) {
      const headFlappy = globals.flappyBird.positionY;
      const feetFlappy = globals.flappyBird.positionY + globals.flappyBird.height;

      if (globals.flappyBird.positionX + globals.flappyBird.width > pair.x) {
        if (headFlappy <= pair.pipeSky.y) {
          return true;
        }

        if (feetFlappy >= pair.pipeFloor.y) {
          return true;
        }
      }
      return false;
    },
    pairs: [],
    update() {
      const framesPassed = frames % 100 === 0;
      if (framesPassed) {
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      pipes.pairs.forEach(function (pair) {
        pair.x = pair.x - 2;

        if (pipes.collideFlappyBird(pair)) {
          birdCrash = true;
          hitSound.play();
          changeScreen(screens.gameOver);
        }

        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift();
        }
      });
    },
  };

  return pipes;
}

const menuGetReady = {
  sortX: 134,
  sortY: 0,
  width: 174,
  height: 152,
  positionX: canvas.width / 2 - 174 / 2,
  positionY: 50,

  draw() {
    context.drawImage(
      sprites,
      menuGetReady.sortX,
      menuGetReady.sortY,
      menuGetReady.width,
      menuGetReady.height,
      menuGetReady.positionX,
      menuGetReady.positionY,
      menuGetReady.width,
      menuGetReady.height
    );
  },
};
const menuGameOver = {
  sortX: 134,
  sortY: 153,
  width: 226,
  height: 200,
  positionX: canvas.width / 2 - 226 / 2,
  positionY: 50,

  draw() {
    context.drawImage(
      sprites,
      menuGameOver.sortX,
      menuGameOver.sortY,
      menuGameOver.width,
      menuGameOver.height,
      menuGameOver.positionX,
      menuGameOver.positionY,
      menuGameOver.width,
      menuGameOver.height
    );
  },
};

const bronzeCoin = {
  sortX: 48,
  sortY: 124,
  width: 44,
  height: 44,
  positionX: 72,
  positionY: 138,
  draw() {
    context.drawImage(
      sprites,
      bronzeCoin.sortX,
      bronzeCoin.sortY,
      bronzeCoin.width,
      bronzeCoin.height,
      bronzeCoin.positionX,
      bronzeCoin.positionY,
      bronzeCoin.width,
      bronzeCoin.height
    );
  },
};
const silverCoin = {
  sortX: 47,
  sortY: 78,
  width: 44,
  height: 44,
  positionX: 72,
  positionY: 138,
  draw() {
    context.drawImage(
      sprites,
      silverCoin.sortX,
      silverCoin.sortY,
      silverCoin.width,
      silverCoin.height,
      silverCoin.positionX,
      silverCoin.positionY,
      silverCoin.width,
      silverCoin.height
    );
  },
};
const goldCoin = {
  sortX: 0,
  sortY: 124,
  width: 44,
  height: 44,
  positionX: 72,
  positionY: 138,
  draw() {
    context.drawImage(
      sprites,
      goldCoin.sortX,
      goldCoin.sortY,
      goldCoin.width,
      goldCoin.height,
      goldCoin.positionX,
      goldCoin.positionY,
      goldCoin.width,
      goldCoin.height
    );
  },
};

function createScore() {
  const score = {
    initialScore: 0,
    finalScore: 0,
    draw() {
      context.font = "35px vt323";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.lineWidth = 3; //
      const scoreText = `Score: ${score.initialScore}`;
      const x = 10;
      const y = 35;
      context.strokeText(scoreText, x, y);
      context.fillText(scoreText, x, y);
    },
    drawFinalScore() {
      context.font = "30px vt323";
      context.fillStyle = "#faaa09";
      context.strokeStyle = "#cd993c";
      context.lineWidth = 3; //
      const finalScoreText = `${score.finalScore}`;
      const x = 218;
      const y = 145;
      context.strokeText(finalScoreText, x, y);
      context.fillText(finalScoreText, x, y);
    },
    update() {
      const framesBreak = 10;
      const framesPassed = frames % framesBreak === 0;

      if (framesPassed) {
        score.initialScore = score.initialScore + 1;
      }
      if (birdCrash == true || birdFall == true) {
        score.finalScore = score.initialScore;
      }
      if (score.finalScore > highScore) {
        highScore = score.finalScore;
      }
    },
    drawHighScore() {
      context.font = "30px vt323";
      context.fillStyle = "#faaa09";
      context.strokeStyle = "#cd993c";
      context.lineWidth = 3; //
      const highScoreText = `${highScore}`;
      const x = 218;
      const y = 185;
      context.strokeText(highScoreText, x, y);
      context.fillText(highScoreText, x, y);
    },
  };
  return score;
}

//Screens
const globals = {};
let onScreen = {};
function changeScreen(newScreen) {
  onScreen = newScreen;

  if (onScreen.initialize) {
    onScreen.initialize();
  }
}

const screens = {
  START: {
    initialize() {
      globals.floor = createFloor();
      globals.flappyBird = createFlappyBird();
      globals.pipes = createPipes();
    },
    draw() {
      background.draw();
      globals.flappyBird.draw();
      menuGetReady.draw();
      globals.floor.draw();
    },
    click() {
      changeScreen(screens.game);
    },
    update() {
      globals.floor.movement();
    },
  },
};

screens.game = {
  initialize() {
    globals.score = createScore();
  },
  draw() {
    background.draw();
    globals.pipes.draw();
    globals.floor.draw();
    globals.flappyBird.draw();
    globals.score.draw();
  },
  click() {
    globals.flappyBird.jumping();
  },
  update() {
    globals.floor.movement();
    globals.pipes.update();
    globals.flappyBird.falling();
    globals.score.update();
  },
};
screens.gameOver = {
  draw() {
    background.draw();
    globals.pipes.draw();
    globals.floor.draw();
    globals.flappyBird.draw();
    menuGameOver.draw();
    globals.score.drawFinalScore();
    globals.score.drawHighScore();

    if (globals.score.finalScore >= 100) {
      goldCoin.draw();
    }
    if (globals.score.finalScore >= 50 && globals.score.finalScore < 100) {
      silverCoin.draw();
    }
    if (globals.score.finalScore > 1 && globals.score.finalScore < 50) {
      bronzeCoin.draw();
    }
  },
  click() {
    changeScreen(screens.START);
  },
  update() {},
};
function loop() {
  onScreen.draw();
  onScreen.update();
  frames += 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (onScreen.click) {
    onScreen.click();
  }
});

changeScreen(screens.START);
loop();
