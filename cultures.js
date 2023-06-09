﻿var cultures = {};

cultures.invariant = {
    numbers: '0123456789',
    decimal: '.',
    firstDay: 'Monday',
    currency: '$',
    weekDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    dayParts: ['AM', 'PM'],
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    direction: 'ltr',
    defaultDateFormat: 'MM/dd/yy hh:mm:ss'
};

cultures['fa-IR'] = {
    numbers: '۰۱۲۳۴۵۶۷۸۹',
    months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    decimal: '/',
    firstDay: 'Saturday',
    currency: 'ریال',
    weekDays: ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهار شنبه', 'پنج شنبه', 'آدینه'],
    dayParts: ['ق.ظ', 'ب.ظ'],
    monthDays: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
    direction: 'rtl',
    defaultDateFormat: 'yy/MM/dd ساعت hh:mm:ss'
};

function GetWeekDayName(code, cultureName) {
    return cultures[cultureName].weekDays[code];
}


cultures['fa-IR'].fromDate = function (date) {
    var result = {};
    var invDayNo, calDayNo;
    var j_np;
    var i;

    var invDate = {
        year: date.getFullYear() - 1600,
        month: date.getMonth(),
        day: date.getDate() - 1
    };

    invDayNo = 365 * invDate.year + Math.floor((invDate.year + 3) / 4) - Math.floor((invDate.year + 99) / 100) + Math.floor((invDate.year + 399) / 400);

    for (i = 0; i < invDate.month; ++i)
        invDayNo += cultures.invariant.monthDays[i];
    if (invDate.month > 1 && ((invDate.year % 4 == 0 && invDate.year % 100 != 0) || (invDate.year % 400 == 0)))
    /* leap and after Feb */
        invDayNo++;
    invDayNo += invDate.day;

    calDayNo = invDayNo - 79;

    j_np = Math.floor(calDayNo / 12053);
    calDayNo %= 12053;

    result.year = 979 + 33 * j_np + 4 * Math.floor(calDayNo / 1461);
    calDayNo %= 1461;

    if (calDayNo >= 366) {
        result.year += Math.floor((calDayNo - 1) / 365);
        calDayNo = (calDayNo - 1) % 365;
    }

    for (i = 0; i < 11 && calDayNo >= cultures['fa-IR'].monthDays[i]; i++) {
        calDayNo -= cultures['fa-IR'].monthDays[i];
    }
    result.month = i + 1;
    result.day = calDayNo + 1;

    return result;
};