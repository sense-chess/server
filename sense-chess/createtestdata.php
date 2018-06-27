<?php	
	// Include the MySQL-Connector
	include("../connect.php");
   	
	// Connect to the local MySQL-Database
	$link=Connection();

	// Read the HTTP-Request / HTTP-Post
	// JSON-String has to decode into a JSON-Object / variable
	$data = json_decode(file_get_contents('php://input'), true);

	// String for the MySQL-Query: Here we insert the values of the JSON-Variable
	$query = "INSERT INTO `boardinput` (`field`, `millis`) VALUES ('d4', '1127810106')";
	$queryy = "INSERT INTO `correctmoves` (`source`, `target`) VALUES ('d2', 'd4')";
	$queryyy = "INSERT INTO `leds` (`fields`) VALUES ('1,2,3,4,64')";

   	// Execute the MySQL-Query: Insert the values into the tables
	if(!mysqli_query($link,$query))
    {
        die('Error : ' . mysql_error());
	}
	if(!mysqli_query($link,$queryy))
    {
        die('Error : ' . mysql_error());
	}
	if(!mysqli_query($link,$queryyy))
    {
        die('Error : ' . mysql_error());
    }

	// Close the DB-Connection
	mysqli_close($link);
?>
