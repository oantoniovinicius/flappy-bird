console.log('Flappy Bird - Antonio Vinicius');

const sprites = new Image();
sprites.src = '/img/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


function loop(){
    context.drawImage(
        sprites, //image
        0, 0, //sX and sY
        33, 24, //width and height of the first bird
        10, 50,
        33, 24,
    );
    requestAnimationFrame(loop);
}

loop();