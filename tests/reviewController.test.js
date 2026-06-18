const {
  getAllReviews,
  getReviewById,
} = require("../controllers/reviewController");
const Review = require("../models/Review");

describe("Review Controller - Unit Tests (GET Routes)", () => {
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

    describe('getAllReviews (GetAll Route)', () => {
        it('should return 200 and an array of all reviews on success', async () => {
            const mockReviews = [
                { _id: '60c72b2f9b1d8b2bad754cc1', rating: 5, comment: 'Excellent work!' },
                { _id: '60c72b2f9b1d8b2bad754cc2', rating: 4, comment: 'Very good' }
            ];

            // Mock simple Review.find() query
            jest.spyOn(Review, 'find').mockResolvedValue(mockReviews);

            await getAllReviews(req, res);

            expect(Review.find).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReviews);
        });

        it('should return 500 if a database error occurs during finding reviews', async () => {
            jest.spyOn(Review, 'find').mockRejectedValue(new Error('Connection failure'));
        
            await getAllReviews(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Connection failure'
            });
        });
    });

    describe('getReviewById (Get Route)', () => {
        it('should return 404 if the review is not found in the database', async () => {
            req.params.id = '60c72b2f9b1d8b2bad754cc1';
            jest.spyOn(Review, 'findById').mockResolvedValue(null);

            await getReviewById(req, res);

            expect(Review.findById).toHaveBeenCalledWith('60c72b2f9b1d8b2bad754cc1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Review not found'
            });
        });

        it('should return 200 and the review object on success', async () => {
            req.params.id = '60c72b2f9b1d8b2bad754cc1';
            const mockReview = { _id: '60c72b2f9b1d8b2bad754cc1', rating: 5, comment: 'Great!' };

            jest.spyOn(Review, 'findById').mockResolvedValue(mockReview);

            await getReviewById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReview);
        });

        it('should return 500 if an unexpected error occurs fetch', async () => {
            req.params.id = '60c72b2f9b1d8b2bad754cc1';
            jest
              .spyOn(Review, "findById")
              .mockRejectedValue(new Error("Database error"));

            
            await getReviewById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Database error'
            });
        });
    });
});    
