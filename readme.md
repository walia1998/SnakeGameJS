<p align="center">
  <b style="color: blue;  ">Visitor count</b>
  <br>
  <a style="" href="https://github.com/walia1998">
  <img src="https://profile-counter.glitch.me/wo/count.svg" />
  </a>
</p>

Initial setup 
```
const gameArea = document.getElementById('gameArea');
const gameSize = 400;
const cellSize = 20;
let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
let food = {x: 300, y: 200};
let dx = cellSize;
let dy = 0;
let score = 0;
let gameStarted = false;
```
* gameArea: This references the HTML element with the ID gameArea, where the game will be displayed.
* gameSize: The size of the game area, set to 400x400 pixels.
* cellSize: The size of each cell in the game grid, set to 20x20 pixels.
* snake: An array representing the snake. It starts with three segments, positioned horizontally at coordinates (160, 200), (140, 200), and (120, 200).
* food: An object representing the food, initially positioned at (300, 200).
* dx: The change in the snake's x-coordinate with each move, initially set to 20 pixels (rightward movement).
* dy: The change in the snake's y-coordinate with each move, initially set to 0 (no vertical movement).
* score: A variable to keep track of the player's score, starting at 0.
gameStarted: A boolean flag to indicate whether the game has started, initially set to false.


2. Audio setup
```
const eatSound = new Audio('./assets/eatSound.mp3');
eatSound.preload = 'auto';
const gameOverSound = new Audio('./assets/gameOver.mp3');
gameOverSound.preload = 'auto';
const startSound = new Audio('./assets/startGame.mp3');
startSound.preload = 'auto';
```
* Audio Objects: These lines create audio objects for three sound effects: eating (eatSound), game over (gameOverSound), and game start (startSound).
* preload: Setting preload to auto ensures that the audio files are loaded as soon as the game starts, reducing lag when the sounds need to be played.


3. Create A div Element 
```
function createDiv(className, x, y) {
    const div = document.createElement('div');
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.classList.add(className);
    return div;
}
```

* createDiv Function: This function creates a div element at the specified x and y coordinates, applies a CSS class (className) to it, and then returns the div. This function is used to create both the snake segments and the food.

4. Drawing the Game Elements
```
function draw() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = createDiv('snake', segment.x, segment.y);
        gameArea.appendChild(snakeElement);
    });
    const foodElement = createDiv('food', food.x, food.y);
    gameArea.appendChild(foodElement);
}
```

* draw Function: This function redraws the entire game area.
* gameArea.innerHTML = '': Clears the game area before drawing the new state.
* snake.forEach(segment => {...}): Loops through each segment of the snake, creating a div for each and appending it to the game area.
* createDiv('snake', segment.x, segment.y): Creates a div for each snake segment using the coordinates in the snake array.
* createDiv('food', food.x, food.y): Creates a div for the food at its current coordinates.


5. Updating the Snake's Position
```
function updateSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        moveFood();
    } else {
        snake.pop();
    }
}
```

* updateSnake Function: This function updates the snake's position and handles the snake eating the food.
* head: Calculates the new position of the snake's head based on the current direction (dx, dy).
* snake.unshift(head): Adds the new head position to the front of the snake array.
if (head.x === food.x && head.y === food.y): Checks if the snake's head is at the same position as the food.
* If true: The snake has eaten the food:
* The score is increased by 10.
* The eatSound is played.
* The moveFood function is called to place the food in a new location.
* If false: The snake didn't eat food, so the last segment (tail) is removed using snake.pop() to keep the snake the same length.

6. Moving the Food

```
function moveFood() {
    let newX, newY;
    do {
        newX = Math.floor(Math.random() * ((gameSize - cellSize) / cellSize)) * cellSize;
        newY = Math.floor(Math.random() * ((gameSize - cellSize) / cellSize)) * cellSize;
    } while (snake.some(segment => segment.x === newX && segment.y === newY));

    food = {x: newX, y: newY};
}
```

* moveFood Function: This function randomly places the food in a new location on the grid.
* Random Position Calculation:
* newX and newY are generated using Math.random() and Math.floor() to ensure they are multiples of cellSize and within the game area.
* Collision Check: The do...while loop ensures that the new food position does not overlap with any part of the snake (snake.some() checks each segment).
* food = {x: newX, y: newY}: The food's position is updated to the new coordinates.

7. Changing the Snake's Direction
```
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -cellSize;
    const goingDown = dy === cellSize;
    const goingRight = dx === cellSize;
    const goingLeft = dx === -cellSize;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -cellSize; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -cellSize; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = cellSize; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = cellSize; }
}
```

* changeDirection Function: This function handles the keyboard input to change the snake's direction.
* Arrow Key Codes: The constants (LEFT_KEY, RIGHT_KEY, etc.) store the key codes for the arrow keys.
* keyPressed = event.keyCode: Captures the key code of the pressed key.
* Direction Flags: Variables (goingUp, goingDown, etc.) are used to check the current direction of the snake.
* Direction Change Conditions:
* Each if statement checks if the pressed key is a valid direction change (e.g., you can't move left if you're already moving right).
* If valid, it updates dx and dy to change the snake's movement direction.


8. Checking for Game Over

```
function checkGameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gameSize;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gameSize;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}
```

* checkGameOver Function: This function determines if the game is over.
* Self-Collision Check: The for loop checks if the snake's head has collided with any part of its body (starting from the 5th segment to avoid immediate game over).
* Wall Collision Check: The next four lines check if the snake's head has moved outside the boundaries of

9. Game Loop
```
function gameLoop() {
    if (checkGameOver()) {
        gameOverSound.play();
        alert('Game Over. Score: ' + score);
        document.location.reload();
        return;
    }
    setTimeout(() => {
        updateSnake();
        draw();
        drawScore();
        gameLoop();
    }, 100);
}
```

* Purpose: The gameLoop function is the core of your game’s update mechanism. It continuously updates the game state, checks for game-over conditions, and redraws the game elements.

* Game Over Check:

  * if (checkGameOver()) { ... }: This checks if the game should end by calling the checkGameOver function.
* Actions: If the game is over:
 *  Play Sound: gameOverSound.play(); plays the game-over sound.
 * Alert: alert('Game Over. Score: ' + score); displays an alert with the final score.
 * Reload: document.location.reload(); reloads the page to restart the game.
 *Continue Loop:

   *setTimeout(() => { ... }, 100);: Sets up a delay before executing the game update code. This creates the game’s frame rate, with 100 milliseconds setting the delay between each frame (i.e., 10 frames per second).
* Update and Draw:
  * updateSnake(); updates the snake’s position.
  * draw(); redraws the game elements (snake and food).
  * drawScore(); updates the score display.
  * Recursive Call: gameLoop(); calls itself to continue the game loop.

  10. Drawing the Score
```
  function drawScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerHTML = 'Score: ' + score;
    }
}
```

* Purpose: The drawScore function updates the displayed score on the web page.

* Retrieve Element:

  * const scoreElement = document.getElementById('score');: Finds the HTML element with the ID score.
* Update Score:

  * if (scoreElement) { ... }: Checks if the score element exists.
scoreElement.innerHTML = 'Score: ' + score;: Updates the content of the score element to show the current score.

11. Starting the Game
```
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startSound.play();
       
            document.addEventListener('keydown', changeDirection);
            gameLoop(); // Start the game loop after the delay
    }
}
```

* Purpose: The startGame function initializes the game when triggered.

* Game Started Check:

* if (!gameStarted) { ... }: Checks if the game has not started yet.
Start Actions:

* gameStarted = true;: Sets the gameStarted flag to true to prevent multiple starts.
* startSound.play();: Plays the game-start sound.
* document.addEventListener('keydown', changeDirection);: Adds an event listener to handle keyboard input for changing the snake's direction.
gameLoop();: Calls the gameLoop function to start updating and drawing the game.

12. Setting Up the Game

```
function setupGame() {
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.classList.add('score');
    document.body.insertBefore(scoreElement, gameArea);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.classList.add('button');
    document.body.appendChild(startButton);
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        startGame();
    });
}
```
* Purpose: The setupGame function initializes the game’s UI elements and prepares the game for starting.

* Score Element:

* const scoreElement = document.createElement('div');: Creates a new div element for displaying the score.
* scoreElement.id = 'score';: Sets the ID of the div to score.
* scoreElement.classList.add('score');: Adds the score class for styling.
* document.body.insertBefore(scoreElement, gameArea);: Inserts the score element before the game area element in the document body.
* Start Button:

* const startButton = document.createElement('button');: Creates a new button element for starting the game.
* startButton.textContent = 'Start Game';: Sets the button text to "Start Game".
* startButton.classList.add('button');: Adds the button class for styling.
* document.body.appendChild(startButton);: Appends the start button to the document body.
* Button Click Event:
* startButton.addEventListener('click', () => { ... });: Adds an event listener to handle the button click.
* startButton.style.display = 'none';: Hides the start button after it’s clicked.
* startGame();: Calls the startGame function to initialize and start the game.