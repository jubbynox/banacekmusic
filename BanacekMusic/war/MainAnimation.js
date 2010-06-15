function MainAnimation()
{
	var albumSelectedShade = jQuery('#albumComponentShade');
	var closeButton = jQuery('#closeSelectedAlbum');
	var albumComponent = jQuery('#albumComponent');
	
	if (typeof(WebKitCSSMatrix) != 'undefined')
	{
		this.showAlbumSelectedArea = showAlbumSelectedAreaWebKit;
		this.hideAlbumSelectedArea = hideAlbumSelectedAreaWebKit;
	}
	else
	{
		this.showAlbumSelectedArea = showAlbumSelectedAreaNonHTML5;
		this.hideAlbumSelectedArea = hideAlbumSelectedAreaNonHTML5;
	}
	
	function showAlbumSelectedAreaWebKit(callback)
	{
		albumSelectedShade.bind('webkitTransitionEnd', function(){closeButton.show(); albumComponent.show(); callback(); albumSelectedShade.unbind('webkitTransitionEnd');});
		albumSelectedShade.addClass('expand');
	}
	
	function hideAlbumSelectedAreaWebKit(callback)
	{
		albumComponent.hide();
		closeButton.hide();
		albumSelectedShade.bind('webkitTransitionEnd', function(){callback(); albumSelectedShade.unbind('webkitTransitionEnd');});
		albumSelectedShade.removeClass('expand');
	}
	
	function showAlbumSelectedAreaNonHTML5(callback)
	{
		albumSelectedShade.animate({bottom: '5%', height: '85%', right: '0.5%', left: '0.5%'}, 300, 'easeInOutCubic', function(){closeButton.show(); albumComponent.show(); callback();});
	}
	
	function hideAlbumSelectedAreaNonHTML5(callback)
	{
		albumComponent.hide();
		closeButton.hide();
		albumSelectedShade.animate({bottom: '50%', height: '0%', right: '50%', left: '50%'}, 300, 'easeInOutCubic', function(){callback();});
	}
}