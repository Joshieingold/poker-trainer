import React, { useEffect, useState } from 'react';
import { compareHands } from '../utils/handEvaluator.jsx'; // Updated path if necessary
import Actions from './Actions/actions.jsx'; // Import the Actions component
import Hand from './Hand.jsx';
import './PokerTable.css';

const suits = ['♠', '♣', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Generates all possible cards.
const createDeck = () => {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
};

// Shuffles the deck for a random set each time.
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const PokerTable = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [opponentHand, setOpponentHand] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [gameState, setGameState] = useState('start'); // Game states
    const [winner, setWinner] = useState(null);
    const [currentBet, setCurrentBet] = useState(0); // Will track bet later!
    const [areOpponentCardsVisible, setOpponentCardsVisible] = useState(false); // source code Toggle for showing opponents cards, will be on board soon.

    useEffect(() => {
        setDeck(shuffleDeck(createDeck())); // Shuffle deck
    }, []);

    const dealHands = () => {
        const newDeck = [...deck];
        setPlayerHand(newDeck.slice(0, 2)); // Player gets first 2 cards
        setOpponentHand(newDeck.slice(2, 4)); // Opponent gets next 2 cards
        setDeck(newDeck.slice(4)); // Update the deck
        setOpponentCardsVisible(false);
        setGameState('pre-flop');
    };

    const revealFlop = () => {
        const newDeck = [...deck];
        setCommunityCards(newDeck.slice(0, 3)); // Reveal first 3 community cards
        setDeck(newDeck.slice(3)); // Update the deck
        setGameState('flop');
    };

    const revealTurn = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]); // Add turn card
        setDeck(newDeck.slice(1)); // Update the deck
        setGameState('turn');
    };

    const revealRiver = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]); // Add river card
        setDeck(newDeck.slice(1)); // Update the deck
        setGameState('river');
    };

    const handleShowdown = () => {
        const playerFullHand = [...playerHand, ...communityCards];
        const opponentFullHand = [...opponentHand, ...communityCards];
        const result = compareHands(playerFullHand, opponentFullHand); // Evaluate the best hands
        console.log(playerFullHand, opponentFullHand);
        setWinner(result); // Set the winner based on comparison
        setOpponentCardsVisible(true);
        setGameState('showdown');
    };

    const handleRestart = () => {
        const newDeck = shuffleDeck(createDeck());
        setDeck(newDeck);
        setPlayerHand([]);
        setOpponentHand([]);
        setCommunityCards([]);
        setGameState('start'); // Reset the game state
        setWinner(null);
        setCurrentBet(0); // Reset bet
    };

    // Actions
    const handleFold = () => {
        console.log("Player folded");
        setGameState('folded');
    };

    const handleCheck = () => {
        console.log("Player checked");
        if (gameState === 'pre-flop') {
            revealFlop(); 
        } else if (gameState === 'flop') {
            revealTurn();
        } else if (gameState === 'turn') {
            revealRiver();
        } else if (gameState === 'river') {
            handleShowdown(); // Showdown after river
        }
    };

    const handleRaise = () => {  
        setCurrentBet(currentBet + 10); // Just adds 10 for now but will be better soon.
    };

    return (
        <div className='gameArea'>
            <div className='table'>
                {gameState !== 'start' && <h2 className='gameState'>{gameState.toUpperCase()}</h2>}
                {gameState === 'start' && (
                    <button onClick={dealHands} className='dealCardsBtn'>
                        Deal Cards
                    </button>
                )}
                {gameState === 'showdown' && (
                    <div className='showdownResultContainer'>
                        <h3 className="winnerText">{winner}</h3>
                        <button onClick={handleRestart} className='button'>
                            New Hand
                        </button>
                    </div>
                )}
                {gameState === 'folded' && (
                    <div className='folded'>
                        <button onClick={handleRestart} className='newHandBtn'>
                            New Hand
                        </button>
                    </div>
                )}
                <div className='player1Container'>
                    <p className='playerName'>Tekoa</p>
                    {areOpponentCardsVisible ? (
                        <Hand cards={opponentHand} />
                    ) : (
                        <div className='cardBacks'>
                            <div className='cardBack'></div>
                            <div className='cardBack'></div>
                        </div>
                    )}
                </div>

                <div className='player2Container'>
                    <p className='playerName'>Your Hand</p>
                    <Hand cards={playerHand} />
                </div>


                <div className='communityCardsContainer'>
                    <Hand cards={communityCards} />
                </div>
            </div>

            <div className='gameControls'>
                {gameState === 'pre-flop' && (
                    <Actions
                        onRestart={handleRestart}
                        onFold={handleFold}
                        onCheck={handleCheck}
                        onRaise={handleRaise}
                    />
                )}
                {gameState === 'flop' && (
                    <Actions
                        onRestart={handleRestart}
                        onFold={handleFold}
                        onCheck={handleCheck}
                        onRaise={handleRaise}
                    />
                )}
                {gameState === 'turn' && (
                    <Actions
                        onRestart={handleRestart}
                        onFold={handleFold}
                        onCheck={handleCheck}
                        onRaise={handleRaise}
                    />
                )}
                {gameState === 'river' && (
                    <Actions
                        onRestart={handleRestart}
                        onFold={handleFold}
                        onCheck={handleCheck}
                        onRaise={handleRaise}
                    />
                )}
            </div>
        </div>
    );
};

export default PokerTable;
