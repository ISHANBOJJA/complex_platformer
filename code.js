// Game Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const gravity = 0.5;
let keys = {};

// Player Object
const player = {
    x: 50,
    y: 400,
    width: 30,
    height: 50,
    color: "red",
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false,
    doubleJump: false,
    wallJumping: false,
    dashing: false,
    dashSpeed: 10,
    direction: 1 // 1 = right, -1 = left
};

// Platforms
const platforms = [
    { x: 0, y: 450, width: 800, height: 50 },  // Ground
    { x: 200, y: 350, width: 120, height: 10 },
    { x: 400, y: 280, width: 120, height: 10 },
    { x: 600, y: 200, width: 120, height: 10 }
];

// Enemies
const enemies = [
    { x: 300, y: 400, width: 30, height: 30, speed: 2, direction: 1 }
];

// Coins
const coins = [
    { x: 220, y: 320, collected: false },
    { x: 420, y: 250, collected: false },
    { x: 620, y: 170, collected: false }
];

// Key Input Handling
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = "brown";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw enemies
    ctx.fillStyle = "purple";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
        }
    });

    // Draw coins
    ctx.fillStyle = "gold";
    coins.forEach(coin => {
        if (!coin.collected) ctx.fillRect(coin.x, coin.y, 10, 10);
    });

    // Player Movement
    player.dx = 0;
    if (keys["ArrowRight"]) {
        player.dx = player.speed;
        player.direction = 1;
    }
    if (keys["ArrowLeft"]) {
        player.dx = -player.speed;
        player.direction = -1;
    }
    if (keys["ArrowUp"] && !player.jumping) {
        player.dy = -10;
        player.jumping = true;
    } else if (keys["ArrowUp"] && player.jumping && !player.doubleJump) {
        player.dy = -10;
        player.doubleJump = true;
    }
    if (keys["Shift"] && !player.dashing) {
        player.dashing = true;
        player.dx += player.dashSpeed * player.direction;
        setTimeout(() => player.dashing = false, 200);
    }

    // Apply Gravity
    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

    // Collision with platforms
    platforms.forEach(p => {
        if (player.y + player.height >= p.y && player.y + player.height - player.dy <= p.y && 
            player.x + player.width > p.x && player.x < p.x + p.width) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.jumping = false;
            player.doubleJump = false;
        }
    });

    // Collision with coins
    coins.forEach(coin => {
        if (!coin.collected && player.x < coin.x + 10 && player.x + player.width > coin.x &&
            player.y < coin.y + 10 && player.y + player.height > coin.y) {
            coin.collected = true;
        }
    });

    // Collision with enemies (game over)
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
            alert("Game Over!");
            resetGame();
        }
    });

    requestAnimationFrame(gameLoop);
}

// Reset Game
function resetGame() {
    player.x = 50;
    player.y = 400;
    coins.forEach(coin => coin.collected = false);
}

// Start Game
gameLoop();
