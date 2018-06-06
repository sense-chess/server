<?php
require_once "../data.php";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = 'SELECT * 
		FROM test ';
		
$query = mysqli_query($conn, $sql);
if (!$query) {
	die ('SQL Error: ' . mysqli_error($conn));
}
?>

<html>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>database - sense-chess</title>
<link rel="shortcut icon" href="../echess.png">
<link rel="icon" type="image/png" href="../echess.svg">
<link rel="image_src" href="../echess.svg" />
<link rel="apple-touch-icon" href="../echess.png" />
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet">
<meta name="description" content="sense-chess is a project by Marcus Schoch and Jan Schneider with Prof. Michael Schuster and Benjamin Thomsen at HfG Schwäbisch Gmünd."> 
<meta name="keywords" content="Jan Schneider, HfG, IoT, Internet der Dinge, Student, Hochschule für Gestaltung, Schwäbisch Gmünd, Gmünd, Internet of Things, Bachelor of Arts, Kikife, Kulturbüro, FSJ, Jan-Patrick, Jan, Schneider">
<link href="styledatabase.css" rel="stylesheet">
<head>
</head>
<body>
<script>
setInterval(function(){
    console.log("parole");
	}, 
3000);
</script>	
<p><a href="https://jan-patrick.de/sense-chess">to CHESS page</a></p>
<h1>test database</h1>
	<table class="data-table">
		<caption class="title">inserted by Arduino Mega</caption>
		<thead>
			<tr>
				<th>NO</th>
				<th>id</th>
				<th>source</th>
				<th>target</th>
				<th>curtime</th>
			</tr>
		</thead>
		<tbody>
		<?php
		$no 	= 1;
		$total 	= 20;
		while ($row = mysqli_fetch_array($query) )
		{
			$amount  = $row['amount'] == 0 ? '' : number_format($row['amount']);
			echo '<tr>
					<td>'.$no.'</td>
					<td>'.$row['id'].'</td>
					<td>'.$row['source'].'</td>
					<td>'.$row['target'].'</td>
					<td>'.$row['curtime'].'</td>
				</tr>';
			$no++;
		}?>
		</tbody>
	</table>
	<br><br>
	<br><br>
	<p><a href="https://jan-patrick.de/imprint/">imprint & data protection</a></p>
	<div id="reload">
	<a href=""><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="100%" width="auto" viewBox="0 0 72 72" enable-background="new 0 0 72 72" xml:space="preserve">
   <g id="_xD83D__xDD04_">	   
		   <path fill="#3F3F3F" stroke="#1D1D1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
		   M20.8,30.4l-3.7,4.1c0.7-7.7,5.6-14.4,13-17c2.1-0.8,4.4-1.2,6.6-1.2c5.5,0,10.8,2.4,14.5,6.5l0.6,0.7l3.9-3.6L55,19.2
		   C50.3,14,43.6,11,36.6,11c-2.8,0-5.7,0.5-8.4,1.5c-9.2,3.3-15.6,11.8-16.4,21.6l-3.3-3.6l-3.3,3.1L14.7,44l9.5-10.4L20.8,30.4z"/>	   
		   <path fill="#3F3F3F" stroke="#1D1D1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
		   M67,38.3l-9.5-10.5l-9.5,10.4l3.3,3.1l3.7-4.1c-0.6,7.7-5.6,14.4-13,17.1c-2.1,0.8-4.4,1.2-6.6,1.2c-5.5,0-10.8-2.4-14.5-6.5
		   l-0.6-0.7l-3.9,3.6l0.6,0.7C21.9,58,28.6,61,35.6,61c2.8,0,5.7-0.5,8.4-1.5c9.2-3.4,15.6-11.9,16.4-21.7l3.3,3.7L67,38.3z"/>
   </g></svg></a>
</div>
<div id="home">
	<a href="https://jan-patrick.de/sense-chess"><svg version="1.1" id="emoji" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="100%" width="auto" viewBox="0 0 72 72" enable-background="new 0 0 72 72" xml:space="preserve">
<g id="_xDB80__xDC11_">
	<polygon fill="#3F3F3F" points="17.1,59.7 16.1,34.7 16.1,27.8 36.1,8.1 56,27.9 56,43.4 55,52 54.9,59.7 41.8,59.2 41.8,41.6 
		30.2,41.6 30.1,59.2 	"/>
	<g>
		<path fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M42,60h12c0.5,0,1-0.5,1-1V34"/>
		<path fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M17.1,34V59c0,0.5,0.4,1,1,1h12.1"/>
		
			<polyline fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="
			8.5,35.6 36,8 63.6,35.3 		"/>
		
			<polyline fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="
			41.8,59.9 41.8,41.6 30.2,41.6 30.2,59.9 		"/>
	</g>
</g>
</svg></a>
</div>
<div id="back">
	<a href="https://jan-patrick.de/sense-chess"><svg version="1.1" id="emoji" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="100%" width="auto" viewBox="0 0 72 72" enable-background="new 0 0 72 72" xml:space="preserve">
   <polygon id="_x2B05__xFE0F_" fill="#3F3F3F" stroke="#1D1D1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="
	   22.8,51.5 5,35 22.8,18.5 26.6,22.6 16.2,32.3 67,32.3 67,37.8 16.2,37.8 26.6,47.5 "/>
   </svg></a>
</div>
<div id="forward">
	<a href="https://jan-patrick.de/sense-chess/playchess/"><svg version="1.1" id="emoji" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="100%" width="auto" viewBox="0 0 72 72" enable-background="new 0 0 72 72" xml:space="preserve">
   <polygon id="_x27A1__xFE0F_" fill="#3F3F3F" stroke="#1D1D1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="
	   49.2,51.5 67,35 49.2,18.5 45.4,22.6 55.8,32.3 5,32.3 5,37.8 55.8,37.8 45.4,47.5 "/>
   </svg></a>
</div>
    </body>
</html>