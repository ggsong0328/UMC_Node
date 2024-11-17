import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import {
  addNewStoreInRegion,
  addNewStoreMission,
  addNewUserMission,
  handleSignUpFood,
  handleSignUpInfo,
  handleSignUpTerms,
  writeStoreReview,
} from "./controllers/user.controller.js";

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

app.post("/regions/:regionId/stores", addNewStoreInRegion);

app.post("/reviews/:storeId", writeStoreReview);

app.post("/missions/add/:storeId", addNewStoreMission);

app.post("/missions/:userId/process", addNewUserMission);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
