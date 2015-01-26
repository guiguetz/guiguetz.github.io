function count() {
  var date = new Date;
  var unix = date.getTime();
  var ms = unix - 1422305657000;
  $('.count').empty().append(ms);
}

setInterval(function(){count()},50);