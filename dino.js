











//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

//cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino.png?raw=true";
    
    cactus1Img = new Image();
    cactus1Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/cactus1.png?raw=true";

    cactus2Img = new Image();
    cactus2Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/cactus2.png?raw=true";

    cactus3Img = new Image();
    cactus3Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/cactus3.png?raw=true";

    dinoImg.onload = () => context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    
    if (gameOver) {
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = "black";
        context.font = "40px courier";
        context.fillText("Game Over!", boardWidth / 2 - 100, boardHeight / 2);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    
    // dino physics
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" || e.code === "ArrowUp") {
        if (dino.y === dinoY) { // Jump only if on the ground
            velocityY = -10;
        }
    }
}

function placeCactus() {
    if (gameOver) return;

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    }

    cactusArray.push(cactus);

    if (cactusArray.length > 5) {
        cactusArray.shift(); 
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
