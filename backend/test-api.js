const axios = require('axios');

const API_URL = 'http://localhost:5000/api/data'; // Change port if needed

async function runTests() {
  try {
    // 1. Test GET (should return an array, possibly empty)
    let response = await axios.get(API_URL);
    console.log('GET /api/data:', response.data);

    // 2. Test POST (add a new entry)
    const testPayload = { key: 'test', value: 'hello world' };
    response = await axios.post(API_URL, testPayload);
    console.log('POST /api/data:', response.data);

    // 3. Test GET again (should include the new entry)
    response = await axios.get(API_URL);
    console.log('GET /api/data (after POST):', response.data);
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error:', err.message);
    }
    // Print full error for debugging
    console.error('Full error object:', err);
  }
}

runTests();