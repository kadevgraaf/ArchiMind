<?php


class AnnotationController extends OntoWiki_Controller_Component
{
	public function init()
    {
        parent::init();
    }
    
    public function annotateAction()
    {
    	$oData = json_decode($this->_request->getParam('data'));

    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    	
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
    	$sSql = "INSERT INTO ef_annotation (instanceURI, phrase, conceptClass)
    			 VALUES ('". $this->_owApp->selectedResource ."','"
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
  			$this->view->phrase = $oData->phrase;
    }
    
     public function instancesdetailsAction()
    {
    }
   
    
    public function getannotationsAction()
    {    	
    	$oConfig = Erfurt_App::getInstance()->getConfig();
    	$oDbSettings = $oConfig->store->zenddb;
    	    		
    	$oConn = mysql_connect($oDbSettings->host, $oDbSettings->username, $oDbSettings->password);
    	mysql_select_db($oDbSettings->dbname, $oConn);
    	
   	    $oData = json_decode($this->_request->getParam('data'));
   	    
    	$aAnnotations = array();
    
    	if ($oData->resourceUri == '')
    	{
    		$sSql = "SELECT phrase, conceptClass FROM ef_annotation WHERE instanceURI = '".$this->_owApp->selectedResource."' AND phrase != '' AND phrase != ' '  ORDER BY phrase ASC";
		}
    	else
    	{
	    	//annotations in list view
    		$sSql = "SELECT phrase, conceptClass FROM ef_annotation WHERE instanceURI = '".$oData->resourceUri."' AND phrase != '' AND phrase != ' ' ORDER BY phrase ASC";
    		//echo $sSql;
    		/*
    		    		$sSql = "SELECT a.phrase as phrase, a.conceptClass as conceptClass, s.p  as p, s.o  as o ".
    		" FROM ef_annotation as a, ef_stmt as s WHERE a.instanceURI = '".$oData->resourceUri."' ".
    		" AND a.instanceURI = s.s ";
//KA TODO -> haal label uit aparte query!
    		*/
    		
		}

		unset($aAnnotations);
		$i = 0;
		$first = true;
    	$oReslink = mysql_query($sSql, $oConn) or die("something went wrong :(");
    	while($aResult = mysql_fetch_array($oReslink, MYSQL_ASSOC))
    	{
    		if($aResult != FALSE)
    		{
	    		
    			//$bAdded = false;
    			//for($i=0;$i<count($aAnnotations);$i++)
    			//{
	    			//get label of instance
				    	$labelSql = "SELECT s.o  as label ".
				    	" FROM ef_stmt as s WHERE s.s = '".$aResult['conceptClass']."' ".
				    	" AND s.p like '%label%' ";
				
				    	$labelReslink = mysql_query($labelSql, $oConn) or die("something went wrong :(");
				
				    	$labelResult = mysql_fetch_array($labelReslink, MYSQL_ASSOC);
				    	
					    if ($labelResult['label'] == ''){$labelResult['label'] = "NO LABEL";}
	    			
	    			
	    			if ($first == true)
	    			{
	    				$aAnnotations[$i]['phrase'] = array();
	    				$aAnnotations[$i]['phrase'] = $aResult['phrase'];
	    				
	    				$aAnnotations[$i]['conceptClass'] = array();
	    				$aAnnotations[$i]['conceptClass'][] = $aResult['conceptClass'];
	    				
	    				$aAnnotations[$i]['label'] = array();
	    				//$aAnnotations[$i]['label'][] = $labelResult['label'];
	    				
						//get label of instance
					    $aAnnotations[$i]['label'][] = $labelResult['label'];	    					    				
	    				
	    				$first = false;
	    			}
    				else if($aAnnotations[$i]['phrase'] == $aResult['phrase'])
    				{
	    				
	    				//create + fill array
					    $pstored = $aAnnotations[$i]['phrase'];
					    $cstored = $aAnnotations[$i]['conceptClass'];
					    $lstored = $aAnnotations[$i]['label'];
    					if(is_array($pstored))
    					{
					    	//$aAnnotations[$i]['phrase'][] = $labelResult['phrase'];
					    	$aAnnotations[$i]['conceptClass'][] = $labelResult['conceptClass'];
					    	//get label of instance
					    	$aAnnotations[$i]['label'][] = $labelResult['label'];	 
			    		}
			    		else
			    		{
				    		//prepend array with previous data
		    				//$aAnnotations[$i]['phrase'] = array();
		    				//$aAnnotations[$i]['phrase'][] = $pstored;
		    				//$aAnnotations[$i]['phrase'][] = $aResult['phrase'];
		    				
		    				$aAnnotations[$i]['conceptClass'] = array();
		    				$aAnnotations[$i]['conceptClass'] = $cstored;
		    				$aAnnotations[$i]['conceptClass'][] = $aResult['conceptClass'];
		    				
					    	//get label of instance
		    				$aAnnotations[$i]['label'] = array();
		    				$aAnnotations[$i]['label'] = $lstored;
		    				$aAnnotations[$i]['label'][] = $labelResult['label'];
    					}	    				
	    				
    				}
    				else
    				{
	    				//go to new phrase
	    				$i++;
	    				
	    				//create + fill array
	    				//$aAnnotations[$i]['phrase'] = array();
	    				$aAnnotations[$i]['phrase'] = $aResult['phrase'];
	    				
	    				//$aAnnotations[$i]['conceptClass'] = array();
	    				$aAnnotations[$i]['conceptClass'][] = $aResult['conceptClass'];
	    				
	    				$aAnnotations[$i]['label'] = array();
	    				//$aAnnotations[$i]['label'][] = $labelResult['label'];
	    				
						//get label of instance
					    $aAnnotations[$i]['label'][] = $labelResult['label'];	    					    				
    				}

    		}
    	}
    	    	
    	$aData['annotations'] = $aAnnotations;
    	$sString = json_encode($aData);    
    	echo $sString;
    }
}