/**
 * jQuery More/Less Plugin
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.2
 *
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {

	$.fn.more_less = function(options) {

		var self = this;
		var o    = $.extend({
			max_height: 100,
			innner_wrap_classname: 'inner-wrap',
			link_wrap_classname: 'link-wrap',
			hidden_state_classname: 'hidden',
			more_link_text: 'more',
			less_link_text: 'less',
			annimate: true,
			show_speed: 'slow',
			hide_speed: 'slow',
			remove_ff_active_outline: true
		}, options);

		function show_text(elem) {
			elem.removeClass(o.hidden_state_classname);
			if (o.annimate === false) {
				elem.find('div.'+o.innner_wrap_classname).css({ height: 'auto', overflow: 'visible' });
			} else {
				var inner_wrap_height = elem.find('div.'+o.innner_wrap_classname).attr("box_h") + "px";
				elem.find('div.'+o.innner_wrap_classname).animate({ "height": inner_wrap_height }, { duration: o.hide_speed });
			}
			elem.find('div.'+o.link_wrap_classname+' a').html(o.less_link_text);
		}

		function hide_text(elem) {
			elem.addClass(o.hidden_state_classname);
			if (o.annimate === false) {
				elem.find('div.'+o.innner_wrap_classname).css({ height: o.max_height, overflow: 'hidden' });
			} else {
				elem.find('div.'+o.innner_wrap_classname).animate({"height": o.inner_height }, {duration: o.hide_speed });
			}
			elem.find('div.'+o.link_wrap_classname+' a').html(o.more_link_text);
		}

		function toggle_more_less(elem) {

			if (elem.hasClass(o.hidden_state_classname)) {
				show_text(elem);
			} else {
				hide_text(elem);
			}
			
		}

		function create_hide_text(elem) {
			elem.addClass(o.hidden_state_classname);
			elem.wrapInner('<div class="'+o.innner_wrap_classname+'"></div>');
			inner_wrap = elem.find('div.'+o.innner_wrap_classname);
			inner_wrap.attr('box_h', elem.height());
			inner_wrap.css({ height: o.inner_height, overflow: 'hidden' }).after('<div class="'+o.link_wrap_classname+'"><a href="javascript:void(0);">'+o.more_link_text+'</a></div>');
			toggle_link = elem.find('div.'+o.link_wrap_classname+' a');
			if (o.remove_ff_active_outline === true) toggle_link.css('outline', 'none');
			toggle_link.click(function() {
				toggle_more_less(elem);
			});
		}

		function init(elems) {

			if (typeof o.inner_height === 'undefined') o.inner_height = o.max_height;

			return elems.each(function() {
			
				var elem = $(this);

				if (elem.height() > o.max_height) {
					create_hide_text(elem);
				}

			});
		}

		return init(this);

	};
})(jQuery);