"use strict"

/*
the function resets the webpage, connect to itunes API server to get a response,
calls other functions to manipulate the data then display the results. 
*/
function searchItunes(){
	clearResultBox();
	var userSearchRequest;
	var refinedSearch;
	userSearchRequest = document.getElementById('searchBox').value;
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
    		data.resultCount === 0 ? alert("No Results Found Try Another Search") : console.log();
			var bySongs = filterForSongs(data);
			var sortedResults = getAlbums(bySongs);
			displayResults(sortedResults);
  		}
  		else if(this.readyState == 4 && this.status != 200)
  			document.getElementById("resultBox").innerHTML = "No search results found";
		};
	xhttp.open("GET", "https://itunes.apple.com/search?term=" + refinedSearch + "&limit=200", true);
	xhttp.send();
}

/*
The function will collect anything that is a song from the results
*/
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

/*
The function will delete spaces from input and add '+' sign to the user search input
*/
function refineSearch(searchInput){
	var seperatedSearch;
	var rejoinedSearch;
	seperatedSearch = searchInput.split(" ");
	rejoinedSearch = seperatedSearch.join("+");
	return rejoinedSearch;
}


/*
The function will check if the user enters any spaces in the search
*/
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
	var album = [];
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
	songsSortedByAlbum.push(sortingSongsInAlbums(album));
	}
	return songsSortedByAlbum;
}

/*
The function will check for duplicate songs in the album 
*/
function checkForDuplicate (sortedSongs) {
	var tempEliminateDublicateSongs = [];
	var eliminateDublicateSongs = [];
	var songTrackingNumber = sortedSongs.map(function(element) {
		return element.trackNumber;
	});
	
	eliminateDublicateSongs = sortedSongs.filter(function(element){
		if(!(tempEliminateDublicateSongs.includes(element.trackNumber))) {
			tempEliminateDublicateSongs.push(element.trackNumber);
			return true;
		} else {
			return false; 
		}
	});

	return eliminateDublicateSongs;
}

/*
The funciton wills ort the songs in the album 
*/
function sortingSongsInAlbums(album){
	var sortedSongs = [];
	sortedSongs = album.sort(function(a, b){
		return a.trackNumber - b.trackNumber;
	})
	
	return checkForDuplicate(sortedSongs);
}

/*
The function will reset the result box if it has any contect 
*/
function clearResultBox(){
	var resultBox = document.getElementById("resultBox");
	while (resultBox.firstChild) {
   		resultBox.removeChild(resultBox.firstChild);
	}
}

/*
The function will output the albums with the sons associated to the albums on the webpage.
*/
function displayResults(songsSortedByAlbum){
	var resultBox = document.getElementById("resultBox")
	for (var albumName in songsSortedByAlbum) {
   		var newElement = document.createElement('div');
    	newElement.id = songsSortedByAlbum[albumName]; 
    	songsSortedByAlbum[albumName][0].collectionName.length >= 65 ? songsSortedByAlbum[albumName][0].collectionName = songsSortedByAlbum[albumName][0].collectionName.substring(0,65): console.log("cool");
    	songsSortedByAlbum[albumName][0].artistName.length >= 65 ? songsSortedByAlbum[albumName][0].artistName = songsSortedByAlbum[albumName][0].collectionName.substring(0,65): console.log("cool");
    	newElement.className = "album";
    	newElement.innerHTML = "<right>" + songsSortedByAlbum[albumName][0].collectionName +" <br> "+ songsSortedByAlbum[albumName][0].artistName+"</right>" ;
    	resultBox.appendChild(newElement);
    	var newImage = document.createElement('div');
		newImage.className = "albumHeader";
		newImage.innerHTML = "<a href=\""+songsSortedByAlbum[albumName][0].collectionViewUrl + "\" target=\"_blank\"><img class=\"albumThumbnail\" src=" + songsSortedByAlbum[albumName][0].artworkUrl100 + "></a>";
		resultBox.appendChild(newImage);
    	var newList = document.createElement("ul");
    	newList.className =  "trackList";
    	for (var track in songsSortedByAlbum[albumName]){
    		var newTrack = document.createElement("li");
    		newTrack.className = "track";
    		newTrack.innerHTML = songsSortedByAlbum[albumName][track].trackNumber +".  " + songsSortedByAlbum[albumName][track].trackName
    		newImage.appendChild(newTrack);

    	}
 		newImage.appendChild(newList)
  	}
}
function callSearch(){
	searchItunes();
	return false;
}