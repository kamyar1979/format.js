var defaultCultureName = '';

function setCulture(name) {
	defaultCultureName = name;
}

String.prototype.format = function () {
	var formatted = decodeURI(this).replace('&amp;', '&');
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{' + i + '\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i] !== null ? arguments[i].toString() : '');
	}
	return formatted;
};

String.map = function (str, src, dst) {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		var index = src.indexOf(str.charAt(i));
		if (index !== -1) {
			result += dst.charAt(index);
		}
		else {
			result += str.charAt(i);
		}
	}
	return result;
};

invariantFormatProvider = function (obj, format) {
	var result = '';
	var raw = '';
	var regexp;
	if (format) {
		switch (typeof obj) {
			case 'number':
				raw = obj.toString();
				var numParts = raw.split('.');
				var re = /(0*)(#*)\.?(#*)(0*)/g;
				var parts = re.exec(format);

				if (parts[1] !== '' && (parts[1].length + parts[2].length > numParts[0].length)) {
					result += new Array(parts[1].length + parts[2].length - numParts[0].length + 1).join('0');
				}

				result += numParts[0];


				if (numParts.length === 1) {
					numParts[1] = '';
				}

				if (parts[3] !== '' && parts[3].length < numParts[1].length) {
					numParts[1] = numParts[1].substr(0, parts[3].length);
				}
				if ((parts[4] !== '') || (numParts[1] !== '')) {
					result += '.' + numParts[1];
				}

				if ((parts[4] !== '') && (parts[3].length + parts[4].length > numParts[1].length)) {
					result += new Array(parts[3].length + parts[4].length - numParts[1].length + 1).join('0');
				}
				break;
			case 'object':
				if (obj instanceof Date) {
					regexp = /y{2,4}/;
					result = format;
					var match = format.match(regexp);
					if (match) {
						if (match[0].length === 4) {
							result = result.replace(regexp, obj.getFullYear().toString());
						}
						else {
							result = result.replace(regexp, obj.getFullYear().toString().substr(2, 2));
						}
					}
					regexp = /M{1,2}/;
					match = format.match(regexp);
					if (match) {
						if (match[0].length === 2) {
							result = result.replace(regexp, invariantFormatProvider(obj.getMonth(), '00'));
						}
						else {
							result = result.replace(regexp, obj.getMonth().toString());
						}
					}
					regexp = /d{1,2}/;
					match = format.match(regexp);
					if (match) {
						if (match[0].length === 2) {
							result = result.replace(regexp, invariantFormatProvider(obj.getDay(), '00'));
						}
						else {
							result = result.replace(regexp, obj.getDay().toString());
						}
					}
					regexp = /[hH]{1,2}/;
					match = format.match(regexp);
					if (match) {
						var hour = obj.getHours();
						if (match[0].indexOf('h') !== -1) {
							if (hour > 12) hour -= 12;
						}
						if (match[0].length === 2) {
							result = result.replace(regexp, invariantFormatProvider(hour, '00'));
						}
						else {
							result = result.replace(regexp, hour.toString());
						}
					}
					regexp = /m{1,2}/;
					match = format.match(regexp);
					if (match) {
						if (match[0].length === 2) {
							result = result.replace(regexp, invariantFormatProvider(obj.getMinutes(), '00'));
						}
						else {
							result = result.replace(regexp, obj.getMinutes().toString());
						}
					}
					regexp = /s{1,2}/;
					match = format.match(regexp);
					if (match) {
						if (match[0].length === 2) {
							result = result.replace(regexp, invariantFormatProvider(obj.getSeconds(), '00'));
						}
						else {
							result = result.replace(regexp, obj.getSeconds().toString());
						}
					}
				}
				break;
			default:
				result = obj.toString();
				break;
		}
	}
	else {
		result = obj.toString();
	}
	return result;
};

cultureFormatProvider = function (obj, cultureName, format) {
	var result = '';
	if (obj instanceof Date && !format) {
		format = cultures[cultureName].defaultDateFormat;
	}
	if (obj !== undefined && obj !== null) {
		if (format) {
			var raw = '';
			var regexp;
			var match;
			switch (typeof obj) {
				case 'number':
					raw = obj.toString();
					var numParts = raw.split('.');
					regexp = /(0*)(#*)\.?(#*)(0*)/g;
					var parts = regexp.exec(format);
					if (parts[1] !== '' && (parts[1].length + parts[2].length > numParts[0].length)) {
						result += new Array(parts[1].length + parts[2].length - numParts[0].length + 1).join(cultures[cultureName].numbers[0]);
					}

					result += String.map(numParts[0], cultures.invariant.numbers, cultures[cultureName].numbers);


					if (numParts.length === 1) {
						numParts[1] = '';
					}

					if (parts[3].length < numParts[1].length) {
						numParts[1] = numParts[1].substr(0, parts[3].length);
					}
					if ((parts[4] !== '') || (numParts[1] !== '')) {
						result += cultures[cultureName].decimal + String.map(numParts[1], cultures.invariant.numbers, cultures[cultureName].numbers);
					}


					if ((parts[4] !== '') && (parts[3].length + parts[4].length > numParts[1].length)) {
						result += new Array(parts[3].length + parts[4].length - numParts[1].length + 1).join(cultures[cultureName].numbers[0]);
					}
					break;
				case 'object':
					if (obj instanceof Date) {
						regexp = /y{2,4}/;
						result = format;
						match = format.match(regexp);
						var localeDate = cultures[cultureName].fromDate(obj);
						if (match) {
							if (match[0].length === 4) {
								result = result.replace(regexp, cultureFormatProvider(localeDate.year, cultureName));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(localeDate.year, cultureName).substr(2, 2));
							}
						}
						regexp = /M{1,2}/;
						match = format.match(regexp);
						if (match) {
							if (match[0].length === 2) {
								result = result.replace(regexp, cultureFormatProvider(localeDate.month, cultureName, '00'));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(localeDate.month, cultureName));
							}
						}
						regexp = /d{1,2}/;
						match = format.match(regexp);
						if (match) {
							if (match[0].length === 2) {
								result = result.replace(regexp, cultureFormatProvider(localeDate.day, cultureName, '00'));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(localeDate.day, cultureName));
							}
						}
						regexp = /[hH]{1,2}/;
						match = format.match(regexp);
						if (match) {
							var hour = obj.getHours();
							if (match[0].indexOf('h') !== -1) {
								if (hour > 12) hour -= 12;
							}
							if (match[0].length === 2) {
								result = result.replace(regexp, cultureFormatProvider(hour, cultureName, '00'));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(hour, cultureName));
							}
						}
						regexp = /m{1,2}/;
						match = format.match(regexp);
						if (match) {
							if (match[0].length === 2) {
								result = result.replace(regexp, cultureFormatProvider(obj.getMinutes(), cultureName, '00'));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(obj.getMinutes(), cultureName));
							}
						}
						regexp = /s{1,2}/;
						match = format.match(regexp);
						if (match) {
							if (match[0].length === 2) {
								result = result.replace(regexp, cultureFormatProvider(obj.getSeconds(), cultureName, '00'));
							}
							else {
								result = result.replace(regexp, cultureFormatProvider(obj.getSeconds(), cultureName));
							}
						}
						break;
					}
					break;
				default:
					result = String.map(obj.toString(), cultures.invariant.numbers + cultures.invariant.decimal, cultures[cultureName].numbers + cultures[cultureName].decimal);
					break;
			}
		}
		else {
			result = String.map(obj.toString(), cultures.invariant.numbers + cultures.invariant.decimal, cultures[cultureName].numbers + cultures[cultureName].decimal);
		}
	}
	return result;
};

String.cultureFormat = function (culture, format) {
	var formatted;
	try {
		var regexp;
		var match;
		var i = 0;
		var formatProvider = function (obj, format) {
			if (culture && (culture !== ''))
				return cultureFormatProvider(obj, culture, format);
			else
				return invariantFormatProvider(obj, format);
		};

		formatted = decodeURI(format).replace('&amp;', '&');
		if (arguments[2] instanceof Array) {
			var array = arguments[2];
			for (i = 0; i < array.length; i++) {
				regexp = new RegExp('\\{' + i + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					formatted = formatted.replace(regexp, array[i] === null ? '' : formatProvider(array[i], match[1]));
			}
		}
		else if ((typeof arguments[2] !== 'number') && (typeof arguments[2] !== 'string') && !(arguments[2] instanceof Date)) {
			var obj = arguments[2];
			for (var item in obj) {
				regexp = new RegExp('@\\{' + item + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					if (obj.hasOwnProperty(item))
						formatted = formatted.replace(regexp, obj[item] === null ? '' : formatProvider(obj[item], match[1]));
			}
		}
		else {
			for (i = 2; i < arguments.length; i++) {
				regexp = new RegExp('\\{' + (i - 2).toString() + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					formatted = formatted.replace(regexp, arguments[i] === null ? '' : formatProvider(arguments[i], match[1]));
			}
		}
	}
	catch (error) {
		formatted = error.message;
	}
	return formatted;
};


String.format = function (format) {
	var formatted;
	try {
		var regexp;
		var match;
		var i = 0;
		var formatProvider = function (obj, format) {
			if (defaultCultureName && (defaultCultureName !== ''))
				return cultureFormatProvider(obj, defaultCultureName, format);
			else
				return invariantFormatProvider(obj, format);
		};
		formatted = decodeURI(format).replace('&amp;', '&');
		if (arguments[1] instanceof Array) {
			var array = arguments[1];
			for (i = 0; i < array.length; i++) {
				regexp = new RegExp('\\{' + i + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					formatted = formatted.replace(regexp, array[i] === null ? '' : formatProvider(array[i], match[1]));
				else
					formatted = 'Invalid format';
			}
		}
		else if ((typeof arguments[1] !== 'number') && (typeof arguments[1] !== 'string') && !(arguments[1] instanceof Date)) {
			var obj = arguments[1];
			for (var item in obj) {
				regexp = new RegExp('@\\{' + item + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					if (obj.hasOwnProperty(item))
						formatted = formatted.replace(regexp, obj[item] === null ? '' : formatProvider(obj[item], match[1]));
					else
						formatted = 'Invalid format';
			}
		}
		else {
			for (i = 1; i < arguments.length; i++) {
				regexp = new RegExp('\\{' + (i - 1).toString() + ':?(.*?)\\}', 'gi');
				match = regexp.exec(formatted);
				if (match && match.length > 0)
					formatted = formatted.replace(regexp, arguments[i] === null ? '' : formatProvider(arguments[i], match[1]));
				else
					formatted = 'Invalid format';
			}
		}
	}
	catch (error) {
		format = error.message;
	}
	return formatted;
};

