export const bodyToReview = (body) => {
  return {
    review_id: body.review_id,
    user_id: body.user_id,
    store_id: body.store_id,
    rating: body.rating,
    review_content: body.review_content,
    created_at: body.created_at,
  };
};
