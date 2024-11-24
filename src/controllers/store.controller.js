import { StatusCodes } from "http-status-codes";
import { addStore, storeReview } from "../services/store.service.js";

export const addNewStoreInRegion = async (req, res) => {
  const { regionId } = req.params; // URL에서 regionId 추출
  const { store_name, owner_id, address } = req.body; // 요청 본문에서 필요한 데이터 추출

  const storeData = {
    region_id: Number(regionId), // 추출한 regionId를 storeData에 포함
    store_name,
    owner_id,
    address,
  };

  try {
    await addStore(storeData); // storeData를 DB 함수에 전달
    res
      .status(201)
      .json({ success: true, message: "가게가 성공적으로 추가되었습니다!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "가게 추가에 실패했습니다" });
  }
};

export const getStoreReview = async (req, res) => {
  try {
    const storeId = parseInt(req.query.storeId); // 쿼리 매개변수로 `storeId` 가져오기
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0; // 기본값 0

    if (!storeId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "storeId is required" });
    }

    const reviews = await storeReview(storeId, cursor);

    res.status(StatusCodes.OK).json({
      success: true,
      data: reviews.data,
      pagination: reviews.pagination,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: err.message });
  }
};
