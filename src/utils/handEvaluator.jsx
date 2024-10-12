// handEvaluator.jsx
import { Hand as PokerHand } from 'pokersolver';

export const compareHands = (playerHand, opponentHand) => {
    const playerCards = PokerHand.solve(playerHand.map(card => `${card.value}${card.suit}`));
    const opponentCards = PokerHand.solve(opponentHand.map(card => `${card.value}${card.suit}`));
    
    if (playerCards > opponentCards) {
        return 'Player Wins';
    } else if (playerCards < opponentCards) {
        return 'Opponent Wins';
    } else {
        return 'It\'s a Tie!';
    }
};
