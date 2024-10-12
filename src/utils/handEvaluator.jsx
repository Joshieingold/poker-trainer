// Update in handEvaluator.js
export const evaluateHand = (hand) => {
    const valueRanks = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
  
    // Sort the hand by value (highest first)
    const sortedHand = hand.sort((a, b) => valueRanks[b.value] - valueRanks[a.value]);
    return sortedHand[0]; // Return the highest card for now
  };
  export const evaluateBestHand = (hand, communityCards) => {
    if (isRoyalFlush(hand, communityCards)) return 1;
    if (isStraightFlush(hand, communityCards)) return 2;
    if (isFourOfAKind(hand, communityCards)) return 3;
    if (isFullHouse(hand, communityCards)) return 4;
    if (isFlush(hand, communityCards)) return 5;
    if (isStraight(hand, communityCards)) return 6;
    if (isThreeOfAKind(hand, communityCards)) return 7;
    if (isTwoPair(hand, communityCards)) return 8;
    if (isOnePair(hand, communityCards)) return 9;
    
    return 10;  // High card as fallback
};
export const compareHands = (playerHand, opponentHand, communityCards) => {
    const playerBestRank = evaluateBestHand(playerHand, communityCards);
    const opponentBestRank = evaluateBestHand(opponentHand, communityCards);

    if (playerBestRank < opponentBestRank) {
        return 'Player Wins';
    } else if (playerBestRank > opponentBestRank) {
        return 'Opponent Wins';
    } else {
        return 'It\'s a Tie!';
    }
};
  export const isRoyalFlush = (hand, communityCards) => {
    // Combine player's hand and community cards
    const allCards = [...hand, ...communityCards];
  
    // Group cards by suit
    const suits = {
      '♠': [], '♣': [], '♦': [], '♥': []
    };
  
    allCards.forEach(card => {
      suits[card.suit].push(card.value);
    });
  
    // Cards required for a Royal Flush
    const royalFlushValues = ['A', 'K', 'Q', 'J', '10'];
  
    // Check each suit for a Royal Flush
    for (const suit in suits) {
      const valuesInSuit = suits[suit];
  
      // Check if this suit contains all the royal flush values
      if (royalFlushValues.every(value => valuesInSuit.includes(value))) {
        return 1;  // Royal Flush found! This is the strongest hand!
      }
    }
  
    return false;  // No Royal Flush
  };
  // Useful because Im going to be checking this a few more times ;-;
  const hasConsecutiveValues = (sortedValues) => {
    for (let i = 0; i < sortedValues.length - 4; i++) {
      if (
        sortedValues[i + 1] === sortedValues[i] + 1 &&
        sortedValues[i + 2] === sortedValues[i] + 2 &&
        sortedValues[i + 3] === sortedValues[i] + 3 &&
        sortedValues[i + 4] === sortedValues[i] + 4
      ) {
        return true;
      }
    }
    return false;
  };
  export const isStraightFlush = (hand, communityCards) => {
    // Combine player's hand and community cards
    const allCards = [...hand, ...communityCards];
  
    // Group cards by suit
    const suits = {
      '♠': [], '♣': [], '♦': [], '♥': []
    };
  
    // Populate suits array with card ranks
    allCards.forEach(card => {
      suits[card.suit].push(valueRanks[card.value]);
    });
  
    // Check each suit for a Straight Flush
    for (const suit in suits) {
      const valuesInSuit = suits[suit];
  
      if (valuesInSuit.length >= 5) {
        // Sort card values in ascending order
        const sortedValues = valuesInSuit.sort((a, b) => a - b);
  
        // Check if there are five consecutive values
        if (hasConsecutiveValues(sortedValues)) {
          return 2;  // Straight Flush found. 2 is the second strongest hand!
        }
      }
    }
  
    return false;  // No Straight Flush
  };
  export const isFourOfAKind = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const valueCount = {};

    allCards.forEach(card => {
        valueCount[card.value] = (valueCount[card.value] || 0) + 1;
    });

    if (Object.values(valueCount).some(count => count === 4)) {
        return 3;  // Four of a Kind rank 3
    }

    return false;
};
export const isFullHouse = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const valueCount = {};

    allCards.forEach(card => {
        valueCount[card.value] = (valueCount[card.value] || 0) + 1;
    });

    const counts = Object.values(valueCount);
    const hasThreeOfAKind = counts.includes(3);
    const hasPair = counts.includes(2);

    if (hasThreeOfAKind && hasPair) {
        return 4;  // Full House rank 4
    }

    return false;
};

export const isFlush = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const suits = { '♠': [], '♣': [], '♦': [], '♥': [] };

    allCards.forEach(card => {
        suits[card.suit].push(card.value);
    });

    for (const suit in suits) {
        if (suits[suit].length >= 5) {
            return 5;  // Flush rank 5
        }
    }

    return false;
};

export const isStraight = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const cardRanks = [...new Set(allCards.map(card => valueRanks[card.value]))].sort((a, b) => a - b);

    for (let i = 0; i <= cardRanks.length - 5; i++) {
        if (
            cardRanks[i + 1] === cardRanks[i] + 1 &&
            cardRanks[i + 2] === cardRanks[i] + 2 &&
            cardRanks[i + 3] === cardRanks[i] + 3 &&
            cardRanks[i + 4] === cardRanks[i] + 4
        ) {
            return 6;  // Straight rank 6
        }
    }

    return false;
};

export const isThreeOfAKind = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const valueCount = {};

    allCards.forEach(card => {
        valueCount[card.value] = (valueCount[card.value] || 0) + 1;
    });

    if (Object.values(valueCount).some(count => count === 3)) {
        return 7;  // Three of a Kind rank 7
    }

    return false;
};

export const isTwoPair = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const valueCount = {};

    allCards.forEach(card => {
        valueCount[card.value] = (valueCount[card.value] || 0) + 1;
    });

    const pairs = Object.values(valueCount).filter(count => count === 2);
    if (pairs.length === 2) {
        return 8;  // Two Pair rank 8
    }

    return false;
};

export const isOnePair = (hand, communityCards) => {
    const allCards = [...hand, ...communityCards];
    const valueCount = {};

    allCards.forEach(card => {
        valueCount[card.value] = (valueCount[card.value] || 0) + 1;
    });

    if (Object.values(valueCount).some(count => count === 2)) {
        return 9;  // One Pair rank 9
    }

    return false;
};

export const isHighCard = (hand, communityCards) => {
    return 10;  // High Card rank 10 (Worst)
};