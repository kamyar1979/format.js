var defaultCultureName = new String();

function setCulture(name){
	defaultCultureName = name;
}


String.prototype.format = function () {
	var formatted = unescape(this).replace('&amp;', '&');
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{' + i + '\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i] == null ? '' : arguments[i].toString());
	}
	return formatted;
}

String.map = function(str, src, dest) {
	var result = new String();
	for(var i = 0; i < str.length; i++) {
		var index = src.indexOf(str.charAt(i));
		if(index != -1) {
			result += dest.charAt(index);
		}
		else {
			result += str.charAt(i);
		}
	}
	return result;
}

Object.toCulture = function (obj, cultureName) {	
	var result = new String();
	var raw = new String();
	switch (typeof obj) {
		case 'number':
			raw = obj.toString();
			break;
		case 'date':
			raw = obj.toPersianDateString();
			break;
		case 'string':
			var re = new RegExp('/Date\\((\\d+)\\)/');
			if (re.test(obj)) {
				raw = (new Date(obj.match(re)[1] * 1)).toPersianDateString();
			}
			else
				raw = obj;
			break;
		default:
			raw = obj.toString();
			break;
	}
	return String.map(raw, cultures.invariant.numbers, cultures[cultureName].numbers);
}

invariantFormatProvider = function (obj, format) {	
	if (format) {		
		var result = new String();
		var raw = new String();
		switch (typeof obj) {
			case 'number':
				raw = obj.toString();				
				var numParts = raw.split('.');				
				var re = /(0*)(#*)\.?(#*)(0*)/g;
				var parts = re.exec(format);				
				if(parts[1] != '' && (parts[1].length + parts[2].length > numParts[0].length)) {										
					result += Array(parts[1].length + parts[2].length - numParts[0].length + 1).join('0');
				}
				
				result += numParts[0];
												
				
				if(numParts.length == 1) {
					numParts[1] = '';
				}
				
				if(parts[3].length < numParts[1].length) {
					numParts[1] = numParts[1].substr(0, parts[3].length);
				}
				if((parts[4] != '') || (numParts[1] != '')) {
					result += '.' + numParts[1];
				}
				
				
				if((parts[4] != '') && (parts[3].length + parts[4].length > numParts[1].length)) {				
					result += Array(parts[3].length + parts[4].length - numParts[1].length + 1).join('0');
				}
				
				return result;
			case 'object':
				if(obj instanceof Date){
					var re = /y{2,4}/;					
					var result = format;
					var match = format.match(re);
					if(match) {					
						if(match[0].length == 4) {
							result = result.replace(re, obj.getFullYear());
						}
						else{
							result = result.replace(re, obj.getFullYear().toString().substr(2, 2));
						}
					}
					re = /M{1,2}/;
					match = format.match(re);
					if(match) {
						if(match[0].length == 2) {
							result = result.replace(re, invariantFormatProvider(obj.getMonth(),'00'));
						}
						else{
							result = result.replace(re, obj.getMonth());
						}
					}
					re = /d{1,2}/;
					match = format.match(re);
					if(match) {
						if(match[0].length == 2) {
							result = result.replace(re, invariantFormatProvider(obj.getDay(),'00'));
						}
						else{
							result = result.replace(re, obj.getDay());
						}
					}
					re = /[hH]{1,2}/;
					match = format.match(re);
					if(match) {
						var hour = obj.getHours();
						if(match[0].indexOf('h') != -1) {
							if(hour > 12) hour -= 12;
						}
						if(match[0].length == 2) {
							result = result.replace(re, invariantFormatProvider(hour,'00'));
						}
						else{
							result = result.replace(re, hour);
						}
					}
					re = /m{1,2}/;
					match = format.match(re);
					if(match) {
						if(match[0].length == 2) {
							result = result.replace(re, invariantFormatProvider(obj.getMinutes(),'00'));
						}
						else{
							result = result.replace(re, obj.getMinutes());
						}
					}
					re = /s{1,2}/;
					match = format.match(re);
					if(match) {
						if(match[0].length == 2) {
							result = result.replace(re, invariantFormatProvider(obj.getSeconds(),'00'));
						}
						else{
							result = result.replace(re, obj.getSeconds());
						}
					}					
					return result;
				}
			default:
				return obj.toString();
		}
	}
	else {
		return obj.toString();
	}	
}

cultureFormatProvider = function (obj, cultureName, format) {
	if (format) {		
		var result = new String();
		var raw = new String();
		switch (typeof obj) {
			case 'number':				
				raw = obj.toString();				
				var numParts = raw.split('.');				
				var re = /(0*)(#*)\.?(#*)(0*)/g;
				var parts = re.exec(format);				
				if(parts[1] != '' && (parts[1].length + parts[2].length > numParts[0].length)) {										
					result += Array(parts[1].length + parts[2].length - numParts[0].length + 1).join(cultures[cultureName].numbers[0]);
				}
				
				result += String.map(numParts[0], cultures.invariant.numbers, cultures[cultureName].numbers);
												
				
				if(numParts.length == 1) {
					numParts[1] = '';
				}
				
				if(parts[3].length < numParts[1].length) {
					numParts[1] = numParts[1].substr(0, parts[3].length);
				}
				if((parts[4] != '') || (numParts[1] != '')) {
					result += cultures[cultureName].decimal + String.map(numParts[1], cultures.invariant.numbers, cultures[cultureName].numbers);
				}
				
				
				if((parts[4] != '') && (parts[3].length + parts[4].length > numParts[1].length)) {				
					result += Array(parts[3].length + parts[4].length - numParts[1].length + 1).join(cultures[cultureName].numbers[0]);
				}
				
				return result;
			default:
				return Object.toCulture(obj, cultureName);
		}
	}
	else {
		return Object.toCulture(obj, cultureName);
	}
}

String.format = function (format) {
	var formatProvider = function(obj, format) {		
		if(defaultCultureName && (defaultCultureName != ''))
			return cultureFormatProvider(obj, defaultCultureName, format);
		else
			return invariantFormatProvider(obj, format);
	};
	var formatted = unescape(format).replace('&amp;', '&');	
	if (arguments[1] instanceof Array) {
		var array = arguments[1];
		for (var i = 0; i < array.length; i++) {
			var regexp = new RegExp('\\{' + i + ':?(.*?)\\}', 'gi');
			var match = regexp.exec(formatted);
			formatted = formatted.replace(regexp, array[i] == null ? '' : formatProvider(array[i], match[1]));
		}
	}
	else if((typeof arguments[1] != 'number') && (typeof arguments[1] != 'string') && !(arguments[1] instanceof Date)){
		var obj = arguments[1];
		for (var i in obj) {
			var regexp = new RegExp('@\\{' + i + ':?(.*?)\\}', 'gi');
			var match = regexp.exec(formatted);
			formatted = formatted.replace(regexp, obj[i] == null ? '' : formatProvider(obj[i], match[1]));
		}
	}	
	else {		
		for (var i = 1; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + (i - 1).toString() + ':?(.*?)\\}', 'gi');
			var match = regexp.exec(formatted);			
			formatted = formatted.replace(regexp, arguments[i] == null ? '' : formatProvider(arguments[i], match[1]));
		}
	}
	return formatted;
}

