// Create.
var SelectableMap = function()
{
	var selectableAreas = new Array();
	var isAreaHighlighted = false;
	
	this.addArea = function(id, name, area)
	{
		var selectableArea = jQuery('#selectableArea').clone();
		selectableArea.attr('id', id);
		selectableArea.attr('title', name);
		selectableArea.css('left', area.left);
		selectableArea.css('right', area.right);
		selectableArea.css('top', area.top);
		selectableArea.css('bottom', area.bottom);
		selectableArea.appendTo('body');
		//selectableArea.mouseenter(function(){isAreaHighlighted = true; highlightArea(id);});
		//selectableArea.mouseleave(function(){isAreaHighlighted = false; setTimeout(showAll, 1000);});
		selectableArea.mouseenter(function(){selectableArea.addClass('Highlight');});
		selectableArea.mouseleave(function(){selectableArea.removeClass('Highlight');});
		selectableArea.click(function(){areaSelected(id); return false;});
		
		selectableAreas[selectableAreas.length] = selectableArea;
	}
	
	this.removeAreas = function()
	{
		for (var index = 0; index < selectableAreas.length; index++)
		{
			selectableAreas[index].remove();
		}
		selectableAreas = new Array();
	}
	
	function areaSelected(id)
	{
		var eventProperties = new Object();
		eventProperties.id = id;
		ComponentFramework.raiseEvent('areaSelected', eventProperties);
	}
}