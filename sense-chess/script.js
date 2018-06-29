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

var SQUARESbestMOVEinvert = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};

var LEDfieldsPinArduino = {
    8: "a8", 16: "b8", 24: "c8", 32: "d8", 40: "e8", 48: "f8", 56: "g8", 64: "h8", 
    7: "a7", 15: "b7", 23: "c7", 31: "d7", 39: "e7", 47: "f7", 55: "g7", 63: "h7",
    6: "a6", 14: "b6", 22: "c6", 30: "d6", 38: "e6", 46: "f6", 54: "g6", 62: "h6",
    5: "a5", 13: "b5", 21: "c5", 29: "d5", 37: "e5", 45: "f5", 53: "g5", 61: "h5",
    4: "a4", 12: "b4", 20: "c4", 28: "d4", 36: "e4", 44: "f4", 52: "g4", 60: "h4",
    3: "a3", 11: "b3", 19: "c3", 27: "d3", 35: "e3", 43: "f3", 51: "g3", 59: "h3",
    2: "a2", 10: "b2", 18: "c2", 26: "d2", 34: "e2", 42: "f2", 50: "g2", 58: "h2", 
    1: "a1",  9: "b1", 17: "c1", 25: "d1", 33: "e1", 41: "f1", 49: "g1", 57: "h1"
};

var PLAYERbestMOVE = {p : 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king'};
var bestMoveAsString = "";
var previousResponse = "";

var ledPinsToHighlight = [];
var ledFrom = "";
var ledTo = "";
var ledThisPieceFromTo = [];
var lastLEDfield = "mj";

// update website in milliseconds
setInterval(updateLatestEntry, 5000);

// functions we need for sense-chess

var interpretIncomingData = function(receivedField, status)
{
    removeGreySquares();
    if(lastLEDfield != receivedField)
    {
        getBestMoveVariables(receivedField);
        lastLEDfield = receivedField;
    }
    switch(status){
        // show all valid moves of the touched piece
        case 1:
            // show all valid moves of the touched piece
            break;
        // show best move of touched piece
        case 2:
            ledPinsToHighlight = ledThisPieceFromTo;
            break;
        // show a piece that can make a better move than the touched one
        case 3:
            ledPinsToHighlight = [ledFrom];
            break;
        // show a piece that can make a better move than the touched one
        case 4:
            ledPinsToHighlight = [ledFrom, ledTo];
            break;
        default:
            ledPinsToHighlight = ["nope"];
            console.log("something went wrong");
            break;
    }
    saveLEDs(ledPinsToHighlight);
}

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
            else 
            {
                console.log("cannot update with same values")
            }
        }
    });
    
};

var sendTestLEDDataToDatabase = function (){
    var ledsOn = ["d3","h7","a1","e2","f5"];
    printLEDsToDatabase(ledsOn);
}

var saveLEDs = function(fields)
{
    printLEDsToDatabase(fields);
    highlightSquares(fields);
}

var printLEDsToDatabase = function (field) {
    var m = "";
    var send = "";
    for(var z = 0; z < field.length; z++){
        Object.keys(LEDfieldsPinArduino).forEach(function(key) {
            m = "nope";
            if (String(LEDfieldsPinArduino[key]) === String(field[z])) {
                m = String(key);
                //console.log("m: " + m);
            }
            if(m === "nope"){
                //console.log("nope");
            }
            else if(send == ""){
                send = m;
            }
            else{
                send = send + "," + m;
            }
        });       
    }
    if(send != ""){      
        var xhr = new XMLHttpRequest();
        var url = "http://localhost/sense-chess/leds.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.fields);
            }
        };
        var data = JSON.stringify({"fields": send});
        xhr.send(data);
    }   
}

var getBestMoveVariables = function (oneField)
{
    var f = 0;
    Object.keys(SQUARESbestMOVE).forEach(function(key)
    {
        if (SQUARESbestMOVE[key] == oneField)
        {
            f = SQUARESbestMOVEinvert[oneField];
        }
    });
    var uglyMoves = game.ugly_moves()
    var found = false;
    var gop = 0;
    while(!found && gop < uglyMoves.length)
    {
        if(uglyMoves[gop].from == f)
        {
            ledThisPieceFromTo = [SQUARESbestMOVE[uglyMoves[gop].from],SQUARESbestMOVE[uglyMoves[gop].to]];
            found = true;
        }
        gop++;
    }
    if(!found){
        ledThisPieceFromTo = ["nope"];
    }
    var bestMove = minimaxRoot(2, game, true);
    ledFrom = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(1,2).map(entry => entry[1]), 10)];
    ledTo = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(2,3).map(entry => entry[1]), 10)];
};

// returns the best move as string and highlighted pieces
var showBestMove = function () {
    var bestMove = findBestMove(game);
    var from = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(1,2).map(entry => entry[1]), 10)];
    var to = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(2,3).map(entry => entry[1]), 10)];
    var piece = PLAYERbestMOVE[(Object.entries(bestMove).slice(4,5).map(entry => entry[1])).toString()];
    var square = [from, to];
    saveLEDs(square);
    bestMoveAsString = "Move the " + piece + " from " + from + " to " + to + ".";
};

var bestMoveOfActualPosition = function(oneField)
{
    var f = 0;
    Object.keys(SQUARESbestMOVE).forEach(function(key)
    {
        if (SQUARESbestMOVE[key] == oneField)
        {
            f = SQUARESbestMOVEinvert[oneField];
        }
    });
    var uglyMoves = game.ugly_moves()
    var found = false;
    var gop = 0;
    while(!found && gop < uglyMoves.length)
    {
        if(uglyMoves[gop].from == f)
        {
            var square = [SQUARESbestMOVE[uglyMoves[gop].from],SQUARESbestMOVE[uglyMoves[gop].to]];
            return square;
        }
        gop++;
    }
    if(!found){
        var nopenop = ["nope"];
        return nopenop;
    }
}

var createTestDataInEveryTable = function () {
    if(confirm("Really create test data in EVERY table?")){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost/sense-chess/createtestdata.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.create);
            }
        };
        var data = JSON.stringify({"create": "every"});
        xhr.send(data);
    }    
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var deleteEverythingFromEveryDatabase = function () {
    if(confirm("Really delete EVERY data from ALL databases?")){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost/sense-chess/deleteall.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.delete);
            }
        };
        var data = JSON.stringify({"delete": "all"});
        xhr.send(data);
    }    
}

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

// highlight fields
var highlightSquares = function(fields)
{
    for(var z = 0; z < fields.length; z++)
    {
        var square = $('#board .square-' + fields[z]);
        var backgroundF = backgroundT = '#aaf7e8';
        if (square.hasClass('black-3c85d') === true)
        {
            backgroundF = '#5d8c83';
        }
        square.css('background', backgroundF);
    }
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