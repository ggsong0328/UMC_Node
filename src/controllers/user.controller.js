import { bodyToFood } from "../dtos/user.dto.js";
import { agreeToTerms } from "../services/user.service.js"; // 약관 동의 함수만 불러옵니다.
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
  console.log(req.body);
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
