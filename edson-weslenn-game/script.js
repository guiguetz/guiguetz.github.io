var sits =
    ['Seu amigo vem de longe te visitar e tomar umas brejas',
     'Você é convidado para ir à casa de um amigo e à pizzaria batepapo',
     'Uma garota diz que quer te ver desesperadamente',
     'Você é chamado para ser padrinho do casamento do seu melhor amigo',
     'Você está vendo uma pessoa em chamas e tem um balde de água que pode ajudá-la',
     'A cura pra humanidade está em suas mãos e você precisa entregar na estação do exército mais próxima']

var sit = sits[Math.floor(Math.random()*sits.length)];
$('.action').text(sit);

function lose() {
  alert('Você venceu! É assim que um Edson Weslenn deve agir!');
  location.reload();
}
function win() {
  alert('Não! Um Edson Weslenn nunca pode aparecer nos locais, e sim dar um bolo, independente da situação!');
  location.reload();
}