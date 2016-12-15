<?php


class UsermodeController extends OntoWiki_Controller_Component
{
	
    public $mode;

	public function init()
    {
        parent::init();
        
        //$this->mode = false;
        //$this->view->view_mode = "user";
    }
    
    public function switchtousermodeAction()
    {   
	    //$mode = $this->_owApp->mode;
	     $this->_owApp->mode = "user";
	    //$this->mode = true;
	    echo $this->_owApp->mode;
    }
    
    public function disableusermodeAction()
    {    	
	    $this->_owApp->mode = "input";
	    echo $this->_owApp->mode;
   }
    
    public function getmodeAction()
    {    	
 	    echo $this->_owApp->mode;
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
	    		
	    		if ($oData->method == "keyword list filter")
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
    
    /*
    public function annotateAction()
    {
    	$oData = json_decode($this->_request->getParam('data'));

    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    	
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
    	$sSql = "INSERT INTO ef_annotation (instanceURL, phrase, conceptClass)
    			 VALUES ('".$oData->currentUrl."','"
    			 			.$oData->phrase."','"
    			 			.$oData->ontoConcept."')";
	 			
    	mysql_query($sSql, $oConn) or die("something went wrong :(");

    	echo "succesfully added concept to phrase: ".$oData->phrase;    	
    }
    
    public function listinstancesAction()
    {
    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    	
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
    	$oData = json_decode($this->_request->getParam('data'));    	

    	$sSql = "SELECT s FROM ef_stmt WHERE p = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' AND o = '".$oData->ontoConcept."'";
    	
    	$oReslink = mysql_query($sSql, $oConn) or die("something went wrong :(");
    	$aInstances = array();
    	while($aResult = mysql_fetch_array($oReslink, MYSQL_ASSOC))
    	{    		
    		$sSql = "SELECT o FROM ef_stmt WHERE p = 'http://www.w3.org/2000/01/rdf-schema#label' AND s = '".$aResult['s']."'";    	
    		
    		$oResult = mysql_query($sSql, $oConn);
    		$aResultTwo = mysql_fetch_array($oResult, MYSQL_ASSOC);
    		
    		$aInstances[] = array('label' => $aResultTwo['o'], 'uri' => $aResult['s']);
    	}
    	
    	if(count($aInstances) == 0)
    	{
    		$this->view->instances = false;
    	}
  		else 
  		{
  			$this->view->instances = $aInstances;
  		}
    }
    
    public function getannotationsAction()
    {    	
    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    	
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
    	$oData = json_decode($this->_request->getParam('data'));
    	
    	$aAnnotations = array();
    	
    	$sSql = "SELECT phrase, conceptClass FROM ef_annotation WHERE instanceUrl = '".$oData->currentUrl."'";
    	

    	$oReslink = mysql_query($sSql, $oConn) or die("something went wrong :(");
    	while($aResult = mysql_fetch_array($oReslink, MYSQL_ASSOC))
    	{
    		if($aResult != FALSE)
    		{
    			$bAdded = false;
    			for($i=0;$i<count($aAnnotations);$i++)
    			{
    				if($aAnnotations[$i]['phrase'] == $aResult['phrase'])
    				{
    					$mClasses = $aAnnotations[$i]['conceptClass'];
    					if(is_array($mClasses))
    					{
    						$aAnnotations[$i]['conceptClass'][] = $aResult['conceptClass'];
    					}
    					else
    					{
    						$aAnnotations[$i]['conceptClass'] = array();
    						$aAnnotations[$i]['conceptClass'][] = $mClasses;
    						$aAnnotations[$i]['conceptClass'][] = $aResult['conceptClass'];
    					}
    					$bAdded = true;
    				}
    			}
    			if(!$bAdded)
    				$aAnnotations[] = $aResult;    				
    		}
    	}
    	    	
    	$aData['annotations'] = $aAnnotations;
    	$sString = json_encode($aData);    
    	echo $sString;
    }
    */
}