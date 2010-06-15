// Create.
function Carousel()
{
	var SCROLL_DIRECTION = {NONE:0, LEFT:1, RIGHT:2};
	var SCROLL_RATE = 1500;	// Pixels per second.
	
	var scrollDirection = SCROLL_DIRECTION.NONE;
	var body = jQuery('body');
	var carousel = jQuery('#carouselArea');
	var heightToWidthRatio;
	var originalCarouselWidth = 0;
	var carouselWidth;
	var frameWidth;
	
	var carouselAnimation = new CarouselAnimation(carousel);
	
	var leftBtn = jQuery('#leftBtn');
	leftBtn.mousedown(startScrollLeft);
	leftBtn.mouseup(stopScrollLeft);
	
	var rightBtn = jQuery('#rightBtn');
	rightBtn.mousedown(startScrollRight);
	rightBtn.mouseup(stopScrollRight);
	
	body.keydown(keyDown);
	jQuery('#buttonArea').mouseout(resetButtons);
	
	/**
	 * Adds an item to the carousel.
	 * 
	 * @param id The ID of the item.
	 * @param name The name of the item.
	 * @param imageUrl The URL of the item's image.
	 * @param imgHeightToWidthRatio The height to width ratio (width/height) of the image.
	 */
	this.addItem = function(id, name, imageUrl, imgHeightToWidthRatio)
	{
		var carouselItem = jQuery('#item').clone();
		var itemImage = carouselItem.children('img');
		carouselItem.attr('id', id);
		carouselItem.attr('title', name);
		itemImage.attr('src', imageUrl);
		itemImage.attr('alt', name);
		carouselItem.appendTo('#carouselArea');
		carouselItem.click(function(){itemClicked(id); return false;});
		originalCarouselWidth += carousel.height() * (imgHeightToWidthRatio*0.73) + 40;	// 40px from image margin in CSS.
		heightToWidthRatio = originalCarouselWidth / carousel.height();
	};
	
	/**
	 * A handler for when an item is clicked.
	 *
	 * @param id The ID.
	 */
	function itemClicked(id)
	{
		var eventProperties = new Object();
		eventProperties.id = id;
		ComponentFramework.raiseEvent('itemSelected', eventProperties);
	}
	
	function keyDown(key)
	{
		if (key.which == 9)
		{
			// User tabbing - reset transformation.
			carouselAnimation.resetCarousel();
		}
	}
	
	function resetButtons()
	{
		switch (scrollDirection)
		{
			case SCROLL_DIRECTION.RIGHT:
				stopScrollRight();
				break;
			case SCROLL_DIRECTION.LEFT:
				stopScrollLeft();
				break;
		}
	}
	
	function startScrollRight()
	{
		scrollDirection = SCROLL_DIRECTION.RIGHT;
		calculateWidths();
		startScroll(rightBtn,  carouselAnimation.convertToTransformPosX(frameWidth - carouselWidth));
	}
	
	function startScrollLeft()
	{
		scrollDirection = SCROLL_DIRECTION.LEFT;
		startScroll(leftBtn,  carouselAnimation.convertToTransformPosX(0));
	}
	
	function startScroll(button, endPosX)
	{
		button.blur();	// Remove accessibility feature.
		button.addClass('down');
		var animationTime = Math.abs(carouselAnimation.getCurrentTransformPosX() - endPosX) / SCROLL_RATE;
		carouselAnimation.startScroll(animationTime, endPosX);
	}
	
	function stopScrollRight()
	{
		var maxPosX = carouselAnimation.convertToTransformPosX(frameWidth - carouselWidth);
		var endPosX = carouselAnimation.getCurrentTransformPosX() - 200;
		endPosX = maxPosX > endPosX ? maxPosX : endPosX;
		stopScroll(rightBtn, endPosX);
	}
	
	function stopScrollLeft()
	{
		var endPosX = carouselAnimation.getCurrentTransformPosX() + 200;
		var minPosX = carouselAnimation.convertToTransformPosX(0);
		endPosX = endPosX > minPosX ? minPosX : endPosX;
		stopScroll(leftBtn, endPosX);
	}
	
	function stopScroll(button, endPosX)
	{
		scrollDirection = SCROLL_DIRECTION.NONE;
		button.removeClass('down');
		carouselAnimation.stopScroll(endPosX);
	}
	
	function calculateWidths()
	{
		// For some reason the width value doesn't change on resize (though the DIV width has changed in reality), but the height does.
		carouselWidth = heightToWidthRatio * carousel.height();
		
		body.css('width', '100%');	// Restrict to visible width.
		frameWidth = body.width();
		body.css('width', '');	// Let it expand to size of carousel
	}
}