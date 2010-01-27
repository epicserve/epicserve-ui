/**
 * jQuery Image Fader Plugin
 * Copyright (c) 2009 Brent O'Connor
 * http://www.epicserve.com/
 *
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {

	$.fn.image_fader = function(options) {
		
		if ($.browser.msie && $.browser.version < 7) return;
		
		var image_fader = this;
		
		var o = $.extend({}, $.fn.image_fader.defaults, options);

		function over_action(elem) {
			elem = $(elem);
			span = elem.append('<span class="'+o.span_class_name+'" />');
			span.css('cursor', 'pointer');
			
			// This is a workaround because I couldn't get fadding to work for span tags that had
			// a PNG with an alpha transparency background
			if ($.browser.msie && $.browser.version >= 7 && o.has_transparent_png_image === true) {
				span.show();
			} else {
				span = elem.find('span').css('opacity', 0).css('cursor', 'pointer');
				span.stop().fadeTo(o.fade_in_speed, o.fade_in_opacity);
			}
		};
		
		function out_action(elem) {
			elem = $(elem);
			span = elem.find('span');
			span.stop().fadeTo(o.fade_out_speed, o.fade_out_opacity);
			span.remove("*");
		};	
			
		return this.each(function() {
			elem = $(this);
			elem.hover(function() { over_action(this); }, function() { out_action(this); } );
		});
	};
	
	$.fn.image_fader.defaults = {
		span_class_name: 'image-fader',
		fade_in_speed: 200,
		fade_out_speed: "slow",
		fade_in_opacity: 1,
		fade_out_opacity: 0,
		has_transparent_png_image: true
	};
	
})(jQuery);