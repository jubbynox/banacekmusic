function CarouselAnimation(carousel)
{
	// The carousel jQuery area.
	var carousel = carousel;
	var carouselViewport = jQuery('#carouselViewport');

	if (typeof(WebKitCSSMatrix) != 'undefined')
	{
		this.resetCarousel = resetCarouselWebKit;
		this.startScroll = startScrollWebKit;
		this.stopScroll = stopScrollWebKit;
		this.getCurrentTransformPosX = getCurrentTransformPosXWebKit;
		this.convertToTransformPosX = convertToTransformPosXWebKit;
	}
	else
	{
		this.resetCarousel = resetCarouselNonHTML5;
		this.startScroll = startScrollNonHTML5;
		this.stopScroll = stopScrollNonHTML5;
		this.getCurrentTransformPosX = getCurrentTransformPosXNonHTML5;
		this.convertToTransformPosX = convertToTransformPosXNonHTML5;
	}
	
	function resetCarouselWebKit()
	{
		carousel.css('-webkit-transform', 'translate3d(0, 0, 0)');
	}
	
	function startScrollWebKit(animationTime, endPosX)
	{
		carousel.css('-webkit-transition', '-webkit-transform ' + animationTime + 's ease-in-out');
		carousel.css('-webkit-transform', 'translate3d(' + endPosX + 'px, 0, 0)');
	}
	
	function stopScrollWebKit(endPosX)
	{
		carousel.css('-webkit-transition', '-webkit-transform 0.5s ease-out');
		carousel.css('-webkit-transform', 'translate3d(' + endPosX + 'px, 0, 0)');
	}
	
	function getCurrentTransformPosXWebKit()
	{
		var theTransform = window.getComputedStyle(carousel[0],null).getPropertyValue("-webkit-transform");
		return new WebKitCSSMatrix(theTransform).m41;
	}
	
	function convertToTransformPosXWebKit(posX)
	{
		var positionTransformDif = carousel.position().left - getCurrentTransformPosXWebKit();
		return posX - positionTransformDif;
	}
	
	function resetCarouselNonHTML5()
	{
		carousel.css('left', 0);
	}
	
	function startScrollNonHTML5(animationTime, endPosX)
	{
		carousel.stop();
		carousel.animate({left: endPosX}, animationTime*1000, 'easeInOutCubic');
	}
	
	function stopScrollNonHTML5(endPosX)
	{
		carousel.stop();
		carousel.animate({left: endPosX}, 500, 'easeOutCubic');
	}
	
	function getCurrentTransformPosXNonHTML5()
	{
		return carousel.position().left + carouselViewport.scrollLeft();
	}
	
	function convertToTransformPosXNonHTML5(posX)
	{
		return posX + carouselViewport.scrollLeft();
	}
}