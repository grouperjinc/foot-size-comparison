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
                  ['6', '5.5', '39', '24.5'],
                  ['7', '6.5', '40', '25.0'],
                  ['8', '7.5', '41', '26.0'],
                  ['9', '8.5', '42', '27.0'],
                  ['10', '9.5', '43', '28.0'],
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
