import React, { useState, useEffect } from "react";
import CelebrityCard from './CelebrityCard';  // Import the CelebrityCard component

function CelebrityGallery() {
  const [celebrities, setCelebrities] = useState([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState([]);
  const [shoeSizeFilter, setShoeSizeFilter] = useState("");
  const [celebrityNameFilter, setCelebrityNameFilter] = useState("");

  useEffect(() => {
    // Fetch the celebrity data from the API or database
    fetch("/api/celebrities")  // Adjust to your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setCelebrities(data);  // Store all the celebrity data
        setFilteredCelebrities(data);  // Show all celebrities by default
      })
      .catch((err) => console.error("Error fetching celebrity data", err));
  }, []);

  // Function to filter celebrities based on shoe size and name
  const filterCelebrities = () => {
    let filtered = celebrities;

    if (shoeSizeFilter) {
      filtered = filtered.filter(
        (celebrity) => celebrity.shoeSize === parseFloat(shoeSizeFilter)
      );
    }

    if (celebrityNameFilter) {
      filtered = filtered.filter(
        (celebrity) => celebrity.name.toLowerCase().includes(celebrityNameFilter.toLowerCase())
      );
    }

    setFilteredCelebrities(filtered); // Update the filtered list
  };

  // Handle changes to the shoe size input
  const handleShoeSizeChange = (event) => {
    const value = event.target.value;
    setShoeSizeFilter(value);
  };

  // Handle changes to the celebrity name input
  const handleCelebrityNameChange = (event) => {
    const value = event.target.value;
    setCelebrityNameFilter(value);
  };

  // Function to handle the "Find your match" button click
  const handleFindMatchClick = () => {
    filterCelebrities();
  };

  return (
    <div>
      <h2>Celebrity Shoe Size Gallery</h2>

      {/* Input for shoe size */}
      <div>
        <input
          type="number"
          name="shoeSize"
          placeholder="Enter your shoe size"
          value={shoeSizeFilter}
          onChange={handleShoeSizeChange}
        />
      </div>

      {/* Input for celebrity name */}
      <div>
        <input
          type="text"
          name="celebrityName"
          placeholder="Enter the celebrity name"
          value={celebrityNameFilter}
          onChange={handleCelebrityNameChange}
        />
      </div>

      {/* Button to find matches */}
      <div>
        <button onClick={handleFindMatchClick}>Find your match</button>
      </div>

      {/* Displaying the filtered celebrities */}
      <div className="celebrity-results">
        {filteredCelebrities.map((celebrity) => (
          <CelebrityCard key={celebrity._id} celebrity={celebrity} />
        ))}
      </div>
    </div>
  );
}

export default CelebrityGallery;
