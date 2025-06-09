// client/src/TestInputs.jsx
import React, { useState, useEffect } from 'react';

const TestInputs = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Add a useEffect to log state changes, useful for observing if state updates are normal
  useEffect(() => {
    console.log('TestInputs: Min Price state updated to:', minPrice);
  }, [minPrice]);

  useEffect(() => {
    console.log('TestInputs: Max Price state updated to:', maxPrice);
  }, [maxPrice]);


  const handleMinPriceChange = (e) => {
    // No e.preventDefault() here, just state update
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    // No e.preventDefault() here, just state update
    setMaxPrice(e.target.value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test Price Inputs - Minimal Example</h1>
      <p>Observe carefully: Does the page refresh when you type here?</p>
      <div>
        <label htmlFor="minTest">Min Price:</label>
        <input
          id="minTest"
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={handleMinPriceChange}
          style={{ margin: '5px', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label htmlFor="maxTest">Max Price:</label>
        <input
          id="maxTest"
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          style={{ margin: '5px', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <p>Current Min Display: **{minPrice}**</p>
      <p>Current Max Display: **{maxPrice}**</p>
    </div>
  );
};

export default TestInputs;