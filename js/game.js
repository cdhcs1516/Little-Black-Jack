//jshint esversion:6

class Deck {
  constructor() {
    this.deck = new Array(52);
    this.deck.fill(false, 0, 52);
    this.used = 0;
  }

  refresh() {
    this.deck.fill(false, 0, 52);
    this.used = 0;
  }

  getCard() {
    var randNumber;
    do {
      randNumber = Math.floor(Math.random() * 52);
    } while(this.deck[randNumber] === true);
    this.deck[randNumber] = true;
    this.used ++;

    return (randNumber + 1);
  }
}

let fullDeck = new Deck();

// the super-class for players
class Player {
  constructor(credit) {
    this.cards = [];
    this.point = 0;
    this.sumOfAce = 0;
    this.credit = credit;
  }

  initial(card1, card2) {
    this.addCard(card1);
    this.addCard(card2);
  }

  // card should be 1-index based (like A:1, 2:2, ..., K:13) and range from [1, 52]
  addCard(card) {
    this.cards.push(card);
    var c = card % 13;
    if (c === 1) {
      this.sumOfAce ++;
      this.point += 11;
    }
    else if (c >= 10 || c === 0) {
      this.point += 10;
    }
    else {
      this.point += c;
    }

    if (this.point > 21 && this.sumOfAce > 0) {
      this.sumOfAce --;
      this.point -= 10;
    }
  }

  getCards() {
    return this.cards;
  }

  removeCards() {
    this.cards = [];
    this.point = 0;
    this.sumOfAce = 0;
  }

  getPoint() {
    return this.point;
  }

  getCredit() {
    return this.credit;
  }

  checkBomb() {
    if (this.point > 21 && this.sumOfAce > 0) {
      this.sumOfAce --;
      this.point -= 10;
    }

    if (this.point > 21) {
      return true;
    }
    else {
      return false;
    }
  }

  win(bet) {
    this.credit += bet;
    this.removeCards();
  }

  lose(bet) {
    this.credit -= bet;
    this.removeCards();
  }
}

class Banker extends Player {
  play() {
    while (this.point < 17) {
      this.addCard(fullDeck.getCard());
    }
  }

  // actually, this function just returns the point of the second card
  getMaskPoint() {
    var c = this.cards[1] % 13;
    if (c === 1) {
      return 11;
    }
    else if (c === 0 || c >= 11) {
      return 10;
    }
    else {
      return c;
    }
  }
}

class Gamer extends Player {
  play() {
    this.addCard(fullDeck.getCard());
  }
}

let banker = new Banker(5000);
let gamer = new Gamer(1000);
var started = false;
var bet = 0;

// $(document).keydown(function () {
//   if (started === false) {
//     nextSequence();
//     started = true;
//   }
// });

$(".btn-bet").click(function (event) {
  bet = Number(event.currentTarget.innerText);
  betCompleted(bet);
});

$("#button-bet-submit").click(function () {
  bet = Number($("#individual-bet").val());
  betCompleted(bet);
});

$(".btn-action").click(function (event) {
  var action = event.currentTarget.innerText;
  if (action === "Hit") {
    gamer.play();
    showWithMask();
    if (gamer.checkBomb()) {
      gamerCompleted();
      bankerWin();
    }
  }
  else {
    gamerCompleted();
    banker.play();
    showAll();
    if (banker.checkBomb()) {
      gamerWin();
    }
    else {
      if (banker.getPoint() < gamer.getPoint()) {
        gamerWin();
      }
      else if (banker.getPoint() > gamer.getPoint()) {
        bankerWin();
      }
      else {
        tie();
      }
    }
  }
});

$(".next-round .btn").click(function () {
  startOver();
});

function betCompleted(betAmount) {
  if (betAmount > gamer.getCredit()) {
    $(".head-sign").text("No Enough Chips. Bet Again");
    return;
  }
  else {
    $(".head-sign").text("Select Your Action");
    $(".bet-amount").text("Your Bet: " + betAmount + ".");
    // $(".btn-bet").prop({disabled: true});
    // disabled the buttons and input box
    $(".btn-bet, #button-bet-submit, #individual-bet").prop("disabled", true);

    if (started === false) {
      gameStart();
      started = true;
    }
  }
}

function gameStart() {
  banker.initial(fullDeck.getCard(), fullDeck.getCard());
  gamer.initial(fullDeck.getCard(), fullDeck.getCard());

  showWithMask();
}

function showWithMask() {
  $($(".banker-card .deck-card")[0]).prop("src", "imgs/deck/deck-back.png");
  banker.getCards().forEach(function (element, index, array) {
    if (index > 0) {
      $($(".banker-card .deck-card")[index]).prop("src", "imgs/deck/" + element + ".jpg");
    }
  });

  gamer.getCards().forEach(function (element, index, array) {
    $($(".player-card .deck-card")[index]).prop("src", "imgs/deck/" + element + ".jpg");
  });

  $(".banker-number").text("Banker's total number: " + banker.getMaskPoint());
  $(".player-number").text("Player's total number: " + gamer.getPoint());
}

function showAll() {
  banker.getCards().forEach(function (element, index, array) {
    $($(".banker-card .deck-card")[index]).prop("src", "imgs/deck/" + element + ".jpg");
  });

  gamer.getCards().forEach(function (element, index, array) {
    $($(".player-card .deck-card")[index]).prop("src", "imgs/deck/" + element + ".jpg");
  });

  $(".banker-number").text("Banker's total number: " + banker.getPoint());
  $(".player-number").text("Player's total number: " + gamer.getPoint());

}

function gamerCompleted() {
  $(".btn-action").prop("disabled", true);
}

function bankerWin() {
  banker.win(bet);
  gamer.lose(bet);

  $(".banker-point").text("Banker's Points: " + banker.getCredit());
  $(".gamer-point").text("Your Points: " + gamer.getCredit());
  $(".head-sign").text("You lose " + bet + ".");

  if (gamer.getCredit() <= 0) {
    alert("Sorry! You have no chips. Game Over!");
  }
  else {
    $(".next-round .btn").prop("disabled", false);
  }
}

function gamerWin() {
  gamer.win(bet);
  banker.lose(bet);

  $(".banker-point").text("Banker's Points: " + banker.getCredit());
  $(".gamer-point").text("Your Points: " + gamer.getCredit());
  $(".head-sign").text("You win " + bet + "!");
  $(".head-sign").text("You win " + bet + "!");

  if (banker.getCredit() <= 0) {
    alert("Congradulations! You beat the banker! He goes bankrupt!");
  }
  else {
    $(".next-round .btn").prop("disabled", false);
  }
}

function tie() {
  $(".head-sign").text("Tie, next round.");

  $(".next-round .btn").prop("disabled", false);
}

function startOver() {
  // reset deck and both players
  fullDeck.refresh();
  banker.removeCards();
  gamer.removeCards();

  // refresh the display
  $(".head-sign").text("Make Your Bet");
  $(".deck-card").prop("src", "");
  showAll();

  // enable the bet and action buttons
  $(".btn-bet, #button-bet-submit, #individual-bet").prop("disabled", false);
  $(".btn-action").prop("disabled", false);

  // disable the next-round button
  $(".next-round .btn").prop("disabled", true);

  started = false;
}
