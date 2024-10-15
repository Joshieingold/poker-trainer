import React, { useEffect, useState } from 'react';
import { compareHands } from '../utils/handEvaluator.jsx'; // Updated path if necessary
import Actions from './Actions/actions.jsx'; // Import the Actions component
import CorrectPercentBar from './CorrectPercentBar/correctpercentbar.jsx';
import Hand from './Hand.jsx';
import './PokerTable.css';
// Data for making every card
const suits = ['♠', '♣', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
// These are the amounts for the Big blind and Small blind
const bbAmount = 10;
const sbAmount = 5;




// Creates deck by making one of evey card for every suit


const createDeck = () => {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
};
// Randomizes the deck
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const PokerTable = () => {
    // Global Variables
    const [deck, setDeck] = useState([]); // Gets the shuffled deck.
    const [playerHand, setPlayerHand] = useState([]); // Creates empty Player hand
    const [opponentHand, setOpponentHand] = useState([]); // Creates empty Opponent hand.
    const [communityCards, setCommunityCards] = useState([]); // Creates Empty Community card section.
    const [gameState, setGameState] = useState('start'); // Sets the game state to the starting position.
    const [winner, setWinner] = useState(null); // Winner for after showdown or fold to determine who gets the pot.
    const [currentBet, setCurrentBet] = useState(0); // Variable to find the amount of chips required to check from the pot.
    const [pot, setPot] = useState(0); // The pot.
    const [playerStack, setPlayerStack] = useState(100); // Starting chips for player
    const [opponentStack, setOpponentStack] = useState(100); // Starting chips for opponent
    const [isPlayerBigBlind, setIsPlayerBigBlind] = useState(true); // Alternate BB/SB
    const [areOpponentCardsVisible, setOpponentCardsVisible] = useState(false); // variable which allows me to set the opponents cards as unseen until the round is over.
    const [playerContribution, setPlayerContribution] = useState(0); // Used for finding the amount towards the pot contributed.
    const [opponentContribution, setOpponentContribution] = useState(0); // Used for finding the amount towards the pot contributed.
    const [hasRaised, setHasRaised] = useState(false); // Is used to move the game state forward after raise check.
    const [isStackZero, setCanCheckorRaise] = useState(false);
    const [isOpponentBB, setIsOpponentBB] = useState(false);
    const [isRightChoice, setRightChoice] = useState([])
    //Shuffle the deck on site load.
    useEffect(() => {
        setDeck(shuffleDeck(createDeck()));
    }, []);


    const range_charts = {
        SB: {
            raise: [
            "AKs", "AQs", "AJs", "ATs",
            "KQs", "KJs",
            "AQo", "KQo", "QQ", "QJs",
            "AJo", "KJo", "JJ",
            "ATo", "TT", "99", "88",
            "J4s", "J3s", "J2s", "T5s", "T4s", "95s", "94s", "85s", "84s", "74s",
            "J6o", "T6o", "96o", "86o", "63s", "Q5o", "53s", "Q4o", "43s", "K3o", "Q3o", "K2o", "Q2o"
        ],
        check: ["AA", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
            "AKo", "KK", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
            "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
            "QJo", "JTs", "J9s", "J8s", "J7s", "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s",
            "A9o",],
        }
    };
    const evaluateSBAction = (playerHand) => {
        if (range_charts.SB.raise.includes(convertHandFormat(playerHand))) {
            return 'Raise';
        } else if (range_charts.SB.check.includes(playerHand)) {
            return 'Check';  // Limp and Check are treated the same here.
        } else {
            return 'Fold';
        }
    };
    const cardRanking = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'T': 10, // Ten is higher than 9
        'J': 11, // Jack is higher than 10
        'Q': 12, // Queen is higher than Jack
        'K': 13, // King is higher than Queen
        'A': 14  // Ace is the highest
    };
    const convertHandFormat = (hand) => {
        // Extract rank and suit for both cards
        const card1 = hand[0].value + hand[0].suit; // e.g. "3h"
        const card2 = hand[1].value + hand[1].suit; // e.g. "4d"
    
        const rank1 = card1[0]; // First card rank
        const suit1 = card1[1]; // First card suit
        const rank2 = card2[0]; // Second card rank
        const suit2 = card2[1]; // Second card suit
    
        // Check if it's a pocket pair (both ranks are the same)
        if (rank1 === rank2) {
            return `${rank1}${rank2}`; // Return pocket pair without "o" or "s"
        }
    
        // Check if the hand is suited or offsuit
        const suited = suit1 === suit2 ? 's' : 'o';
    
        // Determine which card has a higher rank using the cardRanking
        const card1RankValue = cardRanking[rank1];
        const card2RankValue = cardRanking[rank2];
    
        // Compare the ranks correctly to return the higher ranked card first
        if (card1RankValue > card2RankValue) {
            return `${rank1}${rank2}${suited}`; // rank1 is higher, format as "AQ" or "T9"
        } else {
            return `${rank2}${rank1}${suited}`; // rank2 is higher, format as "QA" or "9T"
        }
    };
    
    const handlePlayerMove = (playerHand, isBigBlind) => {
        if (!isBigBlind) {
            // Evaluate the move based on the ranges if the player is SB
            const action = evaluateSBAction(playerHand);
            console.log(`Recommended action for ${convertHandFormat(playerHand)}: ${action}`);
        } else {
            console.log(`Player is Big Blind. No evaluation needed.`);
        }
    };
    


    // Gives each player cards from the deck while removing them from the deck so as not to have duplicates.
    const dealHands = () => {
        const newDeck = [...deck];
        setPlayerHand(newDeck.slice(0, 2));
        setOpponentHand(newDeck.slice(2, 4));
        setDeck(newDeck.slice(4));
        setOpponentCardsVisible(false);
        setGameState('pre-flop');
        placeBlinds();
        
    };

    // Sets blinds into the pot depending on player position. WILL NEED TO BE UPDATED TO ACCOMODATE MORE PLAYERS AS RN ITS JUST A T/F
    const placeBlinds = () => {
        if (isPlayerBigBlind) {
            setPlayerStack((prev) => prev - bbAmount); 
            setPlayerContribution(bbAmount);
            setOpponentStack((prev) => prev - sbAmount);
            setOpponentContribution(sbAmount);
            setPot(bbAmount + sbAmount);
            setCurrentBet(bbAmount);
        } else {
            setIsOpponentBB(true);
            setOpponentStack((prev) => prev - bbAmount);
            setOpponentContribution(bbAmount);
            setPlayerStack((prev) => prev - sbAmount);
            setPlayerContribution(sbAmount);
            setPot(bbAmount + sbAmount);
            setCurrentBet(bbAmount);
        }
        
    };

    const revealFlop = () => { 
        handlePlayerMove(playerHand, isPlayerBigBlind)
        const newDeck = [...deck]; // Uses the deck we were using still not allowing for duplicates.
        setCommunityCards(newDeck.slice(0, 3));
        setDeck(newDeck.slice(3));
        setGameState('flop'); // Changes the game state for updates.
        
        
    };

    const revealTurn = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]);
        setDeck(newDeck.slice(1));
        setGameState('turn');
        console.log(convertHandFormat(playerHand))
    };

    const revealRiver = () => {
        const newDeck = [...deck];
        setCommunityCards((prev) => [...prev, newDeck[0]]);
        setDeck(newDeck.slice(1));
        setGameState('river');
    };

    const handleShowdown = () => {
        const playerFullHand = [...playerHand, ...communityCards]; // Combines players hand with the community cards.
        const opponentFullHand = [...opponentHand, ...communityCards]; // combines the opponents hand with the community cards. 
        const result = compareHands(playerFullHand, opponentFullHand); // Uses Poker-Solver function combined with homebrew function in handEvaluator to decide who won
        console.log(playerFullHand, opponentFullHand); // Shows the best combo for each hand. I want to implement this in the future to be public information.
        

        if (result === 'Josh Wins') {
            setWinner('You win!'); // Changes the UI to show that player name has won!
            setPlayerStack((prev) => prev + pot); // Player gains the pot
        } else if (result === 'Tekoa Wins') {
            setWinner('Opponent wins!'); // Changes the UI to show that opponent name has won!
            setOpponentStack((prev) => prev + pot); // opponent gains the pot :(
        } else {
            setWinner("It's a tie!");
            const halfPot = pot / 2; // divide the pot in two and add it to both players stack.
            setOpponentStack((prev) => prev + halfPot);
            setPlayerStack((prev) => prev + halfPot);
        }
    
        setOpponentCardsVisible(true); // Shows the opponents cards to the player at showdown.
        setGameState('showdown'); 
    };

    const handleRestart = () => {
        // Resets all things except for chips and switches button position.
        const newDeck = shuffleDeck(createDeck()); // Creates a new deck
        setDeck(newDeck); // Uses new deck
        setPlayerHand([]);
        setOpponentHand([]);
        setCommunityCards([]);
        setGameState('start');
        setWinner(null);
        setCurrentBet(0);
        setPot(0);
        setPlayerContribution(0); 
        setOpponentContribution(0); 
        setIsPlayerBigBlind((prev) => !prev);
        setIsOpponentBB((prev) => !prev);
        setHasRaised(false);
    };
    
    const handleFold = () => {
        setGameState('folded');
        setOpponentStack((prev) => prev + pot); // For now only you can fold so the opponent gets the pot if you fold.
        setPot(0)
        handlePlayerMove(playerHand, isPlayerBigBlind)
    };

    const handleCheck = () => {
        let remainingToMatch; // Set variable to find what a check would be equal to.
    
        if (isPlayerBigBlind) {
            // Opponent needs to match player's bet
            remainingToMatch = currentBet - opponentContribution;
            if (remainingToMatch > 0) {
                if (opponentStack >= remainingToMatch) {
                    setOpponentStack((prev) => prev - remainingToMatch);
                    setOpponentContribution((prev) => prev + remainingToMatch);
                    setPot((prev) => prev + remainingToMatch);
                } else {
                    // Opponent goes all-in
                    setPot((prev) => prev + opponentStack);
                    setOpponentContribution((prev) => prev + opponentStack);
                    setOpponentStack(0); // Opponent is now out of chips
                }
            }
        } else {
            // Player needs to match opponent's bet
            remainingToMatch = currentBet - playerContribution;
            if (remainingToMatch > 0) {
                if (playerStack >= remainingToMatch) {
                    setPlayerStack((prev) => prev - remainingToMatch);
                    setPlayerContribution((prev) => prev + remainingToMatch);
                    setPot((prev) => prev + remainingToMatch);
                } else {
                    // Player goes all-in
                    setPot((prev) => prev + playerStack);
                    setPlayerContribution((prev) => prev + playerStack);
                    setPlayerStack(0); // Player is now out of chips
                }
            }
        }
    
        // Advance the game state after the bet is matched
        if (gameState === 'pre-flop') {
            revealFlop();
        } else if (gameState === 'flop') {
            revealTurn();
        } else if (gameState === 'turn') {
            revealRiver();
        } else if (gameState === 'river') {
            handleShowdown();
        }
    };
    

    const handleRaise = () => {
        const raiseAmount = currentBet + 10;
        setCurrentBet(raiseAmount);
        setHasRaised(true);
    
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
        if (gameState==="start") {
            if (playerStack <= 0) {
            setGameState('playerLost');
        }   else if (opponentStack <= 0) {
            setGameState('opponentLost');
        }
    }};
    
    return (
        <div className='gameArea'>
            <div className='PercentBar'>
                <CorrectPercentBar />
            </div>
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
                {gameState === 'folded' && (
                    <div className='roundOver'>
                        <h3>Opponent Gets the Pot</h3>
                        <button onClick={handleRestart} className='newHandBtn'>
                            New Hand
                        </button>
                    </div>
                )}




                <div className='communityCardsContainer'>
                    <Hand cards={communityCards} />
                </div>
                <div className='potContainer'>
                <p>POT: {pot}</p>
            </div>


            </div>
            <div className="playerContainers">
                <div className='player1Container'>
                        <p className='playerName'>Tekoa | {opponentStack / bbAmount}BB |</p>
                        <div className='cardContainer'>
                            {areOpponentCardsVisible ? (
                                <Hand cards={opponentHand} />
                            ) : (
                                <div className='cardBacks'>
                                    <div className='cardBack'></div>
                                    <div className='cardBack'></div>
                                </div>
                            )}
                        </div>
                        <div className='positionContainer'>
                            {isOpponentBB ? (
                                    <p className="position">Big Blind</p>)
                                : (
                                    <p className="position">Small Blind</p>
                                )}
                        </div>

                </div>
                <div className='player2Container'>
                        <p className='playerName'>Your Hand | {playerStack / bbAmount}BB |</p>
                        <div className='cardContainer'><Hand cards={playerHand} /></div>
                        <div className='positionContainer'>
                            {isPlayerBigBlind ? (
                                <p className="position">Big Blind</p>)
                            : (
                                <p className="position">Small Blind</p>
                            )}
                        </div>

                </div>
            </div>

            <div className='gameControls'>
                {['pre-flop', 'flop', 'turn', 'river', 'folded'].includes(gameState) && (
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
