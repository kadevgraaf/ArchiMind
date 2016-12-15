<?php


class DiaglogController extends OntoWiki_Controller_Component
{
	
    public $mode;

	public function init()
    {
        parent::init();
        
        //$this->mode = false;
        //$this->view->view_mode = "user";
    }
    
    public function logsearchAction()
    {    	
	    $oData = json_decode($this->_request->getParam('data'));
	    
	    //$user_data = json_decode($this->_request->getParam('data'));
	    //print_r($user_data);
	    //echo $user_data->user_input1;
	    //echo 'odata waarde' . $oData;//->user_input1;
	    //echo $this->_owApp->mode;
 	    //$user_input;
 	    
 	    
    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    	
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
    	if ($oData->URI == "true") //find label for URI's
    	{
	    	
	    	$sSql = "SELECT o FROM ef_stmt WHERE p LIKE '%type%' AND s = '".$oData->concept."' AND o NOT LIKE '%Thing%'";
    		//$sSql = "SELECT o FROM ef_stmt WHERE p = 'http://www.w3.org/2000/01/rdf-schema#type' AND s = '".$oData->concept."'";    	
    		
    		$oResult = mysql_query($sSql, $oConn);
    		$oResult= mysql_fetch_array($oResult, MYSQL_ASSOC);
    		
    		$conceptURI = $oResult['o'];
    		
    		//$sSql = "SELECT s FROM ef_stmt WHERE p = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' AND o = '".$oData->concept."'";
    		$sSql = "SELECT o FROM ef_stmt WHERE p = 'http://www.w3.org/2000/01/rdf-schema#label' AND s = '".$conceptURI."'";    	
    		
    		$oResult = mysql_query($sSql, $oConn);
    		$oResult= mysql_fetch_array($oResult, MYSQL_ASSOC);
    		
    		$oData->concept = $oResult['o'];
	    	
    		if ($oData->relation != '')
			{
	    		$sSql = "SELECT o FROM ef_stmt WHERE p = 'http://www.w3.org/2000/01/rdf-schema#label' AND s LIKE '%".$oData->relation."%'";    	
	    		
	    		$oResult = mysql_query($sSql, $oConn);
	    		$oResult= mysql_fetch_array($oResult, MYSQL_ASSOC);
	    		
	    		if ($oResult['o'] != ''){$oData->relation = $oResult['o'];}
			}
    		
		}
		else if ($oData->URI == "true - property columns")
		{
	    		$sSql = "SELECT o FROM ef_stmt WHERE o = 'http://www.w3.org/2002/07/owl#ObjectProperty' AND s LIKE '%".$oData->relation."%'";    	
	    		
	    		$oResult = mysql_query($sSql, $oConn);
	    		//$oResult= mysql_fetch_array($oResult, MYSQL_ASSOC);
	    		
	    		if ($oData->method == "keyword list filter" || $oData->method == "Property based list filter")
	    		{
		    		if ($oData->concept == 'undefined'){$oData->method = "keyword list filter - complex"; $oData->subject = $oData->data; $oData->relation = ""; $oData->data = ""; $oData->concept = "";} //if "OR" checkbox for complex keyword list filter is used
		    		else
	    			{
			    		if (mysql_num_rows($oResult) > 0){$oData->relation = $oData->concept; $oData->data = ''; $oData->concept = '';} // if relation (object) property colum is used
			    		else {$oData->data = $oData->concept; $oData->relation = ''; $oData->concept = '';} // if data property colum is used	    		
		    		}
	    		}
	    		else
	    		{
		    		if (mysql_num_rows($oResult) > 0){$oData->relation = $oData->subject; $oData->data = '';} // if relation (object) property colum is used
		    		else {$oData->data = $oData->subject; $oData->relation = '';} // if data property colum is used	    		
    			}
		}
    	
    	
    	$sSql = "INSERT INTO ef_diaglog (method, subject, time, object_property, data_property, concept, user) VALUES ('".$oData->method."','".$oData->subject."', NOW(),'".$oData->relation."','".$oData->data."','".$oData->concept."','".mysql_real_escape_string($_COOKIE['email'])."') ";
	 			
    	mysql_query($sSql, $oConn) or die("something went wrong :(");
    	echo "true";
    	//echo $sSql;
 	    
   }
    
}
?>