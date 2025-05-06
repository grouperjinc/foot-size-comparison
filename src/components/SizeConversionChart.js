import React, { useState, useEffect, useRef } from 'react';

const SizeConversionChart = () => {
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (showChart) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push failed:", e);
      }

      chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showChart]);

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button
        onClick={() => setShowChart(!showChart)}
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: showChart ? '#d9534f' : '#008cba',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = showChart ? '#c9302c' : '#0077a3')
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = showChart ? '#d9534f' : '#008cba')
        }
      >
          {showChart ? '❌ Hide Chart' : '📏 View Foot Size Conversion Chart'}
          <span
            title="Compare US, UK, EU & CM sizes — includes men’s and unisex conversion"
            style={{
              marginLeft: '8px',
              cursor: 'help',
              fontSize: '1.1rem',
              verticalAlign: 'middle',
            }}
          >
            ℹ️
          </span>
        </button>

      {showChart && (
        <div
          ref={chartRef}
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: '#555' }}>
            <strong>Note:</strong> This chart is based on <strong>Men’s/Unisex US sizes</strong>. 
            For Women’s sizes, subtract <strong>1.5</strong> from your usual size to find the equivalent unisex size. 
            (Example: Women’s US 9 ≈ Unisex US 7.5)
            </p>          
          <div style={{ marginBottom: '1rem' }}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-7122777258440810"
              data-ad-slot="2481840441"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem',
                minWidth: '400px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#ddd' }}>
                  <th style={thStyle}>US</th>
                  <th style={thStyle}>UK</th>
                  <th style={thStyle}>EU</th>
                  <th style={thStyle}>CM</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['5', '4.5', '37.5', '23.5'],
                  ['5.5', '5', '38', '24.0'],
                  ['6', '5.5', '39', '24.5'],
                  ['6.5', '6', '39.5', '25.0'],
                  ['7', '6.5', '40', '25.4'],
                  ['7.5', '7', '40.5', '25.8'],
                  ['8', '7.5', '41', '26.0'],
                  ['8.5', '8', '41.5', '26.7'],
                  ['9', '8.5', '42', '27.0'],
                  ['9.5', '9', '42.5', '27.3'],
                  ['10', '9.5', '43', '28.0'],
                  ['10.5', '10', '44', '28.6'],
                  ['11', '10.5', '44.5', '29.0'],
                  ['11.5', '11', '45', '29.4'],
                  ['12', '11.5', '45.5', '29.8'],
                  ['12.5', '12', '46', '30.2'],
                  ['13', '12.5', '47', '30.5'],
                  ['14', '13.5', '48.5', '31.3'],
                  ['15', '14.5', '49.5', '32.2'], 
                  ['16', '15.5', '50.5', '33.0'],
                  ['17', '16.5', '51.5', '34.0'],
                  ['18', '17.5', '52.5', '35.0'],
                  ['19', '18.5', '53.5', '36.0'],
                  ['20', '19.5', '54.5', '37.0']
                ].map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f1f1f1',
                    }}
                  >
                    {row.map((cell, i) => (
                      <td key={i} style={tdStyle}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '0.6rem',
  border: '1px solid #ccc',
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '0.6rem',
  border: '1px solid #ccc',
  textAlign: 'center',
};

export default SizeConversionChart;
