import React, { useEffect, useState } from 'react';
import { compareHands } from '../utils/handEvaluator.jsx'; // Updated path if necessary
import Actions from './Actions/actions.jsx'; // Import the Actions component
import Hand from './Hand.jsx';
import './PokerTable.css';

const suits = ['♠', '♣', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const BIG_BLIND_AMOUNT = 10;
const SMALL_BLIND_AMOUNT = 5;

const createDeck = () => {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
};

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
    const [currentBet, setCurrentBet] = useState(0);
    const [pot, setPot] = useState(0);
    const [playerStack, setPlayerStack] = useState(100); // Starting stacks
    const [opponentStack, setOpponentStack] = useState(100);
    const [isPlayerBigBlind, setIsPlayerBigBlind] = useState(true); // Alternate BB/SB
    const [areOpponentCardsVisible, setOpponentCardsVisible] = useState(false);
    const [playerContribution, setPlayerContribution] = useState(0);
    const [opponentContribution, setOpponentContribution] = useState(0);

    useEffect(() => {
        setDeck(shuffleDeck(createDeck()));
    }, []);

    const dealHands = () => {
        const newDeck = [...deck];
        setPlayerHand(newDeck.slice(0, 2));
        setOpponentHand(newDeck.slice(2, 4));
        setDeck(newDeck.slice(4));
        setOpponentCardsVisible(false);
        setGameState('pre-flop');
        placeBlinds();
    };

    const placeBlinds = () => {
        if (isPlayerBigBlind) {
            setPlayerStack((prev) => prev - BIG_BLIND_AMOUNT);
            setPlayerContribution(BIG_BLIND_AMOUNT);
            setOpponentStack((prev) => prev - SMALL_BLIND_AMOUNT);
            setOpponentContribution(SMALL_BLIND_AMOUNT);
            setPot(BIG_BLIND_AMOUNT + SMALL_BLIND_AMOUNT);
            setCurrentBet(BIG_BLIND_AMOUNT);
        } else {
            setOpponentStack((prev) => prev - BIG_BLIND_AMOUNT);
            setOpponentContribution(BIG_BLIND_AMOUNT);
            setPlayerStack((prev) => prev - SMALL_BLIND_AMOUNT);
            setPlayerContribution(SMALL_BLIND_AMOUNT);
            setPot(BIG_BLIND_AMOUNT + SMALL_BLIND_AMOUNT);
            setCurrentBet(BIG_BLIND_AMOUNT);
        }
    };

    const revealFlop = () => {
        const newDeck = [...deck];
        setCommunityCards(newDeck.slice(0, 3));
        setDeck(newDeck.slice(3));
        setGameState('flop');
    };

    const revealTurn = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]);
        setDeck(newDeck.slice(1));
        setGameState('turn');
    };

    const revealRiver = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]);
        setDeck(newDeck.slice(1));
        setGameState('river');
    };

    const handleShowdown = () => {
        const playerFullHand = [...playerHand, ...communityCards];
        const opponentFullHand = [...opponentHand, ...communityCards];
        const result = compareHands(playerFullHand, opponentFullHand);
        console.log(playerFullHand, opponentFullHand);
        setWinner(result);
        setOpponentCardsVisible(true);
        setGameState('showdown');
    };

    const handleRestart = () => {
        const newDeck = shuffleDeck(createDeck());
        setDeck(newDeck);
        setPlayerHand([]);
        setOpponentHand([]);
        setCommunityCards([]);
        setGameState('start');
        setWinner(null);
        setCurrentBet(0);
        setPot(0);
        setPlayerContribution(0);
        setOpponentContribution(0);
        setIsPlayerBigBlind((prev) => !prev); // Alternate blinds
    };

    const handleFold = () => {
        setGameState('folded');
    };

    const handleCheck = () => {
        let remainingToMatch;

        if (isPlayerBigBlind) {
            // Opponent needs to match player's bet
            remainingToMatch = currentBet - opponentContribution;
            if (remainingToMatch > 0) {
                setOpponentStack((prev) => prev - remainingToMatch);
                setOpponentContribution((prev) => prev + remainingToMatch);
                setPot((prev) => prev + remainingToMatch);
            }
        } else {
            // Player needs to match opponent's bet
            remainingToMatch = currentBet - playerContribution;
            if (remainingToMatch > 0) {
                setPlayerStack((prev) => prev - remainingToMatch);
                setPlayerContribution((prev) => prev + remainingToMatch);
                setPot((prev) => prev + remainingToMatch);
            }
        }

        // Advance to next round
        if (gameState === 'pre-flop') {
            revealFlop();
        } else if (gameState === 'flop') {
            revealTurn();
        } else if (gameState === 'turn') {
            revealRiver();
        } else if (gameState === 'river') {
            handleShowdown();
        }

        // Check if any player is out of chips
        if (playerStack <= 0) {
            setGameState('playerLost');
        } else if (opponentStack <= 0) {
            setGameState('opponentLost');
        }
    };

    const handleRaise = () => {
        const raiseAmount = currentBet + 10;
        setCurrentBet(raiseAmount);

        if (isPlayerBigBlind) {
            // Player raises
            setPlayerStack((prev) => prev - raiseAmount);
            setPlayerContribution((prev) => prev + raiseAmount);
            setPot((prev) => prev + raiseAmount);
        } else {
            // Opponent raises
            setOpponentStack((prev) => prev - raiseAmount);
            setOpponentContribution((prev) => prev + raiseAmount);
            setPot((prev) => prev + raiseAmount);
        }

        // Check if any player is out of chips
        if (playerStack <= 0) {
            setGameState('playerLost');
        } else if (opponentStack <= 0) {
            setGameState('opponentLost');
        }
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
                {gameState === 'playerLost' && (
                    <div className='gameOver'>
                        <h3>You Lost!</h3>
                        <button onClick={handleRestart} className='newHandBtn'>
                            New Hand
                        </button>
                    </div>
                )}
                {gameState === 'opponentLost' && (
                    <div className='gameOver'>
                        <h3>You Won!</h3>
                        <button onClick={handleRestart} className='newHandBtn'>
                            New Hand
                        </button>
                    </div>
                )}
                <div className='player1Container'>
                    <p className='playerName'>Opponent</p>
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

                <Actions
                    onCheck={handleCheck}
                    onRaise={handleRaise}
                    onFold={handleFold}
                    playerStack={playerStack}
                    opponentStack={opponentStack}
                    currentBet={currentBet}
                />
            </div>

            <div className='potContainer'>
                <p>POT: {pot}</p>
            </div>
            <div className='gameControls'>
                {['pre-flop', 'flop', 'turn', 'river'].includes(gameState) && (
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
