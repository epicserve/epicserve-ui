/**
 * epicserve-ui Form Validation
 * Copyright (c) 2010 Brent O'Connor
 * http://www.epicserve.com/
 * 
 * Version: 1.3
 * @requires jQuery v1.2.3 or later
 *
 * Dual licensed under the MIT and GPL licenses.
 * 
 * Example Usage:

	<script src="../eui/js/jquery/jquery-1.4.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="../eui/js/form/validation.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" charset="utf-8">
	$(function() {
		$('#my-form-id').validation({
			fields: [
				{ id: "name", test: "is_empty" },
				{ id: "email", test: "is_email" },
				{ id: "comment", test: "is_empty" }
			]
		});
	});
	</script>
	
 */
(function($) {
	$.fn.validation = function(options) {
	
		var o = $.extend({
			error_arr: [],
			error_display_type: 'inline',
			top_error_div_id: 'top-error-container',
			form_error_id: 'form-error',
			inline_error_class: 'error-msg',
			description_class: 'input-desc',
			error_msgs_pos: 'top',
			scrollto: false,
			submit_btn: false,
			fields: [],
			error_top_inline_msg: '<p>Please correct the errors below.</p>',
			display_top_inline_error_msg: false,
			callback: false,
			default_errors: {
				'is_empty': 'This field is required.',
				'is_email': 'Enter a valid e-mail address.',
				'is_multipe_choice_empty': 'Please select one of the following.'
			}
		}, options);

		function init(forms) {
			return forms.each(function() {
				var form = $(this);
				o.form = form;
				form.submit(function() {
		
					if (o.submit_btn !== false) {
						$(o.submit_btn).attr("disabled", "disabled");
						$(o.submit_btn).val("Please Wait...");
					}
		
					check_form();
	
					if (o.error_arr.length === 0) {
						remove_errors();
						if (o.callback === false) {
							o.form.unbind("submit").trigger('submit');
						} else {
							return o.callback();
						}
					} else {
						display_errors();
						return false;
					}
				});

			});
		}
		
		function remove_errors() {
			$('.'+o.inline_error_class).each(function() {
				$(this).parent().removeClass('error');
				$(this).remove();
			});
		}
		
		
		function add_alt_attr() {
			fields = $(o.form).find("[alt]");
			$.each(fields, function(index, elem) {
				elem = $(elem);
				if(elem.val() == "") {
					elem.val(elem.attr('alt'));
					elem.addClass("class", o.description_class);
				}
			});
		}

		function clear_alt_attr() {
			fields = $(o.form).find("[alt]");
			$.each(fields, function(index, elem) {
				elem = $(elem);
				if(elem.val() === elem.attr("alt")) {
					elem.val('');
					elem.removeClass("class", o.description_class);
				}
			});
		}

		function add_error(field_key, error_msg) {
			o.error_arr[field_key] = error_msg;
		}

		function check_form() {
			
			o.error_arr = [];
			var test = $.fn.validation.test;
			clear_alt_attr();

			$.each(o.fields, function(index, item) {
		
				var test_found     = false;
				var input_id_value = $('#'+item.id).val();

				// check for special test types first
				switch(item.test) {
					case "is_empty":
						if (typeof item.if_empty_fields !== "undefined") {
							test_found = true;
							result = test.is_empty_with_if_fields(item);
						}
					break;
					case "is_multipe_choice_empty":
						test_found = true;
						result = test.is_multipe_choice_empty(item);
					break;
					case "is_same":
						test_found      = true;
						input_id_value2 = $(item.id+'-2').attr("value");
						result          = test.is_same(input_id_value, input_id_value2);
					break;
					case "is_password_valid":
						test_found = true;
						options    = (typeof item.options !== "undefined") ? item.options : null;
						result     = test.is_password_valid(input_id_value, index, options);
					break;
				}

				// run normal tests if it wasn't a special kind of test
				if (typeof eval('test.'+item.test) == "function" && test_found == false) {
					result = eval('test.'+item.test+"(\""+escape(input_id_value)+"\")");
				}
		
				if (typeof result !== "undefined" && result === false) {
					if (typeof item.error_msg === "undefined") {
						if (typeof o.default_errors[item.test] === "undefined") {
							item.error_msg = o.default_errors['is_empty'];
						} else {
							item.error_msg = o.default_errors[item.test];
						}
					}
					add_error(index, item.error_msg);
				}

			});
			return false;
		}

		function display_inline_errors() {

			var fields    = o.fields;
	
			// add top error message
			if ($("#"+o.top_error_div_id).length === 0 && o.display_top_inline_error_msg === true) {
				o.form.prepend('<div>');
				o.form.find('div:first').attr('id', o.top_error_div_id).html(o.error_top_inline_msg);
			}

			// remove previous error messages
			remove_errors();
	
			// add new error messages
			$.each(fields, function(key, field) {

				var selector = '#'+field.id;
				if (field.test === "is_multipe_choice_empty") {
					selector = '#'+$('input[name='+selector.substring(1)+']:first').attr('id');
				}
		
				if (typeof o.error_arr[key] !== "undefined") {
			
					if (field.test === "is_multipe_choice_empty" && (typeof $(selector).parent()[0] !== 'undefined' && $(selector).parent()[0].tagName.toLowerCase() === "label")) {
						var parent = $(selector).parent().parents('ul');
						var parent_tag = 'div';
					} else if (typeof $(selector).parent().prev()[0] !== "undefined" && $(selector).parent().prev()[0].tagName.toLowerCase() === 'dt') {
						var parent = $(selector).parent().parent('dl');
						var parent_tag = 'div';
					} else {
						var parent     = $(selector).parent();
						var parent_tag = parent[0].tagName.toLowerCase();
					}
					error_msg = '<'+parent_tag+' class="'+o.inline_error_class+'">'+field.error_msg+'</'+parent_tag+">\n";
					if (o.error_msgs_pos === 'top') {
						parent.before(error_msg);
					} else {
						$(selector).after(error_msg);
					}
					$(selector).parent().addClass('error');
				}

			});
	
			$('.'+o.inline_error_class).each(function() {
				if ($(this).next().hasClass(o.inline_error_class)) {
					$(this).next().remove();
				}
			});
	
			// re-enable submit button
			if (typeof o.submit_btn !== "undefined" && o.submit_btn_value !== "undefined") {
				$(o.submit_btn).val(o.submit_btn_value);
				$(o.submit_btn).removeAttr("disabled");
			}
	
			// scroll to location
			if (o.scrollto !== false) {
				o.scrollto();
			}

		}

		function display_top_errors() {

			// make array unique
			Array.prototype.getUnique = function () {
				var o = new Object();
				var i, e;
				$.each(this, function(i, e) {
					if (typeof e !== "undefined") o[e] = 1;
				});
				var a = new Array();
				for (e in o) {a.push (e);};
				return a;
			};
	
			error_arr = error_arr.getUnique();

			add_alt_attr();
			window.scroll(0,0);
			html_error = "\t<p>The operation could not be performed because one or more error(s) occurred.  Please resubmit the form after making the following changes:</p>"+
						 "\t<ul>\n";
			$.each(error_arr, function(index, error) {
				html_error += "\t\t<li>"+error+"</li>\n";
			});
			html_error = '<div id="'+o.form_error_id+'">'+html_error+"\t</ul>\n</div>";
			if ($('#'+o.form_error_id).length > 0) {
				$('#'+o.form_error_id).remove();
			}
			o.form.prepend(html_error);
			$('#'+o.form_error_id).hide();
			$('#'+o.form_error_id).fadeIn("slow");
			if (typeof o.submit_btn !== "undefined" && typeof o.submit_btn_value !== "undefined") {
				$(o.submit_btn).val(o.submit_btn_value);
				$(o.submit_btn).removeAttr("disabled");
			}

		}

		function display_errors() {
	
			add_alt_attr();
			if (o.error_display_type == 'inline') {
				display_inline_errors();
			} else if (o.error_display_type == 'top') {
				display_top_errors();
			}
			return false;
		}

		return init(this);
	}
	
	$.fn.validation.test = {
		
		is_empty: function(text_str) {
			if (text_str === "" || typeof text_str === "undefined") {
				return false;
			}
			return true;
		},

		is_multipe_choice_empty: function(item) {
			var ret_val    = false;
			var input_name = item.id.substring(1);
			$('input[name='+input_name+']').each(function() {
				if ($(this).attr('checked') === true || $(this).attr('selected') === true) {
					ret_val = true;
				}
			});
			return ret_val;
		},

		is_bool: function(text_str) {
			if (typeof text_str === "undefined") return false;
			if (text_str != "1" && text_str != "0") {
				return false;
			}
			return true;
		},

		is_empty_with_if_fields: function(item) {
			is_empty_with_if_fields.result = true;
			$.each(item.if_empty_fields, function(key, val) {
				result = is_empty($(val).val());
				if (result == false) {
					result2 = is_empty($(item.id).val());
					if (result2 == false) {
						is_empty_with_if_fields.result = false;
						return false;
					}
				}
			});
			return is_empty_with_if_fields.result;
		},

		is_email: function(text_str) {
			pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (typeof text_str === "undefined" || pattern.test(text_str) === false) {
				return false;
			}
			return true;
		},

		is_same: function(text_str, text2_str) {
			if (typeof text_str === "undefined" || typeof text2_str === "undefined" || text_str !== text2_str) {
				return false;
			}
			return true;
		},

		is_password_valid: function(password, index, options) {
	
			min_length               = (typeof options === "undefined" || typeof options['min_length'] === "undefined") ? 6 : options['min_length'];
			invalid_chars            = (typeof options === "undefined" || typeof options['invalid_chars'] === "undefined") ? "\\s" : options['invalid_chars'];
			required_chars           = (typeof options === "undefined" || typeof options['required_chars'] === "undefined") ? false : options['required_chars'];
			min_length_error_msg     = (typeof options === "undefined" || typeof options['min_length_error_msg'] === "undefined") ? 'Please enter a longer password.  Your password needs to be at least '+ min_length +' characters in length' : options['min_length_error_msg'];
			invalid_chars_error_msg  = (typeof options === "undefined" || typeof options['invalid_chars_error_msg'] === "undefined") ? 'The password you entered has invalid characters like spaces.' : options['invalid_chars_error_msg'];
			required_chars_error_msg = (typeof options === "undefined" || typeof options['required_chars_error_msg'] === "undefined") ? 'The password you entered is missing required characters.' : options['required_chars_error_msg'];

			// check password length
			if (password.length < min_length) {
				settings.fields[index].error_msg = min_length_error_msg;
				return false;
			}
	
			// check for invalid characters
			pattern   = new RegExp(invalid_chars);
			if (pattern.test(password) == true) {
				settings.fields[index].error_msg = invalid_chars_error_msg;
				return false;
			}
	
			// check for required characters
			if (required_chars !== false) {
				has_required_chars = true;
				$.each(required_chars, function(key, val) {
					pattern   = new RegExp(val);
					if (pattern.test(password) === false) {
						has_required_chars = false;
						settings.fields[index].error_msg = required_chars_error_msg;
						return false;
					}
				});
				return has_required_chars;
			}
			return true;
		}

	}
})(jQuery);