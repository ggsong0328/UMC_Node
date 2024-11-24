import { bodyToReview } from "../dtos/review.dto.js";
import { responseFromReviews } from "../dtos/store.dto.js";
import {
  addNewReview,
  getAllUserReview,
} from "../repositories/review.repository.js";

export const addReview = async (reviewData) => {
  const formattedReviewData = bodyToReview(reviewData);
  try {
    await addNewReview(formattedReviewData);
  } catch (err) {
    throw err;
  }
};

export const userReview = async (userId) => {
  const reviews = await getAllUserReview(userId);
  return responseFromReviews(reviews);
};
