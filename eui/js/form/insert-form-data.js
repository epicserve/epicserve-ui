/**
 * epicserve-ui Form Descriptions
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 0.1
 * Requires: jQuery 1.3 or newer
 *
 * Dual licensed under the MIT and GPL licenses.
 *
 * This script makes it easy to insert form data for testing forms.
 *
 * Example Usage:

	<script src="./eui/js/forms/insert-form-data.min.js" type="text/javascript"></script>
	<script type="text/javascript">

	$(function() {

		insert_form_data.init(
			{
				'first': 'John',
				'last': 'Smith',
				'some_checkbox': ['1', '2', '3', '4', '5', '6'],
				'address': 'PO Box 1234',
				'city': 'My Town',
				'state': 'ST',
				'zip': '12345'
			},
			{ 'desc_class': 'input-desc' }
		);

	});

	</script>
*/
insert_form_data = function() {
	
	return {

		o: {
			'desc_class': 'txt-desc'
		},
		
		init: function(form_data, options) {
			
			var self   = this;
			
			self.o = $.extend(self.o, options);
			
			$.each(form_data, function(k, v) {
				var elem = $('#'+k);
				var elem_type = elem.attr('type');
				elem_type = (elem_type) ? elem_type : "checkbox";
				if (elem_type == "checkbox" && typeof v === 'object') {
					elems = $('[name='+k+']');
					self.set_val(elems, v, elem_type);
				} else {
					self.set_val(elem, v, elem_type);
				}
			});
			
		},
		
		set_val: function(elem, val, type) {
			
			var self = this;
			
			switch(type) {
				case "radio":
					self.set_choice_val(elem, val);
				break;
				case "select":
					self.set_choice_val(elem, val);
				break;
				case "select-multiple":
					self.set_multichoice_val(elem, val, type);
				break;
				case "checkbox":
					self.set_multichoice_val(elem, val, type);
				break;
				default:
					elem.removeClass(self.o['desc_class']);
					elem.val(val);
				break;
			}
		},
		
		set_multichoice_val: function(elems, val_arr, type) {
			
			var elems = (type === 'checkbox') ? elems : elems.find('option');
			var select_name = (type === 'checkbox') ? 'checked' : 'selected';
			
			elems.each(function() {
				var elem = $(this);
				if (jQuery.inArray(elem.val(), val_arr) !== -1) {
					elem.attr(select_name, select_name);
				} else {
					elem.removeAttr(select_name);
				}
			});
		},
		
		set_choice_val: function(elem, val) {
			elem.find('option').each(function(){
				if ($(this).val() === val) {
					$(this).attr('selected', 'selected');
				} else {
					$(this).removeAttr('selected');
				}
			});
		}
	};
	
}();