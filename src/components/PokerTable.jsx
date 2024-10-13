// PokerTable.jsx
import React, { useEffect, useState } from 'react';
import { compareHands } from '../utils/handEvaluator.jsx'; // Updated path if necessary
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
    const [gameState, setGameState] = useState('start'); 
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        setDeck(shuffleDeck(createDeck())); // Shuffle deck on mount
    }, []);

    const dealHands = () => {
        const newDeck = [...deck];
        setPlayerHand(newDeck.slice(0, 2)); // you get first 2 cards
        setOpponentHand(newDeck.slice(2, 4)); // Opponent gets next 2 cards
        setDeck(newDeck.slice(4)); // deletes the cards from the deck that were given
        setGameState('pre-flop'); // Changes the game state to reflect the time of the game
    };

    const revealFlop = () => {
        const newDeck = [...deck]; // Uses the old deck with the cards taken off for no risk of duplicates! I think.
        setCommunityCards(newDeck.slice(0, 3)); // Reveals the first 3 community cards
        setDeck(newDeck.slice(3)); // deletes the cards from the deck that were given
        setGameState('flop'); // Changes the game state to reflect the time of the game
    };

    const revealTurn = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]); // Add turn card
        setDeck(newDeck.slice(1)); // deletes the cards from the deck that were given
        setGameState('turn'); // Changes the game state to reflect the time of the game
    };

    const revealRiver = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]); // Add river card
        setDeck(newDeck.slice(1)); // deletes the cards from the deck that were given
        setGameState('river'); // Changes the game state to reflect the time of the game
    };

    const handleShowdown = () => {
        const playerFullHand = [...playerHand, ...communityCards];
        const opponentFullHand = [...opponentHand, ...communityCards];
        const result = compareHands(playerFullHand, opponentFullHand); // Evaluate the best hands
        console.log(playerFullHand, opponentFullHand)
        setWinner(result); // Set the winner based on comparison
        setGameState('showdown');
    };
    // Creates new deck, empties hands, empties community cards and resets the gamestate!
    const handleRestart = () => {
        const newDeck = shuffleDeck(createDeck());
        setDeck(newDeck);
        setPlayerHand([]);
        setOpponentHand([]);
        setCommunityCards([]);
        setGameState('start');
        setWinner(null);
    };
    return (
        <div className='gameArea'>
            <div className='table'>
                <div className='gameControls'>

    
                    {gameState === 'start' && (
                        <button onClick={dealHands} className='button'>
                            Deal Cards
                        </button>
                    )}
                    {gameState === 'pre-flop' && (
                        <button onClick={revealFlop} className='button'>
                            Reveal Flop
                        </button>
                    )}
                    {gameState === 'flop' && (
                        <button onClick={revealTurn} className='button'>
                            Reveal Turn
                        </button>
                    )}
                    {gameState === 'turn' && (
                        <button onClick={revealRiver} className='button'>
                            Reveal River
                        </button>
                    )}
                    {gameState === 'river' && (
                        <button onClick={handleShowdown} className='button'>
                            Showdown
                        </button>
                    )}
                    {gameState === 'showdown' && (
                        <div>
                            
                            <button onClick={handleRestart} className='button'>
                                Restart
                            </button>
                            <h3>{winner}</h3>
                        </div>
                    )}
                </div>
    
                <div className='communityCardsContainer'>
                    <Hand cards={communityCards} />
                </div>
            </div>
            <div className='player1Container'>
                    <p className='playerName'>Tekoa's Hand</p>
                    <Hand cards={opponentHand} />
                </div>
    
                <div className='player2Container'>
                    <p className='playerName'>Your Hand</p>
                    <Hand cards={playerHand} />
                </div>
        </div>
    );
    
    }

export default PokerTable;
