var cultures = new Object();

cultures.invariant = {
numbers : '0123456789',
decimal : '.',
firstDay : 'Monday',
currency : '$',
weekDays : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurseday', 'Friday']
}

cultures['fa-IR'] = {
numbers : '۰۱۲۳۴۵۶۷۸۹',
months : ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
decimal : '/',
firstDay : 'Saturday',
currency : 'ریال',
weekDays : ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهار شنبه', 'پنج شنبه', 'آدینه']
}

function GetWeekDayName(code, cultureName) {
	return cultures[cultureName].weekDays[code];
}
