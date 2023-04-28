console.log('Flappy Bird - Antonio Vinicius');

const hitSound = new Audio();
hitSound.src = '/resources/hit.wav'; 

let frames = 0;

const sprites = new Image();
sprites.src = '/resources/sprites.png';

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
}

function createFloor(){
    const floor = { //drawing the floor
        spriteX: 0, //sortX
        spriteY: 610, //sortY
        width: 224,
        height: 112,
        positionX: 0,
        positionY: canvas.height - 112,
    
        movement(){
            const floorMovement = 1;
            const repeat = floor.width / 2;
            const floorRepeat = floor.positionX - floorMovement;

            floor.positionX = floorRepeat % repeat;
        },
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

    }
    return floor;
}

function collide(flappyBird, floor) {
    const flappyBirdY = flappyBird.positionY + flappyBird.height;
    const floorY = floor.positionY;

    if(flappyBirdY >= floorY) {
        return true;
    }

    return false;
}

function createFlappyBird(){
    const flappyBird = { //drawing the bird itself
        spriteX: 0, //sortX
        spriteY: 0, //sortY
        width: 33,
        height: 24,
        positionX: 10,
        positionY: 50,
        gravity:0.15,
        speed:0,
        jump:4.6,
    
        falling(){
            if(collide(flappyBird, globals.floor)){
                hitSound.play();
                setTimeout(() => {
                    changeScreen(screens.START);
                },500);
                return;
            }
            flappyBird.speed = flappyBird.speed + flappyBird.gravity;
            flappyBird.positionY = flappyBird.positionY + flappyBird.speed;
        },
        jumping(){
            console.log('pulei');
            flappyBird.speed = - flappyBird.jump;
        },
        movements: [
            { spriteX: 0, spriteY: 0, }, 
            { spriteX: 0, spriteY: 26, }, 
            { spriteX: 0, spriteY: 52, }, 
            { spriteX: 0, spriteY: 26, }, 
        ],
        currentFrame:0,
        updateFrame(){
            const framesBreak = 10;
            const passedBreak = frames % framesBreak === 0;
            
            if(passedBreak){
                const aux = 1;
                const increment = aux + flappyBird.currentFrame;
                const repeatBase = flappyBird.movements.length;
                flappyBird.currentFrame = increment % repeatBase;
            }
        },
        draw: function() {
            flappyBird.updateFrame();
            const { spriteX, spriteY } = flappyBird.movements[flappyBird.currentFrame];
            context.drawImage(
                sprites, //image
                spriteX, spriteY, //sX and sY
                flappyBird.width, flappyBird.height, //width and height of the first image(bird)
                flappyBird.positionX, flappyBird.positionY, //initial position
                flappyBird.width, flappyBird.height,
            );
        }
    }
    return flappyBird;
}

const menuGetReady = {
    sortX: 134,
    sortY: 0,
    width: 174,
    height: 152,
    positionX: (canvas.width/2) - 174/2,
    positionY:50,

    draw(){
        context.drawImage(
            sprites,
            menuGetReady.sortX, menuGetReady.sortY,
            menuGetReady.width, menuGetReady.height,
            menuGetReady.positionX, menuGetReady.positionY,
            menuGetReady.width, menuGetReady.height
        );
    }
}

//Screens
const globals = {};
let onScreen = {};
function changeScreen(newScreen){
    onScreen = newScreen;
    
    if(onScreen.initialize){
        onScreen.initialize();
    }
};

const screens = {
    START:{
        initialize(){
            globals.flappyBird = createFlappyBird();
            globals.floor = createFloor();
        },
        draw(){
            background.draw();
            globals.flappyBird.draw();
            globals.floor.draw();
            menuGetReady.draw();
        },
        click(){
            changeScreen(screens.game);
        },
        update(){
            globals.floor.movement();
        }
    }
};

screens.game = {
    draw(){
        background.draw();
        globals.floor.draw();
        globals.flappyBird.draw();
    },
    click(){
        globals.flappyBird.jumping();
    },
    update(){
        globals.floor.movement();
        globals.flappyBird.falling();
    }
};
function loop(){
    onScreen.draw();
    onScreen.update();

    frames += 1;

    requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
    if(onScreen.click){
        onScreen.click();
    }
});

changeScreen(screens.START);
loop();