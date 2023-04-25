console.log('Flappy Bird - Antonio Vinicius');

const sprites = new Image();
sprites.src = '/img/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = { //drawing de background
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    positionX: 0,
    positionY: canvas.height - 204,
    draw: function() {
      context.fillStyle = '#8DE7FF';
      context.fillRect(0,0, canvas.width, canvas.height)
  
      context.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.width, background.height,
        background.positionX, background.positionY,
        background.width, background.height,
      );
  
      //completing the image
      context.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.width, background.height,
        (background.positionX + background.width), background.positionY,
        background.width, background.height,
      );
    },
};

const floor = { //drawing the floor
    spriteX: 0, //sortX
    spriteY: 610, //sortY
    width: 224,
    height: 112,
    positionX: 0,
    positionY: canvas.height - 112,

    draw: function() {
        context.drawImage(
            sprites, //image
            floor.spriteX, floor.spriteY, //sX and sY
            floor.width, floor.height, //width and height of the first image(bird)
            floor.positionX, floor.positionY, //initial position
            floor.width, floor.height,
        );

        //completing the image
        context.drawImage(
            sprites, //image
            floor.spriteX, floor.spriteY, //sX and sY
            floor.width, floor.height, //width and height of the first image(bird)
            (floor.positionX + floor.width), floor.positionY, //initial position
            floor.width, floor.height,
        );
    }
    
};

const flappyBird = { //drawing the bird itself
    spriteX: 0, //sortX
    spriteY: 0, //sortY
    width: 33,
    height: 24,
    positionX: 10,
    positionY: 50,

    draw: function() {
        context.drawImage(
            sprites, //image
            flappyBird.spriteX, flappyBird.spriteY, //sX and sY
            flappyBird.width, flappyBird.height, //width and height of the first image(bird)
            flappyBird.positionX, flappyBird.positionY, //initial position
            flappyBird.width, flappyBird.height,
        );
    }
}

function loop(){
    background.draw();
    floor.draw();
    flappyBird.draw();

    requestAnimationFrame(loop);
}

loop();