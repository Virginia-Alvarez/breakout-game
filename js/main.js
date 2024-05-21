'use strict'

//var
const board= document.getElementById('board');


//board

let widthBoard = 600; 
let heightBoard = 600;
let context;

//player

let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 90;

let player = {
    x : widthBoard/2 - playerWidth/2,
    y: heightBoard - playerHeight - 15,
    width : playerWidth,
    height: playerHeight,
    velocity: playerVelocityX
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
        ball.velocityY *= -1 //reverse direction
    }
    else if (ball.y <= 0 || (ball.x + ball.width) >= widthBoard){
        //if ball touches left or right of canvas
        ball.velocityX *= -1 //reverse direction
    }
    else if (ball.y + ball.height >= heightBoard){
        //game over. ball touch bottom of canvas
    }

    //bounce the ball off player paddle (detectcollision)

    if(topCollision(ball,player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1 // flip y direction up or down
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1 // flip X direction up or down
    }
}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > widthBoard);
}

function movePlayer(event){
    if(event.code == "ArrowLeft"){
        // player.x -= player.velocity;
        let newPosition = player.x - playerVelocityX;
        if(!outOfBounds(newPosition)){
            player.x = newPosition;
        }
    } 
    else if(event.code == "ArrowRight"){
        // player.x += playerVelocityX;
        let newPosition = player.x + playerVelocityX;
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
    return detectCollision(ball, block) && (block.x + block.height) >= ball.x
}

function rightCollision(ball, block) {  // a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x
}

function leftCollision(ball, block) {  // a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x
}


