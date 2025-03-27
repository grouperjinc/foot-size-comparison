import React, { useState, useEffect } from 'react';
import CelebrityCard from './components/CelebrityCard';

function App() {
  const [shoeSize, setShoeSize] = useState('');
  const [matchingCelebrities, setMatchingCelebrities] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [nameMatches, setNameMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch celebrities by shoe size
  const findCelebritiesBySize = async () => {
    if (!shoeSize) return;

    try {
      const response = await fetch(`http://localhost:5000/api/celebrities?shoeSize=${shoeSize}`);
      const data = await response.json();

      if (data.length === 0) {
        setErrorMessage('No celebrities found with this shoe size.');
      } else {
        setErrorMessage('');
      }

      setMatchingCelebrities(data);
    } catch (error) {
      console.error('Error fetching matching celebrities:', error);
      setErrorMessage('An error occurred while fetching data.');
    }
  };

  // Fetch partial name matches
  useEffect(() => {
    if (!searchName) {
      setNameMatches([]);
      setDropdownVisible(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search?name=${searchName}`);
        const data = await response.json();
        setNameMatches(data);
        setDropdownVisible(true); // Show dropdown when matches are found
      } catch (error) {
        console.error('Error fetching name matches:', error);
      }
    };

    fetchMatches();
  }, [searchName]);

  // Select a celebrity from the dropdown list
  const selectCelebrity = (celeb) => {
    setSearchName(celeb.name); // Set name in input field
    setNameMatches([]); // Hide suggestions
    setDropdownVisible(false); // Hide dropdown
  };

  // Handle Enter key press for shoe size input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findCelebritiesBySize();
    }
  };

  return (
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

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Display Matching Celebrities */}
      {matchingCelebrities.length > 0 && (
        <div>
          <h2>Matching Celebrities</h2>
          <div className="celebrity-list">
            {matchingCelebrities.map((celeb) => (
              <CelebrityCard key={celeb._id} celebrity={celeb} />
            ))}
          </div>
        </div>
      )}

      <hr />

      {/* Search for Celebrity */}
      <h2>Search for a Celebrity</h2>
      <div className="search-container" style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Type celebrity name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        {/* Suggestion Dropdown */}
        {dropdownVisible && nameMatches.length > 0 && (
          <ul
            className="suggestion-dropdown"
            style={{
              position: 'absolute',
              background: '#fff',
              border: '1px solid #ccc',
              padding: 0,
              listStyle: 'none',
              maxHeight: '150px',
              overflowY: 'auto',
              width: '100%',
              zIndex: 10,
            }}
          >
            {nameMatches.map((match) => (
              <li
                key={match._id}
                style={{ padding: '5px', cursor: 'pointer' }}
                onClick={() => selectCelebrity(match)}
              >
                {match.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display Selected Celebrity */}
      {searchName && !matchingCelebrities.length && (
        <p>No results for "{searchName}". Please try a different search.</p>
      )}
    </div>
  );
}

export default App;
