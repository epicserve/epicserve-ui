/**
 * jQuery My Script Name
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.1
 *
 * Dual licensed under the MIT and GPL licenses.
 */
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