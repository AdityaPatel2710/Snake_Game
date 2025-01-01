console.log("Connected Successfully!");


// <----- Initializing variables & events -----> //

let gameArena = document.getElementById('game-arena');
let scoreBoard = document.getElementById('score');
let startBtn = document.getElementById('start-btn');

let borderSize = 10;
let cellSize = 20;
let score = 0;
let gameStarted = false;
let arenaSize = gameArena.offsetWidth - (2 * borderSize);
let dx = 1;
let dy = 0;
let Y = Math.floor(arenaSize / (cellSize*2));  // center cordinate in Y-axis
let maxPos = (arenaSize/cellSize) - 1;
let snake = [{x:5, y:Y}, {x:4, y:Y}, {x:3, y:Y}];
let food = {x:maxPos+1, y:maxPos+1}  // initializing so we can use before calling drawFood()
let intervalId, foodElement;

startBtn.onclick = () => {
    startBtn.style.visibility = 'hidden';
    gameStarted = true;
    runTheGame();
    window.onkeydown = changeDirection;
}


// <----- Functions -----> //

function updateScoreBoard() {
    scoreBoard.textContent = `${score}`;
}


function fillCell(x, y, className) {
    let cell = document.createElement('div');
    cell.style.left = `${x*cellSize}px`;
    cell.style.top = `${y*cellSize}px`;
    cell.classList.add(className);
    gameArena.appendChild(cell);
    return cell;
}


function drawSnake() {
    // console.log("draw:", snake[0]);

    // removing old snake body
    let snakeCells = document.querySelectorAll('.snake');
    snakeCells.forEach(snakeCell => snakeCell.remove());

    // drawing new snake body
    snake.forEach((snakeCell) => { 
        fillCell(snakeCell.x, snakeCell.y, 'snake');
    })
}


function drawFood() {
    let newX, newY, rand;
    
    do {
        rand = Math.random();
        while(rand == 1) rand = Math.random();
        newX = Math.floor(rand * (maxPos+1));

        rand = Math.random();
        while(rand == 1) rand = Math.random();
        newY = Math.floor(Math.random() * (maxPos+1));
    } while(snake.some(snakeCell => (newX===snakeCell.x) && (newY===snakeCell.y)));

    food = {x:newX, y:newY};
    foodElement = fillCell(food.x, food.y, 'food');  // drawing food
}


function updateSnake() {
    let newHead = {x: (snake[0].x)+dx, y: (snake[0].y)+dy};
    snake.unshift(newHead);  // inserts at start
    // console.log("update:", newHead);

    if((newHead.x == food.x) && (newHead.y == food.y)) {
        // make sound of eating
        //change the speed
        score += 1;
        foodElement.remove();
        drawFood();
    }
    else snake.pop();  // removes from end
}


function isGameOver() {
    // check if snake hitting it's body
    for(let i=1; i<snake.length; i++) {
        if((snake[i].x == snake[0].x) && (snake[i].y == snake[0].y)) return true;
    }

    // check if snake hitting the wall
    let isHittingLeftWall = snake[0].x < 0;
    let isHittingRightWall = snake[0].x > maxPos;
    let isHittingTopWall = snake[0].y < 0;
    let isHittingDownWall = snake[0] > maxPos;

    return isHittingLeftWall || isHittingRightWall || isHittingTopWall || isHittingDownWall;
}


function changeDirection(event) {
    let keyPressed = event.code;
    
    let notGoingUp = (dy !== -1);
    let notGoingDown = (dy !== 1);
    let notGoingLeft = (dx !== -1);
    let notGoingRight = (dx !== 1);

    if((keyPressed == "ArrowUp") && notGoingDown) {dx = 0; dy = -1;}
    else if((keyPressed == "ArrowDown") && notGoingUp) {dx = 0; dy = 1;}
    else if((keyPressed == "ArrowLeft") && notGoingRight) {dx = -1; dy = 0;}
    else if((keyPressed == "ArrowRight") && notGoingLeft) {dx = 1; dy = 0;}
}


function runTheGame() {
    intervalId = setInterval(() => {
        if(isGameOver()) {
            // what to do after game over
            alert('Game Over!');
            clearInterval(intervalId);
            window.location.reload();
        }
        drawSnake();
        updateSnake();
        updateScoreBoard();
    }, 200);

    setTimeout(() => {
        drawFood();
    }, 2000);
}
