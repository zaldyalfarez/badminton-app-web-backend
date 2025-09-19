import { Sequelize } from "sequelize";
import { config } from "../config/config.js";

const db = new Sequelize({
  dialect: config.db.dialect,
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
});

export default db;
