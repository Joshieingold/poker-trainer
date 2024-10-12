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
    const [gameState, setGameState] = useState('start'); // Game states
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        setDeck(shuffleDeck(createDeck())); // Shuffle deck on mount
    }, []);

    const dealHands = () => {
        const newDeck = [...deck];
        setPlayerHand(newDeck.slice(0, 2)); // Player gets first 2 cards
        setOpponentHand(newDeck.slice(2, 4)); // Opponent gets next 2 cards
        setDeck(newDeck.slice(4)); // Update the deck
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
        setWinner(result); // Set the winner based on comparison
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
    };

    return (
        <div className='gameArea'>
            <div className='table'>
                {gameState === 'start' && (
                    <button onClick={dealHands} className='button'>
                        Deal Cards
                    </button>
                )}
                {gameState === 'pre-flop' && (
                    <div>
                        <h2>Pre-Flop</h2>
                        <button onClick={revealFlop} className='button'>
                            Reveal Flop
                        </button>
                    </div>
                )}
                {gameState === 'flop' && (
                    <div>
                        <h2>Flop</h2>
                        <button onClick={revealTurn} className='button'>
                            Reveal Turn
                        </button>
                    </div>
                )}
                {gameState === 'turn' && (
                    <div>
                        <h2>Turn</h2>
                        <button onClick={revealRiver} className='button'>
                            Reveal River
                        </button>
                    </div>
                )}
                {gameState === 'river' && (
                    <div>
                        <h2>River</h2>
                        <button onClick={handleShowdown} className='button'>
                            Showdown
                        </button>
                    </div>
                )}
                {gameState === 'showdown' && (
                    <div>
                        <h2>Showdown</h2>
                        <h3>{winner}</h3>
                        <button onClick={handleRestart} className='button'>
                            Restart
                        </button>
                    </div>
                )}
                <div className='handsContainer'>
                    <Hand cards={opponentHand} title="Opponent's Hand" />
                    <Hand cards={playerHand} title="Your Hand" />
                </div>
                <div className='communityCardsContainer'>
                    <h2>Community Cards</h2>
                    <Hand cards={communityCards} />
                </div>
            </div>
        </div>
    );
};

export default PokerTable;
