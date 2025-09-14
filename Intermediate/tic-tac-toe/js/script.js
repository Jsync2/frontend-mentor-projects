// Game state
const gameState = {
    currentPlayer: 'X',
    gameMode: null, // 'cpu' or 'player'
    board: Array(9).fill(''),
    scores: {
        X: 0,
        O: 0,
        ties: 0
    },
    isPlayerX: true, // Tracks if human player is X
    gameActive: false,
    cpuThinking: false, // Prevents overlapping CPU moves
    // Add popup state storage
    originalPopupState: null
};

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// DOM Elements
const gameMode = document.getElementById('game-mode');
const gameBoard = document.getElementById('game-board');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resultPopup = document.getElementById('result-popup');
const overlay = document.querySelector('.overlay');
const turnIndicator = document.querySelector('.turn svg');

// Event Listeners
document.getElementById('pva').addEventListener('click', () => startGame('cpu'));
document.getElementById('pvp').addEventListener('click', () => startGame('player'));
document.querySelector('.top-menu button').addEventListener('click', showRestartConfirmation);
board.addEventListener('click', handleCellClick);

// Fixed popup event listeners
document.querySelector('#result-popup button:first-child').addEventListener('click', () => {
    if (resultPopup.dataset.mode === 'restart') {
        // Cancel restart - restore original popup content
        restoreOriginalPopupContent();
        hidePopup();
        resultPopup.dataset.mode = '';
    } else {
        quitGame();
    }
});

document.querySelector('#result-popup button:last-child').addEventListener('click', () => {
    if (resultPopup.dataset.mode === 'restart') {
        // Confirm restart
        resultPopup.dataset.mode = '';
        gameState.originalPopupState = null; // Clear stored state
        resetGame();
        hidePopup();
    } else {
        nextRound();
    }
});

// Mark selection
const markButtons = document.querySelectorAll('.mark-icons button');
markButtons.forEach(button => {
    button.addEventListener('click', () => {
        markButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        gameState.isPlayerX = button.id === 'default';
    });
});

function startGame(mode) {
    gameState.gameMode = mode;
    gameState.gameActive = true;
    gameState.cpuThinking = false;
    gameState.currentPlayer = 'X'; // Always start with X
    gameMode.style.display = 'none';
    gameBoard.style.display = 'flex';
    updateTurnIndicator();
    updateScoreLabels();
    
    // If CPU mode and player is O, CPU goes first
    if (mode === 'cpu' && !gameState.isPlayerX) {
        gameState.cpuThinking = true;
        setTimeout(makeCPUMove, 500);
    }
}

function handleCellClick(e) {
    const cell = e.target;
    if (!cell.classList.contains('cell') || cell.innerHTML || !gameState.gameActive) return;
    
    const index = parseInt(cell.dataset.index);
    
    // In CPU mode, only allow human moves on their turn
    if (gameState.gameMode === 'cpu') {
        const isPlayerTurn = (gameState.currentPlayer === 'X' && gameState.isPlayerX) || 
                            (gameState.currentPlayer === 'O' && !gameState.isPlayerX);
        if (!isPlayerTurn || gameState.cpuThinking) return;
    }
    
    makeMove(index);
    
    // Trigger CPU move if it's CPU mode, game is still active, and not CPU's turn yet
    if (gameState.gameMode === 'cpu' && gameState.gameActive && !gameState.cpuThinking) {
        const isCPUTurn = (gameState.currentPlayer === 'X' && !gameState.isPlayerX) || 
                         (gameState.currentPlayer === 'O' && gameState.isPlayerX);
        if (isCPUTurn) {
            gameState.cpuThinking = true;
            setTimeout(makeCPUMove, 500);
        }
    }
}

function makeMove(index) {
    if (gameState.board[index] || !gameState.gameActive) return;
    
    gameState.board[index] = gameState.currentPlayer;
    cells[index].innerHTML = '';
    cells[index].appendChild(createMarkSVG(gameState.currentPlayer));
    
    checkGameStatus();
    
    // Only switch turns and update indicator if game is still active
    if (gameState.gameActive) {
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
    }
    
    // Reset CPU thinking state
    gameState.cpuThinking = false;
}

function makeCPUMove() {
    // Safety checks
    if (!gameState.gameActive || gameState.gameMode !== 'cpu') {
        gameState.cpuThinking = false;
        return;
    }
    
    // Verify it's actually CPU's turn
    const isCPUTurn = (gameState.currentPlayer === 'X' && !gameState.isPlayerX) || 
                     (gameState.currentPlayer === 'O' && gameState.isPlayerX);
    
    if (!isCPUTurn) {
        gameState.cpuThinking = false;
        return;
    }
    
    const emptyCells = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex);
    } else {
        gameState.cpuThinking = false;
    }
}

function checkGameStatus() {
    // Check for winner
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            endGame(gameState.board[a]);
            return;
        }
    }
    // Check for tie
    if (!gameState.board.includes('')) {
        endGame('tie');
        return;
    }
}

function endGame(result) {
    gameState.gameActive = false;
    gameState.cpuThinking = false;

    cells.forEach(cell => cell.style.backgroundColor = '');

    if (result === 'tie') {
        gameState.scores.ties++;
        showResult('ROUND TIED!', '');
    } else {
        gameState.scores[result]++;
        highlightWinningCombo(result);
        const isPlayerWin = (result === 'X' && gameState.isPlayerX) || 
                           (result === 'O' && !gameState.isPlayerX);
        
        const playerMessage = gameState.gameMode === 'cpu' 
            ? (isPlayerWin ? 'YOU WON!' : 'OH NO, YOU LOST!') 
            : `PLAYER ${isPlayerWin === gameState.isPlayerX ? '2' : '1'} WINS!`;
            
        showResult(playerMessage, result);
    }
    updateScores();
}

function showResult(message, winner) {
    // Set message
    resultPopup.querySelector('h2').textContent = winner ? 'TAKES THE ROUND' : message;
    resultPopup.querySelector('p').textContent = message;
    
    // Handle result icon display
    const resultIconH2 = resultPopup.querySelector('.result-icon h2');
    const resultIconSVG = resultPopup.querySelector('.result-icon svg');
    
    if (winner) {
        // Show winner icon
        resultIconH2.style.display = "";
        resultIconSVG.style.display = "";
        resultIconSVG.innerHTML = '';
        const winnerPath = createMarkSVG(winner).querySelector('path');
        resultIconSVG.appendChild(winnerPath.cloneNode(true));
    } else {
        // Hide icon for ties
        resultIconH2.style.display = "none";
        resultIconSVG.style.display = "none";
    }
    
    // Reset button text to default
    const buttons = resultPopup.querySelectorAll('button');
    buttons[0].textContent = 'QUIT';
    buttons[1].textContent = 'NEXT ROUND';
    
    showPopup();
}

function nextRound() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X'; // Always start with X
    gameState.gameActive = true;
    gameState.cpuThinking = false;
    
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.backgroundColor = ''; // Clear highlight
        cell.style.boxShadow = '';
    });
    hidePopup();
    updateTurnIndicator();
    updateScoreLabels();
    
    // If CPU mode and player is O, CPU goes first
    if (gameState.gameMode === 'cpu' && !gameState.isPlayerX) {
        gameState.cpuThinking = true;
        setTimeout(makeCPUMove, 500);
    }
}

function quitGame() {
    gameState.scores = { X: 0, O: 0, ties: 0 };
    gameState.cpuThinking = false;
    gameState.originalPopupState = null; // Clear any stored popup state
    gameBoard.style.display = 'none';
    gameState.gameActive = false;
    gameMode.style.display = 'flex';
    updateScoreLabels();
    updateScores();
    hidePopup();
    resetGame();
}

function resetGame() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X';
    cells.forEach(cell => cell.innerHTML = '');
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.backgroundColor = ''; // Clear highlight
        cell.style.boxShadow = '';
    });
    makeCPUMove();
    updateTurnIndicator();
}

// Fixed restart confirmation function
function showRestartConfirmation() {
    // Store current popup content before modifying it
    storeOriginalPopupContent();
    
    const buttons = resultPopup.querySelectorAll('button');
    
    // Modify popup content
    resultPopup.querySelector('p').textContent = 'RESTART GAME?';
    
    // Hide result icon
    resultPopup.querySelector('.result-icon h2').style.display = "none";
    resultPopup.querySelector('.result-icon svg').style.display = "none";
    
    // Update button text
    buttons[0].textContent = 'NO, CANCEL';
    buttons[1].textContent = 'YES, RESTART';
    
    resultPopup.dataset.mode = 'restart';
    showPopup();
}

// New helper function to store original popup content
function storeOriginalPopupContent() {
    const buttons = resultPopup.querySelectorAll('button');
    gameState.originalPopupState = {
        h2Text: resultPopup.querySelector('h2').textContent,
        pText: resultPopup.querySelector('p').textContent,
        iconH2Display: resultPopup.querySelector('.result-icon h2').style.display,
        iconSVGDisplay: resultPopup.querySelector('.result-icon svg').style.display,
        iconSVGContent: resultPopup.querySelector('.result-icon svg').innerHTML,
        button1Text: buttons[0].textContent,
        button2Text: buttons[1].textContent
    };
}

// New helper function to restore original popup content
function restoreOriginalPopupContent() {
    if (!gameState.originalPopupState) return;
    
    const buttons = resultPopup.querySelectorAll('button');
    const state = gameState.originalPopupState;
    
    // Restore all original content
    resultPopup.querySelector('h2').textContent = state.h2Text;
    resultPopup.querySelector('p').textContent = state.pText;
    resultPopup.querySelector('.result-icon h2').style.display = state.iconH2Display;
    resultPopup.querySelector('.result-icon svg').style.display = state.iconSVGDisplay;
    resultPopup.querySelector('.result-icon svg').innerHTML = state.iconSVGContent;
    buttons[0].textContent = state.button1Text;
    buttons[1].textContent = state.button2Text;
}

// Helper functions for popup management
function showPopup() {
    resultPopup.style.display = 'flex';
    overlay.style.display = 'block';
}

function hidePopup() {
    resultPopup.style.display = 'none';
    overlay.style.display = 'none';
}

function updateScores() {
    const scoreElements = document.querySelectorAll('.score strong');
    scoreElements[0].textContent = gameState.scores.X;
    scoreElements[1].textContent = gameState.scores.ties;
    scoreElements[2].textContent = gameState.scores.O;
}

function updateTurnIndicator() {
    if (gameState.gameActive) {
        turnIndicator.innerHTML = '';
        turnIndicator.appendChild(createMarkSVG(gameState.currentPlayer));
    }
}

function updateScoreLabels() {
    const scoreLabels = document.querySelectorAll('.score p');
    if (gameState.gameMode === 'cpu') {
        scoreLabels[0].textContent = `X (${gameState.isPlayerX ? 'YOU' : 'CPU'})`;
        scoreLabels[2].textContent = `O (${gameState.isPlayerX ? 'CPU' : 'YOU'})`;
    } else {
        scoreLabels[0].textContent = `X (${gameState.isPlayerX ? 'P1' : 'P2'})`;
        scoreLabels[2].textContent = `O (${gameState.isPlayerX ? 'P2' : 'P1'})`;
    }
}
// Highlight winning cells with background colors
function highlightWinningCombo(winner) {
    // Define colors: teal for X, yellow for O
    const colors = { 
        X: '#31C3BD',  // Teal
        O: '#F2B137'   // Yellow
    };
    const shadows = {
        X: '0 4px hsl(178, 75%, 25%)',  // Teal glow shadow
        O: '0 4px hsl(39, 100%, 39%)'   // Yellow glow shadow
    };
    
    // Find the winning combination
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameState.board[a] === winner && 
            gameState.board[b] === winner && 
            gameState.board[c] === winner) {
            
            // Highlight the winning cells with background color
            cells[a].style.backgroundColor = colors[winner];
            cells[b].style.backgroundColor = colors[winner];
            cells[c].style.backgroundColor = colors[winner];
            
            // Change the SVG fill color to gray for better contrast
            const winningCells = [cells[a], cells[b], cells[c]];
            winningCells.forEach(cell => {
                cell.style.backgroundColor = colors[winner];
                cell.style.boxShadow = shadows[winner];
                
                // Change SVG to gray for better contrast
                const svgPath = cell.querySelector('svg path');
                if (svgPath) {
                    svgPath.style.fill = '#1F3641';
                }
            });
            break; // Only one winning combo possible
        }
    }
}
function createMarkSVG(mark) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("viewBox", "0 0 64 64");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    if (mark === 'X') {
        path.setAttribute("d", "M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z");
        path.setAttribute("fill", "#31C3BD");
    } else {
        path.setAttribute("d", "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z");
        path.setAttribute("fill", "#F2B137");
    }
    
    svg.appendChild(path);
    return svg;
}
