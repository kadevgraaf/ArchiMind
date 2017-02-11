<?php
/*
Code snippets adapted from http://graphite.ecs.soton.ac.uk/sparqllib/

Use of sparqllib.php

Simple library to query SPARQL from PHP.

©2010-12 Christopher Gutteridge, University of Southampton.

Under LGPL license
*/
/*
Note Author (Klaas Andries de Graaf):
Querys and data is often hardcoded (not dynamic from e.g. CASE tool database) with examples 
to allow for easy understanding of code. 
Making this fully dynamic + linking it to database/code repository is easy, but introduces more complex code to read for reviewers.
*/
require_once('sparqllib.php');
//$db = sparql_connect('http://dbpedia.org/sparql');
$db = sparql_connect('http://www.archimind.nl/archimindLOD/index.php/sparql');
//$query = "SELECT ?film
//WHERE { ?film <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:French_films> }";

//echo $_POST['query'];
//echo strlen(trim($_POST['query']));
//echo $_POST['query'];
//if ($_POST['query'] !== ""){$query = $_POST['query'];}
if (strlen(trim($_POST['query']))){$query = $_POST['query'];}
else{	
$query = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
SELECT *
WHERE { ?uri rdf:type AKO:Pattern . 
?uri AKO:description ?description . 
?uri AKO:knowledge_is_located_in ?wikipage . 
?uri rdf:seeAlso ?DBpedia}";
}

$result = sparql_query($query);
$fields = sparql_field_array($result);


//echo $_GET['query'];

?>
<!DOCTYPE html>
<html>
<head>
<title>ArchiMind SPARQL Query Endpoint Demo</title>
<script src="jquery-3.1.1.min.js"></script>
<script type="text/javascript">
    function predefined(question) {
    	//=============================Question 1===================
		var Q1 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT ?components ?datastores ?p ?impl_units  \n" +
"WHERE { \n" +
"{?impl_unit_class rdfs:subClassOf AKO:Architecture . \n" +
"?impl_units rdf:type ?impl_unit_class . \n" +
"?components rdf:type AKO:Component . \n" +
"?impl_units ?p ?components} UNION \n" +
"{?impl_unit_class rdfs:subClassOf AKO:Architecture . \n" +
"?impl_units rdf:type ?impl_unit_class .  \n" +
"?datastores rdf:type AKO:Data_store .  \n" +
"?impl_units ?p ?datastores } \n" +
"} \n" +
"LIMIT 2000";
		if (question == 1){$('#query').val(Q1);}
		//=============================Question 2===================
		var Q2 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT *  \n" +
"WHERE { \n" +
"{AKO:"+$('#Q2parameter').val()+" AKO:results_in ?impl_units} UNION \n" +
"{AKO:"+$('#Q2parameter').val()+" AKO:realized_by ?impl_units} UNION \n" +
"{AKO:"+$('#Q2parameter').val()+" AKO:depends_on ?decisions}  UNION \n" +
"{AKO:"+$('#Q2parameter').val()+" AKO:addressed_by ?decisions}} \n" +
"LIMIT 2000";
		if (question == 2){$('#query').val(Q2);}
		//=============================Question 3===================
		var Q3 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT DISTINCT ?uri \n" +
"WHERE { ?uri rdf:type AKO:Pattern} \n" +
"LIMIT 2000";
		if (question == 3){$('#query').val(Q3);}
		//=============================Question 4===================
		var Q4 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT ?FuncReq \n" +
"WHERE {{?FuncReq rdf:type uva-sa-ontology:Functional_requirement . \n" +
"?FuncReq ?p AKO:"+$('#Q4parameter').val()+"} UNION  \n" +
"{?FuncReq rdf:type AKO:Functional_requirement . \n" +
"AKO:"+$('#Q4parameter').val()+" ?p ?FuncReq }} \n" +
"LIMIT 2000";
		if (question == 4){$('#query').val(Q4);}
		//=============================Question 5===================
		var Q5 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT DISTINCT ?wikipage \n" +
"WHERE { \n" +
"?concern rdf:type AKO:Concern . \n" +
"?concern AKO:knowledge_is_located_in ?wikipage \n" +
"} \n" +
"LIMIT 2000";
		if (question == 5){$('#query').val(Q5);}
		//=============================requirements realized by architecture===================
		var D1 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT ?Req ?AKelement \n" +
"WHERE {{?Req rdf:type AKO:Functional_Requirement}  \n" +
"UNION {?Req rdf:type AKO:Non_functional_requirement }  \n" +
"OPTIONAL {?Req AKO:realized_by ?AKelement} .  \n" +
"FILTER(!bound(?AKelement))} \n" ;
		if (question == 6){$('#query').val(D1);}
		//=============================decisions not realized===================
		var D2 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT ?Req ?decision \n" +
"WHERE {{?Req rdf:type AKO:Functional_Requirement}  \n" +
"UNION {?Req rdf:type AKO:Non_functional_requirement }  \n" +
"OPTIONAL{?Req AKO:addressed_by ?decision}. \n" +
"FILTER(!bound(?decision))} \n" ;
		if (question == 7){$('#query').val(D2);}
		//=============================Question 3 - patterns with context - LOD===================
		var D3 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT * \n" +
"WHERE { ?uri rdf:type AKO:Pattern .  \n" +
"?uri AKO:description ?description .  \n" +
"?uri AKO:knowledge_is_located_in ?wikipage .  \n" +
"?uri rdf:seeAlso ?DBpedia}  \n" ;
		if (question == 8){$('#query').val(D3);}		
		//=============================Other queries================
		var X1 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:> \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n" +
"SELECT *  \n" +
"LIMIT 2000";
		if (question == 60){$('#query').val(X1);}
		
		
		//=============================CASE 1================
var CASE1 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:>  \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>  \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  \n" +
"SELECT DISTINCT ?requirement ?req_name  \n" +
"WHERE  \n" +
"{AKO:Business_rules_engine AKO:satisfies ?requirement .  \n" +
"?requirement rdfs:label ?req_name} ";
	if (question == 10){$('#case').val('reqs1'); $('#query').val(CASE1);}
		
		//=============================CASE 2================
var CASE2 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:>   \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>   \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>   \n" +
"SELECT DISTINCT ?decision ?dec_name   \n" +
"WHERE   \n" +
"{?decision AKO:decision_is_about AKO:Business_rules_engine .   \n" +
"?decision rdfs:label ?dec_name}  ";
	if (question == 11){$('#case').val('decs1'); $('#query').val(CASE1);}
		
		//=============================CASE 3================
var CASE3 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:>  \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>  \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  \n" +
"SELECT DISTINCT ?requirement ?req_name  \n" +
"WHERE  \n" +
"{AKO:Transformer AKO:satisfies ?requirement .  \n" +
"?requirement rdfs:label ?req_name} ";
	if (question == 12){$('#case').val('reqs2'); $('#query').val(CASE3);}
		
		//=============================CASE 4================
var CASE4 = "PREFIX AKO: <http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl:>   \n" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>   \n" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>   \n" +
"SELECT DISTINCT ?decision ?dec_name   \n" +
"WHERE   \n" +
"{?decision AKO:decision_is_about AKO:Transformer .   \n" +
"?decision rdfs:label ?dec_name}  ";
	if (question == 13){$('#case').val('decs2'); $('#query').val(CASE4);}
	

		//=============================execute================
    	//alert('To execute: press "Submit Query"-button in top-right of screen');
    	$('.submit').click();
	}
</script>
</head>
<body>
<center><h1>ArchiMind SPARQL query endpoint demo  - Architecture Documentation Review</h1></center>
<div id='casediv' style="background-color: lightgreen;">
<h2>CASE tool example</h2>
<b>Tasks</b> <br />
<ul>
<li>Implement component <b>Business rules engine</b> (<a href='http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ABusiness_rules_engine' target='_blank'>See knowledge in ArchiMind</a>)
<?php 
if ($_POST['case'] == 'reqs1'){
	echo " <br \>- [Related requirements in ArchiMind: ";
		if (sparql_num_rows( $result ) > 0)
		{
			while($row = sparql_fetch_array($result))
			{
			  foreach($fields as $field)
			  {
				  if(strpos($row[$field], "ttp:") !== false)
				  {echo "<a href='".$row[$field] . "' target='_blank'>";}
				  else
				  {echo $row[$field] . "</a>, ";}
			    //print"$row[$field] <br\>";
			  }
			}
		}
		else
		{
			echo '<b>ARCHITECTURAL RULE VIOLATION - NO RELATED REQUIREMENTS <a href="http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ABusiness_rules_engine" target="_blank">Change</a></b>';
		}

		echo '] <br \>- <a href="#" onclick="predefined(11);">[find related decisions in ArchiMind]</a>';
}
else if ($_POST['case'] == 'decs1'){
	echo ' <br \>- <a href="#" onclick="predefined(10);">[find related requirements in ArchiMind]</a> <br \>- [Related decisions in ArchiMind: ';
		if (sparql_num_rows( $result ) > 0)
		{
			while($row = sparql_fetch_array($result))
			{
			  foreach($fields as $field)
			  {
				  if(strpos($row[$field], "ttp:") !== false)
				  {echo "<a href='".$row[$field] . "' target='_blank'>";}
				  else
				  {echo $row[$field] . "</a>, ";}
			    //print"$row[$field] <br\>";
			  }
			}
		}
		else
		{
			echo '<b>ARCHITECTURAL RULE VIOLATION - NO RELATED DECISIONS <a href="http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ABusiness_rules_engine" target="_blank">Change</a></b>';
		}
		echo '] ';
}
else{
	echo ' <br \>- <a href="#" onclick="predefined(10);">[find related requirements in ArchiMind]</a> <br \>- <a href="#" onclick="predefined(11);">[find related decisions in ArchiMind]</a>';
}
?>
<br \>[Link to code repository] [Link to JIRA project planning]
<br \>[Notes:]
<textarea rows="3" cols="40" name="notes" id="notes">Get rules from business stakeholders. Check with finance.</textarea>
[comments:]
<textarea rows="3" cols="40" name="notes" id="notes">Goes in release 3.01.x.</textarea>
[Reply]<br \>
<br \>
</li>
<li>Implement component <b>Transformer (business)</b> (<a href='http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ATransformer' target='_blank'>See knowledge in ArchiMind</a>)
<?php 
if ($_POST['case'] == 'reqs2'){
	echo " <br \>- [Related requirements in ArchiMind: ";
		if (sparql_num_rows( $result ) > 0)
		{
			while($row = sparql_fetch_array($result))
			{
			  foreach($fields as $field)
			  {
				  if(strpos($row[$field], "ttp:") !== false)
				  {echo "<a href='".$row[$field] . "' target='_blank'>";}
				  else
				  {echo $row[$field] . "</a>, ";}
			    //print"$row[$field] <br\>";
			  }
			}
		}
		else
		{
			echo '<b>ARCHITECTURAL RULE VIOLATION - NO RELATED REQUIREMENTS <a href="http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ATransformer" target="_blank">Change</a>]</b>';
		}

		echo '] <br \> - <a href="#" onclick="predefined(13);">[find related decisions in ArchiMind]</a>';
}
else if ($_POST['case'] == 'decs2'){
	echo ' <br \>- <a href="#" onclick="predefined(12);">[find related requirements in ArchiMind]</a> <br \>- [Related decisions in ArchiMind: ';
		if (sparql_num_rows( $result ) > 0)
		{
			while($row = sparql_fetch_array($result))
			{
			  foreach($fields as $field)
			  {
				  if(strpos($row[$field], "ttp:") !== false)
				  {echo "<a href='".$row[$field] . "' target='_blank'>";}
				  else
				  {echo $row[$field] . "</a>, ";}
			    //print"$row[$field] <br\>";
			  }
			}
		}
		else
		{
			echo '<b>ARCHITECTURAL RULE VIOLATION - NO RELATED DECISIONS <a href="http://www.archimind.nl/archimindLOD/index.php/view/r/sadocontology1.owl%3ATransformer" target="_blank">Change</a></b>';
		}
		echo ']';
}
else{
	echo ' <br \>- <a href="#" onclick="predefined(12);">[find related requirements in ArchiMind]</a> <br \>- <a href="#" onclick="predefined(13);">[find related decisions in ArchiMind]</a>';
}
?>
<br \>[Link to code repository] [Link to JIRA project planning]
<br \>[Notes]
<textarea rows="5" cols="40" name="notes" id="notes">Transformation in DL.</textarea>
[comments:]
<textarea rows="5" cols="40" name="notes" id="notes">Goes in release 2.02.x.</textarea>
[Reply]
</li>
</ul>
</div>
<div id='editordiv' style="background-color: lightblue;">
<br />
<h2>Predefined queries and SPARQL Query Editor - similar to UI in ArchiMind</h2>
<b>Predefined SPARQL queries: </b> <i>(to adapt queries: change query in SPARQL Query editor textbox and press "Submit Query"-button in top-right of screen)</i>
<ul>
<li>Question 1: List ten development dependencies between implementation units. <input type="button" value="Query" onclick="predefined(1);"></li>
<li>Question 2: Which implementation units and decisions are explicitly related to requirement <input id="Q2parameter" type="text" value="Security">?<input type="button" value="Query" onclick="predefined(2);"></li>
<li>Question 3: Which architectural patterns are described in the architecture?<input type="button" value="Query" onclick="predefined(3);"></li>
<li>Question 4: Which functional requirements are related to non-functional requirement <input id="Q4parameter" type="text" value="Compatability">? <input type="button" value="Query" onclick="predefined(4);"></li>
<li>Question 5: Find ten wikipages in which the concerns of the stakeholders are addressed (not just listed).<input type="button" value="Query" onclick="predefined(5);"></li>
<!--<li>SPARQL query for identifying requirements are not realized by at least one element in the architecture.<input type="button" value="Query" onclick="predefined(6);"></li>
<li>SPARQL query for identifying which requirements are not yet addressed by a decision.<input type="button" value="Query" onclick="predefined(7);"></li>-->
<li>SPARQL query for question 3 - Architectural patterns, with additional context, links to wikipages, and links to context information from Linked Open Data on DBpedia.org.<input type="button" value="Query" onclick="predefined(8);"></li>
</ul>
<center>
<form action="query.php" method="POST">
<textarea rows="15" cols="100" name="query" id="query"><?php echo $_POST['query'];?></textarea>
<br/>
<input type="hidden" type="text" id="case" name="case">
<input class="submit" type="submit" id="submit" name="submit" value="submit">
</form>
</center>
<?php

if($_POST['case'] == 'decs1' || $_POST['case'] == 'reqs1' || $_POST['case'] == 'decs2' || $_POST['case'] == 'reqs2')
{
	$result = sparql_query($query);
	$fields = sparql_field_array($result);
}

print "<p>Number of results: ".sparql_num_rows( $result )." results.</p>";
print "<table class='example_table' border='1'>";
print "<tr>";
foreach( $fields as $field )
{
	print "<th>$field</th>";
}
print "</tr>";
while( $row = sparql_fetch_array( $result ) )
{
	print "<tr>";
	foreach( $fields as $field )
	{
	  if(strpos($row[$field], "ttp:") !== false)
	  {print "<td><a href='".$row[$field] . "' target='_blank'>" . $row[$field] . "</a></td>";}
	  else
	  {print "<td>$row[$field]</td>";}
	}
	print "</tr>";
}
print "</table>";
/*
while($row = sparql_fetch_array($result))
{
  foreach($fields as $field)
  {
	  if(strpos($row[$field], "ttp:") !== false)
	  {echo "<a href='".$row[$field] . "' target='_blank'>" . $row[$field] . "</a><br/>";}
	  else
	  {echo $row[$field] . "<br/>";}
    //print"$row[$field] <br\>";
  }
}
*/
?>
<b><a id='refresh' href='http://softcode.nl/querytool/query.php'>refresh</a></b>
</div>
<?php 
//echo $_POST['case'];
//echo $_POST['query'];
if($_POST['case'] != '')
{
//	echo "test";
	?>
<script type="text/javascript">
$(function() {
	//alert('test');
	$("#casediv").focus();
});
</script>
<?php
} else if($_POST['query'] != '')
{
	
?>
<script type="text/javascript">
$(function() {
	//alert('test1');
	$("#refresh").focus();
});
</script>
<?php
}
?>

</body>

</html>