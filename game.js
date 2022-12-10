const GameBoard = (() => {
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getBoard = () => {
        return board
    }

    const getValueOfSquare = (row, column) => {
        return board[row][column];
    }

    const setValueOfSquare = (row, column, value) => {
        board[row][column] = value;
    }

    const clearBoard = () => {
        board = [["", "", ""], ["", "", ""], ["", "", ""]];
    }

    return{getBoard, getValueOfSquare, setValueOfSquare, clearBoard};

})();


const Player = (number) => {
    let score = 0;

    const incrementScore = () => {
        score+=1;
        document.getElementById(`player-${number}`).querySelector('.score').textContent = "score: " + score;

    }

    const makeMove = (row, column, value) => {
        if (GameBoard.getValueOfSquare(row, column) == "" && GameController.getEndGame()==false){
            GameBoard.setValueOfSquare(row, column, value);
            DisplayController.renderGameBoard();
            
            if (GameController.checkWin(GameBoard.getBoard(board))){
                DisplayController.endGame(`Player ${number} won!`);
                incrementScore();
                return;
            }

            if(GameController.checkDraw(board)){
                DisplayController.endGame(`It's a draw!`);
                return;
            }

            GameController.setCurrentPlayerTurn(number==1 ? 2 : 1);
            
        }
        
    }

    return {incrementScore, makeMove};
}


const GameController = (() => {
    const player1 = Player(1);
    const player2 = Player(2);
    let currentPlayerTurn = 1;
    let endGame = false;

    const setCurrentPlayerTurn = (player) => {
        currentPlayerTurn = player;
        DisplayController.indicateCurrentPlayerTurn();
    }

    const getCurrentPlayerTurn = () => {
        return currentPlayerTurn;
    }

    const setEndGame = (value) => {
        endGame = value;
    }

    const getEndGame = () => {
        return endGame;
    }

    const detectClick = (row, column) => {
        getCurrentPlayerTurn()==1 ? player1.makeMove(row, column, "x") : player2.makeMove(row, column, "o");
    }

    const checkRowWin = (board) => {
        for (i=0; i<3; i++){
            var winRow = true;
            var currentValue = board[i][0];
            for (j=0; j<3; j++){
                if (board[i][j] != currentValue){
                    winRow = false;
                    break;
                }
            }
            if (winRow && currentValue!=""){
                return true;
            }
        }
        return false;
    }

    const checkColumnWin = (board) => {
        for (j=0; j<3; j++){
            var winColumn = true;
            var currentValue = board[0][j];
            for (i=0; i<3; i++){
                if (board[i][j] != currentValue){
                    winColumn = false;
                    break;
                }
            }
            if (winColumn && currentValue!=""){
                return true;
            }
        }
        return false;
    }

    const checkDiagonalWin = (board) => {
        var winDiagonal = true;
        let currentValue = board[0][0];
        for (i=0; i<3; i++){
            if (board[i][i] != currentValue){
                winDiagonal = false;
                break;
            }
        }

        if (winDiagonal && currentValue!=""){
            return true;
        }

        winDiagonal = true;
        currentValue = board[0][2];
        for (i=0; i<3; i++){
            if (board[i][2-i] != currentValue){
                winDiagonal = false;
                break;
            }
        }

        if (winDiagonal && currentValue!=""){
            return true;
        }

        return false;
    }

    const checkWin = (board) => {
        if (checkRowWin(board) || checkColumnWin(board) || checkDiagonalWin(board)){
            return true;
        }
        return false;
    }
    

    const checkDraw = (board) => {
        for (i=0; i<3; i++){
            for (j=0; j<3; j++){
                if (board[i][j] == ""){
                    return false;
                }
            }
        }
        return true;
    }

    return{getCurrentPlayerTurn, setCurrentPlayerTurn, setEndGame, getEndGame, detectClick, checkRowWin, checkColumnWin, checkDiagonalWin, checkWin, checkDraw};

})();


const DisplayController = (() => {
    const startGame = () => {
        document.getElementById("game").style.display = "flex";
        document.getElementById("start-screen").style.display = "none";
        renderGameBoard();
        indicateCurrentPlayerTurn();
    }

    const renderGameBoard = () => {
        document.getElementById("board").remove();
        boardElement = document.createElement("table");
        boardElement.id = "board";
        document.getElementById("board-container").appendChild(boardElement);

        board = GameBoard.getBoard();
        boardElement = document.getElementById("board")
        for (i=0; i<3; i++){
            let row = document.createElement("tr");
            for (j=0; j<3; j++){
                let square = document.createElement("td");
                square.setAttribute("data-row", i);
                square.setAttribute("data-column", j);
                let value = document.createTextNode(board[i][j]);
                square.appendChild(value);
                square.addEventListener("click", (event) => GameController.detectClick(event.currentTarget.getAttribute('data-row'), event.currentTarget.getAttribute('data-column')));
                row.appendChild(square)
            }
            document.getElementById("board").appendChild(row)
        }
        
    }

    const indicateCurrentPlayerTurn = () => {
        let player = GameController.getCurrentPlayerTurn();
        document.getElementById(`player-${player}`).firstElementChild.style.border = "2px dashed rgb(195, 27, 15)";
        document.getElementById(`player-${player==1 ? 2 : 1}`).firstElementChild.style.border = "2px dashed rgba(195, 27, 15, 0)";
    }

    const endGame = (message) => {
        document.querySelector(".end-game-popup").textContent = message;
        document.querySelector(".end-game-popup-container").style.display = "block";
        GameController.setEndGame(true);
    }

    const restartGame = () => {
        GameBoard.clearBoard();
        renderGameBoard();
        document.querySelector(".end-game-popup-container").style.display = "none";
        GameController.setCurrentPlayerTurn(1);
        GameController.setEndGame(false);
    }

    return {startGame, renderGameBoard, indicateCurrentPlayerTurn, restartGame, endGame};
})();