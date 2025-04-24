import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image }) => {
  return (
    <div className="celebrity-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Size: {shoeSize}</p>
    </div>
  );
};

export default CelebrityCard;
