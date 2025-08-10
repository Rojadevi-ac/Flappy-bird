// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2 - birdHeight / 2;
let birdImg;

let bird = { x: birdX, y: birdY, width: birdWidth, height: birdHeight };

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // bird image
    birdImg = new Image();
    birdImg.src = "./assets/flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    // pipes images
    topPipeImg = new Image();
    topPipeImg.src = "./assets/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);

    // controls
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", handleJump);
    document.addEventListener("mousedown", handleJump);

    // responsive scaling
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // hide address bar on mobile
    setTimeout(() => window.scrollTo(0, 1), 0);
};

// shared jump/reset function
function handleJump() {
    velocityY = -6;

    // reset game if over
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
        velocityY = -6; // give an initial boost after reset
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // bird physics
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) gameOver = true;

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) gameOver = true;
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let toppipe = { img: topPipeImg, x: pipeX, y: randomPipeY, width: pipeWidth, height: pipeHeight, passed: false };
    pipeArray.push(toppipe);

    let bottompipe = { img: bottomPipeImg, x: pipeX, y: randomPipeY + pipeHeight + openingSpace, width: pipeWidth, height: pipeHeight, passed: false };
    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        handleJump();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function resizeCanvas() {
    let scale = Math.min(window.innerWidth / boardWidth, window.innerHeight / boardHeight);
    board.style.transform = `scale(${scale})`;
    board.style.transformOrigin = "center";
}
