<?php

	// Function to connect to the database
	function Connection(){
		$server="localhost";
		$user="php";
		$pass="php2000";
		$db="chess";
	   	
	   	// Connect to the database
		$connection = mysqli_connect($server, $user, $pass, $db);

		// If there is a problem you will get an error
		if (!$connection) {
	    	die('MySQL ERROR: ' . mysqli_error());
		}

		// Select the database
		mysqli_select_db($connection, $db) or die( 'MySQL ERROR: '. mysqli_error() );
		
		// Return of the DB-Connection-Object
		return $connection;
	}
?>
