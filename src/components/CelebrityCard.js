import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, category }) => {
  return (
    <div className="celebrity-card">
      <div className="celebrity-name">{name}</div>
      <div className="celebrity-shoe-size">Shoe Size: {shoeSize}</div>
      <div className="celebrity-category">Category: {category}</div>
    </div>
  );
};

export default CelebrityCard;
