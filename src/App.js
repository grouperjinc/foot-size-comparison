import React, { useState, useEffect } from 'react';
import CelebrityCard from './components/CelebrityCard';

function App() {
  const [shoeSize, setShoeSize] = useState('');
  const [matchingCelebrities, setMatchingCelebrities] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [nameMatches, setNameMatches] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch celebrities by shoe size
  const findCelebritiesBySize = async () => {
    if (!shoeSize) {
      setErrorMessage('Please enter a shoe size.');
      return;
    }

    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/celebrities?shoeSize=${shoeSize}`);
      const data = await response.json();

      if (data.length === 0) {
        setErrorMessage('No celebrities found with this shoe size.');
        setMatchingCelebrities([]);
      } else {
        setMatchingCelebrities(data);
      }

      setSelectedCelebrity(null); // Reset selected celebrity when filtering by shoe size
    } catch (error) {
      console.error('Error fetching matching celebrities:', error);
      setErrorMessage('An error occurred while fetching data.');
    }
  };

  // Fetch name matches as user types
  useEffect(() => {
    if (!searchName.trim()) {
      setNameMatches([]);
      setDropdownVisible(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/search?name=${searchName}`);
        const data = await response.json();
        
        setNameMatches(data);
        setDropdownVisible(data.length > 0);
      } catch (error) {
        console.error('Error fetching name matches:', error);
      }
    };

    fetchMatches();
  }, [searchName]);

  // Select celebrity from dropdown
  const selectCelebrity = async (celeb) => {
    setSearchName('');  // 🔥 Clear the input field
    setDropdownVisible(false);
    setNameMatches([]);
    setMatchingCelebrities([]);
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/celebrities/${celeb._id}`);
      if (!response.ok) throw new Error("Failed to fetch celebrity details");

      const data = await response.json();
      setSelectedCelebrity(data);
    } catch (error) {
      console.error('Error fetching celebrity details:', error);
      setErrorMessage('Failed to fetch celebrity details.');
    }
  };

  // Handle Enter key press for shoe size input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findCelebritiesBySize();
    }
  };

  return (
    <div className="app-wrapper">
      <div className="App">
        <h1>Find Celebrities with Your US Shoe Size</h1>

        {/* Shoe Size Input */}
        <div>
          <input
            type="number"
            placeholder="Enter your shoe size"
            value={shoeSize}
            onChange={(e) => setShoeSize(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={findCelebritiesBySize}>Find Matches</button>
        </div>

        {/* Error Message (only for shoe size search) */}
        {errorMessage && shoeSize && <p className="error-message">{errorMessage}</p>}

        {/* Display Matching Celebrities by Shoe Size */}
        {matchingCelebrities.length > 0 && (
          <div>
            <h2>Matching Celebrities</h2>
            <div className="celebrity-list">
              {matchingCelebrities.map((celeb) => (
                <CelebrityCard
                  key={celeb._id}
                  name={celeb.name}
                  shoeSize={celeb.shoeSize}
                  image={celeb.image}
                  category={celeb.category}  // Pass the category prop here
                />
              ))}
            </div>
          </div>
        )}

        <hr />

        {/* Search for Celebrity by Name */}
        <h2>Search for a Celebrity</h2>
        <div className="search-container" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Type celebrity name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* Suggestion Dropdown */}
          {dropdownVisible && (
            <ul className="suggestion-dropdown" style={{
              position: 'absolute',
              background: '#fff',
              border: '1px solid #ccc',
              padding: 0,
              listStyle: 'none',
              maxHeight: '150px',
              overflowY: 'auto',
              width: '100%',
              zIndex: 10
            }}>
              {nameMatches.map((match) => (
                <li key={match._id}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onClick={() => selectCelebrity(match)}>
                  {match.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* No Results Message */}
        {searchName && !dropdownVisible && nameMatches.length === 0 && !selectedCelebrity && (
          <p>No results for "{searchName}".<br /><br />Please try a different search.</p>
        )}

        {/* Display Selected Celebrity */}
        {selectedCelebrity && (
          <div className="celebrity-details">          
            <CelebrityCard
              key={selectedCelebrity._id}
              name={selectedCelebrity.name}
              shoeSize={selectedCelebrity.shoeSize}
              image={selectedCelebrity.image}
              category={selectedCelebrity.category}  // Pass the category prop here
            />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
