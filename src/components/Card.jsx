import React from 'react';
import "./Card.css";
const Card = ({ value, suit }) => {
  const cardColor = suit === '♥' || suit === '♦' ? 'red' : 'black';
    return (
    <div style={{ ...styles.card, color: cardColor }} className='card'>
      {value} {suit}
    </div>
  );
};

const styles = {
    card: {
        // Empty I just have this here so my if statement can target the styles for the card color.
    },
  };

export default Card;
