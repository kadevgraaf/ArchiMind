<?php session_start();

if ($_POST['mode'] != '')
{
	session_register('mode');

  	$mode = $_POST['mode'];



	$_SESSION['mode'] = $mode;

	echo $_SESSION['mode'];
}
 
?>
