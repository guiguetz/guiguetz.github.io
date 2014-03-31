/* Write JavaScript here */
var pontos = 0;
var clique = 1;
var custo = 0;

function manual() {
  pontos += clique;
  refresh();
}

function upgrade() {
  preco();
  if (pontos>=custo) {
    clique+=1;
    pontos-=custo;
  }
  refresh();
}

function preco() {
  custo = 10*Math.pow(1.15,clique);
}

function refresh() {
    document.getElementById("mostrador").innerHTML = (pontos.toFixed(2) + " Falcatruas");
}