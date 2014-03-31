/* Write JavaScript here */
var pontos = 0;
var clique = 1;
var custo = 10;
var timed = 0;

function manual() {
  pontos += clique;
  refresh();
}

function auto() {
  pontos += timed;
  refresh();
}

setInterval(refresh(), 1000);

function notManual() {
  timed+=1;
}

function upgrade() {
  if (pontos>=custo) {
    clique+=1;
    pontos-=custo; 
    custo=10*Math.pow(1.15,clique);
  }
  refresh();
}

function refresh() {
  document.getElementById("QtFPC").innerHTML = ("+" + clique + " FP");
  document.getElementById("custo1").innerHTML = (custo.toFixed(2) + " FP");
  document.getElementById("QtFPS").innerHTML = ("+" + timed + " FP/s");
  document.getElementById("mostrador").innerHTML = (pontos.toFixed(2) + " Falcatruas");
}