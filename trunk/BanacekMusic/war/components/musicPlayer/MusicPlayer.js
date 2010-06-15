// Create.
var MusicPlayer = function(size, cover, trackListing)
{
	var MAX_TIME_TO_PREVIOUS = 2000;
	// The player.
	var player;
	
	var templates = jQuery('#templates');
	var isPaused = false;
	var tracks = new Array();
	var currentTrack = 0;
	var playedTime = 0;
	
	// Setup player.
	jQuery('#jplayer').jPlayer({swfPath: '/libraries',
		ready: function ()
		{
			player = this;
			//player("onProgressChange", progressChanged);
			player.onProgressChange(progressChanged);
			player.onSoundComplete(moveNext);
		}});
	
	var musicPlayerAnimation = new MusicPlayerAnimation(jQuery('#playListScroll'));
	
	var previousBtn = jQuery('#previous');
	previousBtn.mousedown(function(){previousBtn.addClass('down');});
	previousBtn.mouseup(function(){previousBtn.removeClass('down'); movePrevious();});
	
	var playpauseBtn = jQuery('#playpause');
	playpauseBtn.mousedown(function(){playpauseBtn.addClass('down');});
	playpauseBtn.mouseup(function(){playpauseBtn.removeClass('down'); playPause();});
	
	var nextBtn = jQuery('#next');
	nextBtn.mousedown(function(){nextBtn.addClass('down');});
	nextBtn.mouseup(function(){nextBtn.removeClass('down'); moveNext();});

	/**
	 * Adds a track.
	 */
	this.add = function(albumImgUrl, albumName, trackNumber, trackName, trackUrl)
	{
		if (typeof(player) != 'undefined')
		{
			if (tracks.length > 0)
			{
				templates.children('.Spacer').clone().appendTo('#playListScroll');
			}
			else
			{
				player.setFile(trackUrl);
				play();
			}
			
			var albumAndTrack = templates.children('.AlbumAndTrack').clone();
			albumAndTrack.find('.AlbumName').text(albumName);
			albumAndTrack.find('.TrackName').text(trackNumber + " - " + trackName);
			var albumImage = albumAndTrack.find('img');
			albumImage.attr('src', albumImgUrl);
			albumImage.attr('alt', albumName);
			albumAndTrack.appendTo('#playListScroll');
			
			var track = new Object();
			track.trackUrl = trackUrl;
			tracks[tracks.length] = track;
		}
	};
	
	function movePrevious()
	{
		if (playedTime < MAX_TIME_TO_PREVIOUS)
		{
			if (currentTrack > 0)
			{
				currentTrack--;
				player.setFile(tracks[currentTrack].trackUrl);
				play();
				musicPlayerAnimation.scrollTo(-59 * currentTrack);
			}
		}
		else
		{
			player.setFile(tracks[currentTrack].trackUrl);
			play();
		}
	}
	
	function playPause()
	{
		if (isPaused)
		{
			play();
		}
		else if (tracks.length > 0)
		{
			pause();
		}
	}
	
	function moveNext()
	{
		if (currentTrack < tracks.length-1)
		{
			currentTrack++;
			player.setFile(tracks[currentTrack].trackUrl);
			play();
			musicPlayerAnimation.scrollTo(-59 * currentTrack);
		}
	}
	
	function play()
	{
		playpauseBtn.removeClass('play');
		playpauseBtn.addClass('pause');
		isPaused = false;
		player.play();
	}
	
	function pause()
	{
		playpauseBtn.removeClass('pause');
		playpauseBtn.addClass('play');
		player.pause();
		isPaused = true;
	}
	
	function progressChanged(loadPercent, playedPercentRelative, playedPercentAbsolute, newPlayedTime, totalTime)
	{
		playedTime = newPlayedTime;
	}
}