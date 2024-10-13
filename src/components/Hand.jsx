import React from 'react';
import Card from './Card';

const Hand = ({ cards, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <div style={styles.hand}>
        {cards.map((card, index) => (
          <Card key={index} value={card.value} suit={card.suit} />
        ))}
      </div>
    </div>
  );
};
// This is to control how card containers are managed
const styles = {
  hand: {
    display: 'flex',
    gap: '3px',
    color: "black",
  },

};

export default Hand;
