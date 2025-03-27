import React, { useState } from "react";

const ShoeSizeComparison = () => {
  const [shoeSize, setShoeSize] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCelebrities, setFilteredCelebrities] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [comparisonResult, setComparisonResult] = useState("");
  const [celebrityFootImage, setCelebrityFootImage] = useState("");

  // Sample list of celebrities
  const celebrities = [
    { name: "Shaquille O'Neal", shoeSize: 22, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/TechCrunch_Disrupt_2023_-_Day_1_%28cropped%29.jpg" },
    { name: "LeBron James", shoeSize: 15, imageUrl: "https://example.com/lebron-foot.jpg" },
    // Add more celebrities here...
  ];

  // Handle search term change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter celebrities based on the search term (case-insensitive)
    const filtered = celebrities.filter((celebrity) =>
      celebrity.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCelebrities(filtered);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCelebrity) return;

    const celebritySize = selectedCelebrity.shoeSize;
    const resultText = `Your shoe size: ${shoeSize} US | ${selectedCelebrity.name}'s shoe size: ${celebritySize} US`;
    setComparisonResult(resultText);
    setCelebrityFootImage(selectedCelebrity.imageUrl);
  };

  // Handle selecting a celebrity from the list
  const handleCelebritySelect = (celebrity) => {
    setSelectedCelebrity(celebrity);
    setSearchTerm(celebrity.name); // Set the search input to the selected celebrity's name
    setFilteredCelebrities([]); // Clear the list after selection
  };

  return (
    <div>
      <h1>Shoe Size Comparison</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="shoe-size">Enter Your Shoe Size (US):</label>
        <input
          type="number"
          id="shoe-size"
          value={shoeSize}
          onChange={(e) => setShoeSize(e.target.value)}
          required
        />
        <br />

        <label htmlFor="celebrity-search">Search Celebrity:</label>
        <input
          type="text"
          id="celebrity-search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a celebrity..."
        />
        {filteredCelebrities.length > 0 && (
          <ul>
            {filteredCelebrities.map((celebrity) => (
              <li
                key={celebrity.name}
                onClick={() => handleCelebritySelect(celebrity)}
                style={{ cursor: "pointer", padding: "5px", border: "1px solid #ccc", marginTop: "5px" }}
              >
                {celebrity.name}
              </li>
            ))}
          </ul>
        )}
        <br />

        <button type="submit">Compare Shoe Sizes</button>
      </form>

      <div id="comparison-result">
        <h2>Comparison Result:</h2>
        <p>{comparisonResult}</p>
        {celebrityFootImage && (
          <img
            src={celebrityFootImage}
            alt="Celebrity Foot"
            style={{ display: "block", maxWidth: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default ShoeSizeComparison;
