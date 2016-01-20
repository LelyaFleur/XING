// JavaScript Document
function buildJson() {
	var request = {keyword: getKeyword(), categories: getCategories(), location: getLocation()};
	return JSON.stringify(request);
}

function getKeyword(){
	return $('#keyword').val();
}

function getCategories(){
	var categoriesList = [];
	$( "select option:selected" ).each(function() {
		if($(this).text() == "in all categories") {
			$('input[type="checkbox"]:checked').each(function() {
	   			categoriesList.push(this.value);
			});
		}else{
			categoriesList.push($(this).text());
		}
	});
	
	return categoriesList;
}

function getLocation(){
	return $('#location').val();
}

function parseSearchResult(result){
	var content = '';
	for(var i=0; i<result.length; i++){
		content += '<div class="suggest">' + result[i] + '</div>';
	}
	return content;
}

function renderSuggestions(searchResult){
	$('#suggestions').html('');
	$('#suggestions').append(parseSearchResult(searchResult));

	$('.suggest').click(function(){
		$('#location').val('');
		$('#location').val($(this).text());
		$('#suggestions').html('');
	});
}

function requestCitySuggestion(name){
	var response = $.ajax({
	  method: "GET",
	  url: "http://gd.geobytes.com/AutoCompleteCity",
	  dataType: "json",
	  data: "callback=?&filter=DE&q=" + name
	});
	response.done(function( data ) {
    	renderSuggestions(data);
  	});
}

function searchAndShow(str){
	var searchResult = requestCitySuggestion(str);
}

function parseData(data){
	var message = "Keyword: " + data.keyword + "</br> Categories: ";
	for(var i=0; i<data.categories.length; i++){
		message += data.categories[i] + "; ";
	}
	message += "</br>" + "Location: " + data.location;
	return message;
}

function buildOptions(){
	var message;
	$('input[type="checkbox"]').each(function() {
		message += "<option>" + this.value + "</option>";
	});
	message += "<option>in all categories</option>";
	return message;
}

function addOptions(){
	$('select').append(buildOptions());
}

$(document).ready(function() {
	addOptions();
	$('#formMessage').hide();
	$('#categoryList').hide();
	$('#location').on("keyup", function() {
		if($(this).val().length >=3){
			searchAndShow($(this).val());
		}else{
			$('#suggestions').html('');
		}
	});

	$('.category').change(function(){
		$('#categoryList').hide();
		$( "select option:selected" ).each(function() {
	      	if($(this).text() == "in all categories") {
				$('#categoryList').show();
			}
    	});
	});

	$('#keyword').focus(function() {
      if($(this).attr('placeholder') == 'Enter keyword') {
     	 $('#keyword').attr('placeholder', '').val('');
   	  }
 	});
	$('#keyword').blur(function() {
	    if($(this).val().trim().length === 0) {
	      $('#keyword').val('').attr('placeholder', 'Enter keyword');
	    }
	});

	$('#location').focus(function() {
      if($(this).attr('placeholder') == 'Location') {
     	 $('#location').attr('placeholder', '').val('');
   	  }
 	});

	$('#location').blur(function() {
	    if($(this).val().trim().length === 0) {
	      $('#location').val('').attr('placeholder', 'Location');
	    }
	});

	$('#allCategories').click(function(){
		var total = 0;
		var checked = 0;
		$('input[type="checkbox"]').each(function() {
			total++;
			if(this.checked) {
				checked++;
			}
		});
		if(checked < total){
			$('input[type="checkbox"]').each(function() {
				this.checked = true;
			});
			
		}else{
			$('input[type="checkbox"]').each(function() {
				this.checked = (this.checked == true) ? false : true;
			});
		}
	});

	$("#search").click(function(){
		var data = buildJson();
		var request = $.ajax({
			type: "POST",
			dataType: "json",
			url: "", 
			data: data
		});
		request.fail(function() {	
			var obj = JSON.parse(data);
			$('#formMessage').html(
			"<h4>Your search request is:</h4> <p>" + parseData(obj) + "</p>");
					
			$('#formMessage').append('<button type="button" class = "confirmButton" id="okButton">OK!</button>');
			$('#formMessage').show();
			$('#formXing').hide();
			$('#okButton').click(function(){
				$('#formMessage').html("");
				$('#formMessage').hide();
				$('#formXing').show();
			});
		});
	});	
});