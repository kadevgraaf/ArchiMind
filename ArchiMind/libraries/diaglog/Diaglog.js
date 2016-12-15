$(document).ready(function() 
{	
	Diaglog.initialise();	
});

Diaglog = {

		
		logSearch: function(methodology, subject, relation, data, concept, sync){

		//alert('voor vesturen' + methodology + subject + 'relation' + relation + 'data' + data + 'concept' + concept); 
		if (methodology == 'Expand instance properties' || methodology == 'In-pages semantic annotation - instance details' || methodology == 'In-pages semantic annotation - navigate to instance' || methodology == 'Navigate inverse relation')
		{
			var arrayVal = '{"method":"'+methodology+'", "subject":"'+subject+'", "relation":"'+relation+'", "data":"'+data+'", "concept":"'+concept+'", "URI":"true"}';	
		}
		else if (methodology == 'Result list faceting - object- or data properties in columns' || methodology == 'keyword list filter' || methodology == 'Property based list filter')
		{
			var arrayVal = '{"method":"'+methodology+'", "subject":"'+subject+'", "relation":"'+relation+'", "data":"'+data+'", "concept":"'+concept+'", "URI":"true - property columns"}';	
		}
		else
		{
			var arrayVal = '{"method":"'+methodology+'", "subject":"'+subject+'", "relation":"'+relation+'", "data":"'+data+'", "concept":"'+concept+'", "URI":"false"}';
		}
		
		
		//alert(arrayVal);
		//$.ajaxSetup({async:false}); //zet heel veel andere functies uit
		/*
					$.post(this.logsearchUrl, {data: arrayVal},
		            function (data) {
						//return true;
			});
		//$.ajaxSetup({async:true});//zet heel veel andere functies uit
		
		//return true;
					//return ret;
					//return false;
		

		*/
			   				$.ajax({
				   			  type: 'POST',
							  url: this.logsearchUrl,
							  data: {data: arrayVal},
							  async: sync,
							  success: function(data) 
							    {
								  //alert('verzonden' + data);
								  return true;
								}
							}); 
							//dataType: 'json',		
							//processData: false,				
					
			
			//			document.location.reload(true);
			//alert('test' + data);
			
		},
	
		setlogsearchUrl: function(){
			this.logsearchUrl = urlBase + 'diaglog/logsearch';
			
		},
		
		initialise: function(){
			this.setlogsearchUrl();
			
		}	
};

