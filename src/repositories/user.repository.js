import { pool } from "../db.config.js"; // MySQL 연결

// 1. user_id 생성 함수 (user 테이블에 삽입)
export const addUserId = async () => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user (user_id, created_at) VALUES (NULL, ?);`,
      [new Date()]
    );
    return result.insertId; // 새로 생성된 user_id 반환
  } catch (err) {
    throw new Error(
      `user 테이블에 user_id 생성 중 오류가 발생했습니다: ${err.message}`
    );
  } finally {
    conn.release();
  }
};

const userRepository = {
  // 사용자 추가 (user_id 먼저 생성)

  // 약관 동의 처리
  agreeTerm: async (termsData) => {
    const conn = await pool.getConnection();
    try {
      // 약관 동의 전에 user_id 생성
      const user_id = await addUserId(); // 약관 동의 시 user_id 생성

      const [result] = await conn.query(
        `INSERT INTO terms_agreement (user_id, all_agreed, age_agreed, service_terms_agreed, privacy_policy_agreed, location_agreed, marketing_agreed) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          user_id, // 생성된 user_id 전달
          termsData.all_agreed || 0,
          termsData.age_agreed || 0,
          termsData.service_terms_agreed || 0,
          termsData.privacy_policy_agreed || 0,
          termsData.location_agreed || 0,
          termsData.marketing_agreed || 0,
        ]
      );
      return user_id; // 생성된 user_id 반환
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  },

  addUser: async (userData) => {
    const conn = await pool.getConnection();
    try {
      //console.log("Received user_id:", userData.user_id);

      // 이메일 중복 확인
      const [confirm] = await conn.query(
        `SELECT EXISTS(SELECT 1 FROM user_details WHERE email = ?) as isExistEmail;`,
        [userData.email]
      );
      if (confirm[0].isExistEmail) {
        return null; // 이미 존재하는 이메일
      }

      // user_details에 사용자 정보 삽입
      const [result] = await conn.query(
        `INSERT INTO user_details (user_id, email, name, gender, birthdate, address, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          userData.user_id,
          userData.email,
          userData.name,
          userData.gender,
          userData.birthdate,
          userData.address,
          userData.phone_number,
        ]
      );
      return result.insertId; // 삽입된 user_id 반환
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  },

  // 선호 음식 처리
  selectFood: async (foodData, user_id) => {
    const conn = await pool.getConnection();
    try {
      //console.log("Inserting food item:", foodData, "for user_id:", user_id); // 확인용 로그
      await conn.query(
        `INSERT INTO food_choices (user_id, food_item, choice_date) VALUES (?, ?, ?)`,
        [user_id, foodData, new Date()]
      );
    } catch (err) {
      console.error("Error inserting food item:", err.message); // 오류 로그
      throw err;
    } finally {
      conn.release();
    }
  },
};

export default userRepository; // 기본 내보내기

export const addNewStore = async (storeData) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO stores (region_id, store_name, owner_id, address) VALUES (?, ?, ?, ?)`,
      [
        storeData.region_id,
        storeData.store_name,
        storeData.owner_id,
        storeData.address,
      ]
    );
  } catch (err) {
    console.error(`오류: (${err})`);
    throw err; // 핸들러에서 에러 처리 가능하도록 다시 던짐
  } finally {
    conn.release();
  }
};

export const addNewReview = async (reviewData) => {
  const conn = await pool.getConnection();
  try {
    // 1. 가게가 존재하는지 확인
    const [storeCheck] = await conn.query(
      `SELECT 1 FROM stores WHERE store_id = ? LIMIT 1;`,
      [reviewData.store_id]
    );

    if (storeCheck.length === 0) {
      throw new Error("Store does not exist");
    }

    // 2. 리뷰 삽입
    await conn.query(
      `INSERT INTO reviews (user_id, store_id, rating, review_content, created_at) VALUES (?, ?, ?, ?, ?);`,
      [
        reviewData.user_id,
        reviewData.store_id,
        reviewData.rating,
        reviewData.review_content,
        new Date(),
      ]
    );
  } catch (err) {
    console.error(`오류: (${err})`);
    throw err;
  } finally {
    conn.release();
  }
};

export const addNewMission = async (missionData) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO missions (store_id, mission_content, review_left) VALUES (?, ?, 0);`,
      [missionData.store_id, missionData.mission_content]
    );
  } catch (err) {
    console.error(`오류: (${err})`);
    throw err;
  } finally {
    conn.release();
  }
};

export const addNewProcessMission = async (processMissionData) => {
  const conn = await pool.getConnection();
  try {
    // 1. 이미 도전 중인지 확인
    const [existingMission] = await conn.query(
      `SELECT * FROM user_missions 
       WHERE user_id = ? AND mission_id = ? AND mission_status = 'in_process'`,
      [processMissionData.user_id, processMissionData.mission_id]
    );

    if (existingMission.length > 0) {
      throw new Error("The mission is already in process.");
    }

    // 2. 새 도전 추가
    await conn.query(
      `INSERT INTO user_missions (user_id, mission_id, mission_status, completed_date) 
       VALUES (?, ?, 'in_process', NULL);`,
      [processMissionData.user_id, processMissionData.mission_id]
    );
  } catch (err) {
    console.error(`오류: (${err.message})`);
    throw err;
  } finally {
    conn.release();
  }
};
