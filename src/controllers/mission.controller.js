import { StatusCodes } from "http-status-codes";
import {
  addMission,
  addProcessMission,
  ProcessToDone,
  storeMission,
  userMission,
} from "../services/mission.service.js";
import { prisma } from "../db.config.js";

export const addNewUserMission = async (req, res) => {
  const { userId } = req.params;
  const { mission_id, mission_status, completed_date } = req.body;

  const processMissionData = {
    user_id: Number(userId),
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
    res.status(500).json({ success: false, error: "미션 추가에 실패했습니다" });
  }
};

export const addNewStoreMission = async (req, res) => {
  const { storeId } = req.params;
  const { mission_content, review_left } = req.body;

  const missionData = {
    store_id: Number(storeId),
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

export const getStoreMission = async (req, res) => {
  try {
    const storeId = parseInt(req.query.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    if (!storeId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "storeId is required" });
    }

    const missions = await storeMission(storeId, cursor);

    res.status(StatusCodes.OK).json({
      success: true,
      data: missions.data,
      pagination: missions.pagination,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, errro: err.message });
  }
};

export const getUserMission = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId is required" });
    }

    const missions = await userMission(userId, cursor);

    res.status(StatusCodes.OK).json({
      success: true,
      data: missions.data,
      pagination: missions.pagination,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: err.message });
  }
};

export const changeProcessToDone = async (req, res) => {
  const { userId, missionId } = req.params;
  const { mission_status, completed_date } = req.body;

  try {
    const userMission = await prisma.userMission.findFirst({
      where: {
        user_id: Number(userId),
        mission_id: Number(missionId),
        mission_status: "in_process",
      },
      select: {
        user_mission_id: true,
      },
    });

    console.log(userMission);

    if (!userMission) {
      return res.status(404).json({
        success: false,
        error: "해당 유저 또는 미션을 찾을 수 없습니다.",
      });
    }

    const processMissionData = {
      user_mission_id: userMission.user_mission_id,
      mission_status: "done",
      completed_date: new Date(completed_date),
    };

    await ProcessToDone(processMissionData);

    res.status(200).json({
      success: true,
      message: "해당 미션을 진행 완료 했습니다!",
    });
  } catch (err) {
    console.error("Error in changeProcessToDone:", err.message);
    res
      .status(500)
      .json({ success: false, error: "미션 완료에 실패했습니다." });
  }
};
