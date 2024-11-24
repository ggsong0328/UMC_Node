export const bodyToStore = (body) => {
  return {
    store_id: body.store_id,
    region_id: body.region_id,
    store_name: body.store_name,
    owner_id: body.owner_id,
    address: body.address,
  };
};

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
