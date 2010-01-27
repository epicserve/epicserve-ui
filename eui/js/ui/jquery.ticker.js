/**
 * jQuery Ticker
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.1
 *
 * Dual licensed under the MIT and GPL licenses.
 */
jQuery.fn.ticker = function(settings) {
		
		var o = jQuery.extend({
			velocity: 0.3,
			wrap_tag: '<div class="mask"></div>',
			ticker_container_tag: '<div class="ticker-container"></div>'
		}, settings);
		
		return this.each(function(){
				var ticker = jQuery(this);
				ticker.addClass("ticker");
				var ticker_width = 0;
				var wrap = ticker.wrap(o.wrap_tag);
				var ticker_container = ticker.parent().wrap(o.ticker_container_tag);								
				var container_width = ticker.parent().parent().width();
				ticker.children().each(function(i){
					ticker_width += jQuery(this, i).width();
				});
				ticker.width(total_scroll_length);
				var total_scroll_length = ticker_width+container_width;
				var scroll_timing = total_scroll_length/o.velocity;
				function scroll_ticker(spazio, tempo){
					ticker.animate({left: '-='+ spazio}, tempo, "linear", function(){ ticker.css("left", container_width); scroll_ticker(total_scroll_length, scroll_timing);});
				}
				ticker.css("left", container_width);
				scroll_ticker(container_width, scroll_timing);
				ticker.hover(
					function(){
						jQuery(this).stop();
					},
					function(){
						var offset = jQuery(this).offset();
						var space_left = (offset.left+ticker_width);
						var time_left = (space_left/o.velocity);
						scroll_ticker(space_left, time_left);
					}
				);			
		});	
};