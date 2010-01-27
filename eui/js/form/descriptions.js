/**
 * TextFieldDescriptions was written by Brent O'Connor of epicserve.com
 */ 
var TextFieldDescriptions = {
	
	init: function() {
	
		// code for form helper div popups
		$.each($(".form-helper"), function() {
			
			target_elem = $("#"+$(this).attr("id").replace(/-helper/, ""));			
			this.style.display = "none";
			if ($(target_elem)[0].tagName == "SELECT") $(target_elem).unbind();
			$(target_elem).unbind("focus", TextFieldDescriptions.show_helper).bind("focus", TextFieldDescriptions.show_helper);
			$(target_elem).unbind("blur", TextFieldDescriptions.hide_all_helpers).bind("blur",  TextFieldDescriptions.hide_all_helpers);
			
		});
	
		// code for alt descriptions
		$.each($("input[type=text]"), function() {
			
			var elem = this;
			if ($(elem).hasClass("txt") && $(elem).attr("alt") != "") {
				
				if ($(elem).val() == "" || $(elem).val() == $(elem).attr("alt")) {
					$(elem).val($(elem).attr("alt"));
					$(elem).addClass("txt-desc");
				}
				$(elem).unbind("blur",  TextFieldDescriptions.add_alt_desc).bind("blur",    TextFieldDescriptions.add_alt_desc);
				$(elem).unbind("focus", TextFieldDescriptions.clear_value).bind("focus",   TextFieldDescriptions.clear_value);
			}
		
		});
		
	},
	
	hide_all_helpers: function() {
		
		$.each($(".form-helper"), function() {
			this.style.display = "none";
		});
	
	},
	
	show_helper: function() {
		
		var helper_elem = "#"+$(this).attr("id")+"-helper";
		$(helper_elem)[0].style.display = "block";

	},

	clear_value: function() {
		
		if ($(this).val() == $(this).attr("alt")) {
			$(this).val("");
			$(this).addClass("txt");
			$(this).removeClass("txt-desc");
		}

	},
	
	add_alt_desc: function() {
		
		if ($(this).val() == "") {
			$(this).addClass("txt-desc");
			$(this).removeClass("txt");
			$(this).val($(this).attr("alt"));
		}

	}
	
}