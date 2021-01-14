document.querySelector('#hit-button').addEventListener('click', blackjackHit);
document
  .querySelector('#stand-button')
  .addEventListener('click', blackjackStand);
document.querySelector('#deal-button').addEventListener('click', blackjackDeal);

let blackjackGame = {
  you: {
    scoreSpan: '#your-blackjack-result',
    div: '#your-box',
    score: 0,
  },
  dealer: {
    scoreSpan: '#dealer-blackjack-result',
    div: '#dealer-box',
    score: 0,
  },
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'],
  cardsDictionary: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  isHit: false,
  turnsOver: false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const CARDS = blackjackGame['cards'];
const CARDS_DIC = blackjackGame['cardsDictionary'];
const HIT_SOUND = new Audio('sounds/swish.m4a');
const LOST_SOUND = new Audio('sounds/aww.mp3');
const WIN_SOUND = new Audio('sounds/cash.mp3');

function blackjackDeal() {
  if (blackjackGame['turnsOver'] === true) {
    let yourCards = document.querySelector(YOU['div']).querySelectorAll('img');
    let dealerCards = document
      .querySelector(DEALER['div'])
      .querySelectorAll('img');

    for (let i = 0; i < yourCards.length; i++) {
      yourCards[i].remove();
    }

    for (let i = 0; i < dealerCards.length; i++) {
      dealerCards[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector(YOU['scoreSpan']).textContent = 0;
    document.querySelector(DEALER['scoreSpan']).textContent = 0;
    document.querySelector(YOU['scoreSpan']).style = 'white';
    document.querySelector(DEALER['scoreSpan']).style = 'white';
    document.querySelector('#black-jack-result').textContent = "Let's Play";
    document.querySelector('#black-jack-result').style.color = 'white';

    blackjackGame['isStand'] = false;
    blackjackGame['isHit'] = false;
    blackjackGame['turnsOver'] = false;
    blackjackGame['standPlayed'] = false;
  }
}

function blackjackHit() {
  if (blackjackGame['isStand'] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    blackjackGame['isHit'] = true;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function blackjackStand() {
  if (blackjackGame['isHit'] && blackjackGame['isStand'] === false) {
    while (DEALER['score'] < 16 && blackjackGame['isHit'] === true) {
      let card = randomCard();
      showCard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
      await sleep(1000);
    }
    blackjackGame['isStand'] = true;
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
  }
}

function randomCard() {
  let randomNum = Math.floor(Math.random() * 13);
  return CARDS[randomNum];
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let img = document.createElement('img');
    img.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(img);
    HIT_SOUND.play();
  }
}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    if (activePlayer['score'] + CARDS_DIC[card][1] <= 21) {
      activePlayer['score'] += CARDS_DIC[card][1];
    } else {
      activePlayer['score'] += CARDS_DIC[card][0];
    }
  } else {
    activePlayer['score'] += CARDS_DIC[card];
  }
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent =
      activePlayer['score'];
  }
}

function computeWinner() {
  let winner;

  if (YOU['score'] <= 21) {
    if (DEALER['score'] > 21 || YOU['score'] > DEALER['score']) {
      winner = YOU;
      blackjackGame['wins']++;
    } else if (DEALER['score'] > YOU['score']) {
      winner = DEALER;
      blackjackGame['losses']++;
    } else if (DEALER['score'] === YOU['score']) {
      blackjackGame['draws']++;
    }
  } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    winner = DEALER;
    blackjackGame['losses']++;
  } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    blackjackGame['draws']++;
  }

  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (winner === YOU) {
    message = 'You WON!';
    messageColor = '#e8e32b';
    WIN_SOUND.play();
  } else if (winner === DEALER) {
    message = 'You Lost!';
    messageColor = 'Red';
    LOST_SOUND.play();
  } else {
    message = "It's a draw!";
    messageColor = '#c2ca98';
  }

  document.querySelector('#black-jack-result').textContent = message;
  document.querySelector('#black-jack-result').style.color = messageColor;
  document.querySelector('#wins').textContent = blackjackGame['wins'];
  document.querySelector('#losses').textContent = blackjackGame['losses'];
  document.querySelector('#draws').textContent = blackjackGame['draws'];
}
