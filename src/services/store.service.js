import { bodyToStore, responseFromReviews } from "../dtos/store.dto.js";
import {
  addNewStore,
  getAllStoreReview,
} from "../repositories/store.repository.js";

export const addStore = async (storeData) => {
  const formattedStoreData = bodyToStore(storeData); //DTO로 변환
  try {
    await addNewStore(formattedStoreData);
  } catch (err) {
    throw err;
  }
};

export const storeReview = async (storeId) => {
  const reviews = await getAllStoreReview(storeId);
  return responseFromReviews(reviews);
};
