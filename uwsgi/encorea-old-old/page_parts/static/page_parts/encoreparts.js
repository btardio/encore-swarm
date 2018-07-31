
var yearfacetedlst = [];
var makefacetedlst = [];
var modelfacetedlst = [];
var engineliterslst = [];
var enginecylinderlst = [];
var enginecclst = [];
var engineboreinchlst = [];
var enginestrokeinchlst = [];
var productfacetedlst = [];

var yearfacetedselectedlst = [];
var makefacetedselectedlst = [];
var modelfacetedselectedlst = [];
var enginelitersselectedlst = [];
var enginecylinderselectedlst = [];
var engineccselectedlst = [];
var engineboreinchselectedlst = [];
var enginestrokeinchselectedlst = [];
var productfacetedselectedlst = [];

var fqs = [];

var currentsort = "partnumber";
var currentoemsort = "yearfaceted";

function clearfqslist(){
    
    fqs.length = 0;
    
}


function alertfqslist(){
    
    liststr = ""
    
    $.each( fqs, function( i )
    {
     
        
        liststr += fqs[i] + " ";
        
        
    });
    
    alert(liststr);
    
}

/*
 * 
 * Gathers the facet query and creates a seleted lst of options
 * 
 */
function gatherfqs(){
    
    clearfqslist();
        
    $.each( $("#body_year_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("yearfaceted:" + yearfacetedlst[val.index]);
        yearfacetedselectedlst.push(yearfacetedlst[val.index]);
    } );
    
    $.each( $("#body_make_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("makefaceted:" + makefacetedlst[val.index]);
        makefacetedselectedlst.push(makefacetedlst[val.index]);
    } );        

    $.each( $("#body_model_select").prop("selectedOptions"), function( key, val ) 
    {
        
        fqs.push("modelfaceted:" + modelfacetedlst[val.index]);
        modelfacetedselectedlst.push(modelfacetedlst[val.index]);
        
    } );        
    
    $.each( $("#body_engineliters_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("engineliters:" + engineliterslst[val.index]);
        enginelitersselectedlst.push(engineliterslst[val.index]);
    } );
    
    $.each( $("#body_enginecylinder_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("enginecylinder:" + enginecylinderlst[val.index]);
        enginecylinderselectedlst.push(enginecylinderlst[val.index]);
    } );      
    
    $.each( $("#body_enginecc_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("enginecc:" + enginecclst[val.index]);
        engineccselectedlst.push(enginecclst[val.index]);
    } );
    
    $.each( $("#body_engineboreinch_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("engineboreinch:" + engineboreinchlst[val.index]);
        engineboreinchselectedlst.push(engineboreinchlst[val.index]);
    } );
    
    $.each( $("#body_enginestrokeinch_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("enginestrokeinch:" + enginestrokeinchlst[val.index]);
        enginestrokeinchselectedlst.push(enginestrokeinchlst[val.index]);
    } );
    
    $.each( $("#body_product_select").prop("selectedOptions"), function( key, val ) 
    {
        fqs.push("productfaceted:" + productfacetedlst[val.index]);
        productfacetedselectedlst.push(productfacetedlst[val.index]);
    } );
    
}

/*
 * whenever a select changes this gathers the facets selected, refills
 * the selects and makes the search request
 * 
 * if a search button were every implemented user can search with having 
 * an empty selectedlst even though things are selected, this is because
 * this list is filled whenever a select changes with onchange
 */
function onchangeselect( domelement ){
    
    domelement.change(function () {
        
        gatherfqs();
        
        fill ();
        
        makesearchrequest({}, currentsort);
        
    });
    
}

/*
 * converts the facetquery list into a String
 */
function gatherfqstring(){
    
    fqstr = ""
    
    $.each( fqs, function( i )
    {

        if ( i != 0 ){
            fqstr += " AND ";
        }
        fqstr += fqs[i].replace(":", ":\"") + "\"";
        
    });
    
    return fqstr;

}

// used for facet search, solr returns a json str, the results are made into a dict for each facet
function makeintodict( alist ){

    count = 2;
    keystr = ""
    var adict = {};
    
    $.each( alist, function( key, val ) {
        
        if ( count % 2 == 0 ){
            
            keystr = val;

        }
        else {
            adict[keystr] = val;
        }
        
        count += 1;
        
    } );
    
    return adict;
    
}

/*
 * Makes an ajax request to solr with facetdict as parameters,
 * fills the select boxes with values
 * Affects the following global variables:
 * outlst: this list contains the inner text of the options for the select, it is used to create the fq and 
 *         determine which options are selected
 * selectedlst: after reselectemptiedfields is called the list is cleared, if a search button were every implemented
 *              user can search with having an empty selectedlst even though things are selected, this is because
 *              this list is filled whenever a select changes with onchange
 * 
 * domelement: the select box to fill
 * facetdict: the parameters for the solr request
 * expectedlst: expected fields returned by the query
 * errorcode: the error to log for the request, which select box failed
 * outlst: this lst contains the options for the select, it is populated after query
 * selectedls: this lst contains the options selected prior to query, it is used to reselect after query
 * reverse: this boolean determines sort order, currently it is not changed whenever user clicks on table column
 */
function makefacetrequest ( domelement, facetdict, expectedlst, errorcode, outlst, selectedlst, reverse ){

    gatheredstr = gatherfqstring();
    
    if ( gatheredstr != "" ){
        facetdict['fq'] = gatheredstr;
    }
        
    domelement.empty();
    
    // note: there are only a certain number of acceptable fields for the request's facetdict
    $.getJSON( "http://" + domain + "/makefacetrequest", facetdict,
        function( data, status, xhr ) { 
            
            try {
                
                var count = 0;
                var items = [];
                
                // check that what was returned by the query is what was expected
                if ( ! expectedlst[0] in data || 
                     ! expectedlst[1] in data[expectedlst[0]] || 
                     ! expectedlst[2] in data[expectedlst[0]][expectedlst[1]] ||
                     ! Array.isArray(data[expectedlst[0]][expectedlst[1]][expectedlst[2]] ) ){
                    
                    domelement.append("Something has gone wrong. This error has been logged.");
                    alert("Something has gone wrong. This error has been logged.");
                    $.get( "http://" + domain + "/logerror?errorcode=" + errorcode + "&errormessage=" + xhr.responseText);
                
                }
                else{
                    
                    // empty the outlst to refill it with entries from the query
                    outlst.length = 0;
                    
                    // makes the results into a dict
                    adict = makeintodict( data[expectedlst[0]][expectedlst[1]][expectedlst[2]] );
                    
                    // sorts the facet results, could be done by solr, but nyi
                    iterlist = Object.keys(adict).sort();
                    
                    if ( reverse ){
                        iterlist = iterlist.reverse();
                    }
                    
                    // iterates the results from solr, creating options
                    $.each( iterlist, function( key, val ) 
                    {
                        
                        var option = $("<option></option>");
                        
                        option.append(val + " (" + adict[val] + ")");
                        
                        domelement.append(option);
                        
                        // stores the options in a list - psuedo javascript pointer
                        // to a global variable
                        outlst.push(val);
                        
                    });
                    
                }
        
            }
            catch(error) {
                domelement.append("Something has gone wrong. This error has been logged.");
                alert("Something has gone wrong. This error has been logged.");
                $.get( "http://" + domain + "/logerror?errorcode=" + errorcode + "&errormessage=" + xhr.responseText);
            }
            
            // reselects fields that were previously selected, clears the selected list (psuedo pointer)
            reselectemptiedfields( domelement, selectedlst );
            
        }).fail(function(xhr) {
            domelement.append("Something has gone wrong. This error has been logged.");
            alert("Something has gone wrong. This error has been logged.");
            $.get( "http://" + domain + "/logerror?errorcode=" + errorcode + "&errormessage=" + xhr.responseText);
            
        });

}

// determines if the fields in the select domelement match that lstselected and 
// reselects them
function reselectemptiedfields( domelement, lstselected ){
    
    $.each( domelement.prop("children"), function( k, v )
    {
        
        $.each( lstselected, function( ka, va ){
            
            if ( v.innerHTML.replace("&amp;", "&").includes(va) ){
                v.selected = true;
            }
            
        });
        
    });

    lstselected.length = 0;
    
    //gatherfqs(); // don't know if this is necessary after lst selected is emptied recreate lstselected and fqs
    
}

// creates a header row for the table
function createheaderrow( sort ){
    
    var sortglyphstr = '&nbsp;<span class="ui-icon ui-icon-caret-1-s"></span>';
    
    searchrow = $("<tr></tr>");
    
    headercolumn = $('<th style="width:16%;"><div id="sortpartnumber" class="encoresort">Part Number' + 
                        ( currentsort == "partnumber" ? sortglyphstr : "") + 
                        '</div></th>');
    headercolumn.click( function(){currentsort = "partnumber"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    headercolumn = $('<th style="width:19%;"><div id="sortproduct" class="encoresort">Product' +
                        ( currentsort == "productfaceted" ? sortglyphstr : "") + 
                        '</div></th>'); 
    headercolumn.click(  function(){currentsort = "productfaceted"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    headercolumn = $('<th style="width:14%;"><div id="sortyear" class="encoresort">Year' + 
                        ( currentsort == "yearfaceted" ? sortglyphstr : "") +
                        '</div></th>'); 
    headercolumn.click(  function(){currentsort = "yearfaceted"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    headercolumn = $('<th style="width:16%;"><div id="sortmake" class="encoresort">Make' +
                        ( currentsort == "makefaceted" ? sortglyphstr : "") +
                        '</div></th>'); 
    headercolumn.click(  function(){currentsort = "makefaceted"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    headercolumn = $('<th style="width:16%;"><div id="sortmodel" class="encoresort">Model' + 
                        ( currentsort == "modelfaceted" ? sortglyphstr : "") +
                        '</div></th>'); 
    headercolumn.click(  function(){currentsort = "modelfaceted"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    headercolumn = $('<th style="width:16%;"><div id="sortengine" class="encoresort">Engine' +
                        ( currentsort == "engineliters" ? sortglyphstr : "") + 
                        '</div></th>'); 
    headercolumn.click(  function(){currentsort = "engineliters"; makesearchrequest ( {}, currentsort );});
    searchrow.append( headercolumn );
    
    return searchrow;
}
    
/*
 * 
 * Makes an ajax request to solr with facetdict and sort as parameters
 * This function fills the table in tab 1 with values received from solr, 
 * links are created in the table for detailed product search
 * 
 */
var searchresults;
function makesearchrequest ( facetdict, sort ){

    gatheredstr = gatherfqstring();
    
    $("#encoreparts").empty();
    
    if ( gatheredstr != "" ){
        facetdict['fq'] = gatheredstr;

        facetdict['sort'] = sort + " asc";
        
        // note: there are only a certain number of acceptable fields for the request's facetdict
        $.getJSON( "http://" + domain + "/makesearchrequest", facetdict,
            function( data ) { 

                searchresults = data;
                
                searchtable = $('<table style="border-width:0; width:70%; margin-left:15%; margin-right:15%;" class="w3-table-all w3-responsive w3-tiny w3-card-4 w3-hoverable"></table>');
                
                searchrow = createheaderrow(sort);
                
                searchtable.append(searchrow);
                
                // iterates the search results creating a row
                $.each( $(data).attr("response").docs, function( index, doc ) 
                {
                    searchrow = $('<tr class="encoreproductrow"></tr>');
                    
                    searchrow.append('<td>' + ( doc.partnumber ? doc.partnumber : "") + "</td>"); searchtable.append(searchrow);
                    
                    searchrow.append('<td>' + ( doc.product ? doc.product : "") + "</td>"); searchtable.append(searchrow);
                    
                    searchrow.append('<td>' + ( doc.year ? doc.year : "" ) + "</td>"); searchtable.append(searchrow);
                    
                    searchrow.append('<td>' + ( doc.make ? doc.make : "" ) + "</td>"); searchtable.append(searchrow);
                    
                    searchrow.append('<td>' + ( doc.model ? doc.model : "" ) + "</td>"); searchtable.append(searchrow);
                    
                    searchrow.prop("encorepartnumber", doc.partnumber);
                    
                    searchrow.append('<td>' + 
                                    ( doc.engineliters ? doc.engineliters + "L " : "" ) + 
                                    ( doc.enginecylinder ? doc.enginecylinder + " Cyl " : "" ) + 
                                    ( doc.enginecc ? doc.enginecc.toString() + "cc " : "" ) + 
                                    ( doc.engineblock ? doc.engineblock : "" ) + 
                                    "</td>"); 
                    
                    // assigns an onclick to the row, for the second tab, part detail search and
                    // execute oemsearch
                    searchrow.click(function(row){ $( "#tabs" ).tabs( "option", "active", 1 ); var inputid = this.encorepartnumber; executepartdetailsearch( inputid ); executeoemsearch( inputid, currentoemsort ); $("#encorepartinputid").val(inputid);  });
                    
                    searchtable.append(searchrow);
                });
                
                $("#encoreparts").append(searchtable);
                
            }).fail(function(xhr) {
                
                $("#encoreparts").append("Something has gone wrong. This error has been logged.");
                alert("Something has gone wrong. This error has been logged.");
                $.get( "http://" + domain + "/logerror?errorcode=109&errormessage=" + xhr.responseText);
                
            });
    }
}



function fillyearfaceted (){
    
    makefacetrequest( $("#body_year_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "yearfaceted", "facet.sort": "false"}, ['facet_counts','facet_fields','yearfaceted'], "100", yearfacetedlst, yearfacetedselectedlst, true );
    
}


function fillmakefaceted (){
    
    makefacetrequest( $("#body_make_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "makefaceted", "facet.sort": "false"}, ['facet_counts','facet_fields','makefaceted'], "101", makefacetedlst, makefacetedselectedlst, false );
    
}

function fillmodelfaceted (){
    
    makefacetrequest( $("#body_model_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "modelfaceted", "facet.sort": "false"}, ['facet_counts','facet_fields','modelfaceted'], "102", modelfacetedlst, modelfacetedselectedlst, false );
    
}

function fillengineliters (){
    
    makefacetrequest( $("#body_engineliters_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "engineliters", "facet.sort": "false"}, ['facet_counts','facet_fields','engineliters'], "103", engineliterslst, enginelitersselectedlst, false );
    
}

function fillenginecylinder (){
    
    makefacetrequest( $("#body_enginecylinder_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "enginecylinder", "facet.sort": "false"}, ['facet_counts','facet_fields','enginecylinder'], "104", enginecylinderlst, enginecylinderselectedlst, false );
    
}

function fillenginecc (){
    
    makefacetrequest( $("#body_enginecc_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "enginecc", "facet.sort": "false"}, ['facet_counts','facet_fields','enginecc'], "105", enginecclst, engineccselectedlst, false );
    
}

function fillengineboreinch (){
    
    makefacetrequest( $("#body_engineboreinch_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "engineboreinch", "facet.sort": "false"}, ['facet_counts','facet_fields','engineboreinch'], "106", engineboreinchlst, engineboreinchselectedlst, false );
    
}

function fillenginestrokeinch (){
    
    makefacetrequest( $("#body_enginestrokeinch_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "enginestrokeinch", "facet.sort": "false"}, ['facet_counts','facet_fields','enginestrokeinch'], "107", enginestrokeinchlst, enginestrokeinchselectedlst, false );
    
}

function fillproductfaceted (){
    
    makefacetrequest( $("#body_product_select"), {"facet.mincount": "1", "facet.limit": "-1", "facet.field": "productfaceted", "facet.sort": "false"}, ['facet_counts','facet_fields','productfaceted'], "108", productfacetedlst, productfacetedselectedlst, false );
    
}


function fill (){
    
    fillyearfaceted();
    fillmakefaceted();
    fillmodelfaceted();
    fillengineliters ();
    fillenginecylinder ();
    fillenginecc ();
    fillengineboreinch ();
    fillenginestrokeinch ();
    fillproductfaceted ();
    
}

function setonchange (){
    
    onchangeselect( $("#body_year_select") );
    onchangeselect( $("#body_make_select") );
    onchangeselect( $("#body_model_select") );
    onchangeselect( $("#body_engineliters_select") );
    onchangeselect( $("#body_enginecylinder_select") );
    onchangeselect( $("#body_enginecc_select") );
    onchangeselect( $("#body_engineboreinch_select") );
    onchangeselect( $("#body_enginestrokeinch_select") );
    onchangeselect( $("#body_product_select") );
    
    
    
}

/*
 * makes the filter clear onclick callback for each facet
 */
function setclearfilters(){
    
    $("#clrselectyear").click( function(){ $.each( $("#body_year_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectmake").click( function(){ $.each( $("#body_make_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectmodel").click( function(){ $.each( $("#body_model_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectproduct").click( function(){ $.each( $("#body_product_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectliters").click( function(){ $.each( $("#body_engineliters_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectcylinders").click( function(){ $.each( $("#body_enginecylinder_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectcc").click( function(){ $.each( $("#body_enginecc_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectbore").click( function(){ $.each( $("#body_engineboreinch_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

    $("#clrselectstroke").click( function(){ $.each( $("#body_enginestrokeinch_select").prop("children"), function( k, v ) { v.selected = false; }); gatherfqs(); fill (); makesearchrequest({}, currentsort); });

}

/*
 * executes a part search for the partnumber. this fills the second tab, left table with 
 * results, returning only 1 row for the part that was searched for 
 */
function executepartdetailsearch( partnumber ){
    
    // note: there are only a certain number of acceptable fields for the request
    $.getJSON( "http://" + domain + "/executepartdetailsearch", { "partnumber": partnumber },
            function( data ) { 
                
                $("#encorepartdetail").empty();
                
                var partdetailtable = $('<table style="border-width:0;width:100%; margin-left:0%; margin-right:0%;" class="w3-table-all w3-responsive w3-tiny w3-card-4 w3-hoverable"></table>');
                
                var headerrow = $("<tr></tr>");
                
                headerrow.append('<th style="width:33%;">Part Number</th>');
                headerrow.append('<th style="width:33%;">Product</th>');
                headerrow.append('<th style="width:33%;">Available</th>');
                
                partdetailtable.append(headerrow);
                
                // iterate the search results, creating a row
                $.each( $(data).attr("response").docs, function( index, doc ){
                    
                    var tablerow = $("<tr></tr>");
                    
                    tablerow.append("<td>" + doc.partnumber + "</td>");
                    tablerow.append("<td>" + doc.product + "</td>");
                    tablerow.append("<td>Available for purchase.</td>");
                
                    partdetailtable.append(tablerow);                    
                    
                });
                
                $("#encorepartdetail").append(partdetailtable);
                
            }).fail(function(xhr) {
                
                $("#encorepartdetail").append("Something has gone wrong. This error has been logged.");
                alert("Something has gone wrong. This error has been logged.");
                $.get( "http://" + domain + "/logerror?errorcode=110&errormessage=" + xhr.responseText);
                
            });
    

}

/*
 * executes a search to find which other models make year a part fits with, this is used
 * to fill the second table in the second tab
 */
function executeoemsearch( partnumber, insort ){
    
    // note: there are only a certain number of acceptable fields for the request
    $.getJSON( "http://" + domain + "/executeoemsearch", {"sort": insort + " asc", "partnumber": partnumber },
            function( data ) { 
                
                var sortglyphstr = '&nbsp;<span class="ui-icon ui-icon-caret-1-s"></span>';
                
                $("#encorepartoem").empty();
                
                var partdetailtable = $('<table style="border-width:0;width:100%; margin-left:0%; margin-right:0%;" class="w3-table-all w3-responsive w3-tiny w3-card-4 w3-hoverable"></table>');
                
                var headerrow = $("<tr></tr>");
                
                headercolumn = $('<th style="width:33%;"><div class="encoresort" id="oemsortyear">Year</div>' + ( currentoemsort == "yearfaceted" ? sortglyphstr : "" ) + '</th>');
                headercolumn.click( function(){currentoemsort = "yearfaceted"; executeoemsearch ( $("#encorepartinputid").val(), currentoemsort );});
                headerrow.append( headercolumn );
                
                headercolumn = $('<th style="width:33%;"><div class="encoresort" id="oemsortmake">Make</div>' + ( currentoemsort == "makefaceted" ? sortglyphstr : "" ) + '</th>');
                headercolumn.click( function(){currentoemsort = "makefaceted"; executeoemsearch ( $("#encorepartinputid").val(), currentoemsort );});
                headerrow.append( headercolumn );
                
                headercolumn = $('<th style="width:33%;"><div class="encoresort" id="oemsortmodel">Model</div>' + ( currentoemsort == "modelfaceted" ? sortglyphstr : "" ) + '</th>');
                headercolumn.click( function(){currentoemsort = "modelfaceted"; executeoemsearch ( $("#encorepartinputid").val(), currentoemsort );});
                headerrow.append( headercolumn );
                
                partdetailtable.append(headerrow);
                
                // iterate the results
                $.each( $(data).attr("response").docs, function( index, doc ){
                    
                    var tablerow = $("<tr></tr>");
                    
                    tablerow.append("<td>" + doc.year + "</td>");
                    tablerow.append("<td>" + doc.make + "</td>");
                    tablerow.append("<td>" + doc.model + "</td>");
                
                    partdetailtable.append(tablerow);                    
                    
                });
                
                $("#encorepartoem").append(partdetailtable);
                
            }).fail(function(xhr) {
                
                $("#encorepartdetail").append("Something has gone wrong. This error has been logged.");
                alert("Something has gone wrong. This error has been logged.");
                $.get( "http://" + domain + "/logerror?errorcode=111&errormessage=" + xhr.responseText);
                
            });
    
}


/*
 * this searches for an equivalent part based on the oem part number 
 */
function executeoempartsearch( oemnumber ){
    
    // note: there are only a certain number of acceptable fields for the request    
    $.getJSON( "http://" + domain + "/executeoempartsearch", {"oemnumber": oemnumber},

            function( data ) { 
                
                $("#encorepartoembody").empty();
                
                var partdetailtable = $('<table style="width:100%; margin-left:0%; margin-right:0%;" class="w3-table-all w3-responsive w3-tiny w3-card-4 w3-hoverable"></table>');
                
                var headerrow = $("<tr></tr>");
                
                headerrow.append('<th style="width:33%;">Part Number</th>');
                headerrow.append('<th style="width:33%;">Product</th>');
                headerrow.append('<th style="width:33%;">Available</th>');
                
                partdetailtable.append(headerrow);
                
                // iterate the response
                $.each( $(data).attr("response").docs, function( index, doc ){
                    
                    var tablerow = $("<tr></tr>");
                    
                    tablerow.append("<td>" + doc.partnumber + "</td>");
                    tablerow.append("<td>" + doc.product + "</td>");
                    tablerow.append("<td>Available for purchase.</td>");
                
                    partdetailtable.append(tablerow);                    
                    
                });
                
                $("#encorepartoembody").append(partdetailtable);
                
            }).fail(function(xhr) {
                
                $("#encorepartdetail").append("Something has gone wrong. This error has been logged.");
                alert("Something has gone wrong. This error has been logged.");
                $.get( "http://" + domain + "/logerror?errorcode=112&errormessage=" + xhr.responseText);
                
            });
    

}

/*
 * set onclick for the part search and oemsearch search buttons
 */
function setbtnclick(){
    
    $("#encorepartdetailsearchbtn").click(function()
    {
        var inputid = $("#encorepartinputid").val();
        executepartdetailsearch( inputid );
        executeoemsearch( inputid, currentoemsort );
    });
    
    $("#encoreoempartsearchbtn").click(function()
    {
        var inputid = $("#encoreoempartinputid").val();
        executeoempartsearch( inputid );
    });
    
    
}
