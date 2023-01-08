var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

//Score
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

// Paddle
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

const missAudio = document.getElementById('miss');

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  missAudio.play();
}

function calculateMousePos(evt) {
  var react = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - react.left - root.scrollLeft;
  var mouseY = evt.clientY - react.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player2Score = 0;
    player1Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  console.log("Hello JS Games");
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 30;
  setInterval(function () {
    moveEverthing();
    drawSomething();
  }, 1000 / framesPerSecond);
  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverthing() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX < 0) {
    // ballSpeedX = -ballSpeedX;
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score += 1;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    // ballSpeedX = -ballSpeedX;
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score += 1; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawSomething() {
  // Background black
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!!!", 340, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Right Player Won!!!", 340, 200);
    }
    canvasContext.fillText("Click To Continue", 350, 500);
    return;
  }

  drawNet();
  // Draw paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );
  // Draw ball
  canvasContext.fillStyle = "white";
  canvasContext.beginPath();
  // Arg -> X-Position Y-Position Radius, Center, angle, Clockwise Bool
  colorCircle(ballX, ballY, 10, "white");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
  return;
}

function colorCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(x, y, w, h, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, w, h);
}