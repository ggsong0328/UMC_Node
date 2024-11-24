import {
  bodyToMission,
  bodyToProcessMission,
  PtoD,
  responseFromMissions,
} from "../dtos/mission.dto.js";
import {
  addNewMission,
  addNewProcessMission,
  changeMissionStatus,
  getAllStoreMission,
  getAllUserMission,
} from "../repositories/mission.repository.js";

export const addMission = async (missionData) => {
  const formattedMissionData = bodyToMission(missionData);
  try {
    await addNewMission(formattedMissionData);
  } catch (err) {
    throw err;
  }
};

export const addProcessMission = async (processMissionData) => {
  const formattedProcessMissionData = bodyToProcessMission(processMissionData);
  try {
    await addNewProcessMission(formattedProcessMissionData);
  } catch (err) {
    throw err;
  }
};

export const storeMission = async (storeId) => {
  const missions = await getAllStoreMission(storeId);
  return responseFromMissions(missions);
};

export const userMission = async (userId) => {
  const missions = await getAllUserMission(userId);
  return responseFromMissions(missions);
};

export const ProcessToDone = async (missionData) => {
  try {
    const formattedMissionData = PtoD(missionData);

    if (!formattedMissionData.user_mission_id) {
      throw new Error("user_mission_id가 없습니다.");
    }

    const updatedMission = await changeMissionStatus(
      formattedMissionData.user_mission_id
    );

    return updatedMission;
  } catch (error) {
    console.error("Error processing mission to done:", error.message);
    throw new Error("Failed to process mission to done");
  }
};
