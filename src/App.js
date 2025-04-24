import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CelebrityCard from './components/CelebrityCard';
import './App.css';

function App() {
  const [shoeSize, setShoeSize] = useState('');
  const [matchingCelebrities, setMatchingCelebrities] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [nameMatches, setNameMatches] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [includeApproximate, setIncludeApproximate] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(false); // State for cookie consent

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Check if user already accepted cookies
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(true);
    }
  }, []);

  // Fetch celebrities by shoe size
  const findCelebritiesBySize = async () => {
    if (!shoeSize) {
      setErrorMessage('Please enter a shoe size.');
      return;
    }

    const size = parseFloat(shoeSize);  // Convert the input value to a float

    if (isNaN(size)) {
      setErrorMessage('Invalid shoe size. Please enter a valid number.');
      return;
    }

    console.log("Sending shoe size to backend:", size);

    setErrorMessage('');
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/celebrities`, {
        params: {
          shoeSize: size,
          exact: !includeApproximate  // exact=true when the toggle is OFF
        }
      });
      console.log("Data received from backend:", data);

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data format received from API");
      }

      setMatchingCelebrities(data);
      setSelectedCelebrity(null);
    } catch (error) {
      console.error('Error fetching matching celebrities:', error);
      setErrorMessage('An error occurred while fetching data. Please try again.');
      setMatchingCelebrities([]);
    }
  };

  // Search for celebrity by name
  useEffect(() => {
    if (!searchName.trim()) {
      setNameMatches([]);
      setDropdownVisible(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/search?name=${searchName}`);
        if (!Array.isArray(data)) {
          console.warn("Unexpected data format in name search:", data);
          setNameMatches([]);
          return;
        }

        setNameMatches(data);
        setDropdownVisible(data.length > 0);
      } catch (error) {
        console.error('Error fetching name matches:', error);
        setNameMatches([]);
      }
    };

    fetchMatches();
  }, [searchName]);

  // Select a celebrity from the dropdown
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
      console.error('Error fetching celebrity details:', error);
      setErrorMessage('Failed to fetch celebrity details.');
    }
  };

  // Handle "Enter" key for shoe size search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findCelebritiesBySize();
    }
  };

  // Accept cookies and store the consent in localStorage
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', true);
    setCookieConsent(true); // Update state to hide the cookie consent banner -important
  };

  return (
    <div className="app-wrapper">
      <div className="App">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Welcome to the Celebrity Foot Size Comparison</h1>
          <p>Discover which celebrities wear the same shoe size as you!</p>
        </div>

        {/* Main Content */}
        <div>
          <input
            type="text" // Change from number to text
            step="0.1"  // This allows decimals in the input field
            placeholder="Enter your shoe size"
            value={shoeSize} 
            onChange={(e) => setShoeSize(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={findCelebritiesBySize}>Find Matches</button> 
        </div>

         {/* Checkbox for approximate matches */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={includeApproximate}
            onChange={() => setIncludeApproximate(!includeApproximate)}
          />
          Include Approximate Matches (±0.5)
        </label>


        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {Array.isArray(matchingCelebrities) && matchingCelebrities.length > 0 && (
          <div>
            <h2>Matching Celebrities</h2>
            <div className="celebrity-list">
              {matchingCelebrities.map((celeb) => (
                <CelebrityCard
                  key={celeb._id}
                  name={celeb.name}
                  shoeSize={celeb.shoeSize}  // This will now be a string or number
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
          {dropdownVisible && Array.isArray(nameMatches) && (
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
                <li key={match._id} style={{ padding: '5px', cursor: 'pointer' }} onClick={() => selectCelebrity(match)}>
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
              category={selectedCelebrity.category}
            />
          </div>
        )}
        {/* Cookie Consent Banner */}
        {!cookieConsent && (
          <div id="cookie-consent" className="cookie-consent">
            <p>We use cookies to enhance your browsing experience. By continuing to use this website, you consent to our use of cookies.</p>
            <button onClick={acceptCookies}>Got it!</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
