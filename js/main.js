'use strict'

//var
const board= document.getElementById('board');


//board

let widthBoard = 500; 
let heightBoard = 500;
let context;

//player

let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 20;

let player = {
    x : widthBoard/2 - playerWidth/2,
    y: heightBoard - playerHeight - 15,
    width : playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

//ball

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: widthBoard/2,
    y: heightBoard/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

//blocks

let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows= 3;  // add more as game goes on
let blockMaxRows= 10;
let blockCount = 0;  // for how many blocks remain

//satrting block corner top left

let blockX = 15;
let blockY = 45;


window.onload = function (){
    board;
    board.height = heightBoard;
    board.width = widthBoard;
    context = board.getContext("2d"); // used for drawing on the board

    //draw inital player
    context.fillStyle = "mediumaquamarine";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

   //create blocks
    createBlocks();
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0, board.width, board.height);

    //player
    context.fillStyle = "mediumaquamarine";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "black";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // bounce ball off walls
    if(ball.y <= 0){
        //if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x < 0 || (ball.x + ball.width) >= widthBoard){
        //if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= heightBoard){
        //game over. ball touch bottom of canvas
    }

    //bounce the ball off player paddle (detectcollision)

    if(topCollision(ball,player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1; // flip y direction up or down
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1; // flip X direction up or down
    }

    //blocks

    context.fillStyle = "mediumaquamarine";
    for (let i=0; i < blockArray.length; i++){
        let block = blockArray[i];
        if(!block.break){
            if(topCollision(ball, block)|| bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)){
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > widthBoard);
}

function movePlayer(event){
    if(event.code == "ArrowLeft"){
        // player.x -= player.velocity;
        let newPosition = player.x - player.velocityX;
        if(!outOfBounds(newPosition)){
            player.x = newPosition;
        }
    } 
    else if(event.code == "ArrowRight"){
        // player.x += playerVelocityX;
        let newPosition = player.x + player.velocityX;
        if(!outOfBounds(newPosition)){
            player.x = newPosition;
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && // a's top right corner passes b's top left corner
        a.y < b.y + b.height && // a's bottom left corner passes b's top left corner
        a.y + a.height > b.y // a's bottom left corner passes b's top left corner.
}

function topCollision(ball, block) {  // a is above b (ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y
}

function bottomCollision(ball, block) {  // a is below b (ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y
}

function rightCollision(ball, block) {  // a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x
}

function leftCollision(ball, block) {  // a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x
}

function createBlocks(){
    blockArray = []; // clear blockArray
    for (let i=0; i < blockColumns; i++ ){
        for (let j=0; j < blockRows; j++){
            let block = {
                x: blockX + i*blockWidth + i*10, // i*10 space 10 pixels apart columns
                y: blockY + j*blockHeight + j*10, 
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}
