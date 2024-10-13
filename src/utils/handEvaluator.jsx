import { Hand } from 'pokersolver';

// maps the icons for the UI into letters for poker-solver
const convertCardForSolver = (card) => {
    const suitMap = {
        '♠': 's',
        '♥': 'h',
        '♦': 'd',
        '♣': 'c'
    };
    return `${card.value}${suitMap[card.suit]}`;
};

export const compareHands = (playerHand, opponentHand) => {
    // converts the players cards from the UI into the format for poker-solver
    const playerCards = Hand.solve(playerHand.map(convertCardForSolver));
    const opponentCards = Hand.solve(opponentHand.map(convertCardForSolver));

    console.log('Player Cards:', playerCards);
    console.log('Opponent Cards:', opponentCards);

    // Compare hands using pokersolver
    const winner = Hand.winners([playerCards, opponentCards]);

    // Determine the winner
    if (winner[0] === playerCards) {
        return 'Josh Wins';
    } else if (winner[0] === opponentCards) {
        return 'Tekoa Wins';
    } else {
        return 'It\'s a Tie!';
    }
};