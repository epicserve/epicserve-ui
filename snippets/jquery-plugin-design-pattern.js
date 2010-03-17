/**
 * jQuery My Script Name
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.1
 *
 * Dual licensed under the MIT and GPL licenses.
 */


function is_required_version(required, current) {
	var cv_arr = current.split(".");
	var rv_arr = required.split(".");
	for (i=0; i <= cv_arr.length-1; i++) {
		cv_num = (typeof cv_arr[i] !== 'undefined' && isNaN(cv_arr[i]) === false) ? parseInt(cv_arr[i], 10) : NaN;
		rv_num = (typeof rv_arr[i] !== 'undefined' && isNaN(rv_arr[i]) === false) ? parseInt(rv_arr[i], 10) : NaN;

		if (cv_num > rv_num) {
			return true;
		} else if ((cv_num === rv_num) && typeof rv_arr[i+1] === "undefined") {
			return true;
		}
	}
	return false;
}

if (typeof jQuery !== "function") {
	throw new Error("jQuery isn't loaded, please load jQuery 1.2.6 or greater in order to use this plugin.");
}

if (is_required_version("1.2.6", $.fn.jquery) === false) {
	throw new Error("This plugin requires jQuery 1.2.6. and the current version of jQuery is "+ $.fn.jquery +".");
}


(function($) {

	$.fn.my_plugin = function(options) {
		
		var self = $.fn.my_plugin; // shortcut
		
		// default options
		self.o = $.extend({
			foo_otion: false,
			bar_option: false
		}, options);
		
		// initialize
		function init(elems) {
			
			// loop through elems from the jQuery selector
			return elems.each(function() {

				el = $(this); // shortcut
				
				// do stuff...
				
			});
		}
		
		// pass elems from the jQuery selector to the init() function
		return init(this);
	};
	
	var $$ = $.fn.my_plugin; // shortcut
	
	// plugin method
	$$.my_method = function(el) {
		
		var o = $$.o; // options shortcut
		
		// do stuff...
		
	};
	
})(jQuery);