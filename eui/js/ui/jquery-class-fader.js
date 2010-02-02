/**
 * jQuery Class Fader
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 1.0
 *
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {

	var $$ = $.fn.class_fader;
	
	$.fn.class_fader = function(options) {
		
		var self = $.fn.class_fader;
		
		self.o = $.extend({
			on_class: 'on',
			off_class: 'off',
			on_fade_speed: 'slow',
			off_fade_speed: 'slow',
			on_fade_opacity: 1,
			off_fade_opacity: 1,
			clone_zindex: 10000
		}, options);
		
		function init(elems) {
			return elems.each(function() {
				el = $(this);
				self.add_elem_clone($(this));
				clone = el.prev();
				clone.hover(
					function() {
						self.fade($(this), 'on', self.o.on_fade_speed, self.o.on_fade_opacity);
					},
					function() {
						self.fade($(this), 'off', self.o.off_fade_speed, self.o.off_fade_opacity);
					}
				);
			});
		}
		
		return init(this);
	};
	
	$$.add_elem_clone= function(el) {
		
		var o = $$.o;
		
		el.clone(true).prependTo(el.parent());
		el_cone = el.parent().children().first();
		el_cone.css({ position: 'absolute', zIndex: o.clone_zindex });
		el.css({ position: 'absolute' });
	};
	
	$$.remove_add_class = function(el, remove_class, add_class) {
		el.removeClass(remove_class).addClass(add_class);
	};
	
	$$.toggle_classes = function(el, state) {
		
		var o = $$.o;
		
		if (state === 'on') {
			state = 1;
		} else {
			state = 0;
		}
		
		top_class  = [o.off_class, o.on_class];
		bott_class = [o.on_class, o.off_class];
		el_clone   = el.parent().children().first();
		
		el_clone.css({ visibility: 'hidden', opacity: 0 });
		$$.remove_add_class(el_clone, bott_class[state], top_class[state]);
		$$.remove_add_class(el, top_class[state], bott_class[state]);
	};

	$$.fade = function(el_clone, state, speed, opacity) {
		var o = $$.o;
		var el = el_clone.next();
		$$.toggle_classes(el, state);
		el_clone.css({ visibility: 'visible' });
		el_clone.fadeTo(speed, opacity);
	};

})(jQuery);