// src/pages/Training.jsx
import React from 'react';
import { ActionButtons } from '../components/ActionButtons';
import { PokerTable } from '../components/PokerTable';
import { usePokerGame } from '../hooks/usePokerGame';

const Training = () => {
  const { players, communityCards, startGame } = usePokerGame();

  return (
    <div>
      <PokerTable players={players} communityCards={communityCards} />
      <ActionButtons 
        onFold={() => console.log('Fold')} 
        onCheck={() => console.log('Check')}
        onRaise={() => console.log('Raise')}
      />
      <button onClick={startGame}>Start New Game</button>
    </div>
  );
};

export default Training;
