import { pool, prisma } from "../db.config.js"; // MySQL 연결

export const addNewMission = async (missionData) => {
  try {
    const missionDetail = await prisma.mission.create({
      data: {
        store_id: missionData.store_id,
        mission_content: missionData.mission_content,
        review_left: missionData.review_left || false,
      },
    });
    return missionDetail.review_id;
  } catch (err) {
    throw new Error(`Error inserting new Mission: ${err.message}`);
  }
};

export const addNewProcessMission = async (processMissionData) => {
  try {
    const existingMission = await prisma.userMission.findFirst({
      where: {
        user_id: processMissionData.user_id,
        mission_id: processMissionData.mission_id,
        mission_status: "in_process",
      },
    });

    if (existingMission) {
      throw new Error("이미 진행중인 미션입니다.");
    }

    const missionDetail = await prisma.userMission.create({
      data: {
        user_id: processMissionData.user_id,
        mission_id: processMissionData.mission_id,
        mission_status: "in_process",
        completed_date: null,
      },
    });
    return missionDetail.user_mission_id;
  } catch (err) {
    throw new Error(`Error inserting new user_mission : ${err.message}`);
  }
};

export const getAllStoreMission = async (storeId, cursor) => {
  try {
    const missions = await prisma.mission.findMany({
      where: {
        store_id: storeId,
        mission_id: cursor > 0 ? { gt: cursor } : undefined,
      },
      include: {
        Store: {
          select: {
            store_name: true,
          },
        },
      },
      orderBy: { mission_id: "asc" },
      take: 5,
    });

    return missions;
  } catch (error) {
    console.error("Error fetching missions", error);
    throw new Error("Failed to fetch store missions");
  }
};

export const getAllUserMission = async (userId, cursor) => {
  try {
    const missions = await prisma.userMission.findMany({
      where: {
        user_id: userId,
        user_mission_id: cursor > 0 ? { gt: cursor } : undefined,
      },
      include: {
        UserDetail: {
          // 연결된 UserDetail 데이터를 가져오기
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
        Mission: {
          select: {
            mission_id: true,
            mission_content: true,
            Store: {
              // Mission에 연결된 Store 데이터도 가져오기
              select: {
                store_name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: { user_mission_id: "asc" },
      take: 5, // 페이징을 위해 5개씩만 가져오기
    });

    return missions;
  } catch (error) {
    console.error("Error fetching user missions:", error);
    throw new Error("Failed to fetch user missions");
  }
};

export const changeMissionStatus = async (userMissionId) => {
  if (!userMissionId) {
    throw new Error("userMissionId가 제공되지 않았습니다.");
  }

  try {
    const updatedMission = await prisma.userMission.update({
      where: {
        user_mission_id: userMissionId, // user_mission_id 조건 필수
      },
      data: {
        mission_status: "done",
        completed_date: new Date(), // 현재 시간을 완료 날짜로 설정
      },
      include: {
        Mission: {
          select: {
            mission_id: true,
            mission_content: true,
          },
        },
      },
    });

    return updatedMission;
  } catch (error) {
    console.error("Error changing mission status:", error.message);
    throw new Error("Failed to change mission status");
  }
};
