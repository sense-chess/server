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
    0: "a8", 1: "b8", 2: "c8", 3: "d8", 4: "e8", 5: "f8", 6: "g8", 7: "h8",
    16: "a7", 17: "b7", 18: "c7", 19: "d7", 20: "e7", 21: "f7", 22: "g7", 23: "h7",
    32: "a6", 33: "b6", 34: "c6", 35: "d6", 36: "e6", 37: "f6", 38: "g6", 39: "h6",
    48: "a5", 49: "b5", 50: "c5", 51: "d5", 52: "e5", 53: "f5", 54: "g5", 55: "h5",
    64: "a4", 65: "b4", 66: "c4", 67: "d4", 68: "e4", 69: "f4", 70: "g4", 71: "h4",
    80: "a3", 81: "b3", 82: "c3", 83: "d3", 84: "e3", 85: "f3", 86: "g3", 87: "h3",
    96: "a2", 97: "b2", 98: "c2", 99: "d2", 100: "e2", 101: "f2", 102: "g2", 103: "h2",
    112: "a1", 113: "b1", 114: "c1", 115: "d1", 116: "e1", 117: "f1", 118: "g1", 119: "h1"
};

var SQUARESbestMOVEinvert = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};

var PLAYERbestMOVE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
var bestMoveAsString = "";
var previousResponse = "";
var lastMouseButtonPressed = 10;

// variables for LEDs
var ledPinsToHighlight = [];
var ledFrom = "";
var ledTo = "";
var ledThisPieceFromTo = [];
var ledValidMoves = [];
var lastLEDfield = "mj";
var lastLEDSent = "-2";
var ledStatus = 0;
var lastidBoardInput = 0;
var LEDfieldsPinArduino = {
    0: "a8", 1: "b8", 2: "c8", 3: "d8", 4: "e8", 5: "f8", 6: "g8", 7: "h8",
    15: "a7", 14: "b7", 13: "c7", 12: "d7", 11: "e7", 10: "f7", 9: "g7", 8: "h7",
    16: "a6", 17: "b6", 18: "c6", 19: "d6", 20: "e6", 21: "f6", 22: "g6", 23: "h6",
    31: "a5", 30: "b5", 29: "c5", 28: "d5", 27: "e5", 26: "f5", 25: "g5", 24: "h5",
    32: "a4", 33: "b4", 34: "c4", 35: "d4", 36: "e4", 37: "f4", 38: "g4", 39: "h4",
    47: "a3", 46: "b3", 45: "c3", 44: "d3", 43: "e3", 42: "f3", 41: "g3", 40: "h3",
    48: "a2", 49: "b2", 50: "c2", 51: "d2", 52: "e2", 53: "f2", 54: "g2", 55: "h2",
    63: "a1", 62: "b1", 61: "c1", 60: "d1", 59: "e1", 58: "f1", 57: "g1", 56: "h1"
};

const intervalDiff = 5000;
const intervalMoveFig = 1000;
const intervalTouchOtherFig = 2000;
const intervalMoveOpo = 2000;
const intervalStart = 2000;
const interval01 = intervalStart + intervalDiff;
const interval02 = interval01 + intervalDiff;
const interval03 = interval02 + intervalDiff;
const interval04 = interval03 + intervalDiff;
const interval05 = interval04 + intervalDiff;

// update website in milliseconds
//setInterval(updateLatestEntry, 500);

///////////////////////////////////////
// functions we need for sense-chess //
///////////////////////////////////////

// interprets and works with the data coming out of the boardinput database
var interpretIncomingData = function (receivedField) {
    removeGreySquares();
    if (!checkmove(lastLEDfield, receivedField)) {
        if (lastLEDfield != receivedField) {
            ledStatus = 0;
            getValidMoves(receivedField);
            getBestMoveVariables(receivedField);
            lastLEDfield = receivedField;
        }
        switch (ledStatus) {
            // show all valid moves of the touched piece
            case 0:
                ledPinsToHighlight = [receivedField];
                ledStatus++;
                break;
            case 1:
                ledPinsToHighlight = ledValidMoves;
                ledStatus++;
                break;
            // show best move of touched piece
            case 2:
                ledPinsToHighlight = ledThisPieceFromTo;
                ledStatus++;
                break;
            // show a piece that can make a better move than the touched one
            case 3:
                ledPinsToHighlight = [ledFrom];
                ledStatus++;
                break;
            // show a piece that can make a better move than the touched one
            case 4:
                ledPinsToHighlight = [ledFrom, ledTo];
                ledStatus++;
                break;
            default:
                ledPinsToHighlight = ["nope"];
                console.log("wrong status: " + ledStatus);
                ledStatus = 0;
                break;
        }
        saveLEDs(ledPinsToHighlight);
    }
    else {
        saveLEDs(["nope"]);
        printMoveDatabase(lastLEDfield, receivedField);
    }
}

var interpretIncomingDataWithStatus = function (receivedField, thisStatus) {
    removeGreySquares();
    if (!checkmove(lastLEDfield, receivedField)) {
        if (lastLEDfield != receivedField) {
            getValidMoves(receivedField);
            getBestMoveVariables(receivedField);
            lastLEDfield = receivedField;
        }
        switch (thisStatus) {
            // show all valid moves of the touched piece
            case 0:
                ledPinsToHighlight = [receivedField];
                break;
            case 1:
                ledPinsToHighlight = ledValidMoves;
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
                console.log("wrong status: " + thisStatus);
                break;
        }
        saveLEDs(ledPinsToHighlight);
    }
    else {
        saveLEDs(["nope"]);
        printMoveDatabase(lastLEDfield, receivedField);
    }
    status = thisStatus;
}

function whichButton(event) {
    console.log("You pressed button: " + event.button);
    if (lastMouseButtonPressed != event.button) {
        deleteAllData();
        var t = game.history().length
        if (t > 0) {
            for (var ohr = 0; ohr < t; ohr++) {
                game.undo();
            }
        }
        renderMoveHistory(game.history());
        board.position(game.fen());
        switch (event.button) {
            // left mouse button
            case 0:
                moveMouseLeftButtonStartPos();
                break;
            // middle mouse button    
            case 1:
                break;
            // right mouse button
            case 2:
                moveMouseRightButtonStartPos();
                break;
            default:
                console.log("Wrong button: " + event.button);
                break;
        }
        lastMouseButtonPressed = event.button;
    }
    else {
        switch (event.button) {
            // left mouse button
            case 0:
                moveMouseLeftButtonMovePos();
                break;
            // middle mouse button    
            case 1:
                break;
            // right mouse button
            case 2:
                moveMouseRightButtonMovePos();
                break;
            default:
                console.log("Wrong button: " + event.button);
                break;
        }
    }
}

var updateByCode = function () {
    var from = document.querySelector('#from').value;
    var to = document.querySelector('#to').value;
    if (!checkmove(from, to)) {
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

var updateByDatabase = function (source, target) {
    if (!checkmove(source, target)) {
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

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var checkmove = function (from, to) {
    var f = t = false;
    Object.keys(SQUARESbestMOVE).forEach(function (key) {
        if (SQUARESbestMOVE[key] == from) {
            f = true;
        }
        else if (SQUARESbestMOVE[key] == to) {
            t = true;
        }
    });
    if (!f || !t) {
        return false;
    }
    var checkedmove = game.check_move({
        from: from,
        to: to,
        promotion: 'q'
    });
    if (checkedmove === null) {
        //checkedmove = "wrong";
        return false;
    }
    else {
        //checkedmove = "right";
        return true;
    }
    //console.log(checkedmove);
};

function updateLatestEntry() {
    $.ajax({
        url: "index.php",
        type: "POST",
        data: { action: 'callingPhpFunction' },
        success: function (response) {
            var data = response.split(/ /);
            id = data[0];
            field = data[1];
            if (id != lastidBoardInput) {
                interpretIncomingData(field);
                previousResponse = response;
                lastidBoardInput = id;
            }
        }
    });
};

var sendAllLEDsOffToDatabase = function () {
    var ledsOff = ["nope"];
    printLEDsToDatabase(ledsOff);
}
var sendTestLEDDataToDatabase = function () {
    var ledsOn = ["d3", "h7", "a1", "e2", "f5"];
    printLEDsToDatabase(ledsOn);
}

var saveLEDs = function (fields) {
    printLEDsToDatabase(fields);
    highlightSquares(fields);
}

var printLEDsToDatabase = function (field) {
    var m = "";
    var send = "";
    var found = false;
    for (var z = 0; z < field.length; z++) {
        Object.keys(LEDfieldsPinArduino).forEach(function (key) {
            m = "-1";
            if (String(LEDfieldsPinArduino[key]).valueOf() == String(field[z]).valueOf()) {
                m = String(key);
                if (send == "") {
                    send = m;
                }
                else {
                    send = send + "," + m;
                }
                found = true;
            }
        });
    }
    if (!found) {
        send = "-1";
    }
    if (send != "" && lastLEDSent != send) {
        lastLEDSent = send;
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
        var data = JSON.stringify({ "fields": "<" + send + ">" });
        xhr.send(data);
    }
}

var sendfieldDataToBoardInputDatabase = function (field) {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost/sense-chess/boardinput.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.fields);
        }
    };
    var data = JSON.stringify({ "field": field });
    xhr.send(data);
}

var printMoveDatabase = function (from, to) {
    updateByDatabase(from, to);
    var xhr = new XMLHttpRequest();
    var url = "http://localhost/sense-chess/validmoves.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.fields);
        }
    };
    var data = JSON.stringify({ "from": from, "to": to });
    xhr.send(data);
}

var getValidMoves = function (oneField) {
    var valMoves = game.moves({
        square: oneField,
        verbose: true
    });
    var vmoves = [oneField];
    if (valMoves.length > 0) {
        for (var lolli = 0; lolli < valMoves.length; lolli++) {
            vmoves.push(valMoves[lolli].to);
        }
        ledValidMoves = vmoves;
    }
    else {
        ledValidMoves = ["nope"];
    }
}

var getBestMoveVariables = function (oneField) {
    var f = 0;
    Object.keys(SQUARESbestMOVE).forEach(function (key) {
        if (SQUARESbestMOVE[key] == oneField) {
            f = SQUARESbestMOVEinvert[oneField];
        }
    });
    var uglyMoves = game.ugly_moves()
    var found = false;
    var gop = 0;
    while (!found && gop < uglyMoves.length) {
        if (uglyMoves[gop].from == f) {
            ledThisPieceFromTo = [SQUARESbestMOVE[uglyMoves[gop].from], SQUARESbestMOVE[uglyMoves[gop].to]];
            found = true;
        }
        gop++;
    }
    if (!found) {
        ledThisPieceFromTo = ["nope"];
    }
    var bestMove = minimaxRoot(2, game, true);
    ledFrom = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(1, 2).map(entry => entry[1]), 10)];
    ledTo = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(2, 3).map(entry => entry[1]), 10)];
};

// returns the best move as string and highlighted pieces
var showBestMove = function () {
    var bestMove = findBestMove(game);
    var from = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(1, 2).map(entry => entry[1]), 10)];
    var to = SQUARESbestMOVE[parseInt(Object.entries(bestMove).slice(2, 3).map(entry => entry[1]), 10)];
    var piece = PLAYERbestMOVE[(Object.entries(bestMove).slice(4, 5).map(entry => entry[1])).toString()];
    var square = [from, to];
    saveLEDs(square);
    bestMoveAsString = "Move the " + piece + " from " + from + " to " + to + ".";
};

var bestMoveOfActualPosition = function (oneField) {
    var f = 0;
    Object.keys(SQUARESbestMOVE).forEach(function (key) {
        if (SQUARESbestMOVE[key] == oneField) {
            f = SQUARESbestMOVEinvert[oneField];
        }
    });
    var uglyMoves = game.ugly_moves()
    var found = false;
    var gop = 0;
    while (!found && gop < uglyMoves.length) {
        if (uglyMoves[gop].from == f) {
            var square = [SQUARESbestMOVE[uglyMoves[gop].from], SQUARESbestMOVE[uglyMoves[gop].to]];
            return square;
        }
        gop++;
    }
    if (!found) {
        var nopenop = ["nope"];
        return nopenop;
    }
}

var createTestDataInEveryTable = function () {
    if (confirm("Really create test data in EVERY table?")) {
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
        var data = JSON.stringify({ "create": "every" });
        xhr.send(data);
    }
}

var deleteEverythingFromEveryDatabase = function () {
    if (confirm("Really delete EVERY data from ALL databases?")) {
        deleteAllData();
    }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var deleteAllData = function () {
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
    var data = JSON.stringify({ "delete": "all" });
    xhr.send(data);
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
    var positionsPerS = (positionCount * 1000 / moveTime);
    $('#position-count').text(positionCount);
    $('#time').text(moveTime / 1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

// highlight fields
var highlightSquares = function (fields) {
    for (var z = 0; z < fields.length; z++) {
        var square = $('#board .square-' + fields[z]);
        var backgroundF = backgroundT = '#aaf7e8';
        if (square.hasClass('black-3c85d') === true) {
            backgroundF = '#5d8c83';
        }
        square.css('background', backgroundF);
    }
};

/*
 * change the players turn 
 */

var updateStatus = function () {
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


var testMove = function () {
    interpretIncomingData('d7');
    sleep(1000);
    interpretIncomingData('d6');
}

document.addEventListener('contextmenu', event => event.preventDefault());

var moveMouseLeftButtonStartPos = function () {
    // saving into database

    sendfieldDataToBoardInputDatabase('g8');
    sendfieldDataToBoardInputDatabase('f6');
    sendfieldDataToBoardInputDatabase('d2');
    sendfieldDataToBoardInputDatabase('d4');
    sendfieldDataToBoardInputDatabase('g7');
    sendfieldDataToBoardInputDatabase('g5');
    sendfieldDataToBoardInputDatabase('e2');
    sendfieldDataToBoardInputDatabase('e3');
    sendfieldDataToBoardInputDatabase('h7');
    sendfieldDataToBoardInputDatabase('h6');
    sendfieldDataToBoardInputDatabase('f1');
    sendfieldDataToBoardInputDatabase('b5');
    sendfieldDataToBoardInputDatabase('a7');
    sendfieldDataToBoardInputDatabase('a5');
    sendfieldDataToBoardInputDatabase('a2');
    sendfieldDataToBoardInputDatabase('a4');
    sendfieldDataToBoardInputDatabase('a8');
    sendfieldDataToBoardInputDatabase('a6');
    sendfieldDataToBoardInputDatabase('b1');
    sendfieldDataToBoardInputDatabase('c3');
    sendfieldDataToBoardInputDatabase('f6');
    sendfieldDataToBoardInputDatabase('e4');
    sendfieldDataToBoardInputDatabase('f2');
    sendfieldDataToBoardInputDatabase('f3');
    sendfieldDataToBoardInputDatabase('b7');
    sendfieldDataToBoardInputDatabase('b6');
    sendfieldDataToBoardInputDatabase('c1');
    sendfieldDataToBoardInputDatabase('d2');
    sendfieldDataToBoardInputDatabase('f8');
    sendfieldDataToBoardInputDatabase('g7');
    sendfieldDataToBoardInputDatabase('c3');
    sendfieldDataToBoardInputDatabase('d5');
    sendfieldDataToBoardInputDatabase('g7');
    sendfieldDataToBoardInputDatabase('e5');
    sendfieldDataToBoardInputDatabase('a1');
    sendfieldDataToBoardInputDatabase('a3');
    sendfieldDataToBoardInputDatabase('e5');
    sendfieldDataToBoardInputDatabase('f4');
    sendfieldDataToBoardInputDatabase('a3');
    sendfieldDataToBoardInputDatabase('c3');
    sendfieldDataToBoardInputDatabase('h8');
    sendfieldDataToBoardInputDatabase('h7');
    sendfieldDataToBoardInputDatabase('d5');
    sendfieldDataToBoardInputDatabase('f6');
    sendfieldDataToBoardInputDatabase('e8');
    sendfieldDataToBoardInputDatabase('f8');
    sendfieldDataToBoardInputDatabase('c3');
    sendfieldDataToBoardInputDatabase('c6');
    sendfieldDataToBoardInputDatabase('h7');
    sendfieldDataToBoardInputDatabase('g7');
    sendfieldDataToBoardInputDatabase('f6');
    sendfieldDataToBoardInputDatabase('g8');
    sendfieldDataToBoardInputDatabase('e4');
    sendfieldDataToBoardInputDatabase('f2');
    sendfieldDataToBoardInputDatabase('d2');
    sendfieldDataToBoardInputDatabase('b4');
    sendfieldDataToBoardInputDatabase('f7');
    sendfieldDataToBoardInputDatabase('f5');
    sendfieldDataToBoardInputDatabase('g2');
    sendfieldDataToBoardInputDatabase('g4');
    sendfieldDataToBoardInputDatabase('a5');
    sendfieldDataToBoardInputDatabase('b4');

    // setting up digital board
    interpretIncomingData('g8');
    interpretIncomingData('f6');
    interpretIncomingData('d2');
    interpretIncomingData('d4');
    interpretIncomingData('g7');
    interpretIncomingData('g5');
    interpretIncomingData('e2');
    interpretIncomingData('e3');
    interpretIncomingData('h7');
    interpretIncomingData('h6');
    interpretIncomingData('f1');
    interpretIncomingData('b5');
    interpretIncomingData('a7');
    interpretIncomingData('a5');
    interpretIncomingData('a2');
    interpretIncomingData('a4');
    interpretIncomingData('a8');
    interpretIncomingData('a6');
    interpretIncomingData('b1');
    interpretIncomingData('c3');
    interpretIncomingData('f6');
    interpretIncomingData('e4');
    interpretIncomingData('f2');
    interpretIncomingData('f3');
    interpretIncomingData('b7');
    interpretIncomingData('b6');
    interpretIncomingData('c1');
    interpretIncomingData('d2');
    interpretIncomingData('f8');
    interpretIncomingData('g7');
    interpretIncomingData('c3');
    interpretIncomingData('d5');
    interpretIncomingData('g7');
    interpretIncomingData('e5');
    interpretIncomingData('a1');
    interpretIncomingData('a3');
    interpretIncomingData('e5');
    interpretIncomingData('f4');
    interpretIncomingData('a3');
    interpretIncomingData('c3');
    interpretIncomingData('h8');
    interpretIncomingData('h7');
    interpretIncomingData('d5');
    interpretIncomingData('f6');
    interpretIncomingData('e8');
    interpretIncomingData('f8');
    interpretIncomingData('c3');
    interpretIncomingData('c6');
    interpretIncomingData('h7');
    interpretIncomingData('g7');
    interpretIncomingData('f6');
    interpretIncomingData('g8');
    interpretIncomingData('e4');
    interpretIncomingData('f2');
    interpretIncomingData('d2');
    interpretIncomingData('b4');
    interpretIncomingData('f7');
    interpretIncomingData('f5');
    interpretIncomingData('g2');
    interpretIncomingData('g4');
    interpretIncomingData('a5');
    interpretIncomingData('b4');
}

var moveMouseLeftButtonMovePos = function () {
    setTimeout(function () { interpretIncomingData('b5'); }, intervalStart);
    setTimeout(function () { interpretIncomingData('b5'); }, interval01);
    setTimeout(function () { interpretIncomingData('b5'); }, interval02);
    setTimeout(function () { interpretIncomingData('b5'); }, interval03);
    setTimeout(function () { interpretIncomingData('b5'); }, interval04);
    setTimeout(function () { interpretIncomingData('b5'); }, interval05);
    clearTimeout();
}

var moveMouseRightButtonStartPos = function () {
    // saving into database
    sendfieldDataToBoardInputDatabase('g8');
    sendfieldDataToBoardInputDatabase('f6');

    // setting up digital board
    interpretIncomingData('g8');
    interpretIncomingData('f6');
}

var moveMouseRightButtonMovePos = function () {
    setTimeout(function () { interpretIncomingData('h2'); }, intervalStart);
    setTimeout(function () { interpretIncomingData('h2'); }, interval01);
    setTimeout(function () { interpretIncomingData('h2'); }, interval02);
    setTimeout(function () { interpretIncomingData('h2'); }, interval03);
    setTimeout(function () { interpretIncomingData('h2'); }, interval04);
    setTimeout(function () { interpretIncomingData('h2'); }, interval05);
    setTimeout(function () { interpretIncomingDataWithStatus('g2', 3); }, interval05 + 3000);
    setTimeout(function () { interpretIncomingData('g4'); }, interval05 + 5000);
    setTimeout(function () { interpretIncomingDataWithStatus('e7', 2); }, interval05 + 6000);
    setTimeout(function () { interpretIncomingData('e6'); }, interval05 + 13000);
    setTimeout(function () { interpretIncomingData('b1'); }, interval05 + 15000 + intervalStart);
    setTimeout(function () { interpretIncomingData('b1'); }, interval05 + 15000 + interval01);
    setTimeout(function () { interpretIncomingData('b1'); }, interval05 + 15000 + interval02);
    setTimeout(function () { interpretIncomingData('a3'); }, interval05 + 15000 + interval03);
    clearTimeout();
}




/*
 * The "original" AI part starts here 
 */

var minimaxRoot = function (depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
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
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function (array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x, y) {
        if (piece.type === 'p') {
            return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
        } else if (piece.type === 'r') {
            return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
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
    var positionsPerS = (positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime / 1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
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

var onMouseoverSquare = function (square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });
    var fieldsToLEDs = [];

    if (moves.length === 0) return;

    greySquare(square);
    fieldsToLEDs.push(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
        fieldsToLEDs.push(moves[i].to);
    }
    printLEDsToDatabase(fieldsToLEDs);
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
    printLEDsToDatabase(["nope"]);
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
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