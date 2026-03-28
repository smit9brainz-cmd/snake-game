// Wait for the DOM to be fully loaded before starting the game
document.addEventListener("DOMContentLoaded", function() {
    // Get the game board element
    let board = document.querySelector(".board");
    let blockHeight = 50;
    let blockWidth = 50;
    
    // let score = document.querySelector(".score");
    // let highscore = document.querySelector(".high-score");

    // Calculate the number of rows and columns in the grid
    let rows = Math.floor(board.clientHeight / blockHeight);
    let colums = Math.floor(board.clientWidth / blockWidth);
    let intervalid = null;
    let timerIntervalid = null;
    let blocks = {};
    
    // Timer variables
    let elapsedTime = 0;
    let score = document.querySelector("#score");
    let highscore = document.querySelector("#highscore");
    let highscoretime = document.querySelector("#highscoretime");
    let timeDisplay = document.querySelector("#time");
    
    // Format time to MM:SS format
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Start the timer
    function startTimer() {
        elapsedTime = 0;
        timerIntervalid = setInterval(() => {
            elapsedTime++;
            timeDisplay.innerText = formatTime(elapsedTime);
        }, 1000);
    }
    
    // Stop the timer
    function stopTimer() {
        clearInterval(timerIntervalid);
    }
    
    // Get high score data from localStorage
    function getHighScoreData() {
        let data = localStorage.getItem("highScoreData");
        return data ? JSON.parse(data) : { score: 0, time: "00:00" };
    }
    
    // Load high score on page load
    function loadHighScore() {
        let data = getHighScoreData();
        highscore.innerText = data.score;
        highscoretime.innerText = data.score > 0 ? `(${data.time})` : '';
    }
    
    // Display high score with time info
    function displayHighScoreInfo() {
        let data = getHighScoreData();
        if (data.score > 0) {
            console.log(`High Score: ${data.score} achieved in ${data.time}`);
        }
    }
    
    // Initialize high score display
    loadHighScore();
    displayHighScoreInfo();

    // Initialize the snake with one segment
    let snake = [
        { x: 1, y: 2 }
    ];

    // Generate initial food position
    let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * colums) };

    // Initialize direction variable (required for movement)
    let direction = "right";

    // Create the game board grid with individual blocks
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < colums; j++) {
            let block = document.createElement("div");
            block.classList.add("block");
            // block.innerText = `${i} - ${j}`;
            board.appendChild(block);
            // Store block reference using grid coordinates as key
            blocks[`${i} - ${j}`] = block;
        }
    }

    // Handle keyboard input for snake direction
    addEventListener("keydown", (e) => {
        if (e.key == "ArrowLeft" && direction != "right") {
            direction = "left";
        } else if (e.key == "ArrowRight" && direction != "left") {
            direction = "right";
        } else if (e.key == "ArrowUp" && direction != "down") {
            direction = "up";
        } else if (e.key == "ArrowDown" && direction != "up") {
            direction = "down";
        }
    });

    // Generate a new random food position
    function generateFood() {
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * colums) };
    }

    // Main game rendering function
    function Render() {
        // Clear previous rendering before updating
        snake.forEach(segment => {
            blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
        });

        blocks[`${food.x} - ${food.y}`].classList.remove("food");

        // Calculate new head position based on direction
        let head = null;
        if (direction == "left") {
            head = { x: snake[0].x, y: snake[0].y - 1 };
        } else if (direction == "right") {
            head = { x: snake[0].x, y: snake[0].y + 1 };
        } else if (direction == "up") {
            head = { x: snake[0].x - 1, y: snake[0].y };
        } else if (direction == "down") {
            head = { x: snake[0].x + 1, y: snake[0].y };
        }

        // Check if snake hit the wall (game over)
        if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= colums) {
            stopTimer();
            alert("Game Over!");
            clearInterval(intervalid);
            return;
        }

        // Check if snake hit itself (game over)
        for (let segment of snake) {
            if (head.x == segment.x && head.y == segment.y) {
                stopTimer();
                alert("Game Over! You hit yourself!");
                clearInterval(intervalid);
                return;
            }
        }

        // Check if snake ate the food
        if (head.x == food.x && head.y == food.y) {
            // Keep the tail (snake grows) and generate new food
            snake.unshift(head);
            generateFood();
            score.innerText = parseInt(score.innerText) + 10; // Update score
        } else {
            // Move snake forward by removing tail
            snake.unshift(head);
            snake.pop();
        }

        if (parseInt(score.innerText) > parseInt(highscore.innerText)) {
            highscore.innerText = score.innerText;
            // Store high score with time achieved
            let highScoreData = {
                score: parseInt(score.innerText),
                time: formatTime(elapsedTime)
            };
            localStorage.setItem("highScoreData", JSON.stringify(highScoreData));
            highscoretime.innerText = `(${formatTime(elapsedTime)})`;
        } else {
            let data = getHighScoreData();
            highscore.innerText = data.score;
            highscoretime.innerText = data.score > 0 ? `(${data.time})` : '';
        }

        // Render updated snake on the board
        snake.forEach(segment => {
            blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
        });

        // Render food on the board
        blocks[`${food.x} - ${food.y}`].classList.add("food");
    }

    // Start the game loop - render every 300ms
    startTimer();
    intervalid = setInterval(() => {
        Render();
    }, 200);
});


