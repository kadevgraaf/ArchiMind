$(document).ready(function() 
{	
	Highlight.initialise();	
});

Highlight = {
		elm: null,
		selectedText: null,
		annotationUrl: null,
		listinstancesUrl: null,
		currentUrl: null,
		annotationArray: null,
		highlightArray: new Array(),
		fetchUrl: null,
		setURLBase: null,
		last_instance_details: '',
		mode: '',

		getContentElement: function(){
			var arrayOfDivs = document.getElementsByTagName('span');
			//alert(arrayOfDivs);
			var howMany = arrayOfDivs.length;		
			//alert(howMany);
			for (var i=0; i < howMany; i++) {
				if (arrayOfDivs[i].getAttribute("property") != '')
				{
					//alert(arrayOfDivs[i].getAttribute("property"));
					//txtElem = new String(arrayOfDivs[i].getAttribute("property")); //increase performance (normal pages has ~108 elements with span tag, most are empty
					
					if(String(arrayOfDivs[i].getAttribute("property")).match('content')) {					
						//alert(String(arrayOfDivs[i].getAttribute("property")));
						this.elm = arrayOfDivs[i];					
					}
				}
			}
		},
		
		loadNavigation: function() {		
			var navigationStateSetupString = '{"navigationtwo":true,"state":{"limit":"40","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			navigationLoadTwo(null, navigationStateSetupString);
			//navigation-content2
			//usernavigation
		},
		
		handleAdd: function(objectUri, phrase){
			ontologyConcept = objectUri;
			var arrayVal = '{"ontoConcept":"'+ontologyConcept+'", "phrase":"'+phrase+'"}';
			
			//var navigationStateSetupString = '{"navigationtwo":true,"state":{"limit":"40","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			
			$.post(this.addAnnotationUrl, {data: arrayVal},
		            function (data) {
						alert(data);
						document.location.reload(true);
			});					
		},
		
		showLinked: function() {
			
		},
		
		getMousePosition: function(e){
			posx=0;posy=0;
			var coords = new Array();
			var ev=(!e)?window.event:e;//Moz:IE
			
			if (ev.pageX){ //Mozilla or compatible			
				posx=ev.pageX;posy=ev.pageY;
			}else if(ev.clientX){//IE or compatible			
				posx=ev.clientX;posy=ev.clientY;
			}else{
				return coords;
			}
			
			coords['x'] = posx;
			coords['y'] = posy;
			return coords;
		},
		
		positionMenu: function(e){
			var coords = this.getMousePosition(e);
			if(coords['x'])
			{
				var navContainerTwo = $('#navigation-contentcontainer');
				navContainerTwo.css('position', 'absolute');
				navContainerTwo.css('top', coords['y']+'px');
				navContainerTwo.css('left', coords['x']+'px');
				navContainerTwo.css('border', '2px solid grey');
				navContainerTwo.css('display', 'block');				
			}
			//document.getElementById('instance_details_container').style.display = 'none';
		},
		
		positionAddMenu: function(menu){
			
				var navContainerTwo = $('#navigation-contentcontainer');
				var menposition = navContainerTwo.css('position');
				var mentop = navContainerTwo.css('top');
				var menleft = navContainerTwo.css('left');
				var menborder = navContainerTwo.css('border');
				var mendisplay = navContainerTwo.css('display');				
				var menheight = navContainerTwo.css('height');
				//alert(mentop);
				var instancescontainer = $('#' + menu); // instances_container or instance_details_container
				if (menu == 'instances_container')
				{
					instancescontainer.css('position', menposition);
					instancescontainer.css('top', mentop);
					instancescontainer.css('left', (menleft.replace('px','') - 290) + 'px');
					instancescontainer.css('border', menborder);
					instancescontainer.css('display', mendisplay);				
				}
				else
				{
					//alert((mentop.replace('px','') + menheight.replace('px','') + 10));
					instancescontainer.css('position', menposition);
					instancescontainer.css('top', parseInt(mentop.replace('px','')) + parseInt(menheight.replace('px','')) + parseInt(10) + 'px');
					instancescontainer.css('left', (menleft.replace('px','') - 100) + 'px');
					instancescontainer.css('border', menborder);
					instancescontainer.css('display', mendisplay);				
					
				}
		},
		
		
		showInstances: function(uri, event){
			var arrayVal = '{"ontoConcept":"'+uri+'", "phrase":"'+this.selectedText+'"}';
			
			//var navigationStateSetupString = '{"navigationtwo":true,"state":{"limit":"40","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			
			$.post(this.listinstancesUrl, {data: arrayVal},
		            function (data) {
						if(!document.getElementById('instancescontainer'))
						{	
							var extraNavElm = document.createElement("div");
							extraNavElm.id  = "instancescontainer";
							extraNavElm.innerHTML = data;
							document.body.appendChild(extraNavElm);
						} else {
							extraNavElm = document.getElementById('instancescontainer');
							extraNavElm.innerHTML = data;
						}
						Highlight.positionAddMenu('instances_container');
						
			});	
		},
		
		
		instanceDetails: function(uri, event){
            //var expansion = $('<div class="expansion" style="font-size:90%"></div>');
            //target.parent().append(expansion);
 //           if (uri != this.last_instance_details)
  //          {
	            this.last_instance_details = uri; 
				$.post(urlBase + 'annotation/instancesdetails', {},
			            function (data) {
							if(!document.getElementById('instancescontainer'))
							{	
								var extraNavElm = document.createElement("div");
								extraNavElm.id  = "instancescontainer";
								extraNavElm.innerHTML = data;
								document.body.appendChild(extraNavElm);
							} else {
								extraNavElm = document.getElementById('instancescontainer');
								extraNavElm.innerHTML = data;
							}
							Highlight.positionAddMenu('instance_details_container');
							
				});	
				            
	            var url    = urlBase + 'view/';
	            var params = 'r=' + uri;
	            $.ajax({
	                url:      url, 
	                data:     params, 
	                dataType: 'html', 
	                success:  function(content) {
		                
		                var extraNavElm = document.getElementById('instances_details');
		                
							extraNavElm.innerHTML = content;
							//alert(extraNavElm.innerHTML);
							Highlight.positionAddMenu('instance_details_container');
								                
	                    //expansion.hide();
	                    //expansion.append(content);
	                    //expansion.slideDown(effectTime);
	                    
		                //archimate edit
		                //var target = $(event.target);
						//var resourceUri = target.next().attr('about') ? target.next().attr('about') : target.next().attr('resource');
		
						//Highlight.getAnnotations(uri); //does not work yet..
						//Highlight.registerAnnotationMenuEvent();
		                //alert(resourceUri);
		                //alert(target.next().attr('rel'));                    
		                
	                    /*map.updateInfoWindow([
	                        new GInfoWindowTab('', target.parent().html())
	                    ])*/ // only a javascript error, i think it was neccessery for the old ontowiki
	                }
	            });
	            Highlight.positionAddMenu();
	       // }
        }
        ,

		
		addTriple: function(resource){
		
			//ka
			//var describesProperty = "http://www.semanticweb.org/ontologies/2010/10/Ontology1288790966584.owl#contains_knowledge_about";
			//+++ andere kant op! http://www.semanticweb.org/ontologies/2010/10/Ontology1288790966584.owl#knowledge_is_located_in
			var insert = {};
			
			var graph = defaultGraph;
			var updateEndpoint = urlBase + 'update';
			
           //create relation from DC (wikipage) to arch. knowledge resource
			insert[defaultResource] = {'http://www.archimind.org/archimind/UvA-SA-ontology.owl#contains_knowledge_about': [{'type': 'uri', 'value': resource}]};
			
			$.getJSON(updateEndpoint,{
				'named-graph-uri': graph,
				'insert':  $.toJSON(insert)                          
           }, function(data) {
           });
           
           //create relation in opposite direction.  from arch. knowledge resource to DC (wikipage).
			insert[resource] = {'http://www.archimind.org/archimind/UvA-SA-ontology.owl#knowledge_is_located_in': [{'type': 'uri', 'value': defaultResource}]};
			$.getJSON(updateEndpoint,{
				'named-graph-uri': graph,
				'insert':  $.toJSON(insert)                          
           }, function(data) {
           });			
           
           //alert('test');
           //ka test var
			setTimeout("document.location.reload(true)", 1000);
		},
		
		
		getEventTarget: function(e){
			e = e || window.event;  
			return e.target || e.srcElement;  
		},
		
		addExtraMenu: function(){
			//we need to get the body element and add an extra navigation element	
			var extraNavElm = document.createElement("div");
			extraNavElm.id  = "navigation-contentcontainer";
			var extraNavButtons = document.createElement("div");
			extraNavButtons.id = "navigation-topmenu";
			extraNavElm.appendChild(extraNavButtons);
			var extraNavElmTwo = document.createElement("div");
			extraNavElmTwo.id = "navigation-content2";
			document.body.appendChild(extraNavElm);
			extraNavElm.appendChild(extraNavElmTwo);
			
		},
		
		setAnnotationUrl: function(){
			this.addAnnotationUrl = urlBase + 'annotation/annotate';
		},
		
		setListInstancesUrl: function(){
			this.listinstancesUrl = urlBase + 'annotation/listinstances';
		},
		
		setFetchUrl: function(){
			this.fetchUrl = urlBase + 'annotation/getannotations';
		},
		
		setURLBase: function(){
			this.urlBase = urlBase;
		},
		
		annotateText: function(){			
			if(this.annotationArray != null)
			{
				//remove old annotations:
				//$('.highlight').removeAttr("id");
				//$('.highlight').removeAttr("class");
				//alert('test' + $('.highlight').html);

				//if ($('.highlight').html != '')
				//{// there are existing annotations
				//	var i = 0;
				//}
				//else
				//{
					//var i = 0 
				//}
				
				for(var i = 0; i<this.annotationArray.length; i++) {
				//alert(this.annotationArray[i].phrase);
				//alert(this.annotationArray[i].marked);
					if(!this.annotationArray[i].marked){
						var matchText = new RegExp(this.annotationArray[i].phrase, "g");					
						var replacementText = '<span class="highlight" id="highlight'+i+'">'+this.annotationArray[i].phrase+'</span>';
						//alert(this.elm);
						Highlight.getContentElement();
						//alert(this.elm);
						if (this.elm != null)
						{
							var containerText = this.elm.innerHTML;
							containerText = containerText.replace(matchText, replacementText);
							var newText = containerText;
							this.elm.innerHTML = containerText;
							
							//mark the item as done, we dont want double spans
							this.annotationArray[i].marked = true;
							
							var highlightElm = $('#highlight'+i);
							this.highlightArray.push(highlightElm);					
							Highlight.registerAnnotationMenuEvent();
						}
						
						//mark the item as done, we dont want it to appear on the wrong wiki page
						this.annotationArray[i].marked = true;
					}						
				}
			}	
			
		},
		
		
		
		closeMenu: function(){
			var navContainerTwo = $('#navigation-content2');			
			navContainerTwo.empty();
			var navContentContainer = $('#navigation-contentcontainer');
			navContentContainer.css('display', 'none');			
			navigationContainer = $('#navigation-content');
			var navigationStateSetupString = '{"navigationtwo":false,"state":{"limit":"15","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			navigationLoadnoJSON(null, navigationStateSetupString);
		},
		
		getAnnotations: function(resUri){
			
			arrayVal = '{"resourceUri":"'+resUri+'"}';
			
			$.post(this.fetchUrl, {data: arrayVal},
		            function (data) {								
						if(data == 'false') {
							//no annotations, yay, saves work
						}else {						
							var myObject = JSON.parse(data);							
							if(myObject.annotations != null) {	
								//alert(data);
								if(Highlight.annotationArray != null) {	Highlight.annotationArray = Highlight.annotationArray.concat(myObject.annotations);}
								else {Highlight.annotationArray = myObject.annotations;}
								Highlight.annotateText();
							}
						}
			});
			//Highlight.closeMenu();
			//var navigationStateSetupString = '{"navigationtwo":false,"state":{"limit":"15","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			//var navigationStateSetupString = '{"state":{"limit":"10","path":[],"showEmpty":true,"showImplicit":true,"lastEvent":"init"},"config":{"name":"Classes","titleMode":"titleHelper","hierarchyTypes":["http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class"],"hierarchyRelations":{"in":["http://www.w3.org/2000/01/rdf-schema#subClassOf"]},"instanceRelation":{"out":["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]},"hiddenNS":["http://www.w3.org/1999/02/22-rdf-syntax-ns#","http://www.w3.org/2000/01/rdf-schema#","http://www.w3.org/2002/07/owl#"],"hiddenRelation":["http://ns.ontowiki.net/SysOnt/hidden"],"showImplicitElements":"1","showEmptyElements":"1","showCounts":"","checkSub":"1","hideDefaultHierarchy":""}}';
			//navigationLoad(null, navigationStateSetupString);
		},
		
		setCurrentUrl: function(){
			var aElem = $('#index a');
			this.currentUrl = aElem.context.URL;
		},
		
		addMenuAnnotations: function(urls, names, phrase){
			//alert(names[0]);
			//alert(urls);
			var navding = document.getElementById('navigation-topmenu');
			var extraNavElm = document.createElement("div");
		
			var titleelm = document.createElement("h1");
			titleelm.innerHTML = '"' + phrase + '"';
			var titleelm1 = document.createElement("p");
			titleelm1.innerHTML = '<strong>refers to knowledge about:</strong>';
			extraNavElm.appendChild(titleelm);
			extraNavElm.appendChild(titleelm1);
			
			if(!(urls instanceof Array))
			{
				var linkelm = document.createElement("a");
				linkelm.innerHTML = names;
				linkelm.setAttribute('onmouseover', 'Highlight.instanceDetails("'+escape(urls)+'");Diaglog.logSearch("In-pages semantic annotation - instance details", "'+names+'", "", "", "'+urls+'", true);');
				//linkelm.setAttribute('onclick', 'Highlight.CloseMenu' );
				linkelm.setAttribute('href', this.urlBase + 'view/?r='+ escape(urls) );
				linkelm.setAttribute('onclick', 'Diaglog.logSearch("In-pages semantic annotation - navigate to instance", "'+names+'", "", "", "'+urls+'", false);');
				extraNavElm.appendChild(linkelm);
			}
			else
			{
				for(var i = 0;i<urls.length;i++)
				{
					var linkelm = document.createElement("a");
					linkelm.setAttribute('onmouseover', 'Highlight.instanceDetails("'+escape(urls[i])+'"); Diaglog.logSearch("In-pages semantic annotation - instance details", "'+names[i]+'" , "", "", "'+urls[i]+'", true); ');	
					linkelm.setAttribute('onclick', 'Diaglog.logSearch("In-pages semantic annotation - navigate to instance", "'+names[i]+'", "", "", "'+urls[i]+'", false);');
					//linkelm.setAttribute('onclick', 'Highlight.CloseMenu' );
					linkelm.setAttribute('href', this.urlBase + 'view/?r='+ escape(urls[i]) );				

					linkelm.innerHTML = names[i];
					
					extraNavElm.appendChild(linkelm);
				}
			}	

			var htmlText = extraNavElm.innerHTML;			
			navding.innerHTML = htmlText;
		},
		
		
		listAnnotations: function(target){
			var text = target.id;
			var id = text.replace('highlight', '');
			var conceptClass = this.annotationArray[id].conceptClass;
			var labels = this.annotationArray[id].label;
			//alert(labels);
			//check if a label has been retrieved
			var rex = new RegExp(/[a-zA-Z0-9_]+$/);
			var labelArray = new Array();
			if(labels instanceof Array){
				for(var i=0;i<labels.length;i++){
					
					if (labels[i] == 'NO LABEL')
					{
						labelArray = rex.exec(conceptClass[i]);
						labels[i] = labelArray;
					}
					//var classNameArray = rex.exec(conceptClass[i]);
					//var classNameArray = labels[i];
					//var className = classNameArray[0];
					//labelArray[i] = classNameArray;
					//labelArray[i] = labels[i];
					//alert(this.annotationArray[id].label[i]);					
				}
			}
			else
			{
					if (labels == 'NO LABEL')
					{
						labelArray = rex.exec(labels);
						labels = labelArray;
					}
				//var classNameArray = rex.exec(conceptClass);
				//multiClasses[0] = classNameArray[0];
			}
			//alert(conceptClass.length);
			//alert(labels.length);
			
			//end check if a label has been retrieved

			this.addMenuAnnotations(conceptClass, labels, target.innerHTML);
		},
		
			registerAnnotationMenuEvent: function(){
				
				//alert(this.elm);	
			if(this.elm != null){				
				this.elm.onmouseup = function(event) {					
					var selectedText = document.getSelection();
					if(selectedText == "" || selectedText == " "){ //empty selection
						var target = Highlight.getEventTarget(event);
						Highlight.selectedText = target.innerHTML;
						
						if (target.nodeName == 'SPAN') //if highlight span has been selected
						{
							Highlight.positionMenu(event);
							Highlight.loadNavigation();
							Highlight.listAnnotations(target);
						}
						
					}
					else
					{
						/*
						//good version
						if(!this.mode)
						{
						
			   				$.ajax({
							  type: 'POST',
							  url: urlBase + 'usermode/getmode',
							  async: false,
							  data: ({}),
							  success: function(data) {
								  if (data == "input")
								  {
									Highlight.positionMenu(event);
									Highlight.selectedText = selectedText;
									Highlight.loadNavigation();
								  }
								  this.mode = data;
								}
							}); 
							
						}
						else if (this.mode == "input")
						{
							*/
							Highlight.positionMenu(event);
							Highlight.selectedText = selectedText;
							Highlight.loadNavigation();
						//}
					}
				}
			}				
			},

		initialise: function(){
			this.setURLBase();
			this.addExtraMenu();
			this.getContentElement();
			this.setAnnotationUrl();
			this.setListInstancesUrl();
			this.setFetchUrl();
			this.setCurrentUrl();
			this.getAnnotations('');

			
						//alert(this.elm);	
			if(this.elm != null){				
				this.elm.onmouseup = function(event) {					
					var selectedText = document.getSelection();
					if(selectedText == "" || selectedText == " "){ //empty selection
						var target = Highlight.getEventTarget(event);
						Highlight.selectedText = target.innerHTML;
						
						if (target.nodeName == 'SPAN') //if highlight span has been selected
						{
							Highlight.positionMenu(event);
							Highlight.loadNavigation();
							Highlight.listAnnotations(target);
						}
						
					}
					else
					{/*
						//good version
						if(!this.mode)
						{
			   				$.ajax({
							  type: 'POST',
							  url: urlBase + 'usermode/getmode',
							  async: false,
							  data: ({}),
							  success: function(data) {
								  if (data == "input")
								  {
									Highlight.positionMenu(event);
									Highlight.selectedText = selectedText;
									Highlight.loadNavigation();
								  }
								  this.mode = data;
								}
							}); 
							
						}
						else if (this.mode == "input")
						{
							*/
							Highlight.positionMenu(event);
							Highlight.selectedText = selectedText;
							Highlight.loadNavigation();
						//}
					}
				}
			}
		}	
};

