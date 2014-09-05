  var div = $(".count2");
  var date = new Date();
  
  var dia = date.getDay();
  var hora = date.getHours();
  var minuto = date.getMinutes();
  var segundo = date.getSeconds();
  
  var newDia = addZero(5-dia);
  var newHora = addZero(24-hora);
  var newMinuto = addZero(60-minuto);
  var newSegundo = addZero(60-segundo);

$(document).ready(function(){ 
  action();
});

if(dia ==6) {
  $('body')
  .css('background-image',"url('1.gif')")
  .css('background-repeat','no-repeat;')
  .css('background-size','100%')
  .css('background-color','rgb(0,0,0,0.2)');
}

function action() {
  div.empty();

  if (dia == 7) {
    newDia = addZero(5);
  }

  if (dia == 6) {
    div.append("Já é sábado!");
  } else {

   div.append(
    "Faltam "+ 
    checkVal(newDia,'dia')+""+
    checkVal(newHora,'hora')+", "+
    checkVal(newMinuto,'minuto')+" e "+
    checkVal(newSegundo,'segundo')+
    " para o sábado!"
    );
 }
  setTimeout(function(){action()}, 1000);
}

function checkVal(i,label) {
  var j = parseInt(i);
  if (equalsZero(j)) {
   i = '';
 } else {
   i = i+" "+label+isPlural(j);
 }
 return i;
}
function equalsZero(i) {
  if (i==0) {
    return true;
  } else {
    return false;
  }
}

function isPlural(i) {
  if (i>1) {
    return 's';
  } else {
    return '';
  }
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}