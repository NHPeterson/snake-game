"use strict";

var currentScore = 0;
var highScore = 0;
var gameX = 21;
var gameY = 21;
var directKey;
var directSnake;
var headX;
var headY;
var tailX;
var tailY;
var bodyX = [];
var bodyY = [];
var foodX;
var foodY;
var foodIcon = "&#9670;";
var gameRun;
var gameSpeed = 200;

window.onload = function() {
	document.getElementById("play").onclick = runGame;
	document.getElementById("up_button").onmousedown = function() {
		if (directSnake !== "down") { directKey = "ArrowUp"; }
	};
	document.getElementById("left_button").onmousedown = function() {
		if (directSnake !== "right") { directKey = "ArrowLeft"; }
	};
	document.getElementById("right_button").onmousedown = function() {
		if (directSnake !== "left") { directKey = "ArrowRight"; }
	};
	document.getElementById("down_button").onmousedown = function() {
		if (directSnake !== "up") { directKey = "ArrowDown"; }
	};
	document.onkeydown = function(e) {
		if (    (e.code === "ArrowUp" && directSnake !== "down")
			|| (e.code === "ArrowRight" && directSnake !== "left")
			|| (e.code === "ArrowDown" && directSnake !== "up")
			|| (e.code === "ArrowLeft" && directSnake !== "right")) {
			directKey = e.code;
		}
	};
	document.getElementById("food_color").oninput = foodColor;
	document.getElementById("game_speed").oninput = function(e) {
		gameSpeed = (5 - e.target.value) * 100;
	};
	if (!localStorage.getItem("snek_score")) {
		localStorage.setItem("snek_score", "0");
	} else {
		highScore = Number(localStorage.getItem("snek_score"));
		document.getElementById("highscore").innerHTML = highScore;
	}
	runGame();
}

function runGame() {
	// reset score
	currentScore = 0;
	document.getElementById("currentscore").innerHTML = currentScore;
	// remove old game
	var gameBoard = document.getElementById("gameboard");
	while (gameBoard.hasChildNodes()) { gameBoard.removeChild(gameBoard.firstChild); }
	// create new game
	var gameTable = document.createElement("table");
	gameBoard.appendChild(gameTable);
	for (var i = 0; i < gameY; i++) {
		var gameRow = document.createElement("tr");
		gameTable.appendChild(gameRow);
		for (var j = 0; j < gameX; j++) {
			var gameCell = document.createElement("td");
			gameRow.appendChild(gameCell);
		}
	}
	// reset snake
	directKey = "";
	directSnake = "";
	headX = Math.ceil((gameX - 1) / 2);
	headY = Math.ceil((gameY - 1) / 2);
	tailX = Math.ceil((gameX - 1) / 2);
	tailY = Math.ceil((gameY - 1) / 2);
	bodyX = [];
	bodyY = [];
	gameTable.rows[headY].cells[headX].setAttribute("class", "snake");
	// randomize food
	var food = function() {
		do {
			foodX = Math.floor(Math.random() * gameX);
			foodY = Math.floor(Math.random() * gameY);
		} while (gameTable.rows[foodY].cells[foodX].className === "snake")
		//gameTable.rows[foodY].cells[foodX].innerHTML = foodIcon;
		gameTable.rows[foodY].cells[foodX].setAttribute("class", "food");
		foodColor();
	};
	food();
	// start new interval
	if (gameRun) { clearInterval(gameRun); }
	gameRun = setInterval(function() {
		if (directKey) {
			// move snake every interval step
			switch (directKey) {
				case "ArrowUp":
					if (gameTable.rows[headY - 1] === undefined
						|| gameTable.rows[headY - 1].cells[headX].className === "snake") {
						endGame(0);
						return;
					} else {
						headY -= 1;
						directSnake = "up";
					}
					break;
				case "ArrowRight":
					if (gameTable.rows[headY].cells[headX + 1] === undefined
						|| gameTable.rows[headY].cells[headX + 1].className === "snake") {
						endGame(0);
						return;
					} else {
						headX += 1;
						directSnake = "right";
					}
					break;
				case "ArrowDown":
					if (gameTable.rows[headY + 1] === undefined
						|| gameTable.rows[headY + 1].cells[headX].className === "snake") {
						endGame(0);
						return;
					} else {
						headY += 1;
						directSnake = "down";
					}
					break;
				case "ArrowLeft":
					if (gameTable.rows[headY].cells[headX - 1] === undefined
						|| gameTable.rows[headY].cells[headX - 1].className === "snake") {
						endGame(0);
						return;
					} else {
						headX -= 1;
						directSnake = "left";
					}
					break;
			}
			gameTable.rows[headY].cells[headX].setAttribute("class", "snake");
			bodyX.push(headX);
			bodyY.push(headY);
			// if food is eaten, grow the tail
			if ((headX === foodX) && (headY === foodY)) {
				currentScore += 1;
				document.getElementById("currentscore").innerHTML = currentScore;
				if (currentScore > highScore) {
					highScore += 1;
					localStorage.setItem("snek_score", highScore);
					document.getElementById("highscore").innerHTML = highScore;
				}
				if (currentScore === (gameX * gameY - 1)) {
					endGame(1);
					return;
				}
				//gameTable.rows[foodY].cells[foodX].innerHTML = "";
				food();
			} else {
				gameTable.rows[tailY].cells[tailX].setAttribute("class", "");
				tailX = bodyX.shift();
				tailY = bodyY.shift();
			}
		}
	}, gameSpeed);
	var endGame = function(num) {
		clearInterval(gameRun);
		var endDiv = document.createElement("div");
		gameBoard.appendChild(endDiv);
		if (num === 1) {
			endDiv.setAttribute("id", "win");
			endDiv.innerHTML = "You win!";
		} else {
			endDiv.setAttribute("id", "lose");
			endDiv.innerHTML = "You lose!";
		}
	}
}

function foodColor() {
	document.querySelector(".food").style.setProperty("--clr", document.getElementById("food_color").value);
}
