import React, { useState } from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image, category, funFact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`celebrity-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="card-inner">
        <div className="card-front">
          <img src={image} alt={name} />
          <h3>{name}</h3>
          <p>Size: {typeof shoeSize === 'object' ? parseFloat(shoeSize?.toString?.() ?? '0') : shoeSize}</p>
          <p>{category}</p>
          <p className="tap-to-flip">Tap to flip</p> {/* Mobile hint */}
        </div>
        <div className="card-back">
          <h3>Fun Fact</h3>
          <p>{funFact || "No fun fact available."}</p>
        </div>
      </div>
    </div>
  );
};

export default CelebrityCard;
