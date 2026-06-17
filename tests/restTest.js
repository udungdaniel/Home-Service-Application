const axios = require("axios");
const { spawn } = require("child_process");

// By default tests target a running server. Pass `--local` to start an
// in-memory MongoDB and the app automatically (uses tests/run-with-memorydb.js).
const useLocal = process.argv.includes("--local");
const BASE_URL = process.env.BASE_URL || "http://localhost:8181/api";

// helper for clean logs
const log = (title, data) => {
  console.log(`\n========== ${title} ==========`);
  console.log(data);
};

let helperProcess;

const startLocalServer = () => {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", ["tests/run-with-memorydb.js"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    helperProcess = proc;

    const stdout = [];
    const stderr = [];

    const onData = (data) => {
      const s = data.toString();
      process.stdout.write(`[helper] ${s}`);
      stdout.push(s);

      if (s.includes("Server running on port")) {
        cleanupStreams();
        resolve(proc);
      }
    };

    const onErr = (data) => {
      const s = data.toString();
      process.stderr.write(`[helper-err] ${s}`);
      stderr.push(s);
    };

    const cleanupStreams = () => {
      proc.stdout.removeListener("data", onData);
      proc.stderr.removeListener("data", onErr);
    };

    proc.stdout.on("data", onData);
    proc.stderr.on("data", onErr);

    proc.on("error", (err) => {
      cleanupStreams();
      reject(err);
    });

    // safety timeout
    const to = setTimeout(() => {
      cleanupStreams();
      reject(new Error("Timed out waiting for local server to start"));
    }, 20000);

    proc.on("close", (code) => {
      clearTimeout(to);
      if (code !== 0) {
        reject(
          new Error(`Helper exited with code ${code}\n${stderr.join("")} `),
        );
      }
    });
  });
};

// wrap everything in one async function
const runTests = async () => {
  if (useLocal) {
    console.log("Starting local in-memory MongoDB and server...");
    try {
      await startLocalServer();
      console.log("Local server is ready. Proceeding with tests.");
    } catch (err) {
      console.error("Failed to start local server:", err);
      if (helperProcess) helperProcess.kill();
      process.exit(1);
    }
  }
  try {
    /**
     * =========================
     * USERS
     * =========================
     */

    const newUser = {
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
      role: "customer",
    };

    const userRes = await axios.post(`${BASE_URL}/users`, newUser);
    log("CREATE USER", userRes.data);

    const userId = userRes.data.data?._id || userRes.data._id;

    const getUsers = await axios.get(`${BASE_URL}/users`);
    log("GET ALL USERS", getUsers.data);

    const getUser = await axios.get(`${BASE_URL}/users/${userId}`);
    log("GET USER BY ID", getUser.data);

    await axios.put(`${BASE_URL}/users/${userId}`, {
      phone: "123456789",
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
      price: 100,
    };

    const serviceRes = await axios.post(`${BASE_URL}/services`, newService);
    log("CREATE SERVICE", serviceRes.data);

    const serviceId = serviceRes.data.data?._id || serviceRes.data._id;

    const getServices = await axios.get(`${BASE_URL}/services`);
    log("GET ALL SERVICES", getServices.data);

    const getService = await axios.get(`${BASE_URL}/services/${serviceId}`);
    log("GET SERVICE BY ID", getService.data);

    await axios.put(`${BASE_URL}/services/${serviceId}`, {
      price: 120,
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
      comment: "Excellent service!",
    };

    const reviewRes = await axios.post(`${BASE_URL}/reviews`, newReview);
    log("CREATE REVIEW", reviewRes.data);

    const reviewId = reviewRes.data._id || reviewRes.data.data?._id;

    const getReviews = await axios.get(`${BASE_URL}/reviews`);
    log("GET ALL REVIEWS", getReviews.data);

    const getReview = await axios.get(`${BASE_URL}/reviews/${reviewId}`);
    log("GET REVIEW BY ID", getReview.data);

    await axios.put(`${BASE_URL}/reviews/${reviewId}`, {
      comment: "Updated review",
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
      notes: "Test booking",
    };

    const bookingRes = await axios.post(`${BASE_URL}/bookings`, newBooking);
    log("CREATE BOOKING", bookingRes.data);

    const bookingId = bookingRes.data._id || bookingRes.data.data?._id;

    const getBookings = await axios.get(`${BASE_URL}/bookings`);
    log("GET ALL BOOKINGS", getBookings.data);

    const getCustomerBookings = await axios.get(
      `${BASE_URL}/bookings/customer/${userId}`,
    );
    log("GET BOOKINGS BY CUSTOMER", getCustomerBookings.data);

    await axios.put(`${BASE_URL}/bookings/${bookingId}`, {
      status: "confirmed",
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

// ensure helper process is cleaned up on exit
process.on("exit", () => {
  if (helperProcess && !helperProcess.killed) {
    helperProcess.kill();
  }
});
process.on("SIGINT", () => process.exit(1));
