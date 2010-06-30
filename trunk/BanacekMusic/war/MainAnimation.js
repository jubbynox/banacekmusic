function MainAnimation()
{
	var albumSelectedShade = jQuery('#albumComponentShade');
	var albumCloseButton = jQuery('#closeSelectedAlbum');
	var albumComponent = jQuery('#albumComponent');
	var infoShade = jQuery('#infoShade');
	var infoCloseButton = jQuery('#closeInfo');
	var infoText = jQuery('#info');
	
	if (typeof(WebKitCSSMatrix) != 'undefined')
	{
		this.showAlbumSelectedArea = showAlbumSelectedAreaWebKit;
		this.hideAlbumSelectedArea = hideAlbumSelectedAreaWebKit;
		this.showInfo = showInfoWebKit;
		this.closeInfo = closeInfoWebKit;
	}
	else
	{
		this.showAlbumSelectedArea = showAlbumSelectedAreaNonHTML5;
		this.hideAlbumSelectedArea = hideAlbumSelectedAreaNonHTML5;
		this.showInfo = showInfoNonHTML5;
		this.closeInfo = closeInfoNonHTML5;
	}
	
	function showAlbumSelectedAreaWebKit(callback)
	{
		albumSelectedShade.bind('webkitTransitionEnd', function(){albumCloseButton.show(); albumComponent.show(); callback(); albumSelectedShade.unbind('webkitTransitionEnd');});
		albumSelectedShade.addClass('expand');
	}
	
	function hideAlbumSelectedAreaWebKit(callback)
	{
		albumComponent.hide();
		albumCloseButton.hide();
		albumSelectedShade.bind('webkitTransitionEnd', function(){callback(); albumSelectedShade.unbind('webkitTransitionEnd');});
		albumSelectedShade.removeClass('expand');
	}
	
	function showAlbumSelectedAreaNonHTML5(callback)
	{
		albumSelectedShade.animate({bottom: '5%', height: '85%', right: '0.5%', left: '0.5%'}, 300, 'easeInOutCubic', function(){albumCloseButton.show(); albumComponent.show(); callback();});
	}
	
	function hideAlbumSelectedAreaNonHTML5(callback)
	{
		albumComponent.hide();
		albumCloseButton.hide();
		albumSelectedShade.animate({bottom: '50%', height: '0%', right: '50%', left: '50%'}, 300, 'easeInOutCubic', function(){callback();});
	}
	
	function showInfoWebKit()
	{
		infoShade.bind('webkitTransitionEnd', function(){infoCloseButton.show(); infoText.show(); infoShade.unbind('webkitTransitionEnd');});
		infoShade.addClass('expand');
	}
	
	function closeInfoWebKit()
	{
		infoText.hide();
		infoCloseButton.hide();
		infoShade.removeClass('expand');
	}
	
	function showInfoNonHTML5()
	{
		infoShade.animate({bottom: '5%', height: '85%', right: '0.5%', left: '0.5%'}, 300, 'easeInOutCubic', function(){infoCloseButton.show(); infoText.show();});
	}
	
	function closeInfoNonHTML5()
	{
		infoText.hide();
		infoCloseButton.hide();
		infoShade.animate({bottom: '50%', height: '0%', right: '50%', left: '50%'}, 300, 'easeInOutCubic');
	}
}