/* Write JavaScript here */
var clique = 1;
var custo = 10;
var pontos = 0;
var timed = 0;
var tier1 = 0;
var tier2 = 0;


function manual() {
  pontos += clique;
  refresh();
}

function auto() {
  pontos += timed;
  refresh();
}
setInterval(refresh, 1000);

function notManual1() {
  timed+=1;
  tier1+=1;
}

function notManual2() {
  timed+=1;
  tier2+=1;
}

function upgrade(num) {
  if (pontos>=custo) {
    clique+=num;
    pontos-=custo; 
    custo[num]=10*Math.pow(1.15,(num));
  }
  refresh();
}

function refresh() {
  auto();
  document.getElementById("QtFPC").innerHTML = ("+" + clique + " FP");
  document.getElementById("custo").innerHTML = (custo.toFixed(2) + " FP");
  document.getElementById("Tier1").innerHTML = (tier1);
  document.getElementById("Tier2").innerHTML = (tier2);
  document.getElementById("mostrador").innerHTML = (pontos.toFixed(2));
}