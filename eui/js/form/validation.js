var form_validator = function() {

	return {
		
		
		defaults: {
			error_arr: [],
			error_display_type: 'inline',
			inline_error_class: 'error-msg',
			form_fields: [],
			error_top_inline_msg: '<p>Please correct the errors below.</p>',
			error_msgs_pos: 'top',
			scrollto: false,
			submit_btn: false,
			top_error_div_id: 'top-error-container',
			form_error_id: 'form-error',
			callback: false,
			default_errors: {
				'is_empty': 'This field is required.',
				'is_email': 'Enter a valid e-mail address.',
				'is_multipe_choice_empty': 'Please select one of the following.'
			}
		},

		init: function(options) {
			
			// set options
			if (typeof options === 'undefined' && typeof this.settings === 'object') {
				var options = this.settings;
			}
			
			this.o = $.extend(this.defaults, options);
			
			$(this.o.form_selector).submit(function() {
				
				var o = form_validator.o;
				if (o.submit_btn !== false) {
					$(o.submit_btn).attr("disabled", "disabled");
					$(o.submit_btn).val("Please Wait...");
				}
				
				form_validator.check_form();
			
				if (form_validator.error_arr.length === 0) {
					if (form_validator.o.callback === false) {
						$(form_validator.o.form_selector).unbind("submit").trigger('submit');
					} else {
						return form_validator.o.callback();
					}
				} else {
				
					form_validator.display_errors();
					return false;
				
				}
				
			 });

		},
		
		is_empty: function(text_str) {
			if (text_str === "" || typeof text_str === "undefined") {
				return false;
			}
			return true;
		},
		
		is_multipe_choice_empty: function(item) {
			var ret_val    = false;
			var input_name = item.input_selector.substring(1);
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
			
			form_validator.is_empty_with_if_fields.result = true;
			$.each(item.if_empty_fields, function(key, val) {
				result = form_validator.is_empty($(val).val());
				if (result == false) {
					result2 = form_validator.is_empty($(item.input_selector).val());
					if (result2 == false) {
						form_validator.is_empty_with_if_fields.result = false;
						return false;
					}
					
				}
			});
			return form_validator.is_empty_with_if_fields.result;
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
				form_validator.settings.form_fields[index].error_msg = min_length_error_msg;
				return false;
			}
			
			// check for invalid characters
			pattern   = new RegExp(invalid_chars);
			if (pattern.test(password) == true) {
				form_validator.settings.form_fields[index].error_msg = invalid_chars_error_msg;
				return false;
			}
			
			// check for required characters
			if (required_chars !== false) {
				has_required_chars = true;
				$.each(required_chars, function(key, val) {
					pattern   = new RegExp(val);
					if (pattern.test(password) === false) {
						has_required_chars = false;
						form_validator.settings.form_fields[index].error_msg = required_chars_error_msg;
						return false;
					}
				});
				return has_required_chars;
			}
			return true;
		
		},
	
		add_alt_attr: function() {
			form_fields = $(this.o.form_selector + " input[alt]");
			$.each(form_fields, function(index, item) {
				item_value = $(item).attr("value");
				item_alt_value = $(item).attr("alt");
				if(typeof item_value === "undefined" || item_value == "") {
					$(item).val(item_alt_value);
					$(item).addClass("class", "txt-desc");
				}
			});
		},
	
		clear_alt_attr: function() {
			form_fields = $(this.o.form_selector + " input[alt]");
			$.each(form_fields, function(index, item) {
				item_value = $(item).attr("value");
				item_alt_value = $(item).attr("alt");
				if(item_value === item_alt_value) {
					$(item).val("");
					$(item).removeClass("class", "txt-desc");
				}
			});
		},
		
		add_error: function(field_key, error_msg) {

			this.error_arr[field_key] = error_msg;

		},

		check_form: function() {

			this.clear_alt_attr();
			this.error_arr = [];

			$.each(this.o.form_fields, function(index, item) {
				
				test_found     = false;
				input_id_value = $(item.input_selector).val();

				// check for special test types first
				switch(item.test_type) {
					case "is_empty":
						if (typeof item.if_empty_fields !== "undefined") {
							test_found = true;
							result = form_validator.is_empty_with_if_fields(item);
						}
					break;
					case "is_multipe_choice_empty":
						test_found = true;
						result = form_validator.is_multipe_choice_empty(item);
					break;
					case "is_same":
						test_found      = true;
						input_id_value2 = $(item.input_selector+'-2').attr("value");
						result          = form_validator.is_same(input_id_value, input_id_value2);
					break;
					case "is_password_valid":
						test_found = true;
						options    = (typeof item.options !== "undefined") ? item.options : null;
						result     = form_validator.is_password_valid(input_id_value, index, options);
					break;
				}

				// run normal tests if it wasn't a special kind of test
				if (typeof eval("form_validator."+item.test_type) == "function" && test_found == false) {
					result = eval("form_validator."+item.test_type+"(\""+escape(input_id_value)+"\")");
				}
				
				if (typeof result !== "undefined" && result === false) {
					if (typeof item.error_msg === "undefined") {
						if (typeof form_validator.o.default_errors[item.test_type] === "undefined") {
							item.error_msg = form_validator.o.default_errors['is_empty'];
						} else {
							item.error_msg = form_validator.o.default_errors[item.test_type];
						}
					}
					form_validator.add_error(index, item.error_msg);
				}

			});
			return false;
		},

		display_inline_errors: function() {

			var o     = this.o;
			var fields    = o.form_fields;
			var error_arr = this.error_arr;
			
			// add top error message
			if ($("#"+o.top_error_div_id).length === 0) {
				$(o.form_selector).prepend('<div id="'+o.top_error_div_id+'">'+o.error_top_inline_msg+'</div>');
			}

			// remove previous error messages
			$('.'+form_validator.o.inline_error_class).each(function() {
				$(this).parent().removeClass('error');
				$(this).remove();
			});
			
			// add new error messages
			$.each(fields, function(key, field) {

				var selector = field.input_selector;
				if (field.test_type === "is_multipe_choice_empty") {
					selector = '#'+$('input[name='+selector.substring(1)+']:first').attr('id');
				}
				
				if (typeof error_arr[key] !== "undefined") {
					
					if (field.test_type === "is_multipe_choice_empty" && (typeof $(selector).parent()[0] !== 'undefined' && $(selector).parent()[0].tagName.toLowerCase() === "label")) {
						var parent = $(selector).parent().parents('ul');
						var parent_tag = 'div';
					} else if (typeof $(selector).parent().prev()[0] !== "undefined" && $(selector).parent().prev()[0].tagName.toLowerCase() === 'dt') {
						var parent = $(selector).parent().parent('dl');
						var parent_tag = 'div';
					} else {
						var parent     = $(selector).parent();
						var parent_tag = parent[0].tagName.toLowerCase();
					}
					error_msg = '<'+parent_tag+' class="'+form_validator.o.inline_error_class+'">'+field.error_msg+'</'+parent_tag+">\n";
					if (o.error_msgs_pos === 'top') {
						parent.before(error_msg);
					} else {
						$(selector).after(error_msg);
					}
					$(selector).parent().addClass('error');
				}

			});
			
			$('.'+form_validator.o.inline_error_class).each(function() {
				if ($(this).next().hasClass(form_validator.o.inline_error_class)) {
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

		},

		display_top_errors: function() {
		
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
			
			this.error_arr = this.error_arr.getUnique();

			this.add_alt_attr();
			window.scroll(0,0);
			html_error = "\t<p>The operation could not be performed because one or more error(s) occurred.  Please resubmit the form after making the following changes:</p>"+
						 "\t<ul>\n";
			$.each(this.error_arr, function(index, error) {
				html_error += "\t\t<li>"+error+"</li>\n";
			});
			html_error = '<div id="'+this.o.form_error_id+'">'+html_error+"\t</ul>\n</div>";
			if ($('#'+this.o.form_error_id).length > 0) {
				$('#'+this.o.form_error_id).remove();
			}
			$(this.o.form_selector).prepend(html_error);
			$('#'+this.o.form_error_id).hide();
			$('#'+this.o.form_error_id).fadeIn("slow");
			if (typeof this.o.submit_btn !== "undefined" && typeof this.o.submit_btn_value !== "undefined") {
				$(this.o.submit_btn).val(this.o.submit_btn_value);
				$(this.o.submit_btn).removeAttr("disabled");
			}
		
		},
		
		
		display_errors: function() {
			
			this.add_alt_attr();
			if (this.o.error_display_type == 'inline') {
				this.display_inline_errors();
			} else if (this.o.error_display_type == 'top') {
				this.display_top_errors();
			}
			return false;
		}
	
	};
}();