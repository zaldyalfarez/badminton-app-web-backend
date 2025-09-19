import express from "express";
import cors from "cors";
import { db } from "./model/index.js";
import { config } from "./config/config.js";
import route from "./route/route.js";

const app = express();
const PORT = config.app.port;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", route);
app.use("/public", express.static("public"));

db.sync({ alter: true }).then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
});
