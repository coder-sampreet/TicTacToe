// Variables to keep track of game state
let music = new Audio("click.wav")
let music2  = new Audio("win.wav")
let music3 = new Audio("reset.wav")
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameover = false;

// Array of winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function to handle a move by a player
function makeMove(index) {
  if (!gameover && board[index] === '') {
    board[index] = currentPlayer;
    document.getElementsByClassName('boxtext')[index].innerText = currentPlayer;
    document.getElementsByClassName('box')[index].style.pointerEvents = 'none';
    document.getElementById('turnInfo').innerText = '---Turn for ' + (currentPlayer === 'X' ? 'O' : 'X') + '---';
    
    music.play();
    if (checkGameOver()) {
      gameover = true;
      setTimeout(showGameOverMessage, 500);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === 'O') {
        makeComputerMove();
      }
    }
  }
}

// Function to make a move by the computer
function makeComputerMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = currentPlayer;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  makeMove(bestMove);
}

// Minimax algorithm

function minimax(board, depth, isMaximizingPlayer) {
  if (checkGameOver()) {
    let result = evaluateBoard();
    return result === 'X' ? -1 : result === 'O' ? 1 : 0;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}



// Function to check if the game is over
function checkGameOver() {
  return checkWin() || checkDraw();
}

// Function to check if there is a winner
function checkWin() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
}

// Function to evaluate the current state of the board
function evaluateBoard() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return '';
}

// Function to check if the game is a draw
function checkDraw() {
  return !board.includes('');
}

// Function to display the game over message
function showGameOverMessage() {
  let message = '';
  if (checkWin()) {
    message = currentPlayer === 'X' ? 'You Win!' : 'Computer Wins!';
  } else if (checkDraw()) {
    message = 'It\'s a Draw!';
  }
   document.getElementById('turnInfo').innerText = message;

   music2.play();

  }

// Function to reset the game
function resetGame() {
  
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameover = false;
  let boxes = document.getElementsByClassName('box');
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.pointerEvents = 'auto';
    boxes[i].children[0].innerText = '';
  }
  document.getElementById('turnInfo').innerText = '---Turn for X---';
  music3.play();
}
