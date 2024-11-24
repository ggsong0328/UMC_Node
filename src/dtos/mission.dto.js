export const bodyToMission = (body) => {
  return {
    mission_id: body.mission_id,
    store_id: body.store_id,
    mission_content: body.mission_content,
    review_left: body.review_left,
  };
};

export const bodyToProcessMission = (body) => {
  return {
    user_id: body.user_id,
    mission_id: body.mission_id,
    mission_status: body.mission_status,
    completed_date: body.completed_date,
  };
};

export const responseFromMissions = (missions) => {
  return {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,
    },
  };
};

export const PtoD = (body) => {
  return {
    user_mission_id: body.user_mission_id,
    mission_id: body.mission_id,
    store_id: body.store_id,
    mission_content: body.mission_content,
    review_left: body.review_left,
  };
};
