import { pool, prisma } from "../db.config.js"; // MySQL 연결

export const addNewReview = async (reviewData) => {
  try {
    // 가게가 존재하는지 확인
    const storeCheck = await prisma.store.findFirst({
      where: {
        store_id: reviewData.store_id,
      },
      select: {
        store_id: true, // 존재 여부만 확인하므로 특정 필드 선택
      },
    });

    if (!storeCheck) {
      throw new Error("Store does not exist");
    }

    const reviewDetail = await prisma.review.create({
      data: {
        user_id: reviewData.user_id,
        store_id: reviewData.store_id,
        rating: reviewData.rating,
        review_content: reviewData.review_content,
        created_at: new Date(),
      },
    });
    return reviewDetail.review_id;
  } catch (err) {
    throw new Error(`Error inserting new reviews: ${err.message}`);
  }
};

export const getAllUserReview = async (userId, cursor) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        user_id: userId,
        review_id: cursor > 0 ? { gt: cursor } : undefined,
      },
      include: {
        User: {
          select: {
            user_id: true,
            created_at: true,
          },
        },
        Store: {
          select: {
            store_name: true,
            address: true,
          },
        },
      },
      orderBy: { review_id: "asc" },
      take: 5,
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw new Error("Failed to fetch user reviews");
  }
};
