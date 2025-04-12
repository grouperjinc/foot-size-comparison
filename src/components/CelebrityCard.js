import React from 'react';
import './CelebrityCard.css';

const CelebrityCard = ({ name, shoeSize, image, category }) => {
  const placeholderImage = 'https://res.cloudinary.com/dlratz7ov/image/upload/v1744428483/placeholder_px9a1k.png'; // Placeholder image URL

  return (
    <div className="celebrity-card">
      <img 
        src={image || placeholderImage}  // Use celebrity image or the placeholder
        alt={name}
        className="celebrity-image"
        onError={(e) => e.target.src = placeholderImage} // Fallback to placeholder if the image fails to load
      />
      <div className="celebrity-name">{name}</div>
      <div className="celebrity-shoe-size">Shoe Size: {shoeSize}</div>
      <div className="celebrity-category">Category: {category}</div>
    </div>
  );
};

export default CelebrityCard;
