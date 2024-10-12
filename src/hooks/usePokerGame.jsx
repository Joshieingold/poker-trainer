// src/hooks/usePokerGame.js
import { useState } from 'react';

export const usePokerGame = () => {
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);

  const startGame = () => {
    // Initialize player hands, community cards, etc.
  };

  return { players, communityCards, startGame };
};
