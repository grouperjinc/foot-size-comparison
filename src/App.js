import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CelebrityCard from './components/CelebrityCard';

function App() {
  const [shoeSize, setShoeSize] = useState('');
  const [matchingCelebrities, setMatchingCelebrities] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [nameMatches, setNameMatches] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const findCelebritiesBySize = async () => {
    if (!shoeSize) {
      setErrorMessage('Please enter a shoe size.');
      return;
    }

    setErrorMessage('');
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/celebrities?shoeSize=${shoeSize}`);
      console.log('%c✅ API response for shoe size:', 'color: green;', data);

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data format received from API");
      }

      if (data.length === 0) {
        setErrorMessage('No celebrities found with this shoe size.');
        setMatchingCelebrities([]);
      } else {
        setMatchingCelebrities(data);
      }

      setSelectedCelebrity(null);
    } catch (error) {
      console.error('❌ Error fetching matching celebrities:', error);
      setErrorMessage('An error occurred while fetching data. Please try again.');
    }
  };

  useEffect(() => {
    if (!searchName.trim()) {
      setNameMatches([]);
      setDropdownVisible(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/search?name=${searchName}`);
        setNameMatches(data);
        setDropdownVisible(data.length > 0);
      } catch (error) {
        console.error('❌ Error fetching name matches:', error);
      }
    };

    fetchMatches();
  }, [searchName]);

  const selectCelebrity = async (celeb) => {
    setSearchName('');
    setDropdownVisible(false);
    setNameMatches([]);
    setMatchingCelebrities([]);
    setErrorMessage('');

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/celebrities/${celeb._id}`);
      setSelectedCelebrity(data);
    } catch (error) {
      console.error('❌ Error fetching celebrity details:', error);
      setErrorMessage('Failed to fetch celebrity details.');
    }
  };

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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {Array.isArray(matchingCelebrities) && matchingCelebrities.length > 0 && (
          <div>
            <h2>Matching Celebrities</h2>
            <div className="celebrity-list">
              {matchingCelebrities.map((celeb) => (
                <CelebrityCard
                  key={celeb._id}
                  name={celeb.name}
                  shoeSize={celeb.shoeSize}
                  image={celeb.image}
                  category={celeb.category}
                />
              ))}
            </div>
          </div>
        )}

        <hr />

        <h2>Search for a Celebrity</h2>
        <div className="search-container" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Type celebrity name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

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

        {searchName && !dropdownVisible && nameMatches.length === 0 && !selectedCelebrity && (
          <p>No results for "{searchName}".<br /><br />Please try a different search.</p>
        )}

        {selectedCelebrity && (
          <div className="celebrity-details">
            <CelebrityCard
              key={selectedCelebrity._id}
              name={selectedCelebrity.name}
              shoeSize={selectedCelebrity.shoeSize}
              image={selectedCelebrity.image}
              category={selectedCelebrity.category}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
