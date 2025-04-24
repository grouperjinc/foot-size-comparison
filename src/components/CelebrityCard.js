import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image }) => {
  return (
    <div className="celebrity-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Size: {typeof shoeSize === 'object' ? parseFloat(shoeSize?.toString?.() ?? '0') : shoeSize}</p>
    </div>
  );
};

export default CelebrityCard;
