import userRepository from "../repositories/user.repository.js"; // userRepository 가져오기
import { bodyToUser, bodyToTerms } from "../dtos/user.dto.js"; // DTO 가져오기

// 1. 사용자 추가 (회원가입)
export const createUserInfo = async (userData) => {
  console.log(userData);
  const formattedUserData = bodyToUser(userData); // DTO로 변환
  return await userRepository.addUser(formattedUserData); // 사용자를 추가하고 user_id 반환
};

// 2. 약관 동의 처리
export const agreeToTerms = async (termsData) => {
  const formattedTermsData = bodyToTerms(termsData); // DTO로 변환
  return await userRepository.agreeTerm(formattedTermsData); // 약관 동의 처리
};

// 3. 선호 음식 저장
export const saveUserFoodPreferences = async (foodData, user_id) => {
  console.log("Received foodData:", foodData); // 확인용 로그
  console.log("Received user_id:", user_id); // 확인용 로그

  if (!foodData || !Array.isArray(foodData)) {
    throw new Error("food_item이 유효한 배열이 아닙니다.");
  }

  // food_item을 JSON 문자열로 변환하여 저장
  const foodItemString = JSON.stringify(foodData);

  try {
    await userRepository.selectFood(foodItemString, user_id); // 수정된 방식으로 전달
  } catch (err) {
    throw err;
  }
};
