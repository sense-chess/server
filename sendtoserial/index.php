<?php
include 'PhpSerial.php';

// Let's start the class
$serial = new PhpSerial;

// First we must specify the device. This works on both linux and windows (if
// your linux serial device is /dev/ttyS0 for COM1, etc)
$serial->deviceSet("COM3");

// We can change the baud rate, parity, length, stop bits, flow control
$serial->confBaudRate(9600);
$serial->confParity("none");
$serial->confCharacterLength(8);
$serial->confStopBits(1);
$serial->confFlowControl("none");

// Then we need to open it
$serial->deviceOpen();

//Unfortunately this is nessesary, arduino requires a 2 second delay in order to receive the message
sleep(2); 
$read = $serial->readPort();

// To write into
//$serial->sendMessage("Hello !");

$serial->deviceClose();

?>

<html>

<head>

<title>Arduino control</title>

</head>

<body>

<?= $read ?>

</body>

</html>
