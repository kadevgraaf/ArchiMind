$(document).ready(function() {

    //instantiate fields and properties
    var fields = new Array('subject', 'description', 'creator', 'publisher', 'type', 'source', 'relation', 'date', 'format', 'identifier');
    var property = new Array('http://purl.org/dc/elements/1.1/subject', 'http://purl.org/dc/elements/1.1/description', 'http://purl.org/dc/elements/1.1/creator', 'http://purl.org/dc/elements/1.1/publisher', 'http://purl.org/dc/elements/1.1/type', 'http://purl.org/dc/elements/1.1/source', 'http://purl.org/dc/elements/1.1/relation', 'http://purl.org/dc/elements/1.1/date', 'http://purl.org/dc/elements/1.1/format', 'http://purl.org/dc/elements/1.1/identifier')
    var oldsubject = false;
    var olddescription = false;
    var oldcreator = false;
    var oldpublisher = false;
    var oldtype = false;
    var oldsource = false;
    var oldrelation = false;
    var olddate = false;
    var oldformat = false;
    var oldidentifier = false;

    //put old value in formfield
    function preLoadForm(triple, property, formField)  {
        if(triple.property.value == property)  {
            $(formField).val(triple.object.value)
        }
    }

    //return 'uri' when uri else 'literal'
    function checkType(value)  {
        if(value.indexOf("http://") != -1)  {
            return 'uri';
        } else  {
            return 'literal';
        }
    }

    //find the old value of a property
    function findOldValue(triple, property, oldValue)  {
        if(!oldValue)  {
            if(triple.property.value == property )  {
                return triple.object.value;
            }  else  {
                return false;
            }
        }
        return oldValue;
    }

    //check if an object is empty
    function isEmpty(ob){
        for(var i in ob){ return false;}
        return true;
    }

    //show the edit form when the button is clicked and fill it with old values and initiate
    $("#metadatatoggle").click(function() {
        var queryEndpoint = urlBase + 'sparql';
        var query = 'SELECT DISTINCT ?property ?object where { <'+ $(".submit_btn:last").attr('resource')+'> ?property ?object.}';
        $.getJSON(queryEndpoint,{
            'query': query,
            'default-graph-uri': $(".submit_btn").attr('graph')
        },
        function(data)  {
            $.each(data.results.bindings, function(i, triple) {
                for(var i = 0; i < fields.length; i++)  {
                   preLoadForm(triple, property[i], '.'+fields[i]+':last')
                }
                });
            $('.metadata_form:last').toggle();
        });

        query = 'SELECT DISTINCT ?label ?subject ?x where { ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label . ?subject <'+'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'+'> ?x . }';
        $.getJSON(queryEndpoint,{
            'query': query,
            'default-graph-uri': $(".submit_btn").attr('graph')
        },
        function(data)  {
            var suggestions = [];
            var newObject = {};
            var type = "";
            $.each(data.results.bindings, function(i, triple) {
                type = triple.x.value;
                var typePos = type.split('#');
                if(typePos[1] != null)  {
                    type = typePos[1];
                }
                newObject = {text: triple.label.value+' - '+type, url: triple.subject.value};
                suggestions.push(newObject);
            });
            $(".subject:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".description:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".creator:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".publisher:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".type:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".source:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".relation:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".date:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".format:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
            $(".identifier:last").autocomplete(suggestions, {matchContains: true, max: 50, formatItem: function(item)  { return item.text} }).result(function(event,item) { $(this).val(item.url)} );
        });
    });

    //hide form when you click cancel
    $(".cancel_btn:last").click(function() {
      $('.metadata_form:last').hide();
    });


    //submit the form
    $(".submit_btn:last").click(function() {
        var queryEndpoint = urlBase + 'sparql';
        var updateEndpoint = urlBase + 'update';
        var graph = $(this).attr('graph');
        var resource = $(this).attr('resource');
        var insert = {};
        var remove = {};
        var query = 'SELECT DISTINCT ?property ?object where { <'+ $(".submit_btn:last").attr('resource')+'> ?property ?object.}';
        $.getJSON(queryEndpoint,{
            'query': query,
            'default-graph-uri': $("#submit_btn").attr('graph')
        },
        function(data)  {
            $.each(data.results.bindings, function(i, triple) {
                oldsubject = findOldValue(triple, 'http://purl.org/dc/elements/1.1/subject', oldsubject);
                olddescription = findOldValue(triple, 'http://purl.org/dc/elements/1.1/description', olddescription);
                oldcreator = findOldValue(triple, 'http://purl.org/dc/elements/1.1/creator', oldcreator);               
                oldpublisher = findOldValue(triple, 'http://purl.org/dc/elements/1.1/publisher', oldpublisher);
                oldtype = findOldValue(triple, 'http://purl.org/dc/elements/1.1/type', oldtype);
                oldsource = findOldValue(triple, 'http://purl.org/dc/elements/1.1/source', oldsource);
                oldrelation = findOldValue(triple, 'http://purl.org/dc/elements/1.1/relation', oldrelation);
                olddate = findOldValue(triple, 'http://purl.org/dc/elements/1.1/date', olddate);
                oldformat = findOldValue(triple, 'http://purl.org/dc/elements/1.1/format', oldformat);
                oldidentifier = findOldValue(triple, 'http://purl.org/dc/elements/1.1/identifier', oldidentifier);
            });
            var subject = $('.subject:last').val();
            var description = $('.description:last').val();
            var creator = $('.creator:last').val();
            var publisher = $('.publisher:last').val();
            var source = $('.source:last').val();
            var type = $('.type:last').val();
            var relation = $('.relation:last').val();
            var date = $('.date:last').val();
            var format = $('.format:last').val();
            var identifier = $('.identifier:last').val();
            var typeSubject = "";
            remove[resource] = {}
            if(oldsubject)  {
                typeSubject = checkType(oldsubject);
                remove[resource]['http://purl.org/dc/elements/1.1/subject'] = [{'type': typeSubject, 'value': oldsubject}];
            }
            if(oldcreator)  {
                typeSubject = checkType(oldcreator);
                remove[resource]['http://purl.org/dc/elements/1.1/creator'] = [{'type': typeSubject, 'value': oldcreator}];
            }
            if(olddescription)  {
                typeSubject = checkType(olddescription);
                remove[resource]['http://purl.org/dc/elements/1.1/description'] = [{'type': typeSubject, 'value': olddescription}];
            }
            if(oldpublisher)  {
                 typeSubject = checkType(oldpublisher);
                 remove[resource]['http://purl.org/dc/elements/1.1/publisher'] = [{'type': typeSubject, 'value': oldpublisher}];
            }
            if(oldtype)  {
                typeSubject = checkType(oldtype);
                remove[resource]['http://purl.org/dc/elements/1.1/type'] = [{'type': typeSubject, 'value': oldtype}];
            }
            if(oldsource)  {
                typeSubject = checkType(oldsource);
                remove[resource]['http://purl.org/dc/elements/1.1/source'] = [{'type': typeSubject, 'value': oldsource}];
            }
            if(oldrelation)  {
                typeSubject = checkType(oldrelation);
                remove[resource]['http://purl.org/dc/elements/1.1/relation'] = [{'type': typeSubject, 'value': oldrelation}];
            }
            if(olddate)  {
                typeSubject = checkType(olddate);
                remove[resource]['http://purl.org/dc/elements/1.1/date'] = [{'type': typeSubject, 'value': olddate}];
            }
            if(oldformat)  {
                typeSubject = checkType(oldformat);
                remove[resource]['http://purl.org/dc/elements/1.1/format'] = [{'type': typeSubject, 'value': oldformat}];
            }
            if(oldidentifier)  {
                typeSubject = checkType(oldidentifier);
                remove[resource]['http://purl.org/dc/elements/1.1/identifier'] = [{'type': typeSubject, 'value': oldidentifier}];
            }
            if(isEmpty(remove[resource]))  {
                remove = {};
            }
            insert[resource] = {};
            if(subject != "")  {
                typeSubject = checkType(subject);
                insert[resource]['http://purl.org/dc/elements/1.1/subject'] = [{'type': typeSubject, 'value': subject}];
            }
            if(creator != "")  {
                typeSubject = checkType(creator);
                insert[resource]['http://purl.org/dc/elements/1.1/creator'] = [{'type': typeSubject, 'value': creator}];
            }
            if(description != "")  {
                typeSubject= checkType(description);
                insert[resource]['http://purl.org/dc/elements/1.1/description'] = [{'type': typeSubject, 'value': description}];
            }
            if(publisher != "")  {
                typeSubject = checkType(publisher);
                insert[resource]['http://purl.org/dc/elements/1.1/publisher'] = [{'type': typeSubject, 'value': publisher}];
            }
            if(type != "")  {
                typeSubject = checkType(type);
                insert[resource]['http://purl.org/dc/elements/1.1/type'] = [{'type': typeSubject, 'value': type}];
            }
            if(source != "")  {
                typeSubject = checkType(source);
                insert[resource]['http://purl.org/dc/elements/1.1/source'] = [{'type': typeSubject, 'value': source}];
            }
            if(relation != "")  {
                typeSubject = checkType(relation);
                insert[resource]['http://purl.org/dc/elements/1.1/relation'] = [{'type': typeSubject, 'value': relation}];
            }
            if(date != "")  {
                typeSubject = checkType(date);
                insert[resource]['http://purl.org/dc/elements/1.1/date'] = [{'type': typeSubject, 'value': date}];
            }
            if(format != "")  {
                typeSubject = checkType(format);
                insert[resource]['http://purl.org/dc/elements/1.1/format'] = [{'type': typeSubject, 'value': format}];
            }
            if(identifier != "")  {
                typeSubject = checkType(identifier);
                insert[resource]['http://purl.org/dc/elements/1.1/identifier'] = [{'type': typeSubject, 'value': identifier}];
            }
            if(isEmpty(insert[resource]))  {
                insert = {};
            }
            $.getJSON(updateEndpoint,{
                'insert':  $.toJSON(insert),
                'delete': $.toJSON(remove),
                'named-graph-uri': graph
           }, function() {});
           window.setTimeout(function() {
            window.location.href = window.location.href
           }, 1000);
        });
     });
});

