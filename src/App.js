import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CelebrityCard from './components/CelebrityCard';
import SizeConversionChart from './components/SizeConversionChart';
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
  const [isLoading, setIsLoading] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);

  const categoryImages = {
    Actor: 'https://res.cloudinary.com/dlratz7ov/image/upload/v1745470676/movie_anvfga.png',
    Athlete: 'https://res.cloudinary.com/dlratz7ov/image/upload/v1745470677/sport_ha9boz.png',
    Music: 'https://res.cloudinary.com/dlratz7ov/image/upload/v1745470676/music_k1cjtm.png',
    Default: 'https://res.cloudinary.com/dlratz7ov/image/upload/v1745471093/placeholder_soon_rlwxdv.png'
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) setCookieConsent(true);
  }, []);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push failed:", e);
    }
  }, []);

  const findCelebritiesBySize = async () => {
    if (!shoeSize) {
      setErrorMessage('Please enter a shoe size.');
      return;
    }

    const size = parseFloat(shoeSize);
    if (isNaN(size)) {
      setErrorMessage('Invalid shoe size. Please enter a valid number.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/celebrities`, {
        params: { shoeSize: size, exact: !includeApproximate }
      });
      setMatchingCelebrities(data);
      setSelectedCelebrity(null);
    } catch (error) {
      console.error('Error fetching matching celebrities:', error);
      setErrorMessage('An error occurred while fetching data. Please try again.');
      setMatchingCelebrities([]);
    } finally {
      setIsLoading(false);
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
        setNameMatches(Array.isArray(data) ? data : []);
        setDropdownVisible(data.length > 0);
      } catch (error) {
        console.error('Error fetching name matches:', error);
        setNameMatches([]);
      }
    };

    fetchMatches();
  }, [searchName, API_BASE_URL]);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') findCelebritiesBySize();
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', true);
    setCookieConsent(true);
  };

  return (
    <div className="app-wrapper">
      <div className="App">
        <div className="hero-section">
          <h1>Welcome to the Celebrity Foot Size Comparison</h1>
          <p><strong>footsizecomparison.com</strong> is a fun and interactive website that helps you compare your shoe size with those of celebrities around the world. Whether you're curious if you match LeBron James or Zendaya, this tool lets you explore who shares your size across the entertainment, music, and sports industries.</p>
          <p>With a growing database of verified celebrity shoe sizes, we make it easy to discover patterns, surprises, and even inspiration. You can search by size, name, or category to see which stars match your footprint. Plus, we’re regularly adding new names to keep the comparison fun and fresh.</p>
          <p>Give it a try — enter your shoe size below and see which famous feet you line up with!</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="text" step="0.1" placeholder="Enter your shoe size" value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} onKeyDown={handleKeyPress} style={{ padding: '0.5rem', fontSize: '1rem' }} />
            <button onClick={findCelebritiesBySize} style={{ padding: '0.5rem 1rem', minWidth: '120px' }} disabled={isLoading}>
              {isLoading ? <span className="spinner" style={{ display: 'inline-block', width: '1rem', height: '1rem', border: '2px solid #fff', borderTop: '2px solid #333', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : 'Find Matches'}
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <input type="checkbox" checked={includeApproximate} onChange={() => setIncludeApproximate(!includeApproximate)} />
            Include Approximate Matches (±0.5)
          </label>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {Array.isArray(matchingCelebrities) && matchingCelebrities.length > 0 && (
          <div>
            <h2>Matching Celebrities</h2>
            <div className="celebrity-list">
              {matchingCelebrities.map((celeb) => (
                <CelebrityCard key={celeb._id} 
                               name={celeb.name} 
                               shoeSize={celeb.shoeSize} 
                               category={celeb.category} 
                               image={categoryImages[celeb.category] || categoryImages.Default} 
                               funFact={celeb.funFact}
                
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ margin: '2rem 0' }}>
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-7122777258440810" data-ad-slot="2481840441" data-ad-format="auto" data-full-width-responsive="true"></ins>
        </div>

        <hr />

        <h2>Search for a Celebrity</h2>
        <div className="search-container" style={{ position: 'relative' }}>
          <input type="text" placeholder="Type celebrity name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          {dropdownVisible && Array.isArray(nameMatches) && (
            <ul className="suggestion-dropdown" style={{ position: 'absolute', background: '#fff', border: '1px solid #ccc', padding: 0, listStyle: 'none', maxHeight: '150px', overflowY: 'auto', width: '100%', zIndex: 10 }}>
              {nameMatches.map((match) => (
                <li key={match._id} style={{ padding: '5px', cursor: 'pointer' }} onClick={() => selectCelebrity(match)}>{match.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-7122777258440810" data-ad-slot="2481840441" data-ad-format="auto" data-full-width-responsive="true"></ins>
        </div>

        {searchName && !dropdownVisible && nameMatches.length === 0 && !selectedCelebrity && (
          <p>No results for "{searchName}".<br /><br />Please try a different search.</p>
        )}

        {selectedCelebrity && (
          <div className="celebrity-details">
            <CelebrityCard key={selectedCelebrity._id} name={selectedCelebrity.name} shoeSize={selectedCelebrity.shoeSize} category={selectedCelebrity.category} image={categoryImages[selectedCelebrity.category] || categoryImages.Default} />
          </div>
        )}

        {/* Include the conversion chart here */}
        <SizeConversionChart />

        {!cookieConsent && (
          <div id="cookie-consent" className="cookie-consent">
            <p>
              We use cookies to enhance your browsing experience and to serve personalized ads via Google AdSense.
              By continuing to use this site, you consent to our use of cookies.
              <a href="/privacypolicy.html" target="_blank" rel="noopener noreferrer">Learn more</a>.
            </p>
            <button onClick={acceptCookies}>Got it!</button>
          </div>
        )}

        <footer style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid #ccc', textAlign: 'center', fontSize: '0.9rem', backgroundColor: '#f5f5f5' }}>
          <p style={{ margin: '0.5rem' }}>
            <a href="/about.html" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>About</a> |
            <a href="/terms.html" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Terms of Use</a> |
            <a href="/privacypolicy.html" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Privacy Policy</a>
          </p>
          <p style={{ marginTop: '0.25rem', color: '#777' }}>© {new Date().getFullYear()} footsizecomparison.com</p>
        </footer>
      </div>
    </div>
  );
}

const footerLinkStyle = {
  color: '#008cba',
  margin: '0 0.5rem',
  textDecoration: 'none'
};

export default App;