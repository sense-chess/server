<?php
require_once "../data.php";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
};
?>

<html>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sense-chess</title>
<link rel="shortcut icon" href="../sense-chess.png">
<link rel="icon" type="image/png" href="../sense-chess.svg">
<link rel="image_src" href="../sense-chess.svg" />
<link rel="apple-touch-icon" href="../sense-chess.png" />
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet">
<meta name="description" content="sense-chess project HfG Schwäbisch Gmünd"> 
<meta name="keywords" content="Marcus Schoch, jan-patrick.de, Jan Schneider, HfG, IoT, Internet der Dinge, Student, Hochschule für Gestaltung, Schwäbisch Gmünd, Gmünd, Internet of Things, Bachelor of Arts, Kikife, Kulturbüro, FSJ, Jan-Patrick, Jan, Schneider">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
<link rel="stylesheet" href="lib/chessboardjs/css/chessboard-0.3.0.css">
<link rel="stylesheet" href="style.css">
<head>
</head>
<body>
<br><br><br>
    <div id="board" class="board"></div><br><br>
        <div class="slidecontainer">
            <label for="rangeTimeline">Example range</label>
            <input type="range" class="custom-range" min="0" max="5" step="0.5" id="rangeTimeline">
        </div>
        <div class="info">
            Search depth:<select id="search-depth">
                <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option>
            </select><br>
            <span>Positions evaluated: <span id="position-count"></span></span><br>
            <span>Time: <span id="time"></span></span><br>
            <span>Positions/s: <span id="positions-per-s"></span> </span><br>
            <form action="#">Move from <textarea id="from"></textarea> to <textarea id="to"></textarea><button onclick="updateByCode()">move</button>
            </form>
            <button id="notificationbutton">best move Notification</button><br><button onclick="sendTestLEDDataToDatabase()">LED Test in Database</button>
            <button onclick="deleteEverythingFromEveryDatabase()">! delete EVERY data from database !</button>
            <button onclick="createTestDataInEveryTable()">create test data in every table</button><br><div id="move-history" class="move-history"></div>    
        </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <script src="lib/jquery/jquery-3.2.1.min.js"></script>
    <script src="lib/chessboardjs/js/chess.js"></script>
    <script src="lib/chessboardjs/js/chessboard-0.3.0.js"></script>
    <script src="script.js"></script> 
    
</body>
</html>