function LiteralEdit(graph, subject, predicate, object) {
    
    var rdfNS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    var xsdNS = 'http://www.w3.org/2001/XMLSchema#';
    
    this.ns = {};
    
    this.id = RDFauthor.getNextId();
    this.disclosureId = RDFauthor.getNextId();
    
    this.graph     = graph;
    this.subject   = subject;
    this.predicate = predicate;
    this.languages = RDFauthor.getLiteralLanguages();
    this.datatypes = RDFauthor.getLiteralDatatypes();
    
    if ($('table.Resource').length) {
        var ns = $('table.Resource').xmlns();
        for (var prefix in ns) {
            if (ns[prefix] == rdfNS || ns[prefix] == xsdNS) {
                this.ns[prefix] = ns[prefix];
            }
        }
    }
    
    this.languages.unshift('');
    // this.datatypes.unshift('');
    
    if (object) {
        this.object   = object.value;
        this.language = object.lang ? object.lang : '';
        this.datatype = object.datatype ? object.datatype : '';
    } else {
        this.object   = '';
        this.language = '';
        this.datatype = '';
    }
    
    this.remove = false;
}

LiteralEdit.prototype.eventsRegistered = false;

LiteralEdit.prototype.focus = function() {
    $('#literal-value-' + this.id).focus();
};

LiteralEdit.prototype.getHtml = function() {
    var widget = this;
    
    
    
    function shortArea() {
       	return '\
            <div class="container literal-value">\
                <textarea rows="1" cols="20" style="width:16em;height:1.4em;padding-top:0.2em" id="literal-value-' + 
                    widget.id + '">' + widget.object + '</textarea>\
            </div>\
            <div class="container util">\
                <a class="disclosure-button disclosure-button-horizontal open" id="' + widget.disclosureId + '" title="Toggle details disclosure"></a>\
            </div>';
    };
    
    function shortAreaFck(){
    	return '\
	        <div class="container literal-value">\
	            <textarea rows="1" name="editor1" cols="20" style="width:16em;height:1.4em;padding-top:0.2em" id="literal-value-' + 
	                widget.id + '">' + widget.object + '</textarea>\
	        </div>\
	        <div class="container util">\
	            <a class="disclosure-button disclosure-button-horizontal open" id="' + widget.disclosureId + '" title="Toggle details disclosure"></a>\
	        </div>';
    }
    
    function longArea() {
        return '\
            <div class="container literal-value">\
                <textarea rows="3" cols="20" style="width:29em" id="literal-value-' + 
                    widget.id + '">' + widget.object + '</textarea>\
            </div>\
            <div class="container util" style="clear:left">\
                <a class="disclosure-button disclosure-button-vertical open" id="' + widget.disclosureId + '" title="Toggle details disclosure"></a>\
            </div>';
    }
    
    function longAreaFck() {
    	return '\
        <div class="container literal-value">\
            <textarea rows="3" name="editor1" cols="20" style="width:29em" id="literal-value-' + 
                widget.id + '">' + widget.object + '</textarea>\
        </div>\
        <div class="container util" style="clear:left">\
            <a class="disclosure-button disclosure-button-vertical open" id="' + widget.disclosureId + '" title="Toggle details disclosure"></a>\
        </div>';
    }
    var predicateText = new String(this.predicate);
   
     if(this.predicate == "content" || predicateText.match('content'))
     {
    	 var html = '\
    	        ' + (this.isLarge() ? longAreaFck() : shortAreaFck()) + '\
    	        <div class="container literal-type util ' + this.disclosureId + '" style="display:none">\
    	            <label><input type="radio" class="radio" name="literal-type-' + this.id + '"' + ((this.datatype != '') ? '' : ' checked="checked"') + ' value="plain" />Plain</label>\
    	            <label><input type="radio" class="radio" name="literal-type-' + this.id + '"' + ((this.datatype != '') ? ' checked="checked"' : '') + ' value="typed" />Typed</label>\
    	        </div>\
    	        <div class="container util ' + this.disclosureId + '" style="display:none">\
    	            <div class="literal-lang"' + (this.datatype ? ' style="display:none"' : '') + '>\
    	                <label for="literal-lang-' + this.id + '">Language:\
    	                    <select id="literal-lang-' + this.id + '" name="literal-lang-' + this.id + '">\
    	                        ' + this.makeOptionString(this.languages, this.language) + '\
    	                    </select>\
    	                </label>\
    	            </div>\
    	            <div class="literal-datatype"' + (this.datatype ? '' : ' style="display:none"') + '>\
    	                <label>Datatype:\
    	                    <select id="literal-datatype-' + this.id + '" name="literal-datatype-' + this.id + '">\
    	                        ' + this.makeOptionString(this.datatypes, this.datatype, true) + '\
    	                    </select>\
    	                </label>\
    	            </div>\
    	        </div>\
    	        <script type="text/javascript"> if(!CKEDITOR.instances["literal-value-'+widget.id+'"]){CKEDITOR.replace( "editor1" );}else{var instance = CKEDITOR.instances["literal-value-'+ this.id + '"];CKEDITOR.remove(instance);CKEDITOR.replace("literal-value-' + this.id + '");}</script>';
     }
     else
     {
    	 var html = '\
    	        ' + (this.isLarge() ? longArea() : shortArea()) + '\
    	        <div class="container literal-type util ' + this.disclosureId + '" style="display:none">\
    	            <label><input type="radio" class="radio" name="literal-type-' + this.id + '"' + ((this.datatype != '') ? '' : ' checked="checked"') + ' value="plain" />Plain</label>\
    	            <label><input type="radio" class="radio" name="literal-type-' + this.id + '"' + ((this.datatype != '') ? ' checked="checked"' : '') + ' value="typed" />Typed</label>\
    	        </div>\
    	        <div class="container util ' + this.disclosureId + '" style="display:none">\
    	            <div class="literal-lang"' + (this.datatype ? ' style="display:none"' : '') + '>\
    	                <label for="literal-lang-' + this.id + '">Language:\
    	                    <select id="literal-lang-' + this.id + '" name="literal-lang-' + this.id + '">\
    	                        ' + this.makeOptionString(this.languages, this.language) + '\
    	                    </select>\
    	                </label>\
    	            </div>\
    	            <div class="literal-datatype"' + (this.datatype ? '' : ' style="display:none"') + '>\
    	                <label>Datatype:\
    	                    <select id="literal-datatype-' + this.id + '" name="literal-datatype-' + this.id + '">\
    	                        ' + this.makeOptionString(this.datatypes, this.datatype, true) + '\
    	                    </select>\
    	                </label>\
    	            </div>\
    	        </div>';
     }
   
    return html;
};

LiteralEdit.prototype.initDisplay = function () {
    if (!this.isLarge()) {
        $('textarea#literal-value-' + this.id).autoResize({extraSpace: 0});
    } else {
        $('textarea#literal-value-' + this.id).autoResize({extraSpace: 10}).trigger('change');
    }
};

LiteralEdit.prototype.isLarge = function () {
    if (this.object.search) {
        return ((this.object.length >= 50) || 0 <= this.object.search(/\n/));
    }
    
    return false;
}

LiteralEdit.prototype.makeOptionString = function(options, selected, replaceNS) {
    replaceNS = replaceNS || false;
    
    var optionString = '';
    for (var i = 0; i < options.length; i++) {
        var display = options[i];
        if (replaceNS) {
            for (var s in this.ns) {
                if (options[i].match(this.ns[s])) {
                    display = options[i].replace(this.ns[s], s + ':');
                    break;
                }
            }
        }
        
        var current = options[i] == selected;
        if (current) {
            // TODO: do something
        }
        
        // Firefox hack
        if (display == '') {
            display = '[none]';
        }
        
        optionString += '<option value="' + options[i] + '"' + (current ? 'selected="selected"' : '') + '>' + display + '</option>';
    }
    
    return optionString;
};

LiteralEdit.prototype.onCancel = function() {	
    return true;
};

LiteralEdit.prototype.onRemove = function() {
    this.remove = true;
};

LiteralEdit.prototype.onSubmit = function() {    
    var dataBank = RDFauthor.getDatabank(this.graph);
    
    // get new values
    var newObjectLiteralType = $('input[name=literal-type-' + this.id + ']:checked').eq(0).val();
    var newObjectLang        = $('#literal-lang-' + this.id + ' option:selected').eq(0).val();
    var newObjectDatatype    = $('#literal-datatype-' + this.id + ' option:selected').eq(0).val();
    var newObjectValue       = $('#literal-value-' + this.id).val();
    
    // no new value, perhaps the ckeditor?
    if(CKEDITOR.instances['literal-value-' + this.id])
    {
	    if(newObjectValue == '' || newObjectValue != CKEDITOR.instances['literal-value-' + this.id].getData())
	    {
	    	newObjectValue = CKEDITOR.instances['literal-value-' + this.id].getData();
	    }	
	    //alert('hoi'+ CKEDITOR.instances['literal-value-' + this.id].getData());
    }
    
    // Widget added an nothing entered and not removing
    if (this.object == '' && newObjectValue == undefined && !this.remove) {
        return true;
    }
    
    var somethingChanged = (newObjectValue != this.object) || (newObjectLang != this.language) || (newObjectDatatype != this.datatype);
    
    var oldTriple = null;
    var newTriple = null;
    
    if (somethingChanged || this.remove) {
        // remove old triple
        // BUG: this prevents removal of empty literals
        if (this.object !== '' || this.remove) {
            var objectOptions = {};
            var object = this.object;
            var quoteLiteral = true;            
            
            if (this.language !== '') {
                objectOptions.lang = this.language;
                quoteLiteral = false;
            } else if (this.datatype !== '') {
                objectOptions.datatype = this.datatype;
                quoteLiteral = false;
            }
            
            // add literal quotes
            if (quoteLiteral) {
                // replace quotes
                if (String(object).match(/["]/)) {
                    object = String(object).replace(/["]/g, '\\\"');
                }
                
                object = '"' + object + '"';
            }
            
            oldTriple = $.rdf.triple(
                $.rdf.resource('<' + this.subject + '>'), 
                $.rdf.resource('<' + this.predicate + '>'), 
                $.rdf.literal(object, objectOptions)
            );
        }
        
        if ((newObjectValue !== '') && !this.remove) {
            // add new triple
            var newObjectOptions = {};
            var newObject = newObjectValue;
            var quoteLiteral = true;
            
            if (newObjectLiteralType == 'plain') {                
                if (newObjectLang != '') {
                    quoteLiteral = false;
                    newObjectOptions.lang = newObjectLang;
                }
            } else {
                newObjectOptions.datatype = newObjectDatatype;
                quoteLiteral = false;
            }
            
            // add literal quotes
            if (quoteLiteral) {
                // replace quotes
                if (String(newObjectValue).match(/["]/)) {
                    newObjectValue = String(newObjectValue).replace(/["]/g, '\\\"');
                }
                
                newObject = '"' + newObjectValue + '"';
            }
            
            try {
                newTriple = $.rdf.triple(
                    $.rdf.resource('<' + this.subject + '>'), 
                    $.rdf.resource('<' + this.predicate + '>'), 
                    $.rdf.literal(newObject, newObjectOptions)
                );
            } catch (e) {
                alert('Could not save literal for the following reason: \n' + e.message);
                return false;
            }
        }
        
        // if we reach here, commit actual changes
        if (oldTriple) {
            dataBank.remove(oldTriple);
        }
        if (newTriple) {
            dataBank.add(newTriple);
        }
    }
    
    return true;
};

RDFauthor.loadScript(widgetBase + 'libraries/autoresize.jquery.min.js');
RDFauthor.registerWidget({constructorFunction: LiteralEdit, hookName: '__literal'});

if (!LiteralEdit.prototype.eventsRegistered) {
    $('.literal-type .radio').live('click', function() {
        var jDatatypeSelect = $('#' + $(this).attr('name').replace('literal-type', 'literal-datatype')).eq(0);
        var jLangSelect     = $('#' + $(this).attr('name').replace('literal-type', 'literal-lang')).eq(0);
        
        if ($(this).val() == 'plain') {
            jDatatypeSelect.closest('div').hide();
            jLangSelect.closest('div').show();
            // clear datatype
            jDatatypeSelect.val('');
        } else {
            jDatatypeSelect.closest('div').show();
            jLangSelect.closest('div').hide();
            // clear lang
            jLangSelect.val('');
        }
    });
    
    $('.disclosure-button').live('click', function() {
        // get disclosure button's id
        var id    = $(this).attr('id');
        var close = $(this).hasClass('open') ? true : false;
        
        // update UI accordingly
        var button = this;
        if (close) {
            $('.' + id).fadeIn(250, function() {
                $(button).removeClass('open').addClass('closed');
            });
        } else {
            $('.' + id).fadeOut(250, function() {
                $(button).removeClass('cosed').addClass('open');
            });
        }
    });
    
    LiteralEdit.prototype.eventsRegistered = true;
}