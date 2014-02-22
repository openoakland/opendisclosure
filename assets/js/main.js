$(document).ready( function() { 
	var oakTable = new dataTable("http://data.oaklandnet.com/resource/68fg-z9fi.json");
	oakTable.makeTable("dataDump");

});

dataTable = function(endpoint) {
	this.endpoint = endpoint; 
	this.tableID = "";

	this.makeTable = function(tableID) { 
		this.tableID = tableID;
		$.getJSON( this.endpoint, function( data ) {
			var table_obj = $('#' + tableID);
		    $.each(data, function(index, item){
		         var table_row = $('<tr>', {id: item.id});
		         var table_cell = $('<td>', {html: item.data});
		         table_row.append(table_cell);
		         table_obj.append(table_row);
		    })
		});
	}
}