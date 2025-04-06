// src/components/CelebrityCard.js
import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image }) => {
  return (
    <div className="celebrity-card">
      <img src={image} alt={name} className="celebrity-image" />
      <div className="celebrity-name">{name}</div>
      <div className="celebrity-shoe-size">Shoe Size: {shoeSize}</div>
    </div>
  );
};

export default CelebrityCard;
