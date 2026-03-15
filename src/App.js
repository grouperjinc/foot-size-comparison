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
  <h1>Celebrity Foot Size Comparison</h1>
  <p style={{ maxWidth: "900px", margin: "0 auto" }}>
    Compare your shoe size with celebrities and learn how sizing works across US, UK, EU, and CM systems.
  </p>
</div>

<div
  className="homepage-content"
  style={{
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "left",
    lineHeight: "1.7",
    padding: "0 10px"
  }}
>
  <h2>About Celebrity Foot Size Comparison</h2>
  <p>
    Celebrity Foot Size Comparison is an informational resource and interactive tool
    designed to help users explore publicly available shoe size data from well-known
    athletes, actors, musicians, and public figures. Many people are curious whether
    they share the same shoe size as their favorite celebrities, and this platform
    organizes that information in a structured and easy-to-browse format.
  </p>

  <h2>Understanding Shoe Size Systems</h2>
  <p>
    Shoe sizing differs across regions and measurement standards. The most commonly
    used systems include United States (US), United Kingdom (UK), European Union (EU),
    and centimeter (CM) measurements. A size 10 in US sizing, for example, does not
    correspond to a size 10 in UK or EU systems.
  </p>
  <p>
    In addition, men’s and women’s sizing scales vary. In many cases, women’s US sizes
    are approximately 1 to 1.5 sizes larger than their men’s equivalents. Understanding
    these differences helps users compare sizes more accurately across categories.
  </p>

  <h2>How Celebrity Shoe Size Information Is Sourced</h2>
  <p>
    Shoe size data displayed on this website is gathered from publicly available
    interviews, media reports, brand disclosures, and other reputable sources.
    Because footwear sizing can vary by brand, model, and fit preference, some
    values may be approximate rather than officially confirmed measurements.
  </p>

  <h2>Why People Compare Celebrity Shoe Sizes</h2>
  <p>
    Many users enjoy comparing themselves to professional athletes, entertainers,
    and cultural figures out of curiosity or interest in sports and fashion.
    Organizing this information in one searchable database makes it easier to
    explore patterns, similarities, and differences across various industries.
  </p>

  <h2>How to Use This Tool</h2>
  <p>
    You can enter your shoe size to discover celebrities who share the same size,
    including approximate matches if desired. The site also allows you to search
    directly by celebrity name to view available details.
  </p>

  <h2>Independent and Informational</h2>
  <p>
    footsizecomparison.com is an independent informational website created for
    entertainment and educational purposes. We are not affiliated with or endorsed
    by any celebrity, brand, or organization mentioned. We continually review
    and update our listings to improve clarity and overall user experience.
  </p>
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

        <footer
          style={{
            marginTop: '2rem',
            padding: '1rem 0',
            borderTop: '1px solid #ccc',
            textAlign: 'center',
            fontSize: '0.9rem',
            backgroundColor: '#f5f5f5'
          }}
        >
          <p style={{ margin: '0.5rem' }}>
            <a href="/about.html" style={footerLinkStyle}>About</a> |{" "}
            <a href="/terms.html" style={footerLinkStyle}>Terms of Use</a> |{" "}
            <a href="/privacypolicy.html" style={footerLinkStyle}>Privacy Policy</a> |{" "}
            <a href="/celebrity-shoe-size-chart/" style={footerLinkStyle}>Celebrity Shoe Size Chart</a>
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