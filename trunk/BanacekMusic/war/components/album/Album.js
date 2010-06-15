var selectableMap;
var albumId;

function selectableMapLoaded()
{
	selectableMap = ComponentFramework.getComponent('selectableMap');
	selectableMap.addEventListener('areaSelected', trackSelected);
}

function trackSelected(eventProperties)
{
	var newEventProperties = new Object();
	newEventProperties.albumId = albumId;
	newEventProperties.trackId = eventProperties.id;
	ComponentFramework.raiseEvent('trackSelected', newEventProperties);
}

// Create.
var Album = function()
{
	var IMAGE_AREA_RATIO = 0.5;
	var coverImage = jQuery('#cover');
	var trackListingImage = jQuery('#trackListing');
	var body = jQuery('body');
	var selectableMapDiv = jQuery('#selectableMap');
	
	coverImage.click(function(){coverImage.css('z-index', 6);});
	coverImage.mouseenter(function(){coverImage.css('z-index', 6);});
	coverImage.mouseleave(function(){coverImage.css('z-index', 3);});
	trackListingImage.click(function(){coverImage.css('z-index', 3);});
	
	this.show = function(id, name, cover, tracks)
	{
		albumId = id;
		setupImage(coverImage, name + " cover", cover.imgUrl, cover.size);
		var resizeScale = setupImage(trackListingImage, name + " track listing", tracks.imgUrl, tracks.size);
		setupTrackLinks(resizeScale, tracks);
		coverImage.show();
		trackListingImage.show();
		selectableMapDiv.show();
	}
	
	this.hide = function()
	{
		coverImage.hide();
		trackListingImage.hide();
		selectableMapDiv.hide();
	}
	
	function setupImage(imageElement, name, url, size)
	{
		imageElement.attr('alt', name);
		imageElement.attr('title', name);
		imageElement.attr('src', url);
		var resizeScale = calculateResizeScale(size);
		setupWidth(imageElement, size.dx, resizeScale);
		return resizeScale;
	}
	
	function setupWidth(element, dx, resizeScale)
	{
		element.css('width', (dx * resizeScale * 100 / body.width()) + "%");
	}
	
	function setupHeight(element, dy, resizeScale)
	{
		element.css('height', (dy * resizeScale * 100 / body.height()) + "%");
	}
	
	function calculateResizeScale(size)
	{
		var desiredArea = body.width() * body.height() * IMAGE_AREA_RATIO;
		return Math.sqrt(desiredArea / (size.dx * size.dy));
	}
	
	function setupTrackLinks(resizeScale, tracks)
	{
		setupWidth(selectableMapDiv, tracks.size.dx, resizeScale);
		setupHeight(selectableMapDiv, tracks.size.dy, resizeScale);
		selectableMap.fireEvent('removeAreas');
		for (var index = 0; index < tracks.track.length; index++)
		{
			var track = tracks.track[index];
			var event = new Object();
			event.id = track.id;
			event.name = track.number + " - " + track.name;
			event.area = getTrackArea(track.imgSel, tracks.size.dy, tracks.size.dx, resizeScale);
			selectableMap.fireEvent('addArea', event);
		}
	}
	
	function getTrackArea(imgSel, imgHeight, imgWidth, resizeScale)
	{
		var area = new Object();
		area.left = Math.round(imgSel.x1 * resizeScale) + "px";
		area.right = Math.round((imgWidth - imgSel.x2) * resizeScale) + "px";
		area.top = Math.round(imgSel.y1 * resizeScale) + "px";
		area.bottom = Math.round((imgHeight - imgSel.y2) * resizeScale) + "px";
		return area;
	}
	
	/**
	 * A handler for when a track is clicked.
	 *
	 * @param id The track ID.
	 */
	function trackClicked(id)
	{
		var eventProperties = new Object();
		eventProperties.id = id;
		ComponentFramework.raiseEvent('trackSelected', eventProperties);
	}
}