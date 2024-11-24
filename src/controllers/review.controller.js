import { StatusCodes } from "http-status-codes";
import { addReview, userReview } from "../services/review.service.js";

export const writeStoreReview = async (req, res) => {
  const { storeId } = req.params;
  const { user_id, rating, review_content, created_at } = req.body;

  const reviewData = {
    store_id: Number(storeId),
    user_id,
    rating,
    review_content,
    created_at,
  };

  try {
    await addReview(reviewData);
    res.status(201).json({
      success: true,
      message: "리뷰가 성공적으로 작성이 되었습니다용!",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "리뷰 작성에 실패했습니다람지" });
  }
};

export const getUserReview = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId is required " });
    }

    const reviews = await userReview(userId, cursor);

    res.status(StatusCodes.OK).json({
      success: true,
      data: reviews.data,
      pagination: reviews.pagination,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: err.message });
  }
};
