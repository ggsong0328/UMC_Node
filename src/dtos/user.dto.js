// 회원가입 시 사용자 정보를 처리하는 DTO
export const bodyToUser = (body) => {
  console.log(body);
  return {
    user_id: body.user_id,
    email: body.email,
    name: body.name,
    gender: body.gender,
    birthdate: body.birthdate,
    address: body.address,
    phone_number: body.phone_number,
  };
};

// 약관 동의 처리 DTO
export const bodyToTerms = (body) => {
  return {
    user_id: body.user_id, // user_id 포함
    all_agreed: body.all_agreed,
    age_agreed: body.age_agreed,
    service_terms_agreed: body.service_terms_agreed,
    privacy_policy_agreed: body.privacy_policy_agreed,
    location_agreed: body.location_agreed,
    marketing_agreed: body.marketing_agreed,
  };
};

// 음식 선호 항목 처리 DTO
export const bodyToFood = (body) => {
  return {
    user_id: body.user_id, // user_id 그대로
    food_item: body.foodChoices.food_item, // food_item을 정확히 가져오기
  };
};
