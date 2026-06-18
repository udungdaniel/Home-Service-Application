const {
  getAllBookings,
  getBookingsByCustomer,
} = require("../controllers/bookingController");
const Booking = require("../models/Booking");

describe("Booking Controller - Unit Tests (GET Routes)", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.restoreAllMocks();
  });

  describe("getAllBookings (GetAll Route)", () => {
    it("should return 200 and all bookings with populated references on success", async () => {
      const mockBookings = [
        {
          _id: "60c72b2f9b1d8b2bad754bbb",
          totalPrice: 150,
          customerId: { name: "Alice", email: "alice@test.com" },
          serviceId: { name: "Plumbing", description: "Fix pipes", price: 150 },
        },
      ];

      // Mock the multi-chain: Booking.find().populate.populate()
      const mockPopulateSecond = jest.fn().mockResolvedValue(mockBookings);
      const mockPopulateFirst = jest
        .fn()
        .mockReturnValue({ populate: mockPopulateSecond });
      jest
        .spyOn(Booking, "find")
        .mockReturnValue({ populate: mockPopulateFirst });

      await getAllBookings(req, res);

      expect(Booking.find).toHaveBeenCalledTimes(1);
      expect(mockPopulateFirst).toHaveBeenCalledWith(
        "customerId",
        "name email",
      );
      expect(mockPopulateSecond).toHaveBeenCalledWith(
        "serviceId",
        "name description price",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });

    it("should return 500 if a database error occurs during finding", async () => {
      const mockPopulateSecond = jest
        .fn()
        .mockRejectedValue(new Error("Query timeout"));
      const mockPopulateFirst = jest
        .fn()
        .mockReturnValue({ populate: mockPopulateSecond });
      jest
        .spyOn(Booking, "find")
        .mockReturnValue({ populate: mockPopulateFirst });

      await getAllBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Query timeout" });
    });
  });

  describe("getBookingsByCustomer (Get Route for Specific Customer)", () => {
    it("should return 200 and specific customer bookings on success", async () => {
      req.params.customerId = "60c72b2f9b1d8b2bad754321";
      const mockCustomerBookings = [
        {
          _id: "60c72b2f9b1d8b2bad754bbb",
          customerId: "60c72b2f9b1d8b2bad754321",
          totalPrice: 100,
          serviceId: { serviceName: "Cleaning", price: 100 },
        },
      ];

      // Mock chain: Booking.find({...}).populate()
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomerBookings);
      jest.spyOn(Booking, "find").mockReturnValue({ populate: mockPopulate });

      await getBookingsByCustomer(req, res);

      expect(Booking.find).toHaveBeenCalledWith({
        customerId: "60c72b2f9b1d8b2bad754321",
      });
      expect(mockPopulate).toHaveBeenCalledWith(
        "serviceId",
        "serviceName price",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomerBookings);
    });

    it("should return 500 if filtering database record fails", async () => {
      req.params.customerId = "60c72b2f9b1d8b2bad754321";
      const mockPopulate = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));
      jest.spyOn(Booking, "find").mockReturnValue({ populate: mockPopulate });

      await getBookingsByCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
