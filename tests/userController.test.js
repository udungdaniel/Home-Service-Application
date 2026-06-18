const { getAllUsers, getUserById } = require("../controllers/userController");
const User = require("../models/User");
const mongoose = require("mongoose");

describe("User Controller - Unit Tests (GET Routes)", () => {
  let req, res;

  beforeEach(() => {
    // Reset mock request and response objects before each test
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.restoreAllMocks();
  });

  describe("getAllUsers (GetAll Route)", () => {
    it("should return 200 and a list of all users on success", async () => {
      const mockUsers = [
        {
          _id: "60c72b2f9b1d8b2bad754321",
          name: "Alice",
          email: "alice@test.com",
        },
        { _id: "60c72b2f9b1d8b2bad754322", name: "Bob", email: "bob@test.com" },
      ];

      // Mock the chained Mongoose query: User.find().sort()
      const mockSort = jest.fn().mockResolvedValue(mockUsers);
      jest.spyOn(User, "find").mockReturnValue({ sort: mockSort });

      await getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
      });
    });

    it("should return 500 if a database error occurs", async () => {
      const mockError = new Error("Database connection failed");

      const mockSort = jest.fn().mockRejectedValue(mockError);
      jest.spyOn(User, "find").mockReturnValue({ sort: mockSort });

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database connection failed",
      });
    });
  });

  describe("getUserById (Get Route)", () => {
    it("should return 400 if the provided ID is structurally invalid", async () => {
      req.params.id = "invalid-id-format";

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid user ID",
      });
    });

    it("should return 404 if the user is not found in the database", async () => {
      const validMockId = new mongoose.Types.ObjectId().toString();
      req.params.id = validMockId;

      // Mock findById to return null (not found)
      jest.spyOn(User, "findById").mockResolvedValue(null);

      await getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith(validMockId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should return 200 and the user object on success", async () => {
      const validMockId = new mongoose.Types.ObjectId().toString();
      req.params.id = validMockId;
      const mockUser = {
        _id: validMockId,
        name: "Daniel",
        email: "danielalfred@gmail.com",
      };

      jest.spyOn(User, "findById").mockResolvedValue(mockUser);

      await getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith(validMockId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it("should return 500 if an unexpected server error occurs", async () => {
      const validMockId = new mongoose.Types.ObjectId().toString();
      req.params.id = validMockId;

      jest
        .spyOn(User, "findById")
        .mockRejectedValue(new Error("Internal server error"));

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
