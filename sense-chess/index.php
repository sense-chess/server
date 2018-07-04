<?php
require_once "../data.php";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
};

function updateNewest($conn)
{    
    $data = 'SELECT * FROM boardinput ORDER BY id DESC LIMIT 1';
    $result = mysqli_query($conn, $data);
    if (!$result)
    {
        die ('SQL Error: ' . mysqli_error($conn));
    }
    $row = mysqli_fetch_assoc($result);
    $id = $row["id"];
    $field = $row["field"];
    return  $id . " " . $field;
};

@$action = $_POST['action']; 

if("callingPhpFunction" == $action)
{
    $idAndfield = updateNewest($conn);
    echo $idAndfield;
    exit;
};
?>

<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sense-chess</title>
<link rel="shortcut icon" href="../icon.png">
<link rel="icon" type="image/png" href="../icon.svg">
<link rel="image_src" href="../icon.svg" />
<link rel="apple-touch-icon" href="../icon.png" />
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet">
<meta name="description" content="sense-chess project HfG Schwäbisch Gmünd"> 
<meta name="keywords" content="Marcus Schoch, jan-patrick.de, Jan Schneider, HfG, IoT, Internet der Dinge, Student, Hochschule für Gestaltung, Schwäbisch Gmünd, Gmünd, Internet of Things, Bachelor of Arts, Kikife, Kulturbüro, FSJ, Jan-Patrick, Jan, Schneider">
<link rel="stylesheet" href="lib/chessboardjs/css/chessboard-0.3.0.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="board" class="board"></div>
        <div class="info">
            Search depth:
            <select id="search-depth">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3" selected>3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <br>
            <span>Positions evaluated: <span id="position-count"></span></span>
            <br>
            <span>Time: <span id="time"></span></span>
            <br>
            <span>Positions/s: <span id="positions-per-s"></span> </span>
            <br>
            <form action="#">Move from 
            <textarea id="from"></textarea> to <textarea id="to"></textarea>
		    <button onclick="updateByCode()">move</button>
            </form>
            <br>
            <button onclick="sendfieldDataToBoardInputDatabase('d7')">d7 next status</button>
            <button onclick="sendfieldDataToBoardInputDatabase('d6')">d6 next status</button>
            <button onclick="sendfieldDataToBoardInputDatabase('d2')">d2 next status</button>
            <button onclick="sendfieldDataToBoardInputDatabase('d4')">d4 next status</button>
            <button onclick="testMove()">test move d7-d6</button>
            <button onclick="sendTestLEDDataToDatabase()">LED Test in Database</button>
            <button onclick="sendAllLEDsOffToDatabase()">LEDs Off in Database</button>
            <button onclick="deleteEverythingFromEveryDatabase()">! delete EVERY data from database !</button>
            <button onclick="createTestDataInEveryTable()">create test data in every table</button>
            <br>
            <div id="move-history" class="move-history"></div>    
        </div>
        <br><br>
    <script src="lib/jquery/jquery-3.2.1.min.js"></script>
    <script src="lib/chessboardjs/js/chess.js"></script>
    <script src="lib/chessboardjs/js/chessboard-0.3.0.js"></script>
    <script src="script.js"></script>
</body>
</html>