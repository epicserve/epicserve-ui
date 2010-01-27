/**
 * epicserve-ui Form Descriptions
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 1.2
 *
 * Dual licensed under the MIT and GPL licenses.
 *
 * This jQuery plugin adds extra descriptions to all matching form input elements that have a value in the alt attribute of the input element.
 *
 * Example Usage:
 *
 * 	$(function() {
 * 		$('input[type=text]').descriptions();
 * 	});
 */

(function($) {

	$.fn.descriptions = function(options) {

		var o    = $.extend({
			description_class: 'input-desc'
		}, options);

		function clear_value(elem) {

			if (elem.val() == elem.attr('alt')) {
				elem.val("");
				elem.removeClass(o.description_class);
			}

		}

		function add_alt_desc(elem) {

			if (elem.val() == "" || elem.val() == elem.attr('alt')) {
				elem.addClass(o.description_class);
				elem.val(elem.attr('alt'));
			}

		}
		
		
		function init(elems) {

			return elems.each(function() {
				
				var elem = $(this);
				
				if ((elem.attr('alt') != "" && elem.val() == "") || (elem.val() == elem.attr('alt'))) {
				
					add_alt_desc(elem);
					elem.blur(function() { add_alt_desc(elem); });
					elem.focus(function() { clear_value(elem); });
				}

			});
		}
		
		return init(this);
		
	};
	
})(jQuery);