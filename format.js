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
	if (typeof arguments[1] == 'object') {
		if (arguments[1] instanceof Array) {
			var array = arguments[1];
			for (var i = 0; i < array.length; i++) {
				var regexp = new RegExp('\\{' + i + ':?(.*?)\\}', 'gi');
				var match = regexp.exec(formatted);
				formatted = formatted.replace(regexp, array[i] == null ? '' : formatProvider(array[i], match[1]));
			}
		}
		else{
			var obj = arguments[1];
			for (var i in obj) {
				var regexp = new RegExp('@\\{' + i + ':?(.*?)\\}', 'gi');
				var match = regexp.exec(formatted);
				formatted = formatted.replace(regexp, obj[i] == null ? '' : formatProvider(obj[i], match[1]));
			}
	}	}
	else {		
		for (var i = 1; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + (i - 1).toString() + ':?(.*?)\\}', 'gi');
			var match = regexp.exec(formatted);			
			formatted = formatted.replace(regexp, arguments[i] == null ? '' : formatProvider(arguments[i], match[1]));
		}
	}
	return formatted;
}

