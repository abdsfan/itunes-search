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
	fetch('https://itunes.apple.com/search?term=' + refinedSearch + "&limit=200")
		.then((resp)=> resp.json())
		.then(function(data) {
			console.log(data);
			var bySongs = filterForSongs(data);
			getAlbums(bySongs);
	});
	
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

function getAlbums(bySongs){
    var albumList = [];
    var songsSortedByAlbum = [];
    var album;
    for (var i = 0; i < bySongs.length; i++) {
        if(!(albumList.includes(bySongs[i].collectionName))){
            albumList.push(bySongs[i].collectionName);
        }
    }
    for (var i = 0; i < albumList.length; i++) {
        album = bySongs.filter(function(element){
            if(element.collectionName === albumList[i]){
                return true;
            }
            else{
                return false;
            }
    	});
    }
    songsSortedByAlbum.push(album);
}

function displayAlbums() {
	for (var albumName in songsSortedByAlbum) {
	   var newElement = document.createElement('div');
	   newElement.id = songsSortedByAlbum[albumName]; newElement.className = "album";
	   newElement.innerHTML = songsSortedByAlbum[albumName][0].collectionName;
	   document.body.appendChild(newElement);
	}
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


