var board,
    game = new Chess();
  
/*
 * The sense-chess part starts here 
 * It is a project at HfG Schwäbisch Gmünd in summer semester 2018.
 */

// declare important variables and objects for sense-chess 
statusEl = $('#status'),
fenEl = $('#fen'),
pgnEl = $('#pgn');

var SQUARESbestMOVE = {
    0:   "a8", 1:   "b8", 2:   "c8", 3:   "d8", 4:   "e8", 5:   "f8", 6:   "g8", 7:   "h8",
    16:  "a7", 17:  "b7", 18:  "c7", 19:  "d7", 20:  "e7", 21:  "f7", 22:  "g7", 23:  "h7",
    32:  "a6", 33:  "b6", 34:  "c6", 35:  "d6", 36:  "e6", 37:  "f6", 38:  "g6", 39:  "h6",
    48:  "a5", 49:  "b5", 50:  "c5", 51:  "d5", 52:  "e5", 53:  "f5", 54:  "g5", 55:  "h5",
    64:  "a4", 65:  "b4", 66:  "c4", 67:  "d4", 68:  "e4", 69:  "f4", 70:  "g4", 71:  "h4",
    80:  "a3", 81:  "b3", 82:  "c3", 83:  "d3", 84:  "e3", 85:  "f3", 86:  "g3", 87:  "h3",
    96:  "a2", 97:  "b2", 98:  "c2", 99:  "d2", 100: "e2", 101: "f2", 102: "g2", 103: "h2",
    112: "a1", 113: "b1", 114: "c1", 115: "d1", 116: "e1", 117: "f1", 118: "g1", 119: "h1"
};
var PLAYERbestMOVE = {p : 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king'};
var bestMoveAsString = "";
var previousResponse = "";

// update website in milliseconds
setInterval(updateLatestEntry, 5000);

// functions we need for sense-chess
var updateByCode = function() {
    var from = document.querySelector('#from').value;
    var to = document.querySelector('#to').value;
    if(!checkmove(from, to)){
        console.log("wrong move");
        return;
    }
    var move = game.move({
        from: from,
        to: to,
        promotion: 'q'
    });
    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    renderMoveHistory(game.history());
    board.position(game.fen());
};

var updateByDatabase = function(source, target) {
    console.log(source);
    console.log(target);
    if(!checkmove(source, target)){
        console.log("wrong move");
        return;
    }
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    renderMoveHistory(game.history());
    board.position(game.fen());
};

var checkmove = function(from, to) {
    var f = t = false;
    Object.keys(SQUARESbestMOVE).forEach(function(key) {
        if (SQUARESbestMOVE[key] == from) {
            f = true;
        }else if (SQUARESbestMOVE[key] == to) {
            t = true;
        }
    });
    if(!f || !t) {
        alert("wrong input");
        return;
    }
    var checkedmove = game.check_move({
        from: from,
        to: to,
        promotion: 'q'
    });
    if (checkedmove === null) {
        //checkedmove = "wrong";
        return false;
    } else {
        //checkedmove = "right";
        return true;
    }
    //console.log(checkedmove);
};

function updateLatestEntry(){  
    $.ajax({
        url : "index.php", 
        type : "POST", 
        data : { action: 'callingPhpFunction'},
        success : function (response) {
            if(response != previousResponse){
                var data = response.split(/ /);
                source = data[0];
                target = data[1];
                updateByDatabase(source, target);
                previousResponse = response;
            }
            else {console.log("cannot update with same values")};
        }
    });
    
};

// returns the best move as string and highlighted pieces
var showBestMove = function () {
    var bestMove = findBestMove(game);
    var from = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(1,2).map(entry => entry[1]), 10)];
    var to = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(2,3).map(entry => entry[1]), 10)];
    var piece = PLAYERbestMOVE[(Object.entries(bestMove).slice(4,5).map(entry => entry[1])).toString()];
    console.log(from);
    console.log(to);
    console.log(piece);
    highlightSquares(from, to);
    bestMoveAsString = "Move the " + piece + " from " + from + " to " + to + ".";
};

// event listener for show best move notification
document.querySelector('#notificationbutton').addEventListener('click', ev => {
    ev.preventDefault();
	if (!('Notification' in window)) {
		throw new Error('This browser does not support notifications.');
		return;
	}
	const ask = Notification.requestPermission(permission => {
		if (permission !== 'granted') {
			alert('Please allow browser notifications!');
			return;
        }
        showBestMove();
		const txt = bestMoveAsString;
		if (txt.match(/^\W*$/)) {
			alert('Something went wrong in showBestMove function');
			return;
		}
		setTimeout(() => {
			const msg = new Notification('sense-chess HELP', {
				body: txt,
				lang: 'en',
				icon: '../echess.svg',
				image: '../echess.svg'
			});
			msg.onclick = ev => alert('You clicked the sense-chess notification!');
			msg.onerror = err => console.error(err);
			msg.onshow = ev => console.info(ev);
			msg.onclose = ev => console.info(ev);
		}, 1000);
	});
});

var findBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = 3;

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

// highlight two pieces
var highlightSquares = function(from, to) {
    var squareFrom = $('#board .square-' + from);
    var squareTo = $('#board .square-' + to);

    var backgroundF = backgroundT = '#aaf7e8';
    if (squareFrom.hasClass('black-3c85d') === true) {
        backgroundF = '#5d8c83';
    } else if(squareTo.hasClass('black-3c85d') === true) {
        backgroundT = '#5d8c83';
    }
    squareFrom.css('background', backgroundF);
    squareTo.css('background', backgroundT);
};

/*
 * change the players turn 
 * */
  
var updateStatus = function() {
    var status = '';
  
    var moveColor = 'White';
    if (game.turn() === 'b') {
      moveColor = 'Black';
    }
  
    // checkmate?
    if (game.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
  
    // draw?
    else if (game.in_draw() === true) {
      status = 'Game over, drawn position';
    }
  
    // game still on
    else {
      status = moveColor + ' to move';
  
      // check?
      if (game.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }
    }
  
    statusEl.html(status);
    fenEl.html(game.fen());
    pgnEl.html(game.pgn());
}; 

/*
 * The "original" AI part starts here 
 * */

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
    // delete this when mouse drag shall be enabled
    return false;
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    //var depth = parseInt($('#search-depth').find(':selected').text());
    var depth = 1;

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    updateStatus();
    renderMoveHistory(game.history());
    // when you want to let play against computer turn this on (multiplayer off)
    //window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#c7ddf9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#4b5c72';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);