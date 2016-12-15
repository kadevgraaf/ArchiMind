$(document).ready(function() 
{	
	Usermode.initialise();	
});

Usermode = {

		elm: null,
		setusermodeUrl: null,
		disableusermodeUrl: null,
	
		
	//	selectedText: null,
	//	annotationUrl: null,
	//	listinstancesUrl: null,
	//	currentUrl: null,
	//	annotationArray: null,
	//	highlightArray: new Array(),
	//	fetchUrl: null,

		switchToUserMode: function(){
			
			$.post(this.setusermodeUrl, {},
		            function (data) {
						alert(data);
						document.location.reload(true);
			});					
		},
		
		disableUserMode: function(){
			
			$.post(this.disableusermodeUrl, {},
		            function (data) {
						alert(data);
						document.location.reload(true);
			});					
		},
		
		getMode: function(){
			
			$.post(this.getmodeUrl, {},
		            function (data) {
						alert(data);
						document.location.reload(true);
			});					
		},		
		
		logSearch: function(methodology, subject, relation, data, concept, sync){

		//alert('voor vesturen' + methodology + subject + 'relation' + relation + 'data' + data + 'concept' + concept); 
		if (methodology == 'Expand instance properties' || methodology == 'In-pages semantic annotation - instance details' || methodology == 'In-pages semantic annotation - navigate to instance' || methodology == 'Navigate inverse relation')
		{
			var arrayVal = '{"method":"'+methodology+'", "subject":"'+subject+'", "relation":"'+relation+'", "data":"'+data+'", "concept":"'+concept+'", "URI":"true"}';	
		}
		else if (methodology == 'Result list faceting - object- or data properties in columns' || methodology == 'keyword list filter')
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
	
		setSetusermodeUrl: function(){
			this.setusermodeUrl = urlBase + 'usermode/switchtousermode';
			//alert('test' + this.setusermodeUrl);
		},
		
		setgetmodeUrl: function(){
			this.getmodeUrl = urlBase + 'usermode/getmode';
			//this.setgetmodeUrl = urlBase + 'usermode/getmode';
			//alert('test' + this.setusermodeUrl);
		},
		
		setDisableusermodeUrl: function(){
			this.disableusermodeUrl = urlBase + 'usermode/disableusermode';
		},
	
		setlogsearchUrl: function(){
			this.logsearchUrl = urlBase + 'usermode/logsearch';
			//alert('test' + this.setusermodeUrl);
		},
		
		initialise: function(){
			this.setSetusermodeUrl();
			this.setDisableusermodeUrl();
			this.setgetmodeUrl();
			this.setlogsearchUrl();
			//alert('test' + this.setusermodeUrl);
		}	
};

