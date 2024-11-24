import { prisma } from "../db.config.js"; // Prisma client import

// 1. user_id 생성 함수 (user 테이블에 삽입)
export const addUserId = async () => {
  try {
    const user = await prisma.user.create({
      data: {
        created_at: new Date(),
      },
    });
    return user.user_id;
  } catch (err) {
    throw new Error(`Error creating user_id in the user table: ${err.message}`);
  }
};

const userRepository = {
  // 사용자 추가 (user_id 먼저 생성)

  // 약관 동의 처리
  agreeTerm: async (termsData) => {
    try {
      // 약관 동의 전에 user_id 생성
      const user_id = await addUserId(); // 약관 동의 시 user_id 생성

      // terms_agreement 테이블에 데이터 삽입
      await prisma.termsAgreement.create({
        data: {
          user_id,
          all_agreed: termsData.all_agreed || false,
          age_agreed: termsData.age_agreed || false,
          service_terms_agreed: termsData.service_terms_agreed || false,
          privacy_policy_agreed: termsData.privacy_policy_agreed || false,
          location_agreed: termsData.location_agreed || false,
          marketing_agreed: termsData.marketing_agreed || false,
        },
      });

      return user_id; // 생성된 user_id 반환
    } catch (err) {
      throw new Error(`Error processing terms agreement: ${err.message}`);
    }
  },

  addUser: async (userData) => {
    console.log(userData);
    try {
      // 이메일 중복 확인
      const existingUser = await prisma.userDetail.findFirst({
        where: { email: userData.email },
      });

      if (existingUser) {
        return null; // 이미 존재하는 이메일
      }

      // user_details에 사용자 정보 삽입
      const userDetail = await prisma.userDetail.create({
        data: {
          user_id: userData.user_id,
          email: userData.email,
          name: userData.name,
          gender: userData.gender,
          birthdate: userData.birthdate,
          address: userData.address,
          phone_number: userData.phone_number,
        },
      });

      return userDetail.details_id; // 삽입된 details_id 반환
    } catch (err) {
      throw new Error(`Error adding user details: ${err.message}`);
    }
  },

  // 선호 음식 처리
  selectFood: async (foodData, user_id) => {
    try {
      await prisma.foodChoice.create({
        data: {
          user_id,
          food_item: foodData,
        },
      });
    } catch (err) {
      console.error(`Error inserting food item: ${err.message}`); // 오류 로그
      throw new Error(`Error inserting food item: ${err.message}`);
    }
  },
};

export default userRepository; // 기본 내보내기
