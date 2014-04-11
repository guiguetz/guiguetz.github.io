/* Write JavaScript here */
var clique = 1;
var custo = 10;
var pontos = 0;
var timed = 0;
var tier1 = 0;
var tier2 = 0;

<<<<<<< HEAD
<<<<<<< HEAD
setInterval(refresh, 1000);
=======
setInterval(refresh(), 1000);
>>>>>>> d862d46bbb4e600d33e4a572dac3387a06a613fc
=======
setInterval(refresh(), 1000);
>>>>>>> d862d46bbb4e600d33e4a572dac3387a06a613fc

function manual() {
  pontos += clique;
  refresh();
}

<<<<<<< HEAD
=======
function auto() {
  pontos += timed;
  refresh();
}

>>>>>>> d862d46bbb4e600d33e4a572dac3387a06a613fc
function notManual1() {
  timed+=0.01;
  tier1+=1;
  document.getElementById("Tier1").innerHTML = (tier1);
  refresh();
}

function notManual2() {
  timed+=1;
  tier2+=1;
  document.getElementById("Tier2").innerHTML = (tier2);
  refresh();
}

function upgrade(num) {
  if (pontos>=custo) {
    clique+=num;
    pontos-=custo; 
    custo=10*Math.pow(1.15,(num));
	document.getElementById("QtFPC").innerHTML = (clique);
	document.getElementById("custo").innerHTML = (custo.toFixed(2));
  }
  refresh();
}

function refresh() {
  document.getElementById("mostrador").innerHTML = (pontos.toFixed(2));
<<<<<<< HEAD
<<<<<<< HEAD
  pontos += timed;
}
=======
}
>>>>>>> d862d46bbb4e600d33e4a572dac3387a06a613fc
=======
}
>>>>>>> d862d46bbb4e600d33e4a572dac3387a06a613fc
