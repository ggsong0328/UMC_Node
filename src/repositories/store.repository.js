import { pool, prisma } from "../db.config.js"; // MySQL 연결

export const addNewStore = async (storeData) => {
  try {
    const storeDetail = await prisma.store.create({
      data: {
        region_id: storeData.region_id,
        store_name: storeData.store_name,
        owner_id: storeData.owner_id,
        address: storeData.address,
      },
    });
    return storeDetail.store_id;
  } catch (err) {
    throw new Error(`Error adding new Store: ${err.message}`);
  }
};

export const getAllStoreReview = async (storeId, cursor) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        store_id: storeId,
        review_id: cursor > 0 ? { gt: cursor } : undefined,
      },
      include: {
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
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch store reviews");
  }
};
