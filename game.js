const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 20;
const playerSize = 30;
const playerSpeed = 8;
const bulletSize = 5;

let playerX = canvas.width / 2;
let bullets = [];
let debris = [];
let score = 0;
let isGameOver = false;
let leaderboard = [];

function drawPlayer() {
    ctx.fillStyle = "orange";
    ctx.fillRect(playerX - playerSize / 2, canvas.height - playerSize, playerSize, playerSize);
}

function drawBullets() {
    ctx.fillStyle = "black";
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x - bulletSize / 2, bullet.y - bulletSize / 2, bulletSize, bulletSize);
    }
}

function drawDebris() {
    ctx.fillStyle = "red";
    for (let deb of debris) {
        ctx.fillRect(deb.x - blockSize / 2, deb.y - blockSize / 2, blockSize, blockSize);
    }
}

function movePlayer(event) {
    if (!isGameOver) {
        if (event.key === "ArrowLeft" && playerX > playerSize / 2) {
            playerX -= playerSpeed;
        } else if (event.key === "ArrowRight" && playerX < canvas.width - playerSize / 2) {
            playerX += playerSpeed;
        } else if (event.key === " " && !isGameOver) {
            createBullet();
        }
    }
}

function createBullet() {
    const bullet = {
        x: playerX,
        y: canvas.height - playerSize,
        speed: 5
    };
    bullets.push(bullet);
}

function createDebris() {
    if (!isGameOver) {
        const deb = {
            x: Math.random() * canvas.width,
            y: 0,
            speed: 2
        };
        debris.push(deb);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawDebris();

    if (!isGameOver) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= bullets[i].speed;
            if (bullets[i].y < 0) {
                bullets.splice(i, 1);
            } else {
                for (let j = debris.length - 1; j >= 0; j--) {
                    if (Math.abs(bullets[i].x - debris[j].x) < blockSize / 2 &&
                        Math.abs(bullets[i].y - debris[j].y) < blockSize / 2) {
                        debris.splice(j, 1);
                        bullets.splice(i, 1);
                        score += 10;
                        break;
                    }
                }
            }
        }

        for (let i = debris.length - 1; i >= 0; i--) {
            debris[i].y += debris[i].speed;
            if (debris[i].y > canvas.height) {
                debris.splice(i, 1);
            } else if (Math.abs(debris[i].x - playerX) < playerSize / 2 &&
                Math.abs(debris[i].y - canvas.height + playerSize / 2) < blockSize / 2) {
                gameOver();
            }
        }
    }

    document.getElementById("score").innerText = score;

    requestAnimationFrame(update);
}

function updateLeaderboard() {
    leaderboard.push(score);
    leaderboard = [...new Set(leaderboard)];
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 3);

    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = "";
    leaderboard.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = "Score " + (index + 1) + ": " + item;
        leaderboardList.appendChild(listItem);
    });
}

function gameOver() {
    isGameOver = true;
    updateLeaderboard();
    document.getElementById("restartButton").style.display = "block";
}

function restartGame() {
    isGameOver = false;
    score = 0;
    bullets = [];
    debris = [];
    playerX = canvas.width / 2;
    updateLeaderboard();
    document.getElementById("restartButton").style.display = "none";
}

document.addEventListener("keydown", movePlayer);

setInterval(createDebris, 1000);

update();
