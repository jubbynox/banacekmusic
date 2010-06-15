var isAlbumSelected = false;
var mainAnimation;
var carouselDiv;
var albumComponent;
var albumData = new Object();
var audioPlayer;
var TRACK_URL = "http://" + window.location.host + "/GetTrackUrl?trackId=";

function playerComponentLoaded()
{
	audioPlayer = ComponentFramework.getComponent('audioPlayer');
}

/**
 * Function called when carousel is loaded.
 * @return
 */
function carouselLoaded()
{
	carouselDiv = jQuery('#albumCarousel');
	var carousel = ComponentFramework.getComponent('albumCarousel');
	carousel.addEventListener('itemSelected', albumSelected);
	
	// Add albums.
	for (var index=0; index < data.album.length; index++)
	{		
		var event = new Object();
		var album = data.album[index];
		event.id = album.id;
		event.name = album.name;
		event.imgUrl = album.thumb.imgUrl;
		event.imgHeightToWidthRatio = album.thumb.size.dx / album.thumb.size.dy;
		carousel.fireEvent('addItem', event);
		
		albumData[album.id] = album;
	}
}

function albumComponentLoaded()
{
	albumComponent = ComponentFramework.getComponent('albumComponent');
	albumComponent.addEventListener('trackSelected', trackSelected);
}

function albumSelected(eventProperties)
{
	if (typeof(mainAnimation) == 'undefined')
	{
		mainAnimation = new MainAnimation();
		jQuery('#closeSelectedAlbum').click(function(){closeSelectedAlbum(); return false;});
	}
	
	if (!isAlbumSelected)
	{
		isAlbumSelected = true;
		var event = new Object();
		var album = albumData[eventProperties.id];
		event.id = album.id;
		event.name = album.name;
		event.cover = album.cover;
		event.tracks = album.tracks;
		mainAnimation.showAlbumSelectedArea(function(){albumComponent.fireEvent('show', event);});
	}
}

function closeSelectedAlbum()
{
	isAlbumSelected = false;
	mainAnimation.hideAlbumSelectedArea(function(){albumComponent.fireEvent('hide');});
	carouselDiv.hide();
	carouselDiv.show();
}

function trackSelected(eventProperties)
{
	var album = albumData[eventProperties.albumId];
	var track;
	for (var index = 0; index < album.tracks.track.length; index++)
	{
		var testTrack = album.tracks.track[index];
		if (eventProperties.trackId == testTrack.id)
		{
			track = testTrack;
			break;
		}
	}
	if (typeof(track) != 'undefined')
	{
		var event = new Object();
		event.albumImgUrl = album.thumb.imgUrl;
		event.albumName = album.name;
		event.trackNumber = track.number;
		event.trackName = track.name;
		event.trackUrl = TRACK_URL + track.id;
		audioPlayer.fireEvent('add', event);
	}
}