// src/components/CelebrityCard.js
import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image, category }) => {
  return (
    <div className="celebrity-card">
      <img src={image} alt={name} className="celebrity-image" />
      <div className="celebrity-name">{name}</div>
      <div className="celebrity-shoe-size">Shoe Size: {shoeSize}</div>
      <div className="celebrity-category">Category: {category}</div>
    </div>
  );
};

export default CelebrityCard;
