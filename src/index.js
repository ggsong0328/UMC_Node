import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import {
  handleSignUpFood,
  handleSignUpInfo,
  handleSignUpTerms,
} from "./controllers/user.controller.js";
import {
  addNewStoreInRegion,
  getStoreReview,
} from "./controllers/store.controller.js";
import {
  getUserReview,
  writeStoreReview,
} from "./controllers/review.controller.js";
import {
  addNewStoreMission,
  addNewUserMission,
  changeProcessToDone,
  getStoreMission,
  getUserMission,
} from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/signUp/terms", handleSignUpTerms);
app.post("/auth/signUp/info", handleSignUpInfo);
app.post("/auth/signUp/foods", handleSignUpFood);

app.post("/stores/regions/:regionId", addNewStoreInRegion);

app.post("/reviews/:storeId", writeStoreReview);
app.get("/reviews/stores", getStoreReview);
app.get("/reviews/users", getUserReview);

app.post("/missions/add/:storeId", addNewStoreMission);
app.post("/missions/:userId/process", addNewUserMission);
app.get("/missions/stores", getStoreMission);
app.get("/missions/users", getUserMission);
app.patch("/missions/:userId/:missionId", changeProcessToDone);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
