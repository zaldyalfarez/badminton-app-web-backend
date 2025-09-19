import { DataTypes } from "sequelize";
import db from "../database/database.js";

const ujian = db.define(
  "Ujian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM("Mudah", "Normal", "Sulit"),
      allowNull: false,
    },
    durasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default ujian;
