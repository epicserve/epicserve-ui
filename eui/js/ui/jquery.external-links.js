/**
 * jQuery External Links Plugin
 * Copyright (c) 2009 Brent O'Connor
 * http://www.epicserve.com/
 *
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {	

	$.fn.external_links = function(options) {
		
		var o = $.extend({
			add_rel: true,
			new_window: true,
			add_class: true,
			add_title: true,
			hostname: location.hostname,
			external_title: 'This link opens in a new window',
			class_name: 'external',
			local_domain_arr: [],
			new_window_callback: open_new_window
		}, options);
		
		function open_new_window () {
			window.open(this.href);
			return false;
		}
		
		function init(elems) {
			
			re = /^(https?:\/\/)([^\/]+).*\/?$/i;
			$(o.local_domain_arr).each(function(k, v) {
				o.local_domain_arr[k] = v.replace(re, "$2");
			});
			
			return elems.each(function() {
			
				var elem          = $(this);
				var external_link = false;
				var valid_link    = false;
	
				if (typeof elem.not("[href^=javascript]")[0] !== 'undefined') valid_link = true;
				
				if (valid_link === true) {
					
					if (elem.attr('rel') === "external") external_link = true;			
					
					// check if the link is external
					if (external_link === false && elem[0].hostname !== o.hostname) {
						if (o.local_domain_arr.length > 0) {
							if ($.inArray(elem[0].hostname, o.local_domain_arr) === -1) {
								external_link = true;
							}
						} else {
							external_link = true;
						}
					}
					
					if (external_link === true) {
						if (o.add_rel === true)    elem.attr('rel', 'external');
						if (o.add_class === true)  elem.addClass(o.class_name);
						if (o.add_title === true)  elem.attr('title', o.external_title);
						if (o.new_window === true) elem.click(o.new_window_callback);
					}
				
				}
			
			});
		}
		
		return init(this);
	
	};
	
	
})(jQuery);