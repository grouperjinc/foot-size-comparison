import React from 'react';
import './CelebrityCard.css'; // If you're using a separate CSS file

const CelebrityCard = ({ celebrity }) => {
  return (
    <div className="celebrity-card">
      <h3 className="celebrity-name">{celebrity.name}</h3>
      <p className="celebrity-shoe-size">Shoe Size: {celebrity.shoeSize}</p>
      {celebrity.imageUrl && (
        <img className="celebrity-image" src={celebrity.imageUrl} alt={celebrity.name} />
      )}
    </div>
  );
};

export default CelebrityCard;
