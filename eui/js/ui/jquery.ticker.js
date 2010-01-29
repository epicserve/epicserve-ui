/**
 * jQuery Ticker
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.2
 *
 * Dual licensed under the MIT and GPL licenses.
 */
jQuery.fn.ticker = function(settings) {
		
		var o = jQuery.extend({
			velocity: 0.12,
			ticker_container_tag: '<div></div>',
			ticker_container_class: 'ticker-container',
			container_id_suffix: '-container', // appends to the origional elements id
			inner_wrap_tag: '<div></div>',
			inner_wrap_tag_class: 'mask',
			auto_add_ticker_padding: true
		}, settings);
		
		return this.each(function(){

				var ticker = jQuery(this);
				var ticker_width = 0;
				
				// add inner wrap
				ticker.wrap(o.inner_wrap_tag);
				var inner_wrap = ticker.parent();
				inner_wrap.addClass(o.inner_wrap_tag_class);
				
				// add container
				inner_wrap.wrap(o.ticker_container_tag);
				var ticker_container = inner_wrap.parent();
				var ticker_container_width = ticker_container.width();
				ticker_container.addClass(o.ticker_container_class);
				if (ticker.attr('id') !== '') ticker_container.attr('id', ticker.attr('id')+o.container_id_suffix);
				
				// Add padding to the ticker at the begining of the ticker so
				// the ticker can start "off screen" and then completely
				// scroll off the screen as well
				var inner_wrap_width = inner_wrap.width();
				if (o.auto_add_ticker_padding === true) {
					var first_child = ticker.children(':first');
					var first_child_left_padding = parseInt(first_child.css('paddingLeft').replace('px', ''), 0);
					first_child.css('paddingLeft', inner_wrap_width+first_child_left_padding);
				}
				
				var total_scroll_width = 0;
				ticker.children().each(function() {
					elem = $(this);
					total_scroll_width += elem.outerWidth();
				});
				var total_fx_time = total_scroll_width/o.velocity;
				ticker.width(total_scroll_width+inner_wrap_width);
				
				function scroll_ticker(target_pos, speed) {
					inner_wrap.animate({ scrollLeft: total_scroll_width }, speed, "linear", function() { inner_wrap.scrollLeft(0); scroll_ticker(total_scroll_width, total_fx_time); });
				}
				scroll_ticker(total_scroll_width, total_fx_time);
				inner_wrap.hover(
					function(){
						jQuery(this).stop();
					},
					function(){
						var scroll_pos = jQuery(this).scrollLeft();
						var space_left = (total_scroll_width-scroll_pos);
						var new_fx_speed = (space_left/o.velocity)*1;
						scroll_ticker(total_scroll_width, new_fx_speed);
					}
				);
		});	
};