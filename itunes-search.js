"use strict"
function searchItunes(){
	var userSearchRequest;
	userSearchRequest = document.getElementById('searchBox').value;
	var refinedSearch;
	if(checkForSpaces(userSearchRequest)){
	refinedSearch = refineSearch(userSearchRequest);
	}
	else{
		refinedSearch = userSearchRequest;
	}
	fetch('https://itunes.apple.com/search?term=' + refinedSearch)
		.then((resp)=> resp.json())
		.then(function(data) {
			console.log(data);
	});
}
function refineSearch(searchInput){
	var seperatedSearch;
	var rejoinedSearch;
	seperatedSearch = searchInput.split(" ");
	rejoinedSearch = seperatedSearch.join("+");
	return rejoinedSearch;
}
function checkForSpaces(userSearchRequest){
	if(userSearchRequest.search(" ")>=0){
		return true;
	}
	else{
		return false;
	}
}