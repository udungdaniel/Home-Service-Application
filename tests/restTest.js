const axios = require('axios');

const BASE_URL = 'http://localhost:8181/api';

// helper for clean logs
const log = (title, data) => {
    console.log(`\n========== ${title} ==========\n`);
    console.log(data);
};

// wrap everything in one async function
const runTests = async () => {
    try {
        /**
         * =========================
         * USERS
         * =========================
         */

        const newUser = {
            name: "Test User",
            email: `test${Date.now()}@mail.com`,
            role: "customer"
        };

        const userRes = await axios.post(`${BASE_URL}/users`, newUser);
        log("CREATE USER", userRes.data);

        const userId = userRes.data.data?._id || userRes.data._id;

        const getUsers = await axios.get(`${BASE_URL}/users`);
        log("GET ALL USERS", getUsers.data);

        const getUser = await axios.get(`${BASE_URL}/users/${userId}`);
        log("GET USER BY ID", getUser.data);

        await axios.put(`${BASE_URL}/users/${userId}`, {
            phone: "123456789"
        });

        log("UPDATE USER", "User updated");

        /**
         * =========================
         * SERVICES
         * =========================
         */

        const newService = {
            providerId: userId,
            serviceName: "Plumbing",
            category: "Home Repair",
            description: "Fix pipes",
            price: 100
        };

        const serviceRes = await axios.post(`${BASE_URL}/services`, newService);
        log("CREATE SERVICE", serviceRes.data);

        const serviceId = serviceRes.data.data?._id || serviceRes.data._id;

        const getServices = await axios.get(`${BASE_URL}/services`);
        log("GET ALL SERVICES", getServices.data);

        const getService = await axios.get(`${BASE_URL}/services/${serviceId}`);
        log("GET SERVICE BY ID", getService.data);

        await axios.put(`${BASE_URL}/services/${serviceId}`, {
            price: 120
        });

        log("UPDATE SERVICE", "Service updated");

        /**
         * =========================
         * REVIEWS
         * =========================
         */

        const newReview = {
            userId,
            serviceId,
            rating: 5,
            comment: "Excellent service!"
        };

        const reviewRes = await axios.post(`${BASE_URL}/reviews`, newReview);
        log("CREATE REVIEW", reviewRes.data);

        const reviewId = reviewRes.data._id || reviewRes.data.data?._id;

        const getReviews = await axios.get(`${BASE_URL}/reviews`);
        log("GET ALL REVIEWS", getReviews.data);

        const getReview = await axios.get(`${BASE_URL}/reviews/${reviewId}`);
        log("GET REVIEW BY ID", getReview.data);

        await axios.put(`${BASE_URL}/reviews/${reviewId}`, {
            comment: "Updated review"
        });

        log("UPDATE REVIEW", "Review updated");

        /**
         * =========================
         * BOOKINGS
         * =========================
         */

        const newBooking = {
            customerId: userId,
            serviceId,
            bookingDate: new Date(),
            totalPrice: 100,
            notes: "Test booking"
        };

        const bookingRes = await axios.post(`${BASE_URL}/bookings`, newBooking);
        log("CREATE BOOKING", bookingRes.data);

        const bookingId = bookingRes.data._id || bookingRes.data.data?._id;

        const getBookings = await axios.get(`${BASE_URL}/bookings`);
        log("GET ALL BOOKINGS", getBookings.data);

        const getCustomerBookings = await axios.get(
            `${BASE_URL}/bookings/customer/${userId}`
        );
        log("GET BOOKINGS BY CUSTOMER", getCustomerBookings.data);

        await axios.put(`${BASE_URL}/bookings/${bookingId}`, {
            status: "confirmed"
        });

        log("UPDATE BOOKING", "Booking updated");

        console.log("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY\n");

    } catch (error) {
        console.log("\n❌ ERROR OCCURRED\n");

        if (error.response) {
            console.log("STATUS:", error.response.status);
            console.log("DATA:", JSON.stringify(error.response.data, null, 2));
            console.log("HEADERS:", error.response.headers);
        } else if (error.request) {
            console.log("NO RESPONSE FROM SERVER");
            console.log(error.request);
        } else {
            console.log("ERROR MESSAGE:", error.message);
        }
    }
};

runTests();