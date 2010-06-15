function MusicPlayerAnimation(playListScroll)
{
	// The playlist scrolling jQuery area.
	var playListScroll = playListScroll;

	if (typeof(WebKitCSSMatrix) != 'undefined')
	{
		this.scrollTo = scrollToWebKit;
	}
	else
	{
		this.scrollTo = scrollToNonHTML5;
	}
	
	function scrollToWebKit(endPosY)
	{
		playListScroll.css('-webkit-transition', '-webkit-transform 1s ease-in-out');
		playListScroll.css('-webkit-transform', 'translate3d(0, ' + endPosY + 'px, 0)');
	}
	
	function scrollToNonHTML5(endPosY)
	{
		playListScroll.stop();
		playListScroll.animate({top: endPosY}, 1000, 'easeInOutCubic');
	}
}