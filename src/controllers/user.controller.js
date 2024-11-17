import { bodyToFood } from "../dtos/user.dto.js";
import { addNewStore } from "../repositories/user.repository.js";
import {
  addMission,
  addProcessMission,
  addReview,
  agreeToTerms,
} from "../services/user.service.js"; // 약관 동의 함수만 불러옵니다.
import { createUserInfo } from "../services/user.service.js"; // 사용자 정보 저장 함수만 불러옵니다.
import { saveUserFoodPreferences } from "../services/user.service.js"; // 선호 음식 저장 함수만 불러옵니다.

export const handleSignUpTerms = async (req, res) => {
  const termsData = req.body; // 클라이언트에서 전달된 약관 동의 데이터

  try {
    // 약관 동의 처리
    await agreeToTerms(termsData);
    res.status(200).json({ message: "약관 동의가 완료되었습니다." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleSignUpInfo = async (req, res) => {
  const userData = req.body; // 클라이언트에서 전달된 사용자 정보

  try {
    // 사용자 정보 저장 및 user_id 반환
    const user_id = await createUserInfo(userData);

    if (!user_id) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }

    res.status(200).json({ user_id, message: "사용자 정보가 저장되었습니다." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleSignUpFood = async (req, res) => {
  const foodData = req.body.foodChoices; // foodChoices가 올바르게 전달되어야 함
  const { user_id } = req.body; // user_id는 반드시 필요함

  if (!user_id) {
    return res.status(400).json({ error: "user_id가 필요합니다." });
  }

  try {
    // bodyToFood 함수로 데이터 형식화
    const formattedFoodData = bodyToFood({ user_id, foodChoices: foodData });
    console.log("Formatted food data:", formattedFoodData); // 확인

    // 선호 음식 저장
    await saveUserFoodPreferences(
      formattedFoodData.food_item,
      formattedFoodData.user_id
    );
    res.status(200).json({ message: "선호 음식이 저장되었습니다." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNewStoreInRegion = async (req, res) => {
  const { regionId } = req.params; // URL에서 regionId 추출
  const { store_name, owner_id, address } = req.body; // 요청 본문에서 필요한 데이터 추출

  const storeData = {
    region_id: regionId, // 추출한 regionId를 storeData에 포함
    store_name,
    owner_id,
    address,
  };

  try {
    await addNewStore(storeData); // storeData를 DB 함수에 전달
    res
      .status(201)
      .json({ success: true, message: "Store added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to add store" });
  }
};

export const writeStoreReview = async (req, res) => {
  const { storeId } = req.params;
  const { user_id, rating, review_content, created_at } = req.body;

  const reviewData = {
    store_id: storeId,
    user_id,
    rating,
    review_content,
    created_at,
  };

  try {
    await addReview(reviewData);
    res
      .status(201)
      .json({ success: true, message: "리뷰가 성공적으로 작성이 되었습니다!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "리뷰 작성에 실패했습니다" });
  }
};

export const addNewStoreMission = async (req, res) => {
  const { storeId } = req.params;
  const { mission_content, review_left } = req.body;

  const missionData = {
    store_id: storeId,
    mission_content,
    review_left,
  };

  try {
    await addMission(missionData);
    res
      .status(201)
      .json({ success: true, message: "미션이 성공적으로 추가 되었습니다!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "미션 추가에 실패했습니다" });
  }
};

export const addNewUserMission = async (req, res) => {
  const { userId } = req.params;
  const { mission_id, mission_status, completed_date } = req.body;

  const processMissionData = {
    user_id: userId,
    mission_id,
    mission_status,
    completed_date,
  };

  try {
    await addProcessMission(processMissionData);
    res.status(201).json({
      success: true,
      message: "도전중인 미션이 새롭게 추가 되었습니다!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "실패!" });
  }
};
