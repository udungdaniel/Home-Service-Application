const axios = require('axios');

const BASE_URL = 'https://home-service-application-u66j.onrender.com/api';

async function runTests() {
  try {
    console.log('\n===== USERS =====');
    let response = await axios.get(`${BASE_URL}/users`);
    console.log('GET ALL USERS: PASSED');

    if (response.data.length > 0) {
      const id = response.data[0]._id;

      response = await axios.get(`${BASE_URL}/users/${id}`);
      console.log('GET USER BY ID: PASSED');
    }

    console.log('\n===== SERVICES =====');
    response = await axios.get(`${BASE_URL}/services`);
    console.log('GET ALL SERVICES: PASSED');

    if (response.data.length > 0) {
      const id = response.data[0]._id;

      response = await axios.get(`${BASE_URL}/services/${id}`);
      console.log('GET SERVICE BY ID: PASSED');
    }

    console.log('\n===== BOOKINGS =====');
    response = await axios.get(`${BASE_URL}/bookings`);
    console.log('GET ALL BOOKINGS: PASSED');

    if (response.data.length > 0) {
      const id = response.data[0]._id;

      response = await axios.get(`${BASE_URL}/bookings/${id}`);
      console.log('GET BOOKING BY ID: PASSED');
    }

    console.log('\n===== REVIEWS =====');
    response = await axios.get(`${BASE_URL}/reviews`);
    console.log('GET ALL REVIEWS: PASSED');

    if (response.data.length > 0) {
      const id = response.data[0]._id;

      response = await axios.get(`${BASE_URL}/reviews/${id}`);
      console.log('GET REVIEW BY ID: PASSED');
    }

    console.log('\n🎉 ALL GET TESTS PASSED 🎉');
  } catch (error) {
    console.error('\n❌ TEST FAILED');

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();