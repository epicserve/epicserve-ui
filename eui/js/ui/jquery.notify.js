/**
 * jQuery Notify
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.4
 *
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {

	$.fn.notify = function(options) {

		var self = this;
		var o    = $.extend({
			sticky: false,
			pause_time: 4000,
			fadein_annimation: 'slideDown',
			fadout_annimation: 'slideUp',
			fadeout_speed: 'slow',
			fadein_speed: 'slow',
			prepend_to_body: true
		}, options);

		function fade_in(elem, speed) {
			if (isNaN(speed)) speed = "'"+speed+"'";
			eval('elem.'+o.fadein_annimation+'('+speed+')');
		}

		function fade_out(elem, speed) {
			if (isNaN(speed)) speed = "'"+speed+"'";
			eval('elem.'+o.fadout_annimation+'('+speed+')');
		}

		function init(elems) {

			if (o.sticky === true) return;

			return elems.each(function() {
				var elem = $(this);
				
				elem.css('display', 'hidden');
				
				if (o.prepend_to_body === true) {
					elem.prependTo('body');
					fade_out(elem, 0);
				}
				fade_in(elem, o.fadein_speed);
				setTimeout(function(){ fade_out(elem, o.fadeout_speed); }, o.pause_time);
				
			});
		}

		return init(this);

	};
})(jQuery);