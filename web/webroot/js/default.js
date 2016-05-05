var date_object = new Date();
var day = String(date_object.getDate());
day = (day.length < 2) ? ("0" + day) : day;
var month = String(date_object.getMonth() + 1);
month = (month.length < 2) ? ("0" + month) : month;
var year = String(date_object.getFullYear());

//var today = day + "-" + month + "-" + year;
var today = [day, month, year].join('.');

