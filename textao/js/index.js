$(document.body).on('click','input',function(){
  $('input').hide();
  $('span').show();
  bg();
});

function bg() {
  var arr = ['60FF3A','E8A70C','FF0000','260CE8','0DFFBC'], 
      i = -1;
  (function f(){
    i = (i + 1) % arr.length;
    $('body').css('background','#' + arr[i])  
    setTimeout(f, 100);
  })();
}