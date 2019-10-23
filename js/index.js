//eshint version:6

// Set some varibles
var bankerDeck = [];
var playerDeck = [];
var bankerNumber = 0;
var playerNumber = 0;
var bankerPoints = 2000;
var playerPoints = 1000;
var bet = 0;
var start = false;
var win = false;

var cardUsed = new Array(104);
cardUsed.fill(false, 0, 104);

$(".btn-bet").click(function (event) {
  bet = Number(event.currentTarget.innerText);
  betCompleted(bet);
});

$("#button-bet-submit").click(function () {
  bet = $("#individual-bet").val();
  betCompleted(bet);
});

function betCompleted(betAmount) {
  $(".head-sign").text("Select Your Action");
  $(".bet-amount").text("Your Bet: " + betAmount + ".");
  // $(".btn-bet").prop({disabled: true});
  // disabled the buttons and input box
  $(".btn-bet, #button-bet-submit, #individual-bet").prop("disabled", true);

  gameStart();
}

function gameStart() {
  // banker's phase
  bankerDeck.push(getCard());
  bankerDeck.push(getCard());

  // player's phase
  playerDeck.push(getCard());
  playerDeck.push(getCard());

  console.log(bankerDeck);
  console.log(playerDeck);

  // show cards
  showCards();

  // show total numbers
  showNumbers();

}

function showCards() {
  var c;
  bankerDeck.forEach(function (element, index, array) {
    c = (element % 52) + 1;
    $($(".banker-card .deck-card")[index]).prop("src", "imgs/deck/" + c + ".jpg");
  });

  playerDeck.forEach(function (element, index, array) {
    c = (element % 52) + 1;
    $($(".player-card .deck-card")[index]).prop("src", "imgs/deck/" + c + ".jpg");
  });
}

function showNumbers() {
  bankerNumber = calcNumber(bankerDeck);
  playerNumber = calcNumber(playerDeck);

  $(".banker-number").text("Banker's total number: " + bankerNumber);
  $(".player-number").text("Player's total number: " + playerNumber);
}

function getCard() {
  var randNumber;
  do {
    randNumber = Math.floor(Math.random() * 104);
  } while(cardUsed[randNumber] === true);
  cardUsed[randNumber] = true;

  return randNumber;

}

function calcNumber(deck) {
  var number = 0;
  var c;
  deck.forEach(function (element) {
    c = (element % 52) % 13;
    if (c >= 9) {
      number += 10;
    }
    else {
      number += (c + 1);
    }
  });

  return number;
}
