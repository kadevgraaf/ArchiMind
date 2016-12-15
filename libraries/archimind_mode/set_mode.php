<?php session_start();


//header("Cache-Control: no-cache");// is dit nodig voor jquery?


 /**
  * @file Voorbeeldcode webservice AdresXpress/XML-RPC/PHP
  * @copyright Cendris Dataconsulting December 2008
  * @author W.J.J. Tol
  * @version 1.0
  *
  */
  
//dev
//echo "test";
//if ($_GET['postcode'] != '' && $_GET['huisnummer'] != '' && 1 == 0)

if ($_POST['mode'] != '')
{
	session_register('mode');
	
  	$mode = $_POST['mode'];
  


	$_SESSION['mode'] = $mode;
	
	echo $_SESSION['mode'];
}
  	//echo $file_content;
  	
//}

?>