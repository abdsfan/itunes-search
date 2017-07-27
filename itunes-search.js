"use strict"

function searchItunes(){
	clearResultBox();
	var userSearchRequest;
	userSearchRequest = document.getElementById('searchBox').value;
	var refinedSearch;
	if(checkForSpaces(userSearchRequest)){
	refinedSearch = refineSearch(userSearchRequest);
	}
	else{
		refinedSearch = userSearchRequest;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
  		if (this.readyState == 4 && this.status == 200) {
  			var data =  JSON.parse(this.response);
    		console.log(data);
			var bySongs = filterForSongs(data);
			var sortedResults = getAlbums(bySongs);
			displayResults(sortedResults);
  		}
		};
	xhttp.open("GET", "https://itunes.apple.com/search?term=" + refinedSearch + "&limit=200", true);
	xhttp.send();
}

function filterForSongs(data) {
	var bySongs = data.results.filter(function(element){
		if (element.kind === "song") {
			return true;
		} else {
			return false;
		}
	});
	return bySongs;
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

function getAlbums(results){
	var albumList = [];
	var songsSortedByAlbum = [];
	var album;
	for (var i = 0; i < results.length; i++) {
		if(!(albumList.includes(results[i].collectionName))){
			albumList.push(results[i].collectionName);
		}
	}
	for (var i = 0; i < albumList.length; i++) {
		album = results.filter(function(element){
			if(element.collectionName === albumList[i]){
				return true;
			}
			else{
				return false;
			}
	});
	songsSortedByAlbum.push(album);
}
	return songsSortedByAlbum;
}
function clearResultBox(){
	var resultBox = document.getElementById("resultBox");
	while (resultBox.firstChild) {
   		resultBox.removeChild(resultBox.firstChild);
	}
}
function displayResults(songsSortedByAlbum){
	var resultBox = document.getElementById("resultBox")
	for (var albumName in songsSortedByAlbum) {
   		var newElement = document.createElement('div');
    	newElement.id = songsSortedByAlbum[albumName]; 
    	newElement.className = "album";
    	newElement.innerHTML = "<img src=" + songsSortedByAlbum[albumName][0].artworkUrl100 + ">" + songsSortedByAlbum[albumName][0].collectionName;
    	resultBox.appendChild(newElement);
    	var newList = document.createElement("ul");
    	newList.className =  "trackList";
    	for (var track in songsSortedByAlbum[albumName]){
    		var newTrack = document.createElement("li");
    		newTrack.className = "track";
    		newTrack.innerHTML = songsSortedByAlbum[albumName][track].trackName
    		resultBox.appendChild(newTrack);

    	}
 		resultBox.appendChild(newList)
  	}
}

